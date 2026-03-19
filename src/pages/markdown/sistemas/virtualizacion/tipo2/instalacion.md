---
title: "Instalación y uso típico"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Instalación y uso típico](#instalación-y-uso-típico)
  - [Instalación como aplicación del sistema: gestores de paquetes, módulos de kernel y configuración inicial](#instalación-como-aplicación-del-sistema-gestores-de-paquetes-módulos-de-kernel-y-configuración-inicial)
  - [Creación de VMs desde ISOs y plantillas: flujos de trabajo gráficos y automatizados](#creación-de-vms-desde-isos-y-plantillas-flujos-de-trabajo-gráficos-y-automatizados)
    - [Flujo gráfico típico: asistente de creación de VM](#flujo-gráfico-típico-asistente-de-creación-de-vm)
    - [Uso de plantillas y clones para despliegue rápido](#uso-de-plantillas-y-clones-para-despliegue-rápido)
  - [Ejecución temporal de sistemas operativos: estrategias para uso efímero sin residuos](#ejecución-temporal-de-sistemas-operativos-estrategias-para-uso-efímero-sin-residuos)
    - [Configuración ligera para cargas temporales](#configuración-ligera-para-cargas-temporales)
    - [Gestión del ciclo de vida: snapshots, exportación y limpieza](#gestión-del-ciclo-de-vida-snapshots-exportación-y-limpieza)
  - [Quédate con...](#quédate-con)

</div>

# Instalación y uso típico

El flujo de instalación y uso de un hipervisor de Tipo 2 refleja su filosofía de diseño: democratizar el acceso a la virtualización mediante una experiencia comparable a la instalación de cualquier aplicación de escritorio. Sin embargo, detrás de esta simplicidad aparente se ocultan mecanismos técnicos no triviales —instalación de módulos de kernel, configuración de permisos de dispositivo, registro de formatos de disco virtuales— que, si se ignoran, pueden resultar en rendimiento subóptimo, fallos de redirección de hardware o vulnerabilidades de seguridad. Comprender el proceso completo, desde la instalación del paquete hasta la creación y gestión del ciclo de vida de una máquina virtual temporal, permite aprovechar al máximo las capacidades del hipervisor mientras se mantienen buenas prácticas de aislamiento y gestión de recursos. Esta sección desglosa el flujo típico de instalación multiplataforma, los mecanismos de creación de VMs desde ISOs y plantillas, y las estrategias para ejecutar sistemas operativos invitados de forma temporal sin dejar residuos operativos ni consumir recursos innecesariamente en el sistema anfitrión.

## Instalación como aplicación del sistema: gestores de paquetes, módulos de kernel y configuración inicial

A diferencia de los hipervisores de Tipo 1 que requieren un proceso de instalación dedicado con particionado de disco y configuración de red a nivel de firmware, los hipervisores de Tipo 2 se distribuyen mediante los mecanismos convencionales del sistema operativo anfitrión: instaladores gráficos (.exe, .dmg), gestores de paquetes nativos (.deb, .rpm, Homebrew, Chocolatey) o repositorios de aplicaciones. Este modelo simplifica el despliegue, pero introduce dependencias específicas que deben gestionarse conscientemente.

```bash
# Instalación en Linux (Debian/Ubuntu) mediante gestor de paquetes
# VirtualBox
sudo apt update
sudo apt install virtualbox virtualbox-ext-pack -y

# Verificar que los módulos de kernel se cargaron correctamente
lsmod | grep -E 'vboxdrv|vboxnetflt|vboxpci'
# Esperado: vboxdrv, vboxnetflt, vboxnetadp, vboxpci cargados

# Añadir usuario al grupo 'vboxusers' para acceso a USB y otras funcionalidades
sudo usermod -aG vboxusers $USER
# Requiere cerrar sesión y volver a entrar para que surta efecto

# VMware Workstation Player (requiere descarga manual del bundle)
# Después de descargar VMware-Player-*.bundle:
chmod +x VMware-Player-*.bundle
sudo ./VMware-Player-*.bundle --console --required --eulas-agreed
# El instalador compila módulos de kernel contra el kernel actual
```

```powershell
# Instalación en Windows mediante Chocolatey (gestor de paquetes)
# Ejecutar PowerShell como Administrador

# Instalar VirtualBox
choco install virtualbox -y

# Instalar VMware Workstation Player (licencia gratuita para uso personal)
choco install vmwareplayer -y

# Verificar instalación
vboxmanage --version
# Salida: 7.0.12r159840

# Verificar servicios de virtualización en ejecución
Get-Service | Where-Object {$_.Name -like "*vbox*" -or $_.Name -like "*vmware*"} | Select-Object Name, Status
```

```bash
# Instalación en macOS mediante Homebrew
# VirtualBox (limitado en Apple Silicon por restricciones de virtualización)
brew install --cask virtualbox

# UTM (basado en QEMU, optimizado para Apple Silicon)
brew install --cask utm

# Parallels Desktop (requiere descarga manual y licencia)
# https://www.parallels.com/products/desktop/

# Verificar que las extensiones de virtualización están habilitadas
# En macOS, requiere habilitar acceso en Preferencias del Sistema → Seguridad y Privacidad
sysctl -a | grep -i machdep.cpu.features | grep -i vmx
# En Apple Silicon, verificar soporte de virtualización ARM
sysctl -a | grep -i hv
```

> La instalación de hipervisores de Tipo 2 frecuentemente requiere compilar módulos de kernel contra el kernel actual del anfitrión. En Linux, esto implica tener instalados los headers del kernel (`linux-headers-$(uname -r)`) y herramientas de compilación (`build-essential`). Una actualización del kernel sin recompilar los módulos puede romper la virtualización hasta que se ejecute `vboxconfig` (VirtualBox) o se reinstale el paquete.

```bash
# Post-instalación en Linux: recompilar módulos de kernel si hay errores
# VirtualBox
sudo /sbin/vboxconfig

# VMware
sudo vmware-modconfig --console --install-all

# Verificar estado de módulos
lsmod | grep -E 'vbox|vmw'
dmesg | grep -i vbox  # Buscar errores de carga en el log del kernel
```

## Creación de VMs desde ISOs y plantillas: flujos de trabajo gráficos y automatizados

Una vez instalado el hipervisor, la creación de máquinas virtuales puede realizarse mediante interfaces gráficas intuitivas o mediante líneas de comandos para automatización y reproducibilidad. Ambas aproximaciones tienen su lugar: la GUI para exploración y aprendizaje, la CLI para scripting, integración en pipelines de CI/CD y despliegues consistentes.

### Flujo gráfico típico: asistente de creación de VM

```text
Pasos comunes en asistentes gráficos (VirtualBox, VMware, Parallels):

1. Nuevo → Asistente de creación de VM
2. Nombre y tipo de SO invitado
   ← El hipervisor ajusta valores por defecto según la selección (ej: Ubuntu 64-bit)
3. Asignación de memoria RAM
   ← Recomendación: 25-50% de la RAM física del host para uso interactivo
4. Creación de disco virtual
   ← Opciones: crear nuevo disco (dinámico/pre-asignado) o usar existente
   ← Formatos: VDI (VirtualBox), VMDK (VMware), QCOW2 (QEMU), HDD (Parallels)
5. Selección de medio de instalación
   ← Archivo ISO local, imagen de red (PXE) o disco físico
6. Personalización avanzada (opcional)
   ← Red, audio, USB, carpetas compartidas, configuración de CPU
7. Finalizar e iniciar VM
```

```bash
# Equivalentes CLI para el flujo gráfico anterior

# VirtualBox: crear VM Ubuntu desde ISO
VBoxManage createvm --name "Ubuntu-Dev" --register --default
VBoxManage modifyvm "Ubuntu-Dev" --memory 4096 --vram 128 --graphicscontroller vmsvga
VBoxManage storagectl "Ubuntu-Dev" --name "SATA" --add sata --controller IntelAhci
VBoxManage storageattach "Ubuntu-Dev" --storagectl "SATA" --port 0 --device 0 \
  --type hdd --medium /vms/ubuntu-dev.vdi --comment "Disco principal"
VBoxManage storageattach "Ubuntu-Dev" --storagectl "SATA" --port 1 --device 0 \
  --type dvddrive --medium /isos/ubuntu-22.04-desktop-amd64.iso
VBoxManage modifyvm "Ubuntu-Dev" --nic1 nat --cableconnected1 on
VBoxManage startvm "Ubuntu-Dev" --type gui  # o 'headless' para sin interfaz
```

```yaml
# Ejemplo: definición de VM en formato libvirt XML (QEMU/KVM)
# Útil para versionar configuraciones en Git y desplegar consistentemente

cat > /tmp/ubuntu-dev.xml << 'EOF'
<domain type='kvm'>
  <name>ubuntu-dev</name>
  <memory unit='GiB'>4</memory>
  <vcpu placement='static'>2</vcpu>
  <os>
    <type arch='x86_64' machine='pc-q35-7.2'>hvm</type>
    <boot dev='cdrom'/>
  </os>
  <features>
    <acpi/><apic/><vmport state='off'/>
  </features>
  <cpu mode='host-passthrough' check='none'/>
  <devices>
    <emulator>/usr/bin/qemu-system-x86_64</emulator>
    <disk type='file' device='disk'>
      <driver name='qemu' type='qcow2' cache='none'/>
      <source file='/vms/ubuntu-dev.qcow2'/>
      <target dev='vda' bus='virtio'/>
    </disk>
    <disk type='file' device='cdrom'>
      <source file='/isos/ubuntu-22.04-desktop-amd64.iso'/>
      <target dev='sda' bus='sata'/>
      <readonly/>
    </disk>
    <interface type='network'>
      <source network='default'/>
      <model type='virtio'/>
    </interface>
    <graphics type='spice' autoport='yes'>
      <listen type='address'/>
    </graphics>
  </devices>
</domain>
EOF

# Crear disco y registrar VM
qemu-img create -f qcow2 /vms/ubuntu-dev.qcow2 50G
virsh define /tmp/ubuntu-dev.xml
virsh start ubuntu-dev
virsh console ubuntu-dev  # Conectar a consola serial
```

> La selección del tipo de SO invitado en el asistente no es cosmética: ajusta valores por defecto como el chipset emulado (PIIX3 vs Q35), el controlador de disco (IDE vs VirtIO) y las optimizaciones de CPU. Seleccionar incorrectamente (ej: "Other Linux" en lugar de "Ubuntu 64-bit") puede resultar en rendimiento subóptimo o incompatibilidades con Guest Additions.

### Uso de plantillas y clones para despliegue rápido

Para escenarios que requieren crear múltiples VMs con configuración idéntica (laboratorios de entrenamiento, pruebas de escalado, entornos de desarrollo estandarizados), los hipervisores de Tipo 2 ofrecen mecanismos de plantillas y clonación que evitan repetir el proceso de instalación desde cero.

```bash
# VirtualBox: crear plantilla base y clonar
# 1. Crear y configurar VM base
VBoxManage createvm --name "Template-Ubuntu" --register
# ... instalar SO, configurar paquetes, limpiar logs, etc. ...
VBoxManage controlvm "Template-Ubuntu" poweroff

# 2. Convertir a plantilla (marcar como no booteable directamente)
VBoxManage modifyvm "Template-Ubuntu" --hardwareuuid "" --description "Plantilla base Ubuntu 22.04"

# 3. Clonar para nueva instancia (linked clone para ahorrar espacio)
VBoxManage clonevm "Template-Ubuntu" \
  --name "Dev-Instance-01" \
  --register \
  --options link \
  --basefolder /vms/dev-clones

# El clone comparte el disco base en modo lectura,
# con un archivo diferencial para escrituras específicas
```

```bash
# QEMU/KVM: usar cloud-init para aprovisionamiento automatizado desde plantilla
# 1. Preparar imagen base con cloud-init habilitado
virt-sysprep -a base-template.qcow2 --operations defaults,ssh-hostkeys,logfiles

# 2. Crear clone con cloud-init para configuración específica
cat > user-data.yaml << 'EOF'
#cloud-config
hostname: dev-ubuntu-01
users:
  - name: developer
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-rsa AAAAB3... public-key-content
packages:
  - git
  - docker.io
  - python3-pip
runcmd:
  - systemctl enable --now docker
EOF

cat > meta-data.yaml << 'EOF'
instance-id: dev-ubuntu-01
local-hostname: dev-ubuntu-01
EOF

# Generar ISO de cloud-init
genisoimage -output /vms/dev-ubuntu-01-cidata.iso \
  -volid cidata -joliet -rock user-data.yaml meta-data.yaml

# Crear disco diferencial y lanzar VM
qemu-img create -f qcow2 -b base-template.qcow2 /vms/dev-ubuntu-01.qcow2
qemu-system-x86_64 \
  -enable-kvm \
  -m 4096 -cpu host \
  -drive file=/vms/dev-ubuntu-01.qcow2,format=qcow2,if=virtio \
  -drive file=/vms/dev-ubuntu-01-cidata.iso,format=raw,if=virtio \
  -netdev user,id=net0,hostfwd=tcp::2222-:22 \
  -device virtio-net-pci,netdev=net0 \
  -nographic
```

> Las plantillas deben "generalizarse" antes de su uso: eliminar claves SSH específicas, limpiar logs, desregistrar licencias de software y resetear identificadores únicos (machine-id en Linux, SID en Windows). De lo contrario, clones derivados pueden presentar conflictos de red, autenticación o licenciamiento.

## Ejecución temporal de sistemas operativos: estrategias para uso efímero sin residuos

Una de las fortalezas de los hipervisores de Tipo 2 es facilitar la ejecución temporal de sistemas operativos alternativos para tareas específicas: probar una distribución de Linux, validar una aplicación en otra versión de Windows, o analizar un artefacto en un entorno aislado. Para que este uso efímero sea verdaderamente práctico, es esencial implementar estrategias que minimicen el consumo de recursos y eviten la acumulación de "residuos" operativos.

### Configuración ligera para cargas temporales

```yaml
# Ejemplo: configuración optimizada para VM temporal de pruebas
vm_profile: "ephemeral-test"
resources:
  cpu: 2                    # Suficiente para tareas interactivas, sin overcommit
  memory: 2048              # 2GB para SO moderno, ajustar según guest
  disk:
    type: "dynamic"         # Thin provisioning para ahorrar espacio inicial
    size: "20GB"            # Tamaño lógico; crece según uso real
    format: "qcow2"         # Soporta snapshots y compresión
  graphics:
    type: "vmsvga"          # Controlador balanceado compatibilidad/rendimiento
    vram: 64                # 64MB suficiente para terminal o escritorio ligero
  network:
    type: "nat"             # Aislamiento por defecto, sin exposición directa
    port_forward:           # Solo puertos necesarios para la prueba
      - guest: 22, host: 2222, protocol: tcp  # SSH para acceso remoto
  integration:
    shared_folders: false   # Deshabilitar si no se requiere intercambio
    clipboard: "hosttoguest" # Unidireccional para minimizar fuga de datos
    usb: false              # Sin redirección USB para cargas temporales
lifecycle:
  auto_shutdown: "2h"       # Apagar automáticamente tras período de inactividad
  snapshot_on_start: true   # Crear snapshot limpio al iniciar
  delete_on_exit: prompt    # Preguntar si eliminar VM y discos al cerrar
```

```bash
# Script de utilidad para crear y limpiar VMs temporales (bash + VirtualBox)
#!/bin/bash
# create-ephemeral-vm.sh

set -euo pipefail

VM_NAME="temp-${1:-test}-$(date +%Y%m%d-%H%M)"
ISO_PATH="${2:-/isos/ubuntu-22.04-desktop-amd64.iso}"
RAM_MB="${3:-2048}"
DISK_GB="${4:-20}"

echo "→ Creando VM temporal: $VM_NAME"

# Crear VM con configuración mínima
VBoxManage createvm --name "$VM_NAME" --register --default
VBoxManage modifyvm "$VM_NAME" --memory "$RAM_MB" --vram 64 --graphicscontroller vmsvga
VBoxManage storagectl "$VM_NAME" --name "SATA" --add sata --controller IntelAhci

# Crear disco dinámico
DISK_PATH="/vms/temp/${VM_NAME}.vdi"
mkdir -p "$(dirname "$DISK_PATH")"
VBoxManage createmedium disk --filename "$DISK_PATH" --size-byte "${DISK_GB}G" --variant Standard
VBoxManage storageattach "$VM_NAME" --storagectl "SATA" --port 0 --device 0 \
  --type hdd --medium "$DISK_PATH"

# Adjuntar ISO de instalación
VBoxManage storageattach "$VM_NAME" --storagectl "SATA" --port 1 --device 0 \
  --type dvddrive --medium "$ISO_PATH"

# Red NAT con forwarding SSH opcional
VBoxManage modifyvm "$VM_NAME" --nic1 nat --cableconnected1 on
VBoxManage modifyvm "$VM_NAME" --natpf1 "ssh,tcp,,2222,,22"

# Iniciar en modo headless (acceso vía SSH después de instalación)
VBoxManage startvm "$VM_NAME" --type headless

echo "✓ VM iniciada: $VM_NAME"
echo "→ Conectar vía: ssh -p 2222 usuario@localhost"
echo "→ Para eliminar después: VBoxManage unregistervm \"$VM_NAME\" --delete"
```

### Gestión del ciclo de vida: snapshots, exportación y limpieza

Para uso temporal, los snapshots permiten capturar un estado "limpio" post-instalación y revertir fácilmente después de pruebas destructivas. La exportación a formatos portables (OVA/OVF) facilita compartir entornos preconfigurados con colegas o archivar configuraciones para uso futuro.

```bash
# VirtualBox: workflow con snapshots para pruebas efímeras
# 1. Tras instalar SO y herramientas básicas, crear snapshot limpio
VBoxManage snapshot "temp-ubuntu" take "base-clean" --description "Post-instalación, listo para pruebas"

# 2. Ejecutar pruebas, instalar paquetes, modificar configuración...

# 3. Revertir a estado limpio si es necesario
VBoxManage snapshot "temp-ubuntu" restore "base-clean"

# 4. Al finalizar, eliminar VM y liberar recursos
VBoxManage controlvm "temp-ubuntu" poweroff
VBoxManage unregistervm "temp-ubuntu" --delete  # --delete elimina discos asociados
```

```bash
# Exportar VM para compartir o archivar (formato OVA portable)
VBoxManage export "temp-ubuntu" \
  --output "/backups/temp-ubuntu-$(date +%Y%m%d).ova" \
  --vsys 0 --product "Ubuntu Dev Temp" --version "1.0" \
  --description "Entorno temporal para pruebas de desarrollo"

# Importar en otro sistema con hipervisor compatible
VBoxManage import "/backups/temp-ubuntu-20240115.ova" \
  --vsys 0 --vmname "Imported-Dev-Env" \
  --diskpath "/vms/imported/disk.vdi"
```

> Los archivos de VM temporales pueden acumularse rápidamente y consumir espacio significativo en el disco del host. Implementar convenciones de nombrado con fecha (`temp-<propósito>-YYYYMMDD`) y scripts de limpieza periódica que eliminen VMs con más de N días de antigüedad previene el "sprawl" de recursos no gestionados.

## Quédate con...

- La **instalación de Tipo 2** sigue los mecanismos convencionales del SO anfitrión (gestores de paquetes, instaladores gráficos), pero requiere atención a módulos de kernel y permisos de dispositivo para funcionar correctamente.
- La **creación de VMs** puede realizarse vía GUI para aprendizaje o CLI para automatización; seleccionar correctamente el tipo de SO invitado ajusta valores por defecto críticos para rendimiento y compatibilidad.
- Las **plantillas y clones** permiten despliegue rápido de entornos estandarizados; generalizar plantillas (limpiar IDs, claves, logs) evita conflictos en instancias derivadas.
- Para **uso temporal**, configurar recursos conservadores (CPU, RAM, disco dinámico) y deshabilitar integraciones innecesarias (USB, carpetas compartidas) minimiza consumo y superficie de ataque.
- Los **snapshots son esenciales para pruebas efímeras**: capturar estado limpio post-instalación permite revertir cambios destructivos instantáneamente, pero deben consolidarse o eliminarse para evitar degradación de rendimiento.
- La **exportación a formatos portables** (OVA/OVF) facilita compartir entornos preconfigurados y archivar configuraciones para reproducibilidad futura.
- Implementar **gobernanza de ciclo de vida**: convenciones de nombrado con fecha, auto-apagado por inactividad y scripts de limpieza periódica previenen la acumulación de VMs olvidadas que consumen recursos del host innecesariamente.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/tipo2/cuando" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
