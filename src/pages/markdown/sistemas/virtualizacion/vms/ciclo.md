---
title: "Ciclo de vida de una VM"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Ciclo de vida de una VM](#ciclo-de-vida-de-una-vm)
  - [Creación: asignación de recursos abstractos y materialización de discos virtuales](#creación-asignación-de-recursos-abstractos-y-materialización-de-discos-virtuales)
  - [Configuración: ajuste fino de hardware virtual y políticas de recursos](#configuración-ajuste-fino-de-hardware-virtual-y-políticas-de-recursos)
    - [Ajustes de CPU y memoria: afinidad, reservas y sobrecompromiso](#ajustes-de-cpu-y-memoria-afinidad-reservas-y-sobrecompromiso)
    - [Configuración de red: modelos de NIC, switches virtuales y aislamiento](#configuración-de-red-modelos-de-nic-switches-virtuales-y-aislamiento)
  - [Ejecución: planificación de recursos y gestión de estado en tiempo real](#ejecución-planificación-de-recursos-y-gestión-de-estado-en-tiempo-real)
  - [Suspensión y apagado: transiciones de estado y persistencia de datos](#suspensión-y-apagado-transiciones-de-estado-y-persistencia-de-datos)
  - [Clonación: derivación de VMs mediante copy-on-write y plantillas](#clonación-derivación-de-vms-mediante-copy-on-write-y-plantillas)
  - [Eliminación: liberación controlada de recursos y limpieza de metadatos](#eliminación-liberación-controlada-de-recursos-y-limpieza-de-metadatos)
  - [Quédate con...](#quédate-con)

</div>

# Ciclo de vida de una VM

El ciclo de vida de una máquina virtual no es una secuencia lineal de operaciones administrativas, sino un flujo de estados gestionados que refleja la arquitectura subyacente de la virtualización: desde la asignación inicial de recursos abstractos hasta la liberación controlada de recursos físicos. Cada transición —creación, configuración, ejecución, suspensión, clonación, eliminación— implica mecanismos técnicos específicos: metadatos de configuración, estructuras de disco copy-on-write, planificación de vCPUs, serialización de estado de memoria y políticas de retención de almacenamiento. Comprender este ciclo en profundidad permite gestionar VMs no como "cajas negras", sino como entidades programables cuyo estado, rendimiento y aislamiento pueden controlarse de forma determinista. Esta sección desglosa cada fase del ciclo de vida, explicando los mecanismos internos que las habilitan, las decisiones de diseño que impactan la operación a largo plazo y las mejores prácticas para evitar deuda técnica acumulada en entornos virtualizados dinámicos.

## Creación: asignación de recursos abstractos y materialización de discos virtuales

La creación de una VM no instancia hardware físico, sino que define metadatos que describen cómo el hipervisor debe presentar recursos virtualizados al sistema invitado. Este proceso implica tres decisiones arquitectónicas fundamentales: la topología de hardware virtual, el formato y política del almacenamiento, y la estrategia de red.

```text
Componentes definidos en la creación de una VM:

┌─────────────────────────────────┐
│  Metadatos de configuración     │  ← XML/JSON que describe la VM
│  • Topología CPU (sockets/cores)│
│  • Memoria asignada/reservada   │
│  • Dispositivos virtuales       │
├─────────────────────────────────┤
│  Discos virtuales               │  ← Archivos o volúmenes lógicos
│  • Formato: qcow2/vmdk/vdi/raw  │
│  • Política: thin/thick provisioning │
│  • Backend: local/NFS/iSCSI     │
├─────────────────────────────────┤
│  Configuración de red           │  ← vNICs conectadas a switches virtuales
│  • Modelo: virtio/e1000/vmxnet3 │
│  • Red: NAT/bridge/overlay      │
└─────────────────────────────────┘
```

```bash
# Ejemplo: creación de VM con libvirt/KVM (CLI)
# 1. Definir configuración en XML
cat > /tmp/web-vm.xml << 'EOF'
<domain type='kvm'>
  <name>web-server-01</name>
  <memory unit='GiB'>4</memory>
  <vcpu placement='static'>2</vcpu>
  <os>
    <type arch='x86_64' machine='pc-q35-7.2'>hvm</type>
    <boot dev='hd'/>
  </os>
  <cpu mode='host-passthrough' check='none'/>
  <devices>
    <emulator>/usr/bin/qemu-system-x86_64</emulator>
    <disk type='file' device='disk'>
      <driver name='qemu' type='qcow2' cache='none' discard='unmap'/>
      <source file='/var/lib/libvirt/images/web-01.qcow2'/>
      <target dev='vda' bus='virtio'/>
    </disk>
    <interface type='network'>
      <source network='default'/>
      <model type='virtio'/>
      <address type='pci' domain='0x0000' bus='0x01' slot='0x00' function='0x0'/>
    </interface>
    <graphics type='spice' autoport='yes'>
      <listen type='address'/>
    </graphics>
  </devices>
</domain>
EOF

# 2. Crear disco virtual con qemu-img
qemu-img create -f qcow2 /var/lib/libvirt/images/web-01.qcow2 50G

# 3. Registrar y iniciar VM
virsh define /tmp/web-vm.xml
virsh start web-server-01
```

> El formato de disco elegido impacta rendimiento y flexibilidad: `qcow2` permite snapshots y compresión pero añade overhead de metadatos; `raw` ofrece mejor rendimiento secuencial pero sin características avanzadas. Para bases de datos o cargas I/O-intensivas, preferir `raw` con cache=`none` y io=`native`; para entornos de desarrollo, `qcow2` con thin provisioning ahorra espacio inicial.

## Configuración: ajuste fino de hardware virtual y políticas de recursos

Tras la creación básica, la configuración permite ajustar el comportamiento de la VM para equilibrar rendimiento, compatibilidad y aislamiento. Esta fase define cómo el hipervisor traduce las solicitudes del guest a operaciones sobre el hardware físico.

### Ajustes de CPU y memoria: afinidad, reservas y sobrecompromiso

```bash
# Configurar CPU pinning en KVM para reducir latencia de scheduling
# Asigna vCPUs de la VM a núcleos físicos específicos
virsh emulatorpin web-server-01 --cpulist 0-1 --live
virsh vcpupin web-server-01 --vcpu 0 --cpulist 0 --live
virsh vcpupin web-server-01 --vcpu 1 --cpulist 1 --live

# Configurar reservas y límites de memoria (libvirt XML)
<memory unit='GiB'>4</memory>           # Memoria asignada
<currentMemory unit='GiB'>2</currentMemory>  # Memoria inicial al arrancar
<memoryBacking>
  <locked/>  # Bloquear memoria en RAM, evitar swap del host
</memoryBacking>
```

```yaml
# Ejemplo: política de recursos en VMware vSphere (PowerCLI)
$vm = Get-VM -Name "web-server-01"
$resourceConfig = New-Object VMware.Vim.ResourceConfigSpec
$resourceConfig.cpuAllocation = New-Object VMware.Vim.ResourceAllocationInfo
$resourceConfig.cpuAllocation.reservation = 2000  # MHz garantizados
$resourceConfig.cpuAllocation.limit = -1           # Sin límite máximo
$resourceConfig.cpuAllocation.shares = New-Object VMware.Vim.SharesInfo
$resourceConfig.cpuAllocation.shares.level = "high"

$resourceConfig.memoryAllocation = New-Object VMware.Vim.ResourceAllocationInfo
$resourceConfig.memoryAllocation.reservation = 4096  # MB garantizados
$resourceConfig.memoryAllocation.limit = -1
$resourceConfig.memoryAllocation.shares.level = "high"

$vmView = Get-View $vm.Id
$vmView.ReconfigVM_Task($resourceConfig)
```

> El sobrecompromiso de memoria (asignar más RAM virtual que física disponible) puede funcionar para cargas con picos no simultáneos, pero requiere monitorizar ballooning y swap de VM. Si el host intercambia memoria de VM a disco, el rendimiento se degrada drásticamente (latencia de disco vs. RAM).

### Configuración de red: modelos de NIC, switches virtuales y aislamiento

```bash
# Configurar red con Open vSwitch para aislamiento multi-tenant
# Crear bridge con VLAN tagging
ovs-vsctl add-br br-production
ovs-vsctl set bridge br-production vlan_mode=secure-tag

# Añadir puerto con VLAN 100 para la VM
ovs-vsctl add-port br-production vnet0 tag=100 \
  -- set Interface vnet0 type=internal

# Asignar a VM en libvirt XML
<interface type='bridge'>
  <source bridge='br-production'/>
  <virtualport type='openvswitch'/>
  <model type='virtio'/>
  <vlan>
    <tag id='100'/>
  </vlan>
</interface>
```

```powershell
# Configurar red en Hyper-V mediante PowerShell
# Crear switch virtual externo
New-VMSwitch -Name "Production-vSwitch" -NetAdapterName "Ethernet0" -AllowManagementOS $false

# Asignar NIC a VM con VLAN tagging
$vm = Get-VM -Name "web-server-01"
$vmNic = $vm | Get-VMNetworkAdapter
Set-VMNetworkAdapterVlan -VMNetworkAdapter $vmNic -Access -VlanId 100
Connect-VMNetworkAdapter -VMNetworkAdapter $vmNic -SwitchName "Production-vSwitch"
```

> El modelo de NIC elegido impacta rendimiento: `virtio` (KVM), `vmxnet3` (VMware) o `Synthetic` (Hyper-V) son controladores paravirtualizados que reducen traps de E/S; evitar emulación legacy (`e1000`, `rtl8139`) salvo para compatibilidad con SOs antiguos.

## Ejecución: planificación de recursos y gestión de estado en tiempo real

Una vez iniciada, la VM transita a estado de ejecución, donde el hipervisor planifica sus vCPUs, gestiona su memoria y media sus operaciones de E/S. Esta fase es dinámica: el rendimiento observado depende de la contención con otras VMs, la carga del host y las políticas de scheduling configuradas.

```text
Flujo de ejecución de una vCPU:

[Guest ejecuta instrucción en modo non-root]
    ↓
[Instrucción privilegiada → VM Exit]
    ↓
[Hipervisor intercepta y valida operación]
    ↓
[Traducción a operación segura sobre hardware]
    ↓
[VM Entry: reanudar ejecución del guest]
    ↓
[Repetir ciclo...]

# Cada VM Exit tiene costo: guardar estado, cambiar tablas de páginas,
# actualizar contadores, posiblemente emular dispositivo
```

```bash
# Monitorizar estado de ejecución en KVM
# Ver procesos QEMU y uso de recursos
ps aux | grep qemu | grep web-server-01

# Métricas de rendimiento en tiempo real
virsh domstats web-server-01 --balloon --cpu --vcpu --net --block

# Salida típica:
# balloon.actual=4194304
# cpu.time=123456789012
# vcpu.0.time=61728394506
# vcpu.0.wait=123456
# net.0.rx.bytes=987654321
# block.1.rd.reqs=12345

# Identificar contención de CPU (ready time alto)
virsh cpu-stats web-server-01 --total
```

```bash
# Gestionar estado de ejecución: pausar, reanudar, reiniciar
virsh suspend web-server-01    # Pausa: guarda estado en RAM, no en disco
virsh resume web-server-01     # Reanuda desde RAM

virsh save web-server-01 /tmp/web-server-01.saved  # Guardar estado en disco
virsh restore /tmp/web-server-01.saved             # Restaurar desde disco

virsh reboot web-server-01     # Reinicio limpio (ACPI)
virsh reset web-server-01      # Reinicio forzado (equivalente a botón reset físico)
```

> La diferencia entre `suspend` y `save` es crítica: `suspend` mantiene el estado en RAM del host (recuperación instantánea, pero vulnerable a pérdida de energía); `save` serializa el estado en disco (recuperación más lenta, pero persistente ante reinicios del host). Usar `save` para migraciones manuales o archivado de estado.

## Suspensión y apagado: transiciones de estado y persistencia de datos

La transición desde ejecución a estado inactivo puede realizarse mediante apagado limpio (shutdown), suspensión (suspend) o apagado forzado (poweroff). Cada método tiene implicaciones en integridad de datos, tiempo de recuperación y consumo de recursos.

```text
Comparativa de métodos de detención:

| Método          | Mecanismo                          | Tiempo recuperación | Integridad datos | Caso de uso ideal |
|----------------|-----------------------------------|-------------------|-----------------|------------------|
| Shutdown (ACPI) | Guest OS ejecuta secuencia de apagado | Lento (minutos)   | Máxima          | Producción, bases de datos |
| Suspend         | Estado de CPU/RAM guardado en RAM  | Instantáneo        | Media (volátil) | Pruebas interactivas |
| Save            | Estado serializado en disco        | Moderado (segundos)| Alta            | Migración manual, checkpoint |
| Poweroff        | Corte de energía simulado          | Lento (boot completo)| Riesgo de corrupción | Emergencias, VM no responsiva |
```

```bash
# Apagado limpio mediante ACPI (recomendado para producción)
virsh shutdown web-server-01

# Verificar estado de transición
virsh list --all | grep web-server-01
# Estado: "shut off" cuando finaliza

# Si el guest no responde a ACPI, forzar apagado (último recurso)
virsh destroy web-server-01  # Equivalente a desconectar alimentación

# Suspender para pausa rápida (estado en RAM)
virsh suspend web-server-01
virsh resume web-server-01

# Guardar estado en disco para persistencia
virsh save web-server-01 /backups/web-server-01.state
# Para restaurar:
virsh restore /backups/web-server-01.state
```

```powershell
# Apagado limpio en Hyper-V mediante PowerShell
Stop-VM -Name "web-server-01" -TurnOff:$false  # $false = ACPI shutdown

# Verificar estado
Get-VM -Name "web-server-01" | Select-Object Name, State

# Suspender y reanudar
Suspend-VM -Name "web-server-01"
Resume-VM -Name "web-server-01"

# Exportar estado para migración manual
Export-VM -Name "web-server-01" -Path "C:\Backup\web-server-01"
```

> Un apagado forzado (`destroy`, `Stop-VM -TurnOff:$true`) puede corromper sistemas de archivos guest si hay escrituras pendientes en caché. Siempre preferir shutdown limpio; usar poweroff solo cuando la VM no responde y se ha agotado el tiempo de espera para operaciones críticas.

## Clonación: derivación de VMs mediante copy-on-write y plantillas

La clonación permite crear nuevas instancias derivadas de una VM existente, ya sea para escalar servicios, aislar entornos de prueba o distribuir configuraciones estandarizadas. Los mecanismos subyacentes varían según el tipo de clonación: completa (copia independiente) o vinculada (referencia compartida).

```text
Tipos de clonación y sus mecanismos:

1. Full Clone (copia completa)
   ← Copia bloque a bloque del disco base
   ← Nueva VM independiente, sin dependencias
   ← Consumo de espacio: 100% del tamaño original
   ← Tiempo: proporcional al tamaño del disco

2. Linked Clone (copia vinculada)
   ← Nuevo disco diferencial con backing file al original
   ← Lecturas: buscar en diferencial → si no, leer del base
   ← Escrituras: siempre en diferencial (copy-on-write)
   ← Consumo de espacio: solo bloques modificados
   ← Dependencia crítica: si se corrompe el base, se pierden todos los clones

3. Template/Seed (plantilla de solo lectura)
   ← Imagen base marcada como read-only
   ← Cada instancia crea su propio disco diferencial
   ← Balance entre rendimiento y aislamiento
```

```bash
# Clonación en KVM/libvirt mediante qemu-img
# Full clone (copia completa)
qemu-img convert -f qcow2 -O qcow2 \
  /var/lib/libvirt/images/base-template.qcow2 \
  /var/lib/libvirt/images/web-clone-01.qcow2

# Linked clone (backing file, copy-on-write)
qemu-img create -f qcow2 \
  -b /var/lib/libvirt/images/base-template.qcow2 \
  -F qcow2 \
  /var/lib/libvirt/images/web-linked-01.qcow2

# Verificar cadena de backing files
qemu-img info /var/lib/libvirt/images/web-linked-01.qcow2
# Salida:
# backing file: /var/lib/libvirt/images/base-template.qcow2
# backing file format: qcow2
```

```bash
# Clonación en VirtualBox mediante VBoxManage
# Linked clone (ahorro de espacio)
VBoxManage clonevm "Base-Template" \
  --name "Dev-Clone-01" \
  --register \
  --options link \
  --basefolder "/vms/clones"

# Full clone (independiente)
VBoxManage clonevm "Base-Template" \
  --name "Prod-Clone-01" \
  --register \
  --options none \
  --basefolder "/vms/production"
```

> Los linked clones introducen una dependencia operativa crítica: la eliminación o corrupción del disco base invalida todos los clones derivados. Para entornos de producción, preferir full clones o implementar estrategias de backup que incluyan la cadena completa de discos dependientes. Además, el rendimiento de lectura puede degradarse con cadenas largas de snapshots/clones debido a la búsqueda en múltiples niveles.

## Eliminación: liberación controlada de recursos y limpieza de metadatos

La eliminación de una VM no es simplemente borrar archivos; requiere una secuencia ordenada para liberar recursos de forma segura, consolidar snapshots si existen y actualizar inventarios de gestión. Una eliminación incorrecta puede dejar residuos de almacenamiento, referencias huérfanas en configuraciones de red o metadatos inconsistentes en sistemas de gestión centralizada.

```bash
# Secuencia segura de eliminación en KVM/libvirt
# 1. Verificar estado y detener si está ejecutándose
virsh list --all | grep web-server-01
virsh shutdown web-server-01  # o destroy si no responde
virsh domstate web-server-01  # Confirmar: "shut off"

# 2. Listar y consolidar snapshots existentes
virsh snapshot-list web-server-01
# Si hay snapshots, consolidar antes de eliminar
virsh snapshot-delete web-server-01 --snapshotname "old-snapshot" --metadata-only

# 3. Desregistrar VM (eliminar metadatos de libvirt)
virsh undefine web-server-01

# 4. Eliminar archivos de disco y configuración manualmente
# (undefine no borra discos por defecto para prevenir pérdida accidental)
rm /var/lib/libvirt/images/web-server-01.qcow2
rm /etc/libvirt/qemu/web-server-01.xml  # Si existe backup de configuración

# 5. Liberar espacio en almacenamiento thin-provisioned
# (qcow2 con discard, o fstrim en guest antes de eliminar)
fstrim -v /  # Ejecutar dentro de la VM antes de apagar
```

```powershell
# Eliminación segura en Hyper-V mediante PowerShell
# 1. Detener VM limpiamente
Stop-VM -Name "web-server-01" -TurnOff:$false
Wait-VM -Name "web-server-01" -For Shutdown -Timeout 300

# 2. Eliminar checkpoints (snapshots) si existen
Get-VMSnapshot -VMName "web-server-01" | Remove-VMSnapshot

# 3. Eliminar VM y archivos asociados
Remove-VM -Name "web-server-01" -Force  # -Force omite confirmación

# 4. Verificar liberación de recursos
Get-VM | Where-Object {$_.Name -like "*web-server-01*"}  # Debe estar vacío
```

> La eliminación de discos thin-provisioned no libera automáticamente espacio en el almacenamiento subyacente: los bloques marcados como "libres" dentro del sistema de archivos guest permanecen asignados en el archivo qcow2/vmdk hasta que se ejecuta `fstrim` (Linux) o `Optimize-Volume -ReTrim` (Windows) dentro de la VM, seguido de una operación de compactación (`qemu-img convert` o `vmware-vdiskmanager -K`). Para evitar acumulación de espacio no reclamado, integrar operaciones de trim en scripts de apagado o mantenimiento periódico.

## Quédate con...

- La **creación de una VM** define metadatos de configuración y materializa discos virtuales; elegir formato (`qcow2` vs `raw`) y política de provisioning (thin vs thick) impacta rendimiento y flexibilidad futura.
- La **configuración de recursos** (CPU pinning, reservas de memoria, modelos de NIC paravirtualizados) permite afinar rendimiento y aislamiento; evitar sobrecompromiso agresivo sin monitorización de contención.
- La **ejecución** implica planificación dinámica de vCPUs y gestión de memoria; monitorizar métricas como `vcpu.wait` y `balloon.actual` para detectar contención antes de que degrade la experiencia del usuario.
- La **suspensión vs. apagado**: `suspend` guarda estado en RAM (recuperación instantánea pero volátil); `save` serializa en disco (persistente pero más lento); `shutdown` limpio preserva integridad de datos, `poweroff` forzado solo como último recurso.
- La **clonación vinculada** (linked clone) ahorra espacio mediante copy-on-write, pero introduce dependencia crítica del disco base; para producción, preferir clones completos o plantillas con gestión explícita de dependencias.
- La **eliminación segura** requiere secuencia ordenada: detener VM, consolidar snapshots, desregistrar metadatos y luego eliminar archivos de disco; ejecutar `fstrim` dentro del guest antes de eliminar para reclaim de espacio en almacenamiento thin-provisioned.
- Cada transición del ciclo de vida tiene trade-offs: documentar políticas de retención, naming conventions con fechas y scripts de automatización para evitar "sprawl" de VMs olvidadas que consumen recursos innecesariamente.v

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/vms/crear" class="next">Siguiente</a>
</div>
