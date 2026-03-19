---
title: "Creación de una VM"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Creación de una VM](#creación-de-una-vm)
  - [Asignación de recursos: vCPUs, RAM, disco y red como abstracciones configurables](#asignación-de-recursos-vcpus-ram-disco-y-red-como-abstracciones-configurables)
    - [vCPUs: topología virtual y planificación sobre núcleos físicos](#vcpus-topología-virtual-y-planificación-sobre-núcleos-físicos)
    - [Memoria: asignación, reservas y técnicas de sobrecompromiso seguro](#memoria-asignación-reservas-y-técnicas-de-sobrecompromiso-seguro)
    - [Disco virtual: formatos, políticas de provisioning y controladores de E/S](#disco-virtual-formatos-políticas-de-provisioning-y-controladores-de-es)
    - [Red: modelos de NIC, switches virtuales y estrategias de conectividad](#red-modelos-de-nic-switches-virtuales-y-estrategias-de-conectividad)
  - [Selección de sistema operativo invitado: implicaciones en compatibilidad y optimización](#selección-de-sistema-operativo-invitado-implicaciones-en-compatibilidad-y-optimización)
  - [ISO de instalación vs. plantilla: flujos de aprovisionamiento inicial](#iso-de-instalación-vs-plantilla-flujos-de-aprovisionamiento-inicial)
    - [Instalación desde ISO: control total, mayor tiempo de aprovisionamiento](#instalación-desde-iso-control-total-mayor-tiempo-de-aprovisionamiento)
    - [Plantillas (templates): consistencia, velocidad y gestión centralizada](#plantillas-templates-consistencia-velocidad-y-gestión-centralizada)
  - [Quédate con...](#quédate-con)

</div>

# Creación de una VM

La creación de una máquina virtual no es un acto de generación de hardware, sino la definición declarativa de una abstracción ejecutable: un conjunto de metadatos que instruyen al hipervisor sobre cómo presentar recursos físicos de forma virtualizada a un sistema operativo invitado. Este proceso, aparentemente sencillo en interfaces gráficas modernas, encapsula decisiones arquitectónicas críticas que determinan el rendimiento, la seguridad y la operabilidad futura de la carga de trabajo: la topología de vCPUs afecta la planificación y escalabilidad, la asignación de memoria define límites de contención, el formato y política del disco virtual impacta la latencia de E/S y la flexibilidad de gestión, y la configuración de red establece fronteras de aislamiento y conectividad. Comprender los mecanismos subyacentes a cada parámetro de creación —más allá de seguir un asistente paso a paso— permite diseñar VMs que no solo "funcionan", sino que se integran de forma predecible y eficiente en la infraestructura virtualizada, evitando deuda técnica que emerge cuando decisiones tempranas limitan opciones posteriores de escalado, migración o recuperación.

## Asignación de recursos: vCPUs, RAM, disco y red como abstracciones configurables

La asignación de recursos en la creación de una VM no reserva hardware físico de forma exclusiva, sino que define políticas de acceso a recursos compartidos mediante mecanismos de planificación, aislamiento y traducción implementados por el hipervisor. Cada tipo de recurso requiere consideraciones específicas para equilibrar rendimiento, densidad de consolidación y garantías de servicio.

### vCPUs: topología virtual y planificación sobre núcleos físicos

Las vCPUs son hilos de ejecución del proceso del hipervisor que el scheduler del host planifica sobre núcleos físicos (pCPUs). La configuración de vCPUs implica dos decisiones independientes: la cantidad de vCPUs expuestas al guest y su mapeo a recursos físicos.

```text
Topología de CPU virtual vs. física:

VM Configuration:
  vCPUs: 4
  Sockets: 2
  Cores per socket: 2
  Threads per core: 1

Guest OS view:
  2 sockets × 2 cores = 4 CPUs lógicas
  ← Importante para licenciamiento de SO (Windows Server por socket)
  ← Impacta afinidad de caché y scheduling NUMA

Host physical view:
  4 vCPU threads scheduled on pCPUs by hypervisor scheduler
  ← Puede haber overcommit: 8 vCPUs totales en 4 pCPUs físicos
```

```bash
# Configurar topología de CPU en libvirt/KVM (XML)
<cpu mode='host-passthrough' check='none'>
  <topology sockets='2' cores='2' threads='1'/>
</cpu>
<vcpu placement='static' cpuset='0-3'>4</vcpu>

# placement='static': vCPUs fijadas a pCPUs específicos (CPU pinning)
# cpuset='0-3': asigna a núcleos físicos 0,1,2,3
# Reduce latencia de scheduling, mejora localidad de caché

# Verificar afinidad en ejecución
virsh emulatorpin web-vm
# Salida: 0-3 (emulator thread en núcleos 0-3)
virsh vcpupin web-vm
# Salida: vCPU 0: 0, vCPU 1: 1, etc.
```

```yaml
# Ejemplo: política de recursos CPU en VMware (PowerCLI conceptual)
$vm = Get-VM "web-server-01"
$spec = New-Object VMware.Vim.VirtualMachineConfigSpec
$spec.numCPUs = 4
$spec.numCoresPerSocket = 2  # 2 sockets × 2 cores = 4 vCPUs totales

# Configuración de scheduling avanzado
$spec.cpuAllocation = New-Object VMware.Vim.ResourceAllocationInfo
$spec.cpuAllocation.reservation = 2000  # MHz mínimos garantizados
$spec.cpuAllocation.shares = New-Object VMware.Vim.SharesInfo
$spec.cpuAllocation.shares.level = "high"  # Prioridad relativa bajo contención
$spec.cpuAllocation.limit = -1  # -1 = sin límite máximo

$vmView = Get-View $vm.Id
$vmView.ReconfigVM_Task($spec)
```

> El overcommit de CPU (asignar más vCPUs totales que pCPUs físicos) es viable para cargas con picos no simultáneos, pero requiere monitorizar métricas de "CPU ready time" o "vcpu.wait". Valores sostenidos >10-20% indican contención severa: las vCPUs esperan demasiado para ser planificadas, degradando el rendimiento guest. Para cargas sensibles a latencia (bases de datos, aplicaciones en tiempo real), evitar overcommit o usar CPU pinning con reservas garantizadas.

### Memoria: asignación, reservas y técnicas de sobrecompromiso seguro

La memoria virtualizada requiere mapear la memoria física guest (GPA) a memoria física real (HPA) mediante tablas de páginas anidadas (EPT/RVI). La configuración inicial define no solo cuánta memoria se asigna, sino cómo se gestiona bajo presión del sistema.

```bash
# Configuración de memoria en libvirt XML
<memory unit='GiB'>8</memory>           # Memoria máxima asignable
<currentMemory unit='GiB'>4</currentMemory>  # Memoria al iniciar
<memoryBacking>
  <locked/>                              # Bloquear en RAM, evitar swap del host
  <hugepages/>                           # Usar hugepages para reducir TLB misses
  <nosharepages/>                        # Deshabilitar KSM para esta VM (aislamiento)
</memoryBacking>
```

```text
Técnicas de gestión de memoria en virtualización:

1. Ballooning
   ← Driver en guest "infla" para liberar memoria al host bajo presión
   ← Útil para overcommit dinámico, pero puede causar paging en guest si se excede

2. Transparent Page Sharing (KSM en Linux)
   ← Deduplica páginas idénticas entre VMs (ahorro de memoria)
   ← Riesgo: ataques side-channel entre VMs que comparten páginas

3. Huge Pages
   ← Páginas de memoria de 2MB/1GB vs. 4KB estándar
   ← Reduce TLB misses, mejora rendimiento para cargas memory-intensive

4. Memory Reservation
   ← Garantiza cantidad mínima de memoria física para la VM
   ← Esencial para cargas críticas que no toleran ballooning o swap
```

```bash
# Configurar hugepages en host Linux para KVM
# 1. Reservar hugepages en boot (grub)
# Editar /etc/default/grub:
GRUB_CMDLINE_LINUX="default_hugepagesz=1G hugepagesz=1G hugepages=8"
update-grub && reboot

# 2. Verificar asignación
grep Huge /proc/meminfo
# HugePages_Total: 8
# HugePages_Free: 8
# Hugepagesize: 1048576 kB

# 3. Asignar a VM específica (libvirt XML)
<memoryBacking>
  <hugepages>
    <page size='1' unit='G' nodeset='0'/>
  </hugepages>
</memoryBacking>
```

> El sobrecompromiso de memoria requiere monitorización proactiva: si el host agota memoria física, puede intercambiar páginas de VM a disco (swap), degradando rendimiento en órdenes de magnitud. Configurar alertas en uso de memoria del host (>80%) y definir reservas mínimas para VMs críticas. Para entornos multi-tenant con cargas no confiables, considerar deshabilitar KSM (`nosharepages`) para eliminar vectores de ataque side-channel.

### Disco virtual: formatos, políticas de provisioning y controladores de E/S

El disco de una VM es un archivo o volumen lógico que el hipervisor presenta como dispositivo de bloque al guest. La elección de formato, política de asignación y controlador impacta directamente el rendimiento de E/S y la flexibilidad operativa.

| Formato | Características | Rendimiento | Casos de uso |
|---------|----------------|-------------|-------------|
| **qcow2** (KVM) | Snapshots, compresión, cifrado, thin provisioning | Bueno (overhead de metadatos ~3-5%) | Desarrollo, pruebas, entornos con snapshots frecuentes |
| **raw** (KVM) | Sin metadatos, acceso directo a bloques | Óptimo (cercano a nativo) | Producción, bases de datos, cargas I/O-intensivas |
| **vmdk** (VMware) | Snapshots, clones vinculados, compatibilidad multi-plataforma | Bueno con paravirtualización | Entornos VMware, migración entre vSphere/Workstation |
| **vdi** (VirtualBox) | Dinámico/fijo, snapshots básicos | Aceptable para uso general | Laboratorios, desarrollo con VirtualBox |

```bash
# Crear disco con qemu-img (KVM/QEMU)
# Thin provisioning (dinámico): ocupa espacio solo al escribir
qemu-img create -f qcow2 /var/lib/libvirt/images/web-01.qcow2 100G

# Thick provisioning (pre-asignado): reserva espacio físico completo
qemu-img create -f raw /var/lib/libvirt/images/db-01.raw 100G
fallocate -l 100G /var/lib/libvirt/images/db-01.raw  # Reservar físicamente

# Verificar tamaño real en disco
du -h /var/lib/libvirt/images/web-01.qcow2  # Ej: 2.1G (thin, solo datos escritos)
du -h /var/lib/libvirt/images/db-01.raw     # Ej: 100G (thick, espacio reservado)
```

```xml
<!-- Configuración óptima de disco en libvirt para producción -->
<disk type='file' device='disk'>
  <driver name='qemu' type='raw' cache='none' io='native' discard='unmap'/>
  <source file='/mnt/nvme/db-01.raw'/>
  <target dev='vda' bus='virtio'/>
  <iotune>
    <read_bytes_sec>104857600</read_bytes_sec>   <!-- 100 MB/s límite lectura -->
    <write_bytes_sec>52428800</write_bytes_sec>   <!-- 50 MB/s límite escritura -->
    <read_iops_sec>10000</read_iops_sec>
    <write_iops_sec>5000</write_iops_sec>
  </iotune>
</disk>

<!-- cache='none': bypass caché del host, directo a disco (requiere guest con write barriers) -->
<!-- io='native': usar AIO nativo del kernel vs. threads emulados -->
<!-- discard='unmap': permitir TRIM para reclaim de espacio en almacenamiento thin -->
```

> Para cargas transaccionales (bases de datos), evitar caché de escritura (`cache='writeback'`) a menos que el host tenga UPS y configuración de flush garantizado; de lo contrario, un corte de energía puede corromper datos en caché no persistidos. Usar `cache='none'` con controladores paravirtualizados (`virtio-blk`) y guest con soporte para write barriers (la mayoría de kernels modernos).

### Red: modelos de NIC, switches virtuales y estrategias de conectividad

La configuración de red define cómo la vNIC de la VM se conecta a redes físicas o virtuales, estableciendo fronteras de aislamiento, políticas de tráfico y mecanismos de aceleración.

```text
Modelos de conectividad de red en virtualización:

1. NAT (Network Address Translation)
   ← VM comparte IP del host, tráfico saliente enmascarado
   ← Aislamiento por defecto, sin exposición directa a red física
   ← Ideal para: desarrollo, pruebas, VMs que solo requieren acceso saliente

2. Bridged (puente)
   ← vNIC conectada directamente a red física mediante bridge
   ← VM obtiene IP propia en la red LAN, visible como dispositivo físico
   ← Ideal para: producción, servicios que deben ser accesibles desde la red

3. Host-Only
   ← Red privada entre host y VMs, sin acceso a red física
   ← Ideal para: laboratorios aislados, pruebas de red interna

4. Overlay (VXLAN, Geneve)
   ← Red lógica sobre infraestructura física, extensible entre hosts
   ← Ideal para: nubes privadas, multi-tenancy, migración en vivo entre sitios
```

```bash
# Configurar red bridge en Linux host para KVM
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
  bridges:
    br0:
      interfaces: [eth0]
      dhcp4: yes
      parameters:
        stp: false
        forward-delay: 0

# Aplicar configuración
netplan apply

# Verificar bridge creado
ip link show br0
# Salida: br0: <BROADCAST,MULTICAST,UP,LOWER_UP> ...
```

```xml
<!-- Asignar NIC paravirtualizada a VM en libvirt -->
<interface type='bridge'>
  <source bridge='br0'/>
  <model type='virtio'/>  ← Paravirtualizado: menor overhead que e1000/rtl8139
  <mac address='52:54:00:ab:cd:ef'/>  ← MAC estática para DHCP reservations
  <address type='pci' domain='0x0000' bus='0x01' slot='0x00' function='0x0'/>
</interface>

<!-- Para multi-queue (paralelismo en E/S de red) -->
<model type='virtio'>
  <driver name='vhost' queues='4'/>  ← 4 colas para distribuir carga entre vCPUs
</model>
```

> El modelo de NIC impacta rendimiento significativamente: `virtio` (KVM), `vmxnet3` (VMware) o `Synthetic` (Hyper-V) son controladores paravirtualizados que reducen VM Exits y permiten batch processing de paquetes; evitar emulación legacy (`e1000`, `rtl8139`) salvo para compatibilidad con SOs antiguos que carecen de drivers paravirtualizados.

## Selección de sistema operativo invitado: implicaciones en compatibilidad y optimización

La selección del tipo de SO invitado durante la creación de una VM no es meramente cosmética: ajusta valores por defecto en la emulación de hardware, habilita optimizaciones específicas y determina la compatibilidad con herramientas de integración.

```text
Impacto de la selección de SO invitado:

┌─────────────────────────────────┐
│  Selección: "Ubuntu 22.04 LTS"  │
├─────────────────────────────────┤
│  → Chipset: Q35 (moderno, PCIe) │
│  → Firmware: UEFI con Secure Boot opcional │
│  → Controlador de disco: VirtIO por defecto │
│  → Controlador de red: VirtIO-net │
│  → Optimizaciones CPU: x2APIC, PV IPI │
│  → Guest Additions: compatible con paquete virtualbox-guest-utils / spice-vdagent │
└─────────────────────────────────┘

vs.

┌─────────────────────────────────┐
│  Selección: "Other Linux"       │
├─────────────────────────────────┤
│  → Chipset: PIIX3 (legacy, IDE) │
│  → Firmware: BIOS tradicional   │
│  → Controlador de disco: IDE emulado │
│  → Controlador de red: e1000 emulado │
│  → Sin optimizaciones paravirtualizadas │
│  → Guest Additions: puede requerir compilación manual │
└─────────────────────────────────┘
```

```bash
# Verificar configuración aplicada según tipo de SO en libvirt
virsh dumpxml web-vm | grep -A10 "<os>"

# Para Ubuntu moderno:
<os>
  <type arch='x86_64' machine='pc-q35-7.2'>hvm</type>
  <loader readonly='yes' type='pflash'>/usr/share/OVMF/OVMF_CODE.fd</loader>
  <boot dev='hd'/>
</os>

# Para "Other Linux" genérico:
<os>
  <type arch='x86_64' machine='pc-i440fx-2.4'>hvm</type>
  <boot dev='hd'/>
</os>
```

> Seleccionar incorrectamente el tipo de SO invitado puede resultar en rendimiento subóptimo (emulación IDE vs. VirtIO), incompatibilidad con características modernas (UEFI vs. BIOS) o dificultades para instalar herramientas de integración. Siempre elegir la opción más específica disponible; si el SO exacto no aparece, seleccionar la distribución base más cercana (ej: "Red Hat Enterprise Linux 9" para AlmaLinux 9).

## ISO de instalación vs. plantilla: flujos de aprovisionamiento inicial

El medio de arranque inicial define cómo se materializa el sistema operativo dentro de la VM: desde una instalación fresca mediante ISO, o mediante clonación de una plantilla preconfigurada. Cada enfoque tiene implicaciones en tiempo de despliegue, consistencia de configuración y gestión del ciclo de vida.

### Instalación desde ISO: control total, mayor tiempo de aprovisionamiento

```bash
# Flujo típico de instalación desde ISO en KVM/libvirt
# 1. Adjuntar ISO como dispositivo de CD-ROM
<disk type='file' device='cdrom'>
  <source file='/isos/ubuntu-22.04-desktop-amd64.iso'/>
  <target dev='sda' bus='sata'/>
  <readonly/>
</disk>

# 2. Configurar boot prioritario desde CD-ROM
<boot dev='cdrom'/>
<boot dev='hd'/>  ← Fallback a disco tras instalación

# 3. Iniciar VM y proceder con instalación interactiva o automatizada
virsh start web-vm
virsh console web-vm  # Conectar a consola serial para instalación headless
```

```yaml
# Automatización de instalación con cloud-init (KVM/QEMU)
# 1. Preparar user-data y meta-data para configuración inicial
# user-data.yaml
#cloud-config
hostname: web-server-01
users:
  - name: admin
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-rsa AAAAB3NzaC1yc2E... admin@laptop
packages:
  - nginx
  - python3-pip
runcmd:
  - systemctl enable --now nginx

# meta-data.yaml
instance-id: web-server-01
local-hostname: web-server-01

# 2. Generar ISO de cloud-init
genisoimage -output /vms/web-01-cidata.iso \
  -volid cidata -joliet -rock user-data.yaml meta-data.yaml

# 3. Adjuntar como segundo CD-ROM en la VM
<disk type='file' device='cdrom'>
  <source file='/vms/web-01-cidata.iso'/>
  <target dev='sdb' bus='sata'/>
  <readonly/>
</disk>

# 4. La imagen base debe tener cloud-init instalado y habilitado
# Al primer boot, cloud-init consume user-data y configura el sistema automáticamente
```

> La instalación desde ISO permite personalización completa, pero introduce variabilidad: configuraciones manuales inconsistentes, paquetes olvidados o errores humanos. Para entornos que requieren reproducibilidad, combinar ISO con automatización (cloud-init, Kickstart, AutoYaST) o migrar a enfoque de plantillas.

### Plantillas (templates): consistencia, velocidad y gestión centralizada

Una plantilla es una VM preconfigurada, generalizada y marcada como inmutable, diseñada para servir como base de clonación rápida. Su creación requiere pasos específicos para asegurar que las instancias derivadas no hereden identificadores únicos conflictivos.

```bash
# Proceso de creación de plantilla en KVM/libvirt
# 1. Crear y configurar VM base
virt-install --name template-ubuntu \
  --memory 2048 --vcpus 2 --disk size=20 \
  --cdrom /isos/ubuntu-22.04-server-amd64.iso \
  --os-variant ubuntu22.04 --network bridge=br0 --graphics none

# 2. Instalar SO, paquetes, configuraciones base...

# 3. Generalizar antes de convertir en plantilla
# Dentro de la VM:
sudo cloud-init clean --logs  # Limpiar estado de cloud-init
sudo truncate -s 0 /etc/machine-id  # Resetear identificador único
sudo rm -f /etc/ssh/ssh_host_*  # Eliminar claves SSH específicas
sudo apt clean && sudo apt autoremove -y  # Limpiar caché de paquetes

# 4. Apagar y convertir en plantilla
virsh shutdown template-ubuntu
virsh define --file <(virsh dumpxml template-ubuntu | sed 's/template-ubuntu/ubuntu-template/g')
virsh snapshot-create-as --domain ubuntu-template --name "base" --description "Plantilla base generalizada"

# 5. Marcar como plantilla (no booteable directamente)
# En libvirt, simplemente no iniciar la plantilla; usar solo como fuente para clones
```

```bash
# Clonar desde plantilla para nueva instancia
# Linked clone (copy-on-write, ahorro de espacio)
qemu-img create -f qcow2 \
  -b /var/lib/libvirt/images/ubuntu-template.qcow2 \
  -F qcow2 \
  /var/lib/libvirt/images/web-prod-01.qcow2

# Definir nueva VM con disco clonado
virsh clone ubuntu-template web-prod-01 \
  --file /var/lib/libvirt/images/web-prod-01.qcow2 \
  --cloud-init user-data=web-01-user.yaml

# La nueva VM arranca con configuración específica de cloud-init,
# sobre base de plantilla generalizada
```

> La generalización de plantillas es crítica: omitir pasos como resetear `machine-id` o eliminar claves SSH puede causar conflictos de red (múltiples VMs con mismo identificador DHCP), fallos de autenticación (claves SSH duplicadas) o problemas de licenciamiento (SOs que vinculan licencia a hardware virtual). Documentar y automatizar el proceso de "sysprep" para cada tipo de SO invitado.

## Quédate con...

- La **asignación de vCPUs** define topología virtual (sockets/cores) que impacta licenciamiento y scheduling; usar CPU pinning y reservas para cargas sensibles a latencia, monitorizar "ready time" para detectar contención.
- La **gestión de memoria** requiere equilibrar asignación, reservas y técnicas de overcommit (ballooning, KSM); hugepages mejoran rendimiento para cargas memory-intensive, pero requieren configuración explícita en host y guest.
- El **formato de disco** (`qcow2` vs `raw`) y política de provisioning (thin vs thick) determinan flexibilidad operativa y rendimiento de E/S; para producción I/O-intensiva, preferir `raw` con `cache='none'` y controladores `virtio`.
- La **configuración de red** debe seleccionar modelo de conectividad (NAT/bridge/overlay) y controlador paravirtualizado (`virtio`, `vmxnet3`) para minimizar overhead; evitar emulación legacy salvo por compatibilidad estricta.
- La **selección del SO invitado** ajusta valores por defecto de hardware virtual y optimizaciones; elegir siempre la opción más específica disponible para habilitar características paravirtualizadas y compatibilidad con Guest Additions.
- La **instalación desde ISO** ofrece control total pero introduce variabilidad; combinar con automatización (cloud-init, Kickstart) para reproducibilidad en entornos que requieren consistencia.
- Las **plantillas** aceleran despliegue y garantizan consistencia, pero requieren generalización cuidadosa (reset de IDs, limpieza de claves) para evitar conflictos en instancias derivadas; documentar y automatizar el proceso de "sysprep".
- Cada decisión en la creación de una VM tiene consecuencias a largo plazo: documentar configuraciones, usar infraestructura como código (Terraform, Ansible) para versionar definiciones de VMs, y establecer convenciones de naming con metadatos (entorno, propietario, fecha de expiración) para facilitar gestión del ciclo de vida.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/vms/ciclo" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/vms/integracion" class="next">Siguiente</a>
</div>
