---
title: "Migración y portabilidad"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Migración y portabilidad](#migración-y-portabilidad)
  - [Exportar e importar VMs: formatos portables OVF/OVA y consideraciones de compatibilidad](#exportar-e-importar-vms-formatos-portables-ovfova-y-consideraciones-de-compatibilidad)
    - [Consideraciones de compatibilidad y limitaciones de los formatos OVF/OVA](#consideraciones-de-compatibilidad-y-limitaciones-de-los-formatos-ovfova)
  - [Migración en vivo entre hosts: mecanismos de pre-copia, convergencia y redirección de estado](#migración-en-vivo-entre-hosts-mecanismos-de-pre-copia-convergencia-y-redirección-de-estado)
    - [Requisitos de infraestructura para migración en vivo](#requisitos-de-infraestructura-para-migración-en-vivo)
    - [Mecanismo de migración en vivo: pre-copia iterativa y fase de convergencia](#mecanismo-de-migración-en-vivo-pre-copia-iterativa-y-fase-de-convergencia)
    - [Redirección de red y preservación de conectividad durante la migración](#redirección-de-red-y-preservación-de-conectividad-durante-la-migración)
    - [Migración con almacenamiento: block migration y Storage vMotion](#migración-con-almacenamiento-block-migration-y-storage-vmotion)
  - [Quédate con...](#quédate-con)

</div>

# Migración y portabilidad

La migración y portabilidad de máquinas virtuales representan la materialización práctica del principio fundamental de la virtualización: desacoplar el estado de ejecución del hardware físico subyacente. Esta capacidad no es simplemente una conveniencia operativa, sino un mecanismo arquitectónico que habilita estrategias de mantenimiento sin downtime, balanceo dinámico de cargas, recuperación ante desastres y movilidad geográfica de servicios. Sin embargo, detrás de la aparente simplicidad de "mover una VM" se ocultan protocolos complejos de transferencia de estado, sincronización de memoria, redirección de red y consistencia de almacenamiento que, si no se comprenden, pueden resultar en migraciones fallidas, corrupción de datos o interrupciones del servicio. Comprender los mecanismos subyacentes de los formatos de exportación (OVF/OVA), los protocolos de migración en vivo (pre-copia iterativa, convergencia, redirección) y los requisitos de infraestructura (almacenamiento compartido, red de baja latencia, compatibilidad de CPU) es esencial para diseñar entornos virtualizados que aprovechen la movilidad como ventaja estratégica, no como fuente de riesgo operativo.

## Exportar e importar VMs: formatos portables OVF/OVA y consideraciones de compatibilidad

Los formatos OVF (Open Virtualization Format) y OVA (Open Virtual Appliance, archivo único que encapsula OVF) son estándares abiertos definidos por el DMTF para empaquetar y distribuir máquinas virtuales de forma portable entre diferentes plataformas de virtualización. Estos formatos no son simples contenedores de archivos de disco, sino descripciones declarativas que incluyen metadatos de configuración, referencias a recursos, políticas de despliegue y certificados de integridad.

```text
Estructura de un paquete OVF:

manifest.ovf                    ← Descriptor XML principal
  • Metadatos de la VM (nombre, versión, descripción)
  • Configuración de hardware virtual (CPU, RAM, discos, red)
  • Referencias a archivos de disco y certificados
  • Propiedades de configuración personalizables al despliegue

disk-1.vmdk                     ← Archivo(s) de disco virtual
disk-2.vmdk                     ← Pueden ser múltiples discos

manifest.mf                     ← Checksums SHA para integridad
certificate.pem                 ← Firma digital opcional para verificación

# OVA: mismo contenido, pero empaquetado como archivo TAR único
appliance.ova = manifest.ovf + disks + manifest.mf + certificate.pem
```

```bash
# Exportar VM a formato OVF/OVA en VirtualBox
# OVF (archivos separados, más flexible para edición manual)
VBoxManage export "web-server-01" \
  --output "/exports/web-server-01.ovf" \
  --vsys 0 --product "WebServer" --version "1.0" \
  --description "Servidor web Ubuntu 22.04 con nginx" \
  --options manifest

# OVA (archivo único, más conveniente para distribución)
VBoxManage export "web-server-01" \
  --output "/exports/web-server-01.ova" \
  --vsys 0 --product "WebServer" --version "1.0"

# Verificar contenido del OVA (es un TAR)
tar -tvf /exports/web-server-01.ova
# Salida:
# -rw-r--r-- ... web-server-01.ovf
# -rw-r--r-- ... web-server-01-disk1.vmdk
# -rw-r--r-- ... web-server-01.mf
```

```bash
# Exportar VM en KVM/libvirt a formato OVF (requiere virt-v2v o herramientas externas)
# Método 1: Usar virt-v2v para conversión directa
virt-v2v -i libvirt -o local -os /exports \
  -of raw -oa sparse web-server-01

# Método 2: Exportar manualmente como OVF
# 1. Obtener configuración XML
virsh dumpxml web-server-01 > /tmp/web-server-01.xml

# 2. Copiar archivos de disco
cp /var/lib/libvirt/images/web-server-01.qcow2 /exports/

# 3. Crear descriptor OVF manualmente o con herramienta como ovftool
# (proceso complejo; considerar usar Packer para construir imágenes portables)
```

```powershell
# Exportar VM en Hyper-V a formato OVF (requiere System Center VMM o PowerShell avanzado)
# Método simplificado: exportar a formato nativo y convertir
Export-VM -Name "web-server-01" -Path "C:\Exports\web-server-01"

# Los archivos exportados incluyen:
# - Virtual Machines\{GUID}.xml  ← Configuración
# - Virtual Hard Disks\*.vhdx    ← Discos virtuales
# - Snapshots\ (si existen)      ← Checkpoints

# Para convertir a OVF, usar herramientas como StarWind V2V Converter
# o exportar directamente desde vCenter si está integrado
```

```bash
# Importar VM desde OVF/OVA en VirtualBox
VBoxManage import "/exports/web-server-01.ova" \
  --vsys 0 --vmname "web-server-imported" \
  --unit 8 --disk "/vms/imported/web-server-01.vmdk" \
  --unit 9 --network "NAT" --networkaddr "192.168.1.0/24"

# Verificar importación exitosa
VBoxManage list vms | grep "web-server-imported"
```

```bash
# Importar en KVM/libvirt desde OVF (proceso manual)
# 1. Extraer archivos del OVA si es necesario
mkdir /tmp/ovf-import && cd /tmp/ovf-import
tar -xvf /exports/web-server-01.ova

# 2. Convertir disco VMDK a formato nativo (qcow2)
qemu-img convert -f vmdk -O qcow2 \
  web-server-01-disk1.vmdk \
  /var/lib/libvirt/images/web-server-imported.qcow2

# 3. Adaptar descriptor XML a formato libvirt
# (editar manualmente o usar script de conversión)
# Ajustar rutas de disco, interfaces de red, controladores

# 4. Definir e iniciar VM
virsh define /tmp/web-server-imported.xml
virsh start web-server-imported
```

> La portabilidad entre hipervisores no es automática: diferencias en modelos de hardware virtual (chipset, controladores, firmware) pueden requerir ajustes manuales tras la importación. Siempre probar la VM importada en un entorno aislado antes de desplazarla a producción, y documentar las adaptaciones necesarias para cada par de plataformas origen/destino.

### Consideraciones de compatibilidad y limitaciones de los formatos OVF/OVA

| Aspecto | Detalle técnico | Impacto operativo |
|---------|----------------|------------------|
| **Controladores de disco/red** | OVF referencia dispositivos virtuales específicos (IDE, SATA, virtio, vmxnet3) | Guest sin drivers para el hardware virtualizado en la plataforma destino puede no arrancar o tener rendimiento degradado |
| **Firmware (BIOS vs UEFI)** | OVF puede especificar tipo de firmware, pero no todas las plataformas lo respetan | VM configurada para UEFI puede fallar al importar en plataforma que solo soporta BIOS legacy |
| **Características avanzadas** | Snapshots, clones vinculados, configuraciones de alta disponibilidad no se exportan en OVF estándar | Perder funcionalidades específicas de plataforma; reconstruir manualmente si son críticas |
| **Licenciamiento de SO** | Algunos SOs vinculan activación a hardware virtual (UUID, MAC) | Re-activación requerida tras importación; verificar términos de licencia para movilidad |
| **Tamaño de archivo** | OVA puede ser muy grande (decenas de GB); transferencia lenta por red | Usar medios físicos o transferencia acelerada (rsync con compresión, Aspera, etc.) para entornos remotos |

```bash
# Verificar compatibilidad de firmware antes de importar
# Extraer y examinar descriptor OVF
tar -xOf appliance.ova *.ovf | grep -i firmware

# Salida posible:
# <Firmware>efi</Firmware>  ← Requiere UEFI en plataforma destino
# <Firmware>bios</Firmware> ← Compatible con BIOS legacy

# Si la plataforma destino no soporta el firmware especificado,
# puede requerir conversión de disco (ej: gparted para cambiar tabla de particiones)
# o reconfiguración manual post-importación
```

> Para maximizar portabilidad, construir imágenes base con controladores genéricos o múltiples drivers instalados, usar firmware BIOS cuando sea posible (más ampliamente soportado que UEFI en migraciones cruzadas), y evitar características específicas de plataforma en plantillas destinadas a distribución multi-hipervisor.

## Migración en vivo entre hosts: mecanismos de pre-copia, convergencia y redirección de estado

La migración en vivo (live migration) permite trasladar una máquina virtual en ejecución de un host físico a otro sin interrupción perceptible del servicio. Esta funcionalidad es crítica para mantenimiento de hardware, balanceo de cargas, recuperación ante fallos planificados y optimización energética. Su implementación requiere coordinación precisa entre múltiples componentes: sincronización de memoria, transferencia de estado de CPU, redirección de conectividad de red y gestión de almacenamiento compartido.

### Requisitos de infraestructura para migración en vivo

```text
Prerrequisitos técnicos para migración en vivo exitosa:

┌─────────────────────────────────┐
│  Almacenamiento compartido      │
│  • NFS, iSCSI, FC-SAN, vSAN, Ceph │
│  • Accesible por ambos hosts con mismos paths │
│  • Rendimiento suficiente para no ser cuello de botella │
├─────────────────────────────────┤
│  Red de migración dedicada      │
│  • Ancho de banda: 10 GbE recomendado │
│  • Latencia: <10 ms entre hosts │
│  • Aislamiento: VLAN dedicada o enlaces físicos separados │
│  • MTU: 9000 (jumbo frames) para eficiencia │
├─────────────────────────────────┤
│  Compatibilidad de CPU          │
│  • Mismo fabricante (Intel/AMD) y generación mínima │
│  • Mismo conjunto de instrucciones expuesto al guest │
│  • Modo CPU "host-passthrough" requiere hardware idéntico │
│  • Usar modo "CPU model definido" (ej: Haswell-noTSX) para heterogeneidad │
├─────────────────────────────────┤
│  Configuración de red consistente│
│  • Mismos nombres de bridges/vSwitches en ambos hosts │
│  • Mismas VLANs y políticas de seguridad │
│  • MAC addresses preservadas durante migración │
└─────────────────────────────────┘
```

```bash
# Verificar compatibilidad de CPU entre hosts KVM
# En host origen y destino, ejecutar:
virsh cpu-baseline < <(virsh capabilities) > /tmp/cpu-baseline.xml

# Comparar resultados: si difieren significativamente,
# definir modelo de CPU común para las VMs
# En libvirt XML de la VM:
<cpu mode='custom' match='exact' check='partial'>
  <model fallback='allow'>Haswell-noTSX</model>
</cpu>
```

```bash
# Configurar red de migración dedicada en KVM (ejemplo con Netplan)
# /etc/netplan/02-migration.yaml
network:
  version: 2
  ethernets:
    eth1:  # Interfaz física dedicada para migración
      dhcp4: no
      addresses: [10.10.10.1/24]  # Host 1
      # addresses: [10.10.10.2/24]  # Host 2
      mtu: 9000  # Jumbo frames
  bonds:
    migration-bond:
      interfaces: [eth1]
      parameters:
        mode: active-backup
        mii-monitor-interval: 100

# Aplicar configuración
sudo netplan apply

# Verificar conectividad y rendimiento entre hosts
ping -c 4 -s 8972 10.10.10.2  # Test con jumbo frames
iperf3 -c 10.10.10.2 -t 30 -P 4  # Medir ancho de banda disponible
```

> La migración en vivo sin almacenamiento compartido es posible mediante tecnologías como "block migration" (KVM) o "Storage vMotion" (VMware), pero transfiere también el contenido del disco, lo que incrementa drásticamente el tiempo de migración y el consumo de red. Reservar esta opción para casos excepcionales; preferir almacenamiento compartido para migraciones frecuentes.

### Mecanismo de migración en vivo: pre-copia iterativa y fase de convergencia

```text
Fases de una migración en vivo típica (vMotion, KVM live migration):

Fase 1: Pre-copia iterativa de memoria
┌─────────────────────────────────┐
│  Host origen copia páginas de RAM │
│  de la VM al host destino        │
│  mientras la VM sigue ejecutándose│
│                                  │
│  Iteración 1: copia toda la RAM  │
│  Iteración 2: copia páginas "sucias" │
│  Iteración N: copia delta residual │
│                                  │
│  Criterio de convergencia:      │
│  • Páginas sucias < umbral      │
│  • Tiempo máximo de iteraciones │
│  • Ancho de banda disponible    │
└─────────────────────────────────┘

Fase 2: Suspensión breve y transferencia de estado final
┌─────────────────────────────────┐
│  1. Pausar ejecución de la VM   │
│     (duración: 10-100 ms típico)│
│  2. Transferir estado residual: │
│     • Registros de CPU          │
│     • Páginas sucias finales    │
│     • Estado de dispositivos    │
│  3. Reanudar VM en host destino │
│  4. Redirección de red:         │
│     • Actualizar tablas MAC     │
│     • Gratuitous ARP para switches│
└─────────────────────────────────┘

Fase 3: Limpieza y confirmación
┌─────────────────────────────────┐
│  • Host origen libera recursos  │
│  • Host destino confirma éxito  │
│  • Sistema de gestión actualiza │
│    inventario y monitoreo       │
└─────────────────────────────────┘

Downtime total: típicamente <50-200 ms, imperceptible para
la mayoría de aplicaciones (excepto cargas ultra-sensibles a latencia)
```

```bash
# Ejecutar migración en vivo en KVM/libvirt
# Método 1: migración con almacenamiento compartido (más rápida)
virsh migrate --live --persistent web-server-01 \
  qemu+ssh://kvm-host-02.local/system

# Método 2: migración con block migration (incluye transferencia de disco)
virsh migrate --live --persistent --copy-storage-all web-server-01 \
  qemu+ssh://kvm-host-02.local/system

# Método 3: migración con parámetros avanzados
virsh migrate --live --persistent \
  --parallel 3 \                    ← Transferencia paralela (acelera convergencia)
  --compression \                   ← Compresión de tráfico de migración
  --postcopy \                      ← Habilitar modo post-copia (avanzado)
  web-server-01 qemu+ssh://kvm-host-02.local/system
```

```bash
# Monitorizar progreso de migración en tiempo real
# En host origen, ejecutar en terminal separada:
watch -n 1 'virsh domjobinfo web-server-01'

# Salida típica durante migración:
# Job type: Unbounded Migration
# Time elapsed: 45 ms
# Data processed: 2.1 GiB
# Data remaining: 156 MiB
# Data total: 4.2 GiB
# Memory bandwidth: 125 MiB/s
# Downtime: 0 ms (aún en fase de pre-copia)
# ...

# Tras completar:
# Job type: Completed
# Downtime: 87 ms  ← Tiempo de interrupción real
```

```powershell
# Migración en vivo en Hyper-V mediante PowerShell
# Requiere clúster de failover o configuración manual de almacenamiento compartido

# Migrar VM a otro nodo del clúster
Move-VM -Name "web-server-01" `
  -DestinationHost "hyperv-host-02.local" `
  -IncludeStorage  # Omitir si almacenamiento ya es compartido

# Migrar con almacenamiento específico
Move-VM -Name "web-server-01" `
  -DestinationHost "hyperv-host-02.local" `
  -DestinationStoragePath "\\san-storage\vm-datastore" `
  -IncludeStorage

# Verificar estado de migración
Get-VM -Name "web-server-01" | Select-Object Name, State, ComputerName
```

> El parámetro `--postcopy` en migraciones KVM invierte el orden tradicional: primero transfiere el estado mínimo para reanudar la VM en destino, luego copia el resto de memoria "bajo demanda" mientras la VM ya está ejecutándose en el nuevo host. Esto reduce el downtime a casi cero, pero introduce riesgo: si la red falla durante post-copia, la VM puede quedar en estado inconsistente. Usar solo en entornos con red altamente confiable y para cargas que no toleran ni milisegundos de interrupción.

### Redirección de red y preservación de conectividad durante la migración

Uno de los desafíos técnicos más complejos de la migración en vivo es mantener la conectividad de red de la VM sin interrupción perceptible para clientes externos. Esto requiere coordinación entre el hipervisor, los switches virtuales y la infraestructura de red física.

```text
Mecanismo de redirección de red durante migración:

[Antes de migración]
Cliente externo → Switch físico → Host origen (MAC de vNIC) → VM

[Durante fase de convergencia]
1. VM pausa brevemente (50-100 ms)
2. Estado de red transferido a host destino
3. Host destino envía Gratuitous ARP:
   "La MAC AA:BB:CC:DD:EE:FF ahora está en puerto X"
4. Switches físicos actualizan tablas MAC
5. VM reanuda en host destino

[Después de migración]
Cliente externo → Switch físico → Host destino (misma MAC) → VM

# Para el cliente: la IP y MAC no cambian; solo la ruta física subyacente
# Latencia adicional: tiempo de propagación de Gratuitous ARP + convergencia de switches
# Típico: <100 ms de posible pérdida de paquetes (TCP retransmite automáticamente)
```

```bash
# Verificar que la MAC se preserva tras migración en KVM
# Antes de migrar, anotar MAC de la VM
virsh domifaddr web-server-01

# Salida:
# vnet0  52:54:00:ab:cd:ef  192.168.1.100/24

# Tras migración, verificar en host destino
virsh domifaddr web-server-01
# Debe mostrar la misma MAC y dirección IP

# Si la MAC cambia, clientes pueden experimentar timeout de ARP;
# forzar actualización con gratuitous ARP manual desde guest:
# Dentro de la VM Linux:
arping -U -c 3 -I eth0 192.168.1.100
```

```yaml
# Configuración recomendada para switches físicos en entorno de migración
# (ejemplo conceptual para switches Cisco-style)

interface port-channel-10  # Uplink a hosts de virtualización
  description Virtualization-Hosts-Migration
  switchport mode trunk
  switchport trunk allowed vlan 100-199  # VLANs de producción
  spanning-tree portfast trunk  # Convergencia rápida tras migración
  spanning-tree bpduguard enable  # Protección contra bucles
  no cdp enable  # Opcional: reducir overhead de protocolos de descubrimiento
```

> En entornos con múltiples switches o topologías complejas, la convergencia de tablas MAC puede tardar más que el downtime de la migración, causando pérdida de conectividad extendida. Mitigar con: switches que soporten Virtual Port Channel (vPC), configuración de portfast para puertos de hosts, y monitoreo de tiempo de convergencia post-migración.

### Migración con almacenamiento: block migration y Storage vMotion

Cuando el almacenamiento no es compartido entre hosts, la migración debe transferir también el contenido de los discos virtuales. Esta operación, conocida como "block migration" en KVM o "Storage vMotion" en VMware, incrementa significativamente el tiempo total y el consumo de recursos de red.

```text
Comparativa: migración con vs. sin almacenamiento compartido

| Aspecto | Almacenamiento compartido | Block migration / Storage vMotion |
|---------|--------------------------|-----------------------------------|
| Tiempo total | 30-120 segundos (solo memoria) | 5-60 minutos (memoria + disco) |
| Ancho de banda requerido | 1-5 Gbps (memoria) | 5-10+ Gbps (memoria + disco) |
| Impacto en rendimiento de VM | Mínimo (solo fase de convergencia) | Moderado-alto (E/S compite con transferencia) |
| Complejidad operativa | Baja (solo red y CPU compatibles) | Alta (gestión de transferencia de disco, consistencia) |
| Casos de uso | Mantenimiento, balanceo de cargas | Migración entre clusters, DR, consolidación |
```

```bash
# Block migration en KVM/libvirt
# Transferir VM completa (memoria + disco) entre hosts sin almacenamiento compartido

virsh migrate --live --persistent --copy-storage-all \
  --parallel 4 \  # Transferencia paralela de bloques de disco
  --compression \ # Compresión para reducir volumen de datos
  web-server-01 \
  qemu+ssh://kvm-host-02.local/system

# Monitorizar progreso específico de transferencia de disco
watch -n 2 'virsh domjobinfo web-server-01 | grep -i "disk"'

# Salida durante migración:
# Memory bandwidth: 125 MiB/s
# Disk bandwidth: 45 MiB/s  ← Transferencia de disco en paralelo
# Total transferred: 12.5 GiB (memoria) + 45 GiB (disco)
```

```powershell
# Storage vMotion en VMware vSphere (PowerCLI)
# Migrar solo almacenamiento de VM entre datastores, manteniendo host

$vm = Get-VM -Name "web-server-01"
$targetDatastore = Get-Datastore -Name "new-datastore-01"

# Migrar discos a nuevo datastore
Move-VM -VM $vm -Datastore $targetDatastore -Priority High

# Migrar VM completa (host + almacenamiento) simultáneamente
$targetHost = Get-VMHost -Name "esxi-host-02.local"
Move-VM -VM $vm -Destination $targetHost -Datastore $targetDatastore -Priority High

# Verificar progreso
Get-Task | Where-Object {$_.Description -like "*Migrate*"} | 
  Select-Object Name, PercentComplete, State, StartTime
```

> La migración con transferencia de disco debe planificarse fuera de horas pico: consume ancho de banda significativo y puede degradar el rendimiento de otras VMs que comparten la misma red o almacenamiento. Para migraciones grandes, considerar: (1) pre-copiar discos durante ventana de mantenimiento, (2) usar migración en dos fases (disco primero, luego memoria), o (3) implementar replicación asíncrona previa para reducir delta a transferir.

## Quédate con...

- Los formatos **OVF/OVA** estandarizan la portabilidad de VMs entre plataformas, pero no garantizan compatibilidad automática: verificar firmware, controladores y características de hardware virtual antes de importar en entorno destino.
- La **migración en vivo** requiere prerrequisitos estrictos: almacenamiento compartido, red dedicada de baja latencia (<10 ms) y compatibilidad de CPU; omitir cualquiera de estos puede causar fallos o downtime extendido.
- El mecanismo de **pre-copia iterativa** transfiere memoria en rondas sucesivas hasta converger; la fase final de suspensión típica dura <50-200 ms, imperceptible para la mayoría de aplicaciones.
- La **redirección de conectividad** durante migración depende de Gratuitous ARP y convergencia de switches; configurar portfast y monitorear pérdida de paquetes post-migración para garantizar continuidad.
- La **block migration** (transferencia de disco + memoria) es significativamente más lenta y costosa que la migración con almacenamiento compartido; reservar para casos excepcionales y ejecutar fuera de horas pico.
- El parámetro **`--postcopy`** en KVM reduce downtime a casi cero pero introduce riesgo de inconsistencia si la red falla; usar solo en entornos con conectividad altamente confiable.
- **Monitorizar progreso** con `virsh domjobinfo`, `esxtop` o PowerCLI permite detectar cuellos de botella (ancho de banda insuficiente, alta tasa de páginas sucias) y ajustar parámetros en tiempo real.
- La **preservación de MAC e IP** es crítica para conectividad transparente; verificar que la configuración de red no cambia tras migración y forzar actualización de ARP si es necesario.
- Para migraciones frecuentes o a escala, automatizar mediante APIs (libvirt, vSphere API) y orquestadores (Terraform, Ansible) en lugar de comandos manuales, garantizando consistencia y auditabilidad.
- Documentar siempre el procedimiento de rollback: cómo revertir una migración fallida sin pérdida de datos, especialmente crítico en migraciones con transferencia de disco donde el estado puede estar parcialmente replicado.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/vms/monitoreo" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
