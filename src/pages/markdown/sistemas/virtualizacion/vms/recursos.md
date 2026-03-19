---
title: "Gestión de recursos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Gestión de recursos](#gestión-de-recursos)
  - [Limitación y reserva de CPU/RAM: mecanismos de planificación y garantía de recursos](#limitación-y-reserva-de-cpuram-mecanismos-de-planificación-y-garantía-de-recursos)
    - [CPU: shares, reservas y límites en el scheduler del hipervisor](#cpu-shares-reservas-y-límites-en-el-scheduler-del-hipervisor)
    - [Métricas de contención de CPU: detectar cuándo las reservas son insuficientes](#métricas-de-contención-de-cpu-detectar-cuándo-las-reservas-son-insuficientes)
    - [Memoria: reservas, límites y técnicas de gestión bajo presión](#memoria-reservas-límites-y-técnicas-de-gestión-bajo-presión)
  - [Discos dinámicos vs. fijos: trade-offs entre flexibilidad y rendimiento predecible](#discos-dinámicos-vs-fijos-trade-offs-entre-flexibilidad-y-rendimiento-predecible)
    - [Aprovisionamiento dinámico (thin provisioning): flexibilidad con riesgos operativos](#aprovisionamiento-dinámico-thin-provisioning-flexibilidad-con-riesgos-operativos)
    - [Aprovisionamiento fijo (thick provisioning): rendimiento predecible con costo de capacidad](#aprovisionamiento-fijo-thick-provisioning-rendimiento-predecible-con-costo-de-capacidad)
    - [Compactación y reclaim de espacio: recuperar capacidad en discos thin](#compactación-y-reclaim-de-espacio-recuperar-capacidad-en-discos-thin)
  - [Snapshots: qué son, cuándo usarlos y por qué no son backup](#snapshots-qué-son-cuándo-usarlos-y-por-qué-no-son-backup)
    - [Arquitectura de snapshots: árboles de discos diferenciales con copy-on-write](#arquitectura-de-snapshots-árboles-de-discos-diferenciales-con-copy-on-write)
    - [Cuándo usar snapshots: casos de uso apropiados y límites operativos](#cuándo-usar-snapshots-casos-de-uso-apropiados-y-límites-operativos)
    - [Por qué los snapshots no son backup: diferencias arquitectónicas críticas](#por-qué-los-snapshots-no-son-backup-diferencias-arquitectónicas-críticas)
  - [Quédate con...](#quédate-con)

</div>

# Gestión de recursos

La gestión de recursos en virtualización no es simplemente asignar cantidades fijas de CPU, memoria y almacenamiento a máquinas virtuales, sino implementar políticas dinámicas de planificación, aislamiento y garantía de servicio que determinan cómo múltiples cargas de trabajo compiten por recursos físicos finitos sin comprometer la estabilidad del sistema ni la predictibilidad del rendimiento. Cada decisión de configuración —reservas mínimas, límites máximos, prioridades relativas, políticas de aprovisionamiento de disco— tiene implicaciones técnicas profundas que se manifiestan bajo contención: una VM sin reserva de memoria puede sufrir ballooning y swapping cuando el host está bajo presión; un disco thin-provisionado sin monitorización puede agotar el almacenamiento físico y causar fallos en cascada; una cadena larga de snapshots degrada el rendimiento de E/S y introduce dependencias operativas críticas. Comprender los mecanismos subyacentes de gestión de recursos —desde los algoritmos de scheduling del hipervisor hasta las estructuras copy-on-write de discos virtuales— permite diseñar entornos virtualizados que equilibren densidad de consolidación con garantías de servicio, evitando tanto el sobreprovisionamiento costoso como la contención destructiva que emerge cuando múltiples VMs compiten sin políticas claras de asignación.

## Limitación y reserva de CPU/RAM: mecanismos de planificación y garantía de recursos

La asignación de CPU y memoria en virtualización opera mediante tres conceptos distintos pero complementarios: asignación (cantidad configurada), reserva (mínimo garantizado) y límite (máximo permitido). Comprender esta distinción es fundamental para diseñar políticas de recursos que prevengan la contención destructiva mientras maximizan la utilización del hardware.

### CPU: shares, reservas y límites en el scheduler del hipervisor

```text
Modelo de asignación de CPU en virtualización:

┌─────────────────────────────────┐
│  Asignación (Configuration)     │  ← vCPUs configuradas en la VM
│  Ej: 4 vCPUs                    │  ← Lo que el guest "ve"
├─────────────────────────────────┤
│  Reserva (Reservation)          │  ← MHz mínimos garantizados
│  Ej: 2000 MHz                   │  ← Siempre disponibles, incluso bajo contención
├─────────────────────────────────┤
│  Límite (Limit)                 │  ← MHz máximos permitidos
│  Ej: 4000 MHz o -1 (ilimitado)  │  ← Tope incluso si hay recursos ociosos
├─────────────────────────────────┤
│  Shares (Prioridad relativa)    │  ← high/normal/low o valor numérico
│  Ej: 2000 shares                │  ← Determina distribución bajo contención
└─────────────────────────────────┘
```

```bash
# Configurar recursos de CPU en KVM/libvirt (XML)
<cputune>
  <shares>2048</shares>              ← Prioridad relativa (default: 1024)
  <period>100000</period>            ← Ventana de tiempo en microsegundos
  <quota>400000</quota>              ← Límite: quota/period = 4 vCPUs máx
  <reservation>200000</reservation>  ← Reserva: 2 vCPUs mín garantizadas
</cputune>

# Verificar configuración aplicada
virsh cputune web-server-01

# Salida típica:
# shares: 2048
# period: 100000
# quota: 400000
# reservation: 200000
```

```powershell
# Configurar recursos de CPU en Hyper-V mediante PowerShell
$vm = Get-VM -Name "web-server-01"

# Configurar reserva y límite (en porcentaje de núcleo lógico)
Set-VMProcessor -VM $vm `
  -CpuWeight 80 `                    ← Peso relativo (0-100, default: 50)
  -CpuMinimum 50 `                   ← Mínimo 50% de un núcleo
  -CpuMaximum 80                     ← Máximo 80% de un núcleo

# Verificar configuración
Get-VMProcessor -VM $vm | Select-Object Name, CpuWeight, CpuMinimum, CpuMaximum
```

```yaml
# Ejemplo: política de recursos CPU en VMware vSphere (PowerCLI)
$vm = Get-VM -Name "web-server-01"
$resourceConfig = New-Object VMware.Vim.ResourceConfigSpec

$resourceConfig.cpuAllocation = New-Object VMware.Vim.ResourceAllocationInfo
$resourceConfig.cpuAllocation.reservation = 2000    # MHz garantizados
$resourceConfig.cpuAllocation.limit = -1            # -1 = sin límite máximo
$resourceConfig.cpuAllocation.shares = New-Object VMware.Vim.SharesInfo
$resourceConfig.cpuAllocation.shares.level = "high" # high/normal/low
$resourceConfig.cpuAllocation.shares.shares = 4000  # Valor numérico si custom

$vmView = Get-View $vm.Id
$vmView.ReconfigVM_Task($resourceConfig)
```

> Las reservas de CPU son críticas para cargas sensibles a latencia (bases de datos, aplicaciones en tiempo real): garantizan que la VM recibirá ciclos de CPU incluso cuando el host está bajo contención severa. Sin embargo, reservar recursos reduce la capacidad de overcommit del host: si se reservan 32 GHz en un host de 32 GHz, no se puede sobrecomprometer CPU aunque las cargas reales usen menos.

### Métricas de contención de CPU: detectar cuándo las reservas son insuficientes

```bash
# Monitorizar contención de CPU en KVM
# CPU ready time: tiempo que vCPU espera para ser planificada
virsh cpu-stats web-server-01 --total

# Salida:
# cpu_time: 123456789012 nanoseconds
# vcpu_time: 61728394506 nanoseconds
# wait_time: 123456789 nanoseconds  ← Tiempo de espera (ready time)

# Calcular porcentaje de ready time
# wait_time / (cpu_time + wait_time) × 100
# >10% sostenido indica contención significativa
```

```bash
# Monitor en tiempo real con esxtop (ESXi) o virt-top (KVM)
virt-top

# Columnas clave:
# CPU: uso actual de CPU física
# MEM: uso de memoria
# %CPU: porcentaje de CPU asignada que está usando la VM
# rCPU: CPU física real usada (considerando ready time)

# Identificar VMs con alto ready time
# En ESXi esxtop: presionar 'c' para ver columna %RDY
# %RDY > 10% sostenido = investigar reservas/shares
```

> El ready time alto puede tener múltiples causas: overcommit agresivo de vCPUs, VMs con más vCPUs de las necesarias (CPU co-stop), o falta de reservas para cargas críticas. Antes de aumentar reservas, verificar si la VM realmente usa las vCPUs asignadas: una VM con 8 vCPUs pero 10% de uso real está desperdiciando recursos de planificación.

### Memoria: reservas, límites y técnicas de gestión bajo presión

```text
Jerarquía de gestión de memoria en virtualización:

1. Memoria asignada (configured)
   ← Cantidad máxima que la VM puede usar
   ← Ej: 8 GB

2. Memoria reservada (reserved)
   ← Cantidad físicamente garantizada en el host
   ← Ej: 4 GB siempre en RAM

3. Memoria activa (active)
   ← Cantidad realmente en uso por el guest
   ← Ej: 3 GB (puede variar dinámicamente)

4. Memoria compartida (shared)
   ← Páginas deduplicadas entre VMs (KSM/TPS)
   ← Ej: 500 MB ahorrados por deduplicación

5. Memoria swappeada (swapped)
   ← Páginas de VM intercambiadas a disco del host
   ← Ej: 0 MB (ideal) → >0 MB indica presión severa
```

```xml
<!-- Configuración de memoria en libvirt/KVM -->
<memory unit='GiB'>8</memory>           ← Memoria máxima asignable
<currentMemory unit='GiB'>4</currentMemory>  ← Memoria al iniciar
<memoryBacking>
  <locked/>                              ← Bloquear en RAM, evitar swap del host
  <hugepages/>                           ← Usar hugepages para reducir TLB misses
  <nosharepages/>                        ← Deshabilitar KSM para esta VM
</memoryBacking>
```

```bash
# Verificar estado de memoria de VM en KVM
virsh domstats web-server-01 --balloon

# Salida típica:
# balloon.current=4194304        ← Memoria actual asignada (KB)
# balloon.target=8388608         ← Memoria objetivo configurada
# balloon.rss=3145728            ← Resident Set Size (memoria física real)
# balloon.usable=4000000         ← Memoria usable dentro del guest
# balloon.last-update=12345678   ← Timestamp de última actualización

# Si balloon.current < balloon.target, el guest ha liberado memoria al host
# Si balloon.rss << balloon.current, el host puede estar swappeando
```

```powershell
# Configurar memoria dinámica en Hyper-V (Dynamic Memory)
Set-VMMemory -VMName "web-server-01" `
  -DynamicMemoryEnabled $true `
  -StartupBytes 2GB `           ← Memoria al iniciar
  -MinimumBytes 1GB `           ← Mínimo que puede reducirse
  -MaximumBytes 8GB `           ← Máximo que puede crecer
  -Buffer 20                    ← Buffer del 20% para crecimiento rápido

# Verificar configuración
Get-VMMemory -VMName "web-server-01" | 
  Select-Object Name, DynamicMemoryEnabled, Startup, Minimum, Maximum, Buffer
```

> La memoria dinámica (ballooning, Dynamic Memory) permite overcommit seguro al recuperar memoria de VMs subutilizadas, pero introduce latencia variable: cuando una VM necesita memoria repentinamente, debe solicitarla al host, lo que puede causar pausas perceptibles. Para cargas con patrones de memoria impredecibles o sensibles a latencia, preferir memoria estática con reservas garantizadas.

## Discos dinámicos vs. fijos: trade-offs entre flexibilidad y rendimiento predecible

La elección entre discos de aprovisionamiento dinámico (thin) y fijo (thick) no es solo una decisión de almacenamiento, sino una política operativa que impacta rendimiento, capacidad planificada y riesgo de agotamiento de recursos. Cada enfoque tiene implicaciones técnicas que se manifiestan de forma distinta bajo cargas de trabajo reales.

### Aprovisionamiento dinámico (thin provisioning): flexibilidad con riesgos operativos

```text
Mecanismo de thin provisioning:

Disco configurado: 100 GB (lógico)
Espacio físico inicial: ~1 GB (solo metadatos)

Flujo de escritura:
[Guest escribe bloque X]
    ↓
[Hipervisor asigna bloque físico en datastore]
    ↓
[Metadatos del disco actualizan mapeo lógico→físico]
    ↓
[Espacio físico crece incrementalmente]

Ventaja: eficiencia de capacidad (solo se usa lo escrito)
Riesgo: agotamiento sorpresa si no se monitoriza
```

```bash
# Crear disco thin en KVM/qemu-img
qemu-img create -f qcow2 /var/lib/libvirt/images/web-01.qcow2 100G

# Verificar tamaño lógico vs. físico
du -h /var/lib/libvirt/images/web-01.qcow2
# Salida: 2.1G (físico) vs. 100G (lógico configurado)

# Verificar información detallada
qemu-img info /var/lib/libvirt/images/web-01.qcow2
# Salida:
# virtual size: 100G
# disk size: 2.1G
# cluster_size: 65536
# Format specific information:
#   compat: 1.1
#   lazy refcounts: false
```

```bash
# Monitorizar crecimiento de discos thin en el host
# Script para alertar cuando uso físico > 80% de capacidad del datastore

#!/bin/bash
DATASTORE="/var/lib/libvirt/images"
THRESHOLD=80

used=$(df "$DATASTORE" | tail -1 | awk '{print $5}' | tr -d '%')

if [ "$used" -gt "$THRESHOLD" ]; then
    echo "ALERTA: Datastore al ${used}% de capacidad"
    # Enviar notificación (email, Slack, PagerDuty, etc.)
fi
```

```powershell
# Crear disco dinámico en Hyper-V
New-VHD -Path "C:\VMs\web-01.vhdx" `
  -SizeBytes 100GB `
  -Dynamic  ← Thin provisioning

# Verificar tamaño real
Get-VHD -Path "C:\VMs\web-01.vhdx" | 
  Select-Object Size, FileSize, SizeOnDisk
# Size: 100GB (lógico)
# FileSize: 2GB (físico actual)
```

> El thin provisioning introduce un riesgo operacional crítico: el datastore puede agotarse inesperadamente cuando múltiples VMs crecen simultáneamente. Cuando esto ocurre, las VMs no pueden escribir nuevos datos y pueden fallar abruptamente (sistemas de archivos se montan como read-only, bases de datos se detienen). Implementar alertas proactivas (>70%, >80%, >90%) y políticas de expansión automática o limpieza de snapshots es esencial para producción.

### Aprovisionamiento fijo (thick provisioning): rendimiento predecible con costo de capacidad

```text
Mecanismo de thick provisioning:

Disco configurado: 100 GB (lógico)
Espacio físico inicial: 100 GB (reservado completamente)

Flujo de creación:
[Hipervisor reserva bloques físicos contiguos]
    ↓
[Inicializa bloques (cero-fill o lazy-zero)]
    ↓
[Disco listo para uso con rendimiento consistente]

Ventaja: sin sorpresas de capacidad, mejor rendimiento secuencial
Riesgo: capacidad subutilizada, menor densidad de consolidación
```

```bash
# Crear disco thick (pre-asignado) en KVM
# Método 1: formato raw con fallocate
qemu-img create -f raw /var/lib/libvirt/images/db-01.raw 100G
fallocate -l 100G /var/lib/libvirt/images/db-01.raw  # Reservar físicamente

# Método 2: qcow2 con preallocation
qemu-img create -f qcow2 \
  -o preallocation=metadata \
  /var/lib/libvirt/images/db-02.qcow2 100G

# Método 3: qcow2 con preallocation completa (más lento)
qemu-img create -f qcow2 \
  -o preallocation=full \
  /var/lib/libvirt/images/db-03.qcow2 100G
```

```bash
# Verificar pre-asignación
du -h /var/lib/libvirt/images/db-01.raw
# Salida: 100G (espacio físico reservado completo)

# Comparar con thin:
du -h /var/lib/libvirt/images/web-01.qcow2
# Salida: 2.1G (solo espacio usado)
```

```powershell
# Crear disco fijo en Hyper-V
New-VHD -Path "C:\VMs\db-01.vhdx" `
  -SizeBytes 100GB `
  -Fixed  ← Thick provisioning

# Convertir disco dinámico a fijo (requiere VM apagada)
Resize-VHD -Path "C:\VMs\web-01.vhdx" -ToFixed
```

| Característica | Thin Provisioning | Thick Provisioning |
|---------------|------------------|-------------------|
| Espacio inicial | Mínimo (solo metadatos) | Completo (100% reservado) |
| Rendimiento de escritura | Variable (overhead de asignación) | Consistente (bloques pre-asignados) |
| Riesgo de agotamiento | Alto (requiere monitorización) | Bajo (capacidad garantizada) |
| Densidad de consolidación | Alta (overcommit posible) | Baja (sin overcommit) |
| Casos de uso ideales | Desarrollo, pruebas, cargas impredecibles | Producción, bases de datos, cargas I/O-intensivas |

> Para bases de datos y cargas transaccionales, el thick provisioning elimina la latencia variable de asignación dinámica de bloques durante escrituras. Sin embargo, el thin provisioning con SSDs modernos y controladores virtio tiene un overhead mínimo (~3-5%) que puede ser aceptable para muchas cargas de producción si se implementa monitorización adecuada.

### Compactación y reclaim de espacio: recuperar capacidad en discos thin

```bash
# Liberar espacio en disco thin después de eliminar archivos en el guest
# Paso 1: Dentro de la VM, ejecutar fstrim (Linux) o Optimize-Volume (Windows)

# Linux guest:
sudo fstrim -v /
# Salida: /: 15.2 GiB was trimmed

# Windows guest (PowerShell como Administrador):
Optimize-Volume -DriveLetter C -ReTrim -Verbose

# Paso 2: En el host, compactar el archivo de disco (requiere VM apagada)
virsh shutdown web-01
virsh domstate web-01  # Esperar hasta "shut off"

# Compactar qcow2
qemu-img convert -f qcow2 -O qcow2 \
  -o compression_type=zlib \
  /var/lib/libvirt/images/web-01.qcow2 \
  /var/lib/libvirt/images/web-01-compacted.qcow2

# Reemplazar disco original
mv /var/lib/libvirt/images/web-01.qcow2 /var/lib/libvirt/images/web-01.qcow2.bak
mv /var/lib/libvirt/images/web-01-compacted.qcow2 /var/lib/libvirt/images/web-01.qcow2

# Verificar reducción
du -h /var/lib/libvirt/images/web-01.qcow2*
```

```powershell
# Compactar disco VHDX en Hyper-V (VM debe estar apagada)
Stop-VM -Name "web-01" -TurnOff:$false
Wait-VM -Name "web-01" -For Shutdown -Timeout 300

# Optimizar VHDX dinámico (reclaim de bloques libres)
Optimize-VHD -Path "C:\VMs\web-01.vhdx" -Mode Full

# Verificar reducción
Get-VHD -Path "C:\VMs\web-01.vhdx" | Select-Object Size, FileSize
```

> La compactación de discos thin es una operación I/O-intensiva que requiere tiempo de downtime. Para entornos de producción, considerar ventanas de mantenimiento programadas o implementar almacenamiento con reclaim automático (vSAN, Ceph) que libera bloques sin intervención manual.

## Snapshots: qué son, cuándo usarlos y por qué no son backup

Los snapshots de máquinas virtuales son una de las funcionalidades más poderosas y malentendidas de la virtualización. Capturan el estado exacto de una VM en un instante específico, permitiendo rollback rápido ante cambios fallidos, pero su implementación técnica mediante copy-on-write introduce dependencias operativas y degradación de rendimiento que los hacen inadecuados como estrategia de backup a largo plazo.

### Arquitectura de snapshots: árboles de discos diferenciales con copy-on-write

```text
Estructura de snapshots con copy-on-write:

Estado inicial (sin snapshots):
┌─────────────────────┐
│  disk-base.qcow2    │  ← Contiene todos los datos
│  (lectura/escritura)│
└─────────────────────┘

Snapshot 1 creado:
┌─────────────────────┐
│  disk-base.qcow2    │  ← Solo lectura ahora
├─────────────────────┤
│  disk-snap1.qcow2   │  ← Nuevo: escrituras van aquí
│  (lectura/escritura)│
└─────────────────────┘

Snapshot 2 creado:
┌─────────────────────┐
│  disk-base.qcow2    │  ← Solo lectura
├─────────────────────┤
│  disk-snap1.qcow2   │  ← Solo lectura
├─────────────────────┤
│  disk-snap2.qcow2   │  ← Nuevo: escrituras actuales
│  (lectura/escritura)│
└─────────────────────┘

Flujo de lectura del bloque X:
1. Buscar en disk-snap2.qcow2 → si existe, devolver
2. Si no, buscar en disk-snap1.qcow2 → si existe, devolver
3. Si no, buscar en disk-base.qcow2 → devolver
4. Si no existe en ningún nivel, devolver cero

Flujo de escritura del bloque X:
1. Siempre escribir en el snapshot más reciente (disk-snap2.qcow2)
2. Marcar bloque como "dirty" en metadatos
```

```bash
# Gestionar snapshots en KVM/libvirt
# Crear snapshot con metadatos
virsh snapshot-create-as --domain web-01 \
  --name "pre-patch-20250115" \
  --description "Antes de aplicar parches de seguridad kernel" \
  --disk-only --atomic

# Listar snapshots existentes
virsh snapshot-list web-01

# Salida típica:
# Name                 Creation Time             State
# ------------------------------------------------------------
# pre-patch-20250115   2025-01-15 10:30:00 +0000 running
# base-clean           2025-01-10 08:00:00 +0000 shutoff

# Verificar cadena de snapshots (árbol de dependencias)
virsh snapshot-info web-01 pre-patch-20250115

# Revertir a snapshot específico
virsh snapshot-revert web-01 pre-patch-20250115

# Eliminar snapshot (consolida cambios en el padre)
virsh snapshot-delete web-01 pre-patch-20250115
```

```bash
# Gestionar snapshots en VirtualBox
# Crear snapshot
VBoxManage snapshot "web-01" take "pre-update" --description "Pre-actualización de paquetes"

# Listar snapshots (muestra árbol de dependencias)
VBoxManage snapshot "web-01" list

# Salida:
# Name: pre-update (UUID: abc123...)
#    Name: post-config (UUID: def456...)  ← Snapshot anidado

# Revertir
VBoxManage snapshot "web-01" restore "pre-update"

# Eliminar
VBoxManage snapshot "web-01" delete "post-config"
```

```powershell
# Gestionar checkpoints (snapshots) en Hyper-V
# Crear checkpoint
Checkpoint-VM -Name "web-01" -SnapshotName "pre-patch"

# Listar checkpoints
Get-VMSnapshot -VMName "web-01" | Select-Object Name, CreationTime, SnapshotType

# CheckpointType: Standard (incluye memoria) o Production (solo disco, vía VSS)

# Revertir
$checkpoint = Get-VMSnapshot -VMName "web-01" -Name "pre-patch"
Restore-VMSnapshot -VMSnapshot $checkpoint -Confirm:$false

# Eliminar
Remove-VMSnapshot -VMName "web-01" -Name "pre-patch" -Confirm:$false
```

> La cadena de snapshots introduce overhead de lectura: cada operación de lectura puede requerir buscar en múltiples archivos de disco antes de encontrar el bloque solicitado. Con cadenas largas (>5 snapshots), la latencia de E/S puede degradarse significativamente (20-50% en cargas aleatorias). Consolidar o eliminar snapshots regularmente es esencial para mantener rendimiento.

### Cuándo usar snapshots: casos de uso apropiados y límites operativos

```text
Casos de uso APROPIADOS para snapshots:

✅ Pruebas de actualizaciones/parches
   ← Crear snapshot pre-patch, aplicar cambios, revertir si fallan
   ← Ventana de retención: 24-72 horas máximo

✅ Desarrollo y debugging
   ← Capturar estado antes de cambios de configuración riesgosos
   ← Ventana de retención: duración de la sesión de desarrollo

✅ Preparación para operaciones de mantenimiento
   ← Snapshot antes de migración, upgrade de hardware virtual, etc.
   ← Ventana de retención: hasta confirmar estabilidad post-operación

✅ Captura de estado para análisis forense
   ← Preservar estado exacto de VM tras incidente de seguridad
   ← Ventana de retención: según política de retención de evidencia
```

```text
Casos de uso INAPROPIADOS para snapshots:

❌ Backup a largo plazo
   ← Dependencia de cadena: eliminar base corrompe todos los snapshots
   ← Degradación de rendimiento con el tiempo
   ← Sin protección contra fallo del datastore completo

❌ Liberación de espacio en disco
   ← Los snapshots NO liberan espacio, lo consumen adicionalmente
   ← Cada snapshot añade metadatos y bloques diferenciales

❌ Sustituto de replicación para DR
   ← Snapshots son locales al datastore/host
   ← No protegen contra fallo físico del almacenamiento

❌ Versionado de aplicaciones
   ← Usar control de versiones (Git) o imágenes inmutables
   ← Snapshots capturan estado completo, no cambios específicos
```

```bash
# Script de ejemplo: política de retención automática de snapshots
#!/bin/bash
# cleanup-snapshots.sh

VM_NAME="$1"
MAX_AGE_DAYS=3

# Listar snapshots con fecha de creación
snapshots=$(virsh snapshot-list "$VM_NAME" --name)

for snap in $snapshots; do
    creation_time=$(virsh snapshot-info "$VM_NAME" "$snap" | grep "Creation time:" | cut -d: -f2-)
    
    # Calcular edad en días
    creation_epoch=$(date -d "$creation_time" +%s)
    current_epoch=$(date +%s)
    age_days=$(( (current_epoch - creation_epoch) / 86400 ))
    
    if [ "$age_days" -gt "$MAX_AGE_DAYS" ]; then
        echo "Eliminando snapshot $snap (${age_days} días de antigüedad)"
        virsh snapshot-delete "$VM_NAME" "$snap"
    fi
done
```

> Los snapshots deben tratarse como operaciones de corta duración: crear antes de cambios riesgosos, validar resultados, y consolidar/eliminar inmediatamente después. Una política operativa saludable mantiene <3 snapshots activos por VM y <72 horas de antigüedad máxima, excepto para casos específicos documentados (forense, auditoría).

### Por qué los snapshots no son backup: diferencias arquitectónicas críticas

```text
Comparativa: Snapshots vs. Backup tradicional

| Característica          | Snapshot                    | Backup tradicional           |
|------------------------|----------------------------|------------------------------|
| Ubicación              | Mismo datastore que la VM  │ Almacenamiento independiente │
| Dependencia            │ Cadena de archivos         │ Archivo independiente        │
| Impacto si se pierde   │ Pérdida de VM + snapshots  │ Solo se pierde el backup     │
| Rendimiento de VM      │ Degradado con múltiples    │ Sin impacto en VM activa     |
| Retención recomendada  │ Horas a días               │ Semanas a años               |
| Protección contra      │ Errores lógicos, rollback  │ Fallo físico, ransomware     |
| RTO (recuperación)     │ Minutos (revertir)         │ Horas (restaurar)            |
| RPO (pérdida de datos) │ Cero (estado exacto)       │ Depende de frecuencia        |
```

```text
Escenario de fallo con snapshots como único "backup":

1. Datastore físico falla (controlador RAID, corrupción, desastre)
   ↓
2. Todos los archivos de disco se pierden:
   - disk-base.qcow2
   - disk-snap1.qcow2
   - disk-snap2.qcow2
   ↓
3. Resultado: VM completamente irrecuperable
   ← Los snapshots estaban en el mismo almacenamiento que la VM

Escenario con backup adecuado:

1. Datastore físico falla
   ↓
2. Backup en almacenamiento independiente está intacto
   ↓
3. Restaurar VM desde backup en datastore alternativo
   ← Downtime mayor, pero recuperación posible
```

```bash
# Estrategia recomendada: snapshots + backup independiente
# Flujo operativo para cambios de producción:

# 1. Crear snapshot pre-cambio
virsh snapshot-create-as --domain web-01 --name "pre-change" --disk-only

# 2. Ejecutar cambio (parche, configuración, etc.)

# 3. Validar funcionamiento
# ... pruebas ...

# 4. Si éxito: eliminar snapshot
virsh snapshot-delete web-01 pre-change

# 5. Si fallo: revertir
virsh snapshot-revert web-01 pre-change

# 6. Independientemente: backup periódico a almacenamiento separado
# (usando herramientas como Veeam, Proxmox Backup Server, rsync, etc.)
```

> Una estrategia robusta de protección de datos combina snapshots (para RTO bajo ante errores operativos) con backups tradicionales (para protección contra fallos físicos y retención a largo plazo). La regla 3-2-1 aplica: 3 copias de datos, 2 medios diferentes, 1 copia fuera del sitio. Los snapshots cuentan como una copia, pero no satisfacen los requisitos de medios diferentes o ubicación separada.

## Quédate con...

- La **gestión de recursos** (CPU/RAM) opera mediante tres conceptos distintos: asignación (configurado), reserva (garantizado) y límite (tope máximo); comprender esta distinción es esencial para prevenir contención destructiva.
- Las **reservas de CPU y memoria** son críticas para cargas sensibles a latencia: garantizan recursos mínimos incluso bajo contención severa, pero reducen la capacidad de overcommit del host.
- El **ready time de CPU** (>10% sostenido) y el **swap de memoria de VM** son métricas clave de contención; monitorizar proactivamente antes de que degraden la experiencia del usuario.
- Los **discos thin** (dinámicos) ahorran espacio inicial pero requieren monitorización proactiva (>70%, >80%, >90%) para evitar agotamiento sorpresa del datastore que puede causar fallos en cascada.
- Los **discos thick** (fijos) ofrecen rendimiento predecible y sin sorpresas de capacidad, ideales para bases de datos y cargas I/O-intensivas, pero con menor densidad de consolidación.
- La **compactación de discos thin** requiere ejecutar `fstrim`/`Optimize-Volume` dentro del guest seguido de conversión/compactación en el host con VM apagada; planificar ventanas de mantenimiento.
- Los **snapshots** implementan copy-on-write con árboles de discos diferenciales: potentes para rollback rápido (RTO bajo), pero degradan rendimiento con cadenas largas (>5 snapshots).
- Los **snapshots no son backup**: residen en el mismo datastore que la VM, introducen dependencias de cadena y no protegen contra fallos físicos del almacenamiento.
- Política saludable de snapshots: **<3 activos por VM**, **<72 horas de antigüedad**, eliminación automática tras validar cambios; usar para pruebas y mantenimiento, no para retención a largo plazo.
- Una estrategia robusta combina **snapshots** (errores operativos, RTO bajo) + **backups tradicionales** (fallos físicos, retención larga, 3-2-1) para protección completa de datos y continuidad del negocio.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/vms/integracion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/vms/monitoreo" class="next">Siguiente</a>
</div>
