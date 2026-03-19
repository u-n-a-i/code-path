---
title: "Funcionalidades comunes"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Funcionalidades comunes](#funcionalidades-comunes)
  - [Carpetas compartidas: sistemas de archivos híbridos mediante redirección de E/S](#carpetas-compartidas-sistemas-de-archivos-híbridos-mediante-redirección-de-es)
  - [Portapapeles compartido y redirección de USB: canales de comunicación host-guest](#portapapeles-compartido-y-redirección-de-usb-canales-de-comunicación-host-guest)
    - [Portapapeles compartido: sincronización de datos temporales mediante canales virtuales](#portapapeles-compartido-sincronización-de-datos-temporales-mediante-canales-virtuales)
    - [Redirección de USB: paso de dispositivos físicos mediante filtrado y emulación](#redirección-de-usb-paso-de-dispositivos-físicos-mediante-filtrado-y-emulación)
  - [Integración de escritorio: unificación de experiencias mediante redirección gráfica y de entrada](#integración-de-escritorio-unificación-de-experiencias-mediante-redirección-gráfica-y-de-entrada)
    - [Redirección gráfica: desde framebuffer emulado a composición de ventanas](#redirección-gráfica-desde-framebuffer-emulado-a-composición-de-ventanas)
    - [Redirección de entrada: unificación de teclado, ratón y gestos](#redirección-de-entrada-unificación-de-teclado-ratón-y-gestos)
  - [Snapshots y clonación rápida: gestión de estados mediante copy-on-write y metadatos](#snapshots-y-clonación-rápida-gestión-de-estados-mediante-copy-on-write-y-metadatos)
    - [Snapshots: captura de estado mediante árboles de discos diferenciales](#snapshots-captura-de-estado-mediante-árboles-de-discos-diferenciales)
    - [Clonación rápida: derivación de VMs mediante enlaces y referencias compartidas](#clonación-rápida-derivación-de-vms-mediante-enlaces-y-referencias-compartidas)
  - [Quédate con...](#quédate-con)

</div>

# Funcionalidades comunes

Las funcionalidades comunes de los hipervisores de Tipo 2 —carpetas compartidas, portapapeles unificado, redirección de USB, integración de escritorio y gestión de snapshots— no son meras comodidades de interfaz, sino mecanismos técnicos complejos que requieren coordinación entre el espacio de usuario del hipervisor, el kernel del sistema operativo anfitrión y los controladores paravirtualizados dentro de la máquina invitada. Estas características transforman la virtualización de una simple emulación de hardware en una experiencia de usuario fluida donde los límites entre host y guest se difuminan de forma controlada. Comprender cómo funcionan estos mecanismos a nivel de sistema —desde los canales de comunicación virtuales hasta los sistemas de archivos en red y los mecanismos de copy-on-write para snapshots— es esencial para configurarlos de forma segura, diagnosticar problemas de rendimiento o sincronización, y evitar vulnerabilidades introducidas por una integración excesiva entre entornos que, arquitectónicamente, deberían permanecer aislados.

## Carpetas compartidas: sistemas de archivos híbridos mediante redirección de E/S

La funcionalidad de carpetas compartidas permite exponer directorios del sistema operativo anfitrión como sistemas de archivos montables dentro de la máquina virtual, facilitando el intercambio de archivos sin necesidad de medios extraíbles virtuales o transferencias de red externas. Técnicamente, esta característica no monta el sistema de archivos nativo del host directamente en el guest, sino que implementa un protocolo de redirección de E/S a través de un canal de comunicación privilegiado entre el proceso del hipervisor y los controladores paravirtualizados instalados en la VM.

```text
Arquitectura de carpetas compartidas:

[Guest OS]
    ↓ (llamada al sistema: open/read/write en /mnt/shared)
[Driver paravirtualizado: vboxsf/vmhgfs/9p]
    ↓ (protocolo de redirección sobre canal virtual)
[Hipervisor Tipo 2 - proceso de usuario]
    ↓ (traducción a llamadas del sistema del host)
[Host OS Kernel - VFS layer]
    ↓ (acceso al sistema de archivos nativo: NTFS/ext4/APFS)
[Disco físico del host]
```

Cada plataforma implementa este mecanismo con tecnologías distintas:

| Hipervisor | Tecnología subyacente | Driver en guest | Protocolo de transporte |
|-----------|----------------------|-----------------|------------------------|
| **VirtualBox** | vboxsf (Shared Folders) | `vboxsf` kernel module | VMCI (Virtual Machine Communication Interface) |
| **VMware** | vmhgfs-fuse | `vmhgfs` o `vmhgfs-fuse` | HGFS (Host-Guest File System) sobre VMCI |
| **Parallels** | prl_fs | `prl_fs` kernel module | Canal propietario optimizado para macOS |
| **QEMU/KVM** | virtio-9p (Plan 9) | `9p` kernel module + `virtio` | 9P2000.L sobre virtio-serial |

```bash
# Montar carpeta compartida en guest Linux con VirtualBox
# Requiere Guest Additions instaladas y carpeta configurada en host

# Verificar que el módulo vboxsf está cargado
lsmod | grep vboxsf

# Montar manualmente (si no se hace automáticamente)
sudo mkdir -p /mnt/shared
sudo mount -t vboxsf NombreCarpetaConfigurada /mnt/shared

# Para montaje persistente, añadir a /etc/fstab
echo "NombreCarpetaConfigurada /mnt/shared vboxsf defaults,uid=1000,gid=1000 0 0" | sudo tee -a /etc/fstab
```

```bash
# Configurar carpeta compartida en QEMU/KVM con virtio-9p
# En el host, definir el dispositivo 9p en la línea de comandos de QEMU

qemu-system-x86_64 \
  -fsdev local,id=shared_dev,path=/home/user/shared,security_model=mapped \
  -device virtio-9p-pci,fsdev=shared_dev,mount_tag=shared_tag \
  ...

# En el guest Linux, montar el sistema de archivos 9p
sudo mkdir -p /mnt/shared
sudo mount -t 9p -o trans=virtio,version=9p2000.L shared_tag /mnt/shared

# Para montaje persistente en /etc/fstab del guest
echo "shared_tag /mnt/shared 9p trans=virtio,version=9p2000.L,defaults 0 0" | sudo tee -a /etc/fstab
```

> Las carpetas compartidas introducen una superficie de ataque significativa: un proceso malicioso dentro de la VM podría intentar acceder a archivos sensibles del host si los permisos no están correctamente configurados. Siempre usar el principio de mínimo privilegio: compartir solo directorios específicos, con permisos de solo lectura cuando sea posible, y evitar exponer rutas críticas como `/`, `C:\`, o directorios de configuración del sistema.

## Portapapeles compartido y redirección de USB: canales de comunicación host-guest

El portapapeles compartido y la redirección de USB son funcionalidades que requieren canales de comunicación bidireccionales de baja latencia entre el proceso del hipervisor y la máquina virtual. Estos mecanismos permiten una experiencia de usuario integrada, pero dependen críticamente de las herramientas de integración instaladas en el guest y de configuraciones de seguridad adecuadas para evitar fugas de datos o vectores de ataque.

### Portapapeles compartido: sincronización de datos temporales mediante canales virtuales

El portapapeles unificado intercepta las operaciones de copia/pegue en ambos sistemas y las redirige a través de un canal de comunicación dedicado, manteniendo una caché temporal de los datos transferidos.

```text
Flujo de portapapeles bidireccional:

[Guest: Ctrl+C en texto]
    ↓
[Driver de integración en guest captura evento]
    ↓
[Canal virtual VMCI/virtio-serial]
    ↓
[Hipervisor procesa y traduce formato si es necesario]
    ↓
[Host OS: API de portapapeles nativa (Win32/GTK/Clipboard)]
    ↓
[Usuario puede pegar en aplicación del host]

# El proceso inverso ocurre para host → guest
```

```bash
# Configurar modo de portapapeles en VirtualBox mediante VBoxManage
# Opciones: disabled, hosttoguest, guesttohost, bidirectional

VBoxManage modifyvm "MiVM" --clipboard-mode bidirectional
VBoxManage modifyvm "MiVM" --draganddrop bidirectional

# Verificar configuración actual
VBoxManage showvminfo "MiVM" | grep -i clipboard
```

```powershell
# Configurar integración de portapapeles en VMware Workstation (PowerShell)
# Requiere VMware.PowerCLI module

$vm = Get-VM -Name "Dev-Environment"
$vmView = Get-View $vm.Id
$configSpec = New-Object VMware.Vim.VirtualMachineConfigSpec
$configSpec.extraConfig += @(
    (New-Object VMware.Vim.OptionValue -Property @{key="isolation.tools.copy.disable"; value=$false}),
    (New-Object VMware.Vim.OptionValue -Property @{key="isolation.tools.paste.disable"; value=$false})
)
$vmView.ReconfigVM($configSpec)
```

> El portapapeles compartido puede exponer datos sensibles inadvertidamente: contraseñas copiadas, tokens de autenticación o información confidencial pueden sincronizarse entre entornos con diferentes niveles de seguridad. Para VMs que manejan datos críticos, considerar deshabilitar esta funcionalidad (`--clipboard-mode disabled`) y usar métodos de transferencia más controlados como SFTP o volúmenes cifrados.

### Redirección de USB: paso de dispositivos físicos mediante filtrado y emulación

La redirección de USB permite conectar dispositivos físicos del host (tokens de seguridad, unidades flash, cámaras, adaptadores serie) directamente a la máquina virtual, como si estuvieran conectados físicamente a su bus USB virtual. El hipervisor intercepta el tráfico USB en el host y lo reenvía al guest mediante un protocolo de túnel.

```text
Arquitectura de redirección USB:

[Dispositivo USB físico]
    ↓
[Host OS: Driver USB nativo]
    ↓
[Hipervisor: Filtro USB captura tráfico]
    ↓
[Canal virtual de alta prioridad]
    ↓
[Guest OS: Driver USB virtual (emulado o paravirtualizado)]
    ↓
[Aplicación en guest ve dispositivo como conectado localmente]
```

```bash
# Listar dispositivos USB disponibles para redirección en VirtualBox
VBoxManage list usbhost

# Salida típica:
# VendorId: 0x1234
# ProductId: 0x5678
# Manufacturer: YubiKey
# Product: YubiKey OTP+U2F+CCID
# Serial: 12345678
# Current State: Busy/Available

# Crear filtro USB para conectar automáticamente un dispositivo a la VM
VBoxManage usbfilter add 0 --target "MiVM" --name "YubiKey" \
  --vendorid 1234 --productid 5678 --action hold

# El dispositivo se conectará automáticamente cuando la VM inicie
# y esté disponible físicamente en el host
```

```bash
# Redirección USB en QEMU/KVM mediante spice/usbredir
# Requiere spice-server y usbredir instalados en host y guest

qemu-system-x86_64 \
  -spice port=5900,disable-ticketing=on \
  -device virtio-serial-pci \
  -chardev spicevmc,id=usbredirchardev,name=usbredir \
  -device usb-redir,chardev=usbredirchardev,id=usbredir \
  ...

# En el guest, instalar spice-vdagent para mejor integración
sudo apt install spice-vdagent
```

> La redirección de USB puede introducir vulnerabilidades de seguridad: dispositivos maliciosos podrían intentar explotar controladores en el guest o, en configuraciones incorrectas, acceder al host. Filtrar dispositivos por vendor/product ID específico en lugar de permitir redirección genérica, y evitar conectar dispositivos no confiables a VMs con acceso a recursos sensibles.

## Integración de escritorio: unificación de experiencias mediante redirección gráfica y de entrada

La integración de escritorio trasciende la simple virtualización de hardware para proporcionar una experiencia de usuario donde las aplicaciones del guest se ejecutan de forma transparente junto a las del host. Esta funcionalidad requiere redirección avanzada de gráficos, entrada y eventos del sistema.

### Redirección gráfica: desde framebuffer emulado a composición de ventanas

Los hipervisores de Tipo 2 implementan múltiples estrategias para renderizar la salida gráfica de la VM:

| Método | Descripción | Rendimiento | Casos de uso |
|--------|-------------|-------------|-------------|
| **Framebuffer emulado** (VGA, SVGA) | Emulación completa de hardware gráfico | Bajo (30-60% nativo) | SOs legacy sin drivers modernos |
| **Controlador paravirtualizado** (vmwgfx, vboxvideo, virtio-gpu) | Driver especializado en guest + backend en host | Alto (80-95% nativo) | Uso general con Guest Additions instaladas |
| **Composición de ventanas** (Unity, Coherence) | Aplicaciones individuales renderizadas en host | Variable (depende de integración) | Integración profunda host-guest |
| **GPU Passthrough** (VFIO) | Asignación directa de GPU física a VM | Nativo (95-98%) | Gaming, CAD, cargas GPU-intensivas |

```bash
# Verificar controlador gráfico activo en guest Linux (VirtualBox)
lspci -k | grep -A3 -i vga

# Salida esperada con Guest Additions:
# 00:02.0 VGA compatible controller: InnoTek Systemberatung GmbH VirtualBox Graphics Adapter
# Kernel driver in use: vboxvideo

# Sin Guest Additions:
# 00:02.0 VGA compatible controller: VMware SVGA II Adapter
# Kernel driver in use: vmwgfx  # o ningún driver si no está instalado
```

```xml
<!-- Configurar virtio-gpu con aceleración 3D en libvirt/KVM -->
<domain type='kvm'>
  ...
  <devices>
    <graphics type='spice' autoport='yes'>
      <listen type='address'/>
      <image compression='off'/>
      <gl enable='yes' rendernode='/dev/dri/renderD128'/>
    </graphics>
    <video>
      <model type='virtio' heads='1' primary='yes'>
        <acceleration accel3d='yes'/>
      </model>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x01' function='0x0'/>
    </video>
  </devices>
</domain>
```

> La aceleración 3D en virtualización Tipo 2 depende críticamente de la compatibilidad entre el driver del guest, el backend del hipervisor y los controladores gráficos del host. En macOS con Apple Silicon, las opciones están limitadas por las APIs gráficas disponibles (Metal) y la arquitectura ARM; la aceleración 3D para guests x86 emulados es particularmente limitada.

### Redirección de entrada: unificación de teclado, ratón y gestos

La integración fluida de entrada requiere capturar eventos de dispositivos de entrada en el host y redirigirlos al guest con latencia mínima, manejando correctamente la captura/release del foco y los gestos específicos de plataforma.

```text
Flujo de redirección de entrada:

[Evento físico: movimiento de ratón, tecla presionada]
    ↓
[Host OS: subsistema de entrada (evdev/X11/Wayland/Win32)]
    ↓
[Hipervisor: intercepta evento si la VM tiene foco]
    ↓
[Traducción de eventos: scancode → keycode → evento guest]
    ↓
[Canal virtual de entrada (virtio-input, VMCI)]
    ↓
[Guest OS: driver de entrada paravirtualizado]
    ↓
[Aplicación en guest recibe evento como si fuera local]
```

```bash
# Configurar integración de entrada en VirtualBox
# Habilitar integración de ratón (evita captura manual con Host key)
VBoxManage modifyvm "MiVM" --mouse integrated

# Configurar tecla de host para liberar captura (por defecto: Ctrl derecho)
VBoxManage setextradata global "GUI/HostKey" "RightCtrl"

# Habilitar soporte para tabletas gráficas (mejor precisión que emulación de ratón)
VBoxManage modifyvm "MiVM" --usbtablet on
```

> La redirección de entrada puede generar conflictos cuando múltiples aplicaciones compiten por el foco: atajos de teclado del host pueden interceptarse antes de llegar al guest, o viceversa. Configurar claramente las teclas de escape (Host key) y documentar las combinaciones reservadas por cada capa para evitar frustraciones operativas.

## Snapshots y clonación rápida: gestión de estados mediante copy-on-write y metadatos

Los snapshots y la clonación rápida son funcionalidades críticas para desarrollo, pruebas y recuperación que permiten capturar el estado exacto de una VM en un instante y crear copias derivadas sin duplicar inmediatamente todo el contenido del disco.

### Snapshots: captura de estado mediante árboles de discos diferenciales

Un snapshot no es una copia completa del disco, sino un punto de referencia que redirige las escrituras posteriores a un nuevo archivo diferencial, manteniendo el estado anterior inmutable. Esta implementación mediante copy-on-write permite revertir cambios instantáneamente, pero introduce complejidad en la gestión del almacenamiento.

```text
Estructura de snapshots con copy-on-write:

Estado inicial:
[disk-base.qcow2] ← Contiene todos los datos originales

Snapshot 1 creado:
[disk-base.qcow2] (solo lectura)
[disk-snap1.qcow2] ← Nuevo: contiene solo bloques modificados desde snap1

Snapshot 2 creado:
[disk-base.qcow2] (solo lectura)
[disk-snap1.qcow2] (solo lectura)
[disk-snap2.qcow2] ← Nuevo: contiene bloques modificados desde snap2

Lectura de bloque X:
1. Buscar en disk-snap2.qcow2 → si existe, devolver
2. Si no, buscar en disk-snap1.qcow2 → si existe, devolver  
3. Si no, buscar en disk-base.qcow2 → devolver
4. Si no existe en ningún nivel, devolver cero

Escritura de bloque X:
1. Siempre escribir en el snapshot más reciente (disk-snap2.qcow2)
2. Marcar bloque como "dirty" en metadatos del snapshot
```

```bash
# Gestionar snapshots en VirtualBox mediante VBoxManage
# Crear snapshot con descripción
VBoxManage snapshot "MiVM" take "Pre-Update" --description "Estado antes de actualizar paquetes"

# Listar snapshots existentes
VBoxManage snapshot "MiVM" list

# Salida típica:
# Name: Pre-Update (UUID: abc123...)
#    Name: Post-Config (UUID: def456...)  ← Snapshot anidado

# Revertir a snapshot específico
VBoxManage snapshot "MiVM" restore "Pre-Update"

# Eliminar snapshot (consolida cambios en el padre)
VBoxManage snapshot "MiVM" delete "Post-Config"
```

```bash
# Gestionar snapshots en QEMU/KVM mediante virsh
# Crear snapshot con metadata XML
virsh snapshot-create-as --domain mi-vm \
  --name "backup-pre-patch" \
  --description "Pre-parche de seguridad kernel" \
  --disk-only --atomic

# Listar snapshots
virsh snapshot-list mi-vm

# Revertir snapshot
virsh snapshot-revert mi-vm backup-pre-patch

# Eliminar snapshot
virsh snapshot-delete mi-vm backup-pre-patch
```

> Los snapshots no son backups: dependen de la cadena completa de archivos de disco. Eliminar un snapshot intermedio sin consolidar correctamente puede corromper la cadena completa. Además, el rendimiento de E/S se degrada con cadenas largas de snapshots debido a la búsqueda en múltiples niveles. Usar snapshots para pruebas de corta duración (<72h) y consolidar o eliminar regularmente.

### Clonación rápida: derivación de VMs mediante enlaces y referencias compartidas

La clonación rápida permite crear nuevas VMs derivadas de una plantilla sin copiar inmediatamente todo el contenido del disco base, ahorrando tiempo y espacio mediante técnicas de linking y referencia compartida.

| Tipo de clonación | Mecanismo | Ventaja | Limitación |
|------------------|-----------|---------|-----------|
| **Linked Clone** | Nuevo disco referenciando base (copy-on-write) | Creación instantánea, bajo uso de disco | Depende del disco base; si se corrompe, se pierden todos los clones |
| **Full Clone** | Copia completa e independiente del disco | Autonomía total, portable | Tiempo y espacio proporcional al tamaño del disco original |
| **Template/Seed** | Imagen base de solo lectura + disco diferencial por instancia | Balance entre rendimiento y aislamiento | Requiere gestión de plantillas centralizada |

```bash
# Crear linked clone en VirtualBox
VBoxManage clonevm "Template-Ubuntu" \
  --name "Dev-Instance-01" \
  --register \
  --options link \
  --basefolder /vms/linked-clones

# El nuevo VM comparte el disco base en modo lectura,
# con un archivo diferencial para escrituras específicas

# Verificar estructura de discos
VBoxManage showvminfo "Dev-Instance-01" | grep -A5 "Storage"
```

```bash
# Crear clon en QEMU/KVM con qemu-img
# Linked clone mediante backing file
qemu-img create -f qcow2 \
  -b /templates/base-ubuntu.qcow2 \
  -F qcow2 \
  /vms/dev-clone-01.qcow2

# El nuevo archivo es pequeño inicialmente (~200KB de metadatos)
# y crece solo con las escrituras específicas de esta instancia

# Verificar cadena de backing files
qemu-img info /vms/dev-clone-01.qcow2

# Salida:
# image: /vms/dev-clone-01.qcow2
# file format: qcow2
# virtual size: 50G
# backing file: /templates/base-ubuntu.qcow2
# backing file format: qcow2
```

> Los linked clones introducen una dependencia crítica: si el disco base se elimina o corrompe, todos los clones derivados quedan inutilizables. Para entornos de producción o datos importantes, preferir full clones o implementar estrategias de backup que incluyan la cadena completa de discos dependientes.

## Quédate con...

- Las **carpetas compartidas** implementan redirección de E/S mediante protocolos virtuales (vboxsf, HGFS, 9p), no montaje directo de sistemas de archivos; requieren drivers paravirtualizados en el guest y configuración cuidadosa de permisos para evitar exposición de datos sensibles.
- El **portapapeles compartido** sincroniza datos temporales mediante canales VMCI/virtio-serial; útil para productividad pero potencial vector de fuga de información sensible entre entornos con diferentes niveles de seguridad.
- La **redirección de USB** intercepta y túneliza tráfico de dispositivos físicos al guest; filtrar por vendor/product ID específico y evitar dispositivos no confiables para minimizar riesgos de seguridad.
- La **integración gráfica** varía desde framebuffer emulado (bajo rendimiento) hasta controladores paravirtualizados (alto rendimiento); la aceleración 3D requiere compatibilidad entre driver guest, backend del hipervisor y GPU del host.
- Los **snapshots** implementan copy-on-write con árboles de discos diferenciales: potentes para pruebas y rollback, pero no sustituyen backups y degradan rendimiento con cadenas largas.
- La **clonación rápida** (linked clones) ahorra tiempo y espacio mediante referencias a discos base, pero introduce dependencias críticas: la corrupción del base afecta a todos los clones derivados.
- Todas estas funcionalidades dependen de **herramientas de integración instaladas en el guest** (Guest Additions, VMware Tools, spice-vdagent); sin ellas, la experiencia se degrada significativamente y muchas características quedan inhabilitadas.
- La **integración host-guest aumenta la superficie de ataque**: cada canal de comunicación compartido es un potencial vector de escape de VM o fuga de datos; aplicar principio de mínimo privilegio y deshabilitar funcionalidades no esenciales en entornos sensibles.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/tipo2/ejemplos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/tipo2/cuando" class="next">Siguiente</a>
</div>
