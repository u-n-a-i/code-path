---
title: "Entornos de desarrollo y pruebas"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Entornos de desarrollo y pruebas](#entornos-de-desarrollo-y-pruebas)
  - [Probar aplicaciones en múltiples SO sin afectar la máquina principal](#probar-aplicaciones-en-múltiples-so-sin-afectar-la-máquina-principal)
    - [Arquitectura de entornos de prueba aislados](#arquitectura-de-entornos-de-prueba-aislados)
    - [Snapshots para debugging y rollback durante pruebas](#snapshots-para-debugging-y-rollback-durante-pruebas)
  - [Simular redes completas con VirtualBox + Vagrant](#simular-redes-completas-con-virtualbox--vagrant)
    - [Arquitectura de laboratorios de red virtualizados](#arquitectura-de-laboratorios-de-red-virtualizados)
    - [Redes internas aisladas y configuración de enrutamiento](#redes-internas-aisladas-y-configuración-de-enrutamiento)
  - [Quédate con...](#quédate-con)

</div>

# Entornos de desarrollo y pruebas

La virtualización transformó radicalmente cómo los desarrolladores y equipos de QA conciben, construyen y validan software: de mantener laboratorios físicos costosos con múltiples máquinas dedicadas a cada configuración de SO, a poder instanciar entornos de prueba efímeros, reproducibles y descartables mediante código. Esta capacidad no es simplemente una conveniencia operativa, sino un habilitador estratégico para prácticas modernas de ingeniería de software: integración continua que valida builds en múltiples plataformas simultáneamente, pruebas de compatibilidad que reproducen exactamente el entorno del cliente, y simulación de topologías de red complejas que serían prohibitivas de implementar físicamente. Comprender cómo diseñar entornos de desarrollo y pruebas virtualizados —desde la configuración de VMs individuales para testing multi-SO hasta la orquestación de laboratorios completos mediante Vagrant— permite establecer flujos de trabajo que equilibran fidelidad del entorno, velocidad de iteración y consumo de recursos, evitando errores comunes como entornos de desarrollo que divergen de producción o laboratorios de prueba que se vuelven deuda técnica no gestionada.

## Probar aplicaciones en múltiples SO sin afectar la máquina principal

El desarrollo de software moderno frecuentemente requiere validar que una aplicación funcione correctamente en múltiples sistemas operativos, versiones de runtime, y configuraciones de dependencias. La virtualización permite crear entornos aislados que pueden configurarse, modificarse y destruirse sin riesgo para el sistema de desarrollo principal, estableciendo una frontera clara entre la herramienta de trabajo del desarrollador y los entornos de prueba efímeros.

### Arquitectura de entornos de prueba aislados

```text
Modelo de aislamiento para desarrollo:

┌─────────────────────────────────┐
│  Máquina Principal (Host)      │
│  • SO del desarrollador        │
│  • IDE, herramientas de dev    │
│  • Configuración personalizada │
│  • Datos de trabajo críticos   │
├─────────────────────────────────┤
│  Hipervisor Tipo 2             │
│  • VirtualBox / VMware / KVM   │
│  • Aísla VMs del host          │
│  • Snapshots para rollback     │
├─────────────────────────────────┤
│  VMs de Prueba (Guests)        │
│  • Windows 10, 11, Server      │
│  • Ubuntu, CentOS, Debian      │
│  • macOS (en hardware Apple)   │
│  • Configuraciones específicas │
│  • Descartables sin riesgo     │
└─────────────────────────────────┘

Flujo de trabajo típico:
1. Crear VM desde plantilla base
2. Instalar aplicación/dependencias
3. Ejecutar pruebas
4. Capturar resultados
5. Revertir snapshot o eliminar VM
```

```bash
# Configurar VM de prueba con VirtualBox (CLI automatizada)
# Script para crear entorno de prueba reproducible

#!/bin/bash
# create-test-vm.sh

VM_NAME="test-ubuntu-2204"
ISO_PATH="/isos/ubuntu-22.04-desktop-amd64.iso"
DISK_PATH="/vms/test-vm/${VM_NAME}.vdi"
RAM_MB=4096
DISK_GB=50

# Crear directorio para la VM
mkdir -p "$(dirname "$DISK_PATH")"

# Crear y registrar VM
VBoxManage createvm --name "$VM_NAME" --register --default

# Configurar hardware
VBoxManage modifyvm "$VM_NAME" \
  --memory "$RAM_MB" \
  --vram 128 \
  --graphicscontroller vmsvga \
  --nic1 nat \
  --cableconnected1 on \
  --usb off \
  --audio none

# Crear disco dinámico (ahorra espacio inicial)
VBoxManage createmedium disk \
  --filename "$DISK_PATH" \
  --size-byte "${DISK_GB}G" \
  --variant Standard

# Configurar controlador de almacenamiento
VBoxManage storagectl "$VM_NAME" \
  --name "SATA" \
  --add sata \
  --controller IntelAhci

# Adjuntar disco y ISO
VBoxManage storageattach "$VM_NAME" \
  --storagectl "SATA" \
  --port 0 --device 0 \
  --type hdd \
  --medium "$DISK_PATH"

VBoxManage storageattach "$VM_NAME" \
  --storagectl "SATA" \
  --port 1 --device 0 \
  --type dvddrive \
  --medium "$ISO_PATH"

# Iniciar VM
VBoxManage startvm "$VM_NAME" --type gui

echo "VM '$VM_NAME' creada e iniciada"
echo "Para eliminar después de pruebas: VBoxManage unregistervm '$VM_NAME' --delete"
```

```yaml
# Configuración de múltiples entornos de prueba con Vagrant
# Vagrantfile para testing multi-plataforma

Vagrant.configure("2") do |config|
  
  # Ubuntu 22.04 LTS
  config.vm.define "ubuntu22" do |ubuntu|
    ubuntu.vm.box = "ubuntu/jammy64"
    ubuntu.vm.network "private_network", ip: "192.168.50.10"
    ubuntu.vm.provider "virtualbox" do |vb|
      vb.memory = 2048
      vb.cpus = 2
    end
    ubuntu.vm.provision "shell", path: "scripts/setup-ubuntu.sh"
  end
  
  # CentOS Stream 9
  config.vm.define "centos9" do |centos|
    centos.vm.box = "generic/centos-stream9"
    centos.vm.network "private_network", ip: "192.168.50.20"
    centos.vm.provider "virtualbox" do |vb|
      vb.memory = 2048
      vb.cpus = 2
    end
    centos.vm.provision "shell", path: "scripts/setup-centos.sh"
  end
  
  # Windows 10 (requiere licencia y ISO propia)
  config.vm.define "windows10" do |win|
    win.vm.box = "gusztavvargadr/windows-10"
    win.vm.network "private_network", ip: "192.168.50.30"
    win.vm.provider "virtualbox" do |vb|
      vb.memory = 4096
      vb.cpus = 2
      vb.gui = true  # Interfaz gráfica para Windows
    end
  end
  
  # Configuración común para todas las VMs
  config.vm.synced_folder ".", "/vagrant", type: "rsync"
  config.ssh.insert_key = true
  config.ssh.password = "vagrant"
  config.ssh.username = "vagrant"
end
```

```bash
# Comandos Vagrant para gestión de entornos de prueba
# Iniciar todos los entornos
vagrant up

# Iniciar solo un entorno específico
vagrant up ubuntu22

# Ver estado de todas las VMs
vagrant status

# Conectar por SSH a una VM específica
vagrant ssh ubuntu22

# Ejecutar comando remoto sin login interactivo
vagrant ssh ubuntu22 -c "docker --version && python3 --version"

# Recargar configuración tras cambios en Vagrantfile
vagrant reload ubuntu22

# Suspender todas las VMs (guarda estado en disco)
vagrant suspend

# Reanudar VMs suspendidas
vagrant resume

# Destruir todas las VMs y liberar recursos
vagrant destroy

# Destruir solo una VM específica
vagrant destroy ubuntu22

# Forzar eliminación sin confirmación
vagrant destroy -f
```

> Los entornos de prueba deben ser efímeros por diseño: crear bajo demanda para cada ciclo de pruebas, capturar resultados, y destruir inmediatamente después para liberar recursos. Usar snapshots solo para debugging durante la sesión de prueba, no como mecanismo de retención a largo plazo.

### Snapshots para debugging y rollback durante pruebas

Los snapshots permiten capturar el estado exacto de una VM en un instante específico, facilitando el debugging de problemas complejos y el rollback rápido tras cambios que rompen el entorno de pruebas.

```bash
# Workflow con snapshots para testing iterativo
# 1. Crear snapshot base después de configuración inicial
VBoxManage snapshot "test-ubuntu-2204" take "base-configured" \
  --description "Post-instalación, dependencias instaladas, listo para testing"

# 2. Ejecutar pruebas que pueden modificar el sistema
# ... ejecutar suite de pruebas ...

# 3. Si las pruebas fallan, investigar con el estado actual
# ... debugging ...

# 4. Revertir al estado base para nuevas pruebas
VBoxManage snapshot "test-ubuntu-2204" restore "base-configured"

# 5. Para debugging profundo, crear snapshot del estado fallido
VBoxManage snapshot "test-ubuntu-2204" take "failure-state" \
  --description "Estado tras fallo de prueba X, para análisis posterior"

# 6. Listar todos los snapshots disponibles
VBoxManage snapshot "test-ubuntu-2204" list --machinereadable

# 7. Eliminar snapshots de debugging después de resolver el problema
VBoxManage snapshot "test-ubuntu-2204" delete "failure-state"
```

```yaml
# Mejores prácticas para snapshots en desarrollo
snapshot_best_practices:
  naming_convention:
    formato: "<tipo>-<descripcion>-<fecha>"
    ejemplos:
      - "base-clean-20250115"
      - "pre-test-auth-module-20250115"
      - "failure-crash-on-login-20250115"
  
  retention_policy:
    snapshots_base: "Mantener mientras la VM exista"
    snapshots_testing: "Eliminar al finalizar sesión de pruebas"
    snapshots_debugging: "Eliminar tras resolver el issue (<7 días)"
  
  limitaciones:
    - "No usar como mecanismo de backup (dependen del disco base)"
    - "Cadenas largas (>5 snapshots) degradan rendimiento de E/S"
    - "Consumen espacio adicional en el datastore del host"
    - "No replicar snapshots entre hosts sin consolidar primero"
```

> Los snapshots son herramientas de debugging, no de backup: si el disco base se corrompe o elimina, todos los snapshots asociados se pierden. Para retención a largo plazo de entornos de prueba configurados, exportar como OVA/OVF o crear plantillas base versionadas.

## Simular redes completas con VirtualBox + Vagrant

La virtualización permite simular topologías de red completas —múltiples servidores, routers, firewalls, balanceadores de carga— en una sola máquina física, facilitando pruebas de integración, validación de configuraciones de infraestructura, y entrenamiento de equipos de operaciones sin requerir hardware dedicado.

### Arquitectura de laboratorios de red virtualizados

```text
Topología de laboratorio típica con Vagrant:

┌─────────────────────────────────────────────────────────────────┐
│  Host Físico (Laptop/Workstation)                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Red NAT (VirtualBox)                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │   Web-01    │  │   Web-02    │  │   Web-03    │     │   │
│  │  │ 192.168.50.10│ │ 192.168.50.11│ │ 192.168.50.12│     │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │   │
│  │         │                │                │             │   │
│  │         └────────────────┼────────────────┘             │   │
│  │                          │                              │   │
│  │                  ┌───────▼───────┐                      │   │
│  │                  │    LB-01      │                      │   │
│  │                  │ 192.168.50.5  │                      │   │
│  │                  └───────┬───────┘                      │   │
│  │                          │                              │   │
│  │  ┌───────────────────────┼───────────────────────────┐ │   │
│  │  │                       │                           │ │   │
│  │  │  ┌─────────────┐  ┌───▼───────┐  ┌─────────────┐ │ │   │
│  │  │  │   App-01    │  │   DB-01   │  │   Cache-01  │ │ │   │
│  │  │  │ 192.168.50.20│ │192.168.50.30││192.168.50.40│ │ │   │
│  │  │  └─────────────┘  └───────────┘  └─────────────┘ │ │   │
│  │  │                                                    │ │   │
│  │  │  Red Interna: isolated-network                    │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

```ruby
# Vagrantfile para laboratorio de red completo (3-tier architecture)
# file: Vagrantfile

Vagrant.configure("2") do |config|
  
  # Configuración común para todas las VMs
  config.vm.box = "ubuntu/jammy64"
  config.vm.synced_folder ".", "/vagrant", type: "rsync"
  config.ssh.insert_key = true
  
  # ─────────────────────────────────────────────────────────────
  # Capa de Presentación: Load Balancer
  # ─────────────────────────────────────────────────────────────
  config.vm.define "lb01" do |lb|
    lb.vm.hostname = "lb01"
    lb.vm.network "private_network", ip: "192.168.50.5"
    lb.vm.network "private_network", ip: "192.168.50.105", virtualbox__intnet: "web-net"
    
    lb.vm.provider "virtualbox" do |vb|
      vb.memory = 1024
      vb.cpus = 1
    end
    
    lb.vm.provision "shell", path: "scripts/provision-lb.sh",
      args: ["web01 web02 web03"]
  end
  
  # ─────────────────────────────────────────────────────────────
  # Capa de Presentación: Web Servers (3 nodos)
  # ─────────────────────────────────────────────────────────────
  (1..3).each do |i|
    config.vm.define "web0#{i}" do |web|
      web.vm.hostname = "web0#{i}"
      web.vm.network "private_network", ip: "192.168.50.1#{i}"
      web.vm.network "private_network", virtualbox__intnet: "web-net"
      
      web.vm.provider "virtualbox" do |vb|
        vb.memory = 2048
        vb.cpus = 2
      end
      
      web.vm.provision "shell", path: "scripts/provision-web.sh",
        args: ["web0#{i}"]
    end
  end
  
  # ─────────────────────────────────────────────────────────────
  # Capa de Aplicación: App Servers (2 nodos)
  # ─────────────────────────────────────────────────────────────
  (1..2).each do |i|
    config.vm.define "app0#{i}" do |app|
      app.vm.hostname = "app0#{i}"
      app.vm.network "private_network", ip: "192.168.50.2#{i}"
      app.vm.network "private_network", virtualbox__intnet: "app-net"
      
      app.vm.provider "virtualbox" do |vb|
        vb.memory = 4096
        vb.cpus = 2
      end
      
      app.vm.provision "shell", path: "scripts/provision-app.sh",
        args: ["app0#{i}", "db01"]
    end
  end
  
  # ─────────────────────────────────────────────────────────────
  # Capa de Datos: Database Server
  # ─────────────────────────────────────────────────────────────
  config.vm.define "db01" do |db|
    db.vm.hostname = "db01"
    db.vm.network "private_network", ip: "192.168.50.30"
    db.vm.network "private_network", virtualbox__intnet: "app-net"
    
    db.vm.provider "virtualbox" do |vb|
      vb.memory = 8192
      vb.cpus = 4
    end
    
    db.vm.provision "shell", path: "scripts/provision-db.sh"
  end
  
  # ─────────────────────────────────────────────────────────────
  # Capa de Datos: Cache Server (Redis)
  # ─────────────────────────────────────────────────────────────
  config.vm.define "cache01" do |cache|
    cache.vm.hostname = "cache01"
    cache.vm.network "private_network", ip: "192.168.50.40"
    cache.vm.network "private_network", virtualbox__intnet: "app-net"
    
    cache.vm.provider "virtualbox" do |vb|
      vb.memory = 2048
      vb.cpus = 2
    end
    
    cache.vm.provision "shell", path: "scripts/provision-cache.sh"
  end
end
```

```bash
# Scripts de provisionamiento automatizado con Ansible
# Alternativa más robusta que shell scripts para laboratorios complejos

# file: ansible/playbook.yml
---
- name: Configure Web Servers
  hosts: webservers
  become: yes
  vars:
    nginx_version: "1.24"
    app_port: 8080
  
  tasks:
    - name: Install nginx
      apt:
        name: nginx={{ nginx_version }}
        state: present
        update_cache: yes
    
    - name: Deploy application config
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: restart nginx
  
    - name: Ensure nginx is running
      service:
        name: nginx
        state: started
        enabled: yes
  
  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted

- name: Configure Database Server
  hosts: databases
  become: yes
  vars:
    postgresql_version: "15"
    db_name: "appdb"
  
  tasks:
    - name: Install PostgreSQL
      apt:
        name: postgresql-{{ postgresql_version }}
        state: present
    
    - name: Create application database
      postgresql_db:
        name: "{{ db_name }}"
        state: present
    
    - name: Create application user
      postgresql_user:
        name: appuser
        password: "{{ db_password }}"
        db: "{{ db_name }}"
        priv: "ALL"
```

```bash
# Comandos para gestionar laboratorio de red completo
# Iniciar todo el laboratorio (puede tomar 10-30 minutos)
vagrant up

# Iniciar solo componentes específicos
vagrant up lb01 web01 web02 web03

# Ver estado de todas las VMs del laboratorio
vagrant status

# Verificar conectividad de red entre nodos
vagrant ssh lb01 -c "ping -c 3 web01"
vagrant ssh web01 -c "ping -c 3 app01"
vagrant ssh app01 -c "ping -c 3 db01"

# Ejecutar playbook de Ansible contra el laboratorio
ansible-playbook -i inventory.ini ansible/playbook.yml

# Generar inventario dinámico desde Vagrant
vagrant ssh-config > ~/.ssh/vagrant-lab-config
ansible all -i ~/.ssh/vagrant-lab-config --private-key ~/.vagrant.d/insecure_private_key -m ping

# Suspender laboratorio completo (libera RAM, mantiene estado en disco)
vagrant suspend

# Reanudar laboratorio
vagrant resume

# Destruir laboratorio completo (elimina todas las VMs y discos)
vagrant destroy -f

# Destruir solo una capa (ej: capa web)
vagrant destroy web01 web02 web03 -f
```

> Los laboratorios de red complejos consumen recursos significativos del host: 6-8 VMs con la configuración anterior pueden requerir 24-32 GB de RAM y 8+ núcleos de CPU. Para equipos con recursos limitados, considerar: (1) reducir memoria asignada por VM, (2) usar contenedores Docker en lugar de VMs completas para algunos componentes, o (3) ejecutar el laboratorio en un servidor dedicado accesible remotamente.

### Redes internas aisladas y configuración de enrutamiento

Vagrant permite configurar múltiples tipos de red para simular topologías realistas: redes NAT para acceso a internet, redes privadas para comunicación entre VMs, y redes internas completamente aisladas para simular segmentos de red segregados.

```ruby
# Tipos de red en VirtualBox + Vagrant

Vagrant.configure("2") do |config|
  
  config.vm.define "network-test" do |vm|
    
    # 1. NAT (Network Address Translation)
    # La VM puede salir a internet, pero no es accesible desde fuera
    # Default en VirtualBox, no requiere configuración explícita
    vm.vm.network "public_network"  # Omite para usar NAT por defecto
    
    # 2. Red Privada (Bridged o Host-Only)
    # IP fija accesible desde el host y otras VMs
    vm.vm.network "private_network", ip: "192.168.50.10"
    
    # 3. Red Interna (Isolated)
    # Solo comunicación entre VMs en la misma red interna
    # El host NO tiene acceso a esta red
    vm.vm.network "private_network",
      virtualbox__intnet: "isolated-app-network",
      ip: "10.0.0.10"
    
    # 4. Múltiples interfaces de red
    # Útil para routers, firewalls, balanceadores
    vm.vm.network "private_network",
      virtualbox__intnet: "frontend-net",
      ip: "192.168.1.10"
    
    vm.vm.network "private_network",
      virtualbox__intnet: "backend-net",
      ip: "192.168.2.10"
  end
end
```

```bash
# Configurar enrutamiento entre redes internas
# Script para habilitar forwarding de IP en VMs que actúan como routers

#!/bin/bash
# provision-router.sh

# Habilitar IP forwarding en el kernel
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p

# Configurar iptables para NAT entre interfaces
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
iptables -A FORWARD -i eth0 -o eth1 -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT

# Guardar reglas de iptables (persistencia tras reboot)
iptables-save > /etc/iptables/rules.v4

# Verificar configuración
echo "=== Interfaces de red ==="
ip addr show

echo "=== Tabla de enrutamiento ==="
ip route show

echo "=== Forwarding habilitado ==="
cat /proc/sys/net/ipv4/ip_forward
```

```yaml
# Configuración de firewall para segmentación de red
# UFW (Uncomplicated Firewall) para laboratorios Ubuntu

firewall_configuration:
  load_balancer:
    interfaces:
      eth0: "192.168.50.5 (frontend)"
      eth1: "192.168.50.105 (backend)"
    reglas_entrada:
      - "Allow 80/tcp from any (HTTP)"
      - "Allow 443/tcp from any (HTTPS)"
      - "Allow 22/tcp from 192.168.50.0/24 (SSH admin)"
    reglas_salida:
      - "Allow 8080/tcp to 192.168.50.10-192.168.50.12 (web servers)"
  
  web_servers:
    interfaces:
      eth0: "192.168.50.10-12 (frontend)"
      eth1: "192.168.50.110-112 (backend)"
    reglas_entrada:
      - "Allow 8080/tcp from 192.168.50.5 (LB only)"
      - "Allow 22/tcp from 192.168.50.0/24 (SSH admin)"
    reglas_salida:
      - "Allow 8080/tcp to 192.168.50.20-21 (app servers)"
  
  database_servers:
    interfaces:
      eth0: "192.168.50.30 (backend only)"
    reglas_entrada:
      - "Allow 5432/tcp from 192.168.50.20-21 (app servers only)"
      - "Allow 22/tcp from 192.168.50.0/24 (SSH admin)"
    reglas_salida:
      - "Deny all (database no necesita salir)"
```

> La segmentación de red en laboratorios virtualizados replica prácticas de producción: capas frontend/backend, acceso restringido a bases de datos, y administración mediante redes segregadas. Usar esta oportunidad para validar reglas de firewall y configuraciones de seguridad antes de desplegar a producción.

## Quédate con...

- Los **entornos de prueba virtualizados** deben ser efímeros por diseño: crear bajo demanda, ejecutar pruebas, capturar resultados y destruir para liberar recursos; no mantener VMs de prueba "por si acaso".
- **Vagrant automatiza la creación de laboratorios** mediante Vagrantfile declarativo: define VMs, redes, y provisionamiento en código versionable que puede compartirse con el equipo.
- Los **snapshots son herramientas de debugging**, no de backup: usar para rollback durante sesiones de prueba, eliminar después de resolver issues, y no confiar en ellos para retención a largo plazo.
- La **simulación de redes completas** permite validar topologías 3-tier, firewalls, enrutamiento y segmentación antes de implementar en producción; esencial para pruebas de integración y entrenamiento.
- Los **tipos de red en VirtualBox** (NAT, privada, interna) permiten simular diferentes niveles de aislamiento y conectividad; usar redes internas para segmentos que deben estar aislados del host.
- El **provisionamiento automatizado** (shell scripts, Ansible, Chef) garantiza que los entornos de prueba sean reproducibles; evitar configuración manual que introduce variabilidad entre ejecuciones.
- Los **laboratorios complejos consumen recursos significativos**: 6-8 VMs pueden requerir 24-32 GB RAM y 8+ CPUs; planificar capacidad del host o usar servidor dedicado para laboratorios compartidos.
- La **segmentación de red en laboratorios** replica prácticas de producción: validar reglas de firewall, configuraciones de enrutamiento y políticas de acceso antes de desplegar cambios críticos.
- **Exportar laboratorios como OVA/OVF** permite compartir entornos de prueba preconfigurados con otros equipos o archivar configuraciones para auditoría y reproducibilidad futura.
- El **principio fundamental**: entornos de desarrollo/pruebas deben ser idénticos a producción en configuración, pero efímeros en ciclo de vida; la infraestructura de prueba es descartable, el código que la define es permanente.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/casos/homelab" class="next">Siguiente</a>
</div>
