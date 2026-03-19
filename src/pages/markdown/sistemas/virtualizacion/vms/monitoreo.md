---
title: "Monitoreo y rendimiento"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Monitoreo y rendimiento](#monitoreo-y-rendimiento)
  - [Métricas clave: interpretación contextualizada en arquitecturas virtualizadas](#métricas-clave-interpretación-contextualizada-en-arquitecturas-virtualizadas)
    - [CPU: uso, ready time y co-stop como indicadores de salud de planificación](#cpu-uso-ready-time-y-co-stop-como-indicadores-de-salud-de-planificación)
    - [Memoria: activa, ballooning y swap como indicadores de presión](#memoria-activa-ballooning-y-swap-como-indicadores-de-presión)
    - [I/O de disco: latencia, IOPS y throughput desde múltiples perspectivas](#io-de-disco-latencia-iops-y-throughput-desde-múltiples-perspectivas)
    - [Red: ancho de banda, paquetes por segundo y latencia de red virtualizada](#red-ancho-de-banda-paquetes-por-segundo-y-latencia-de-red-virtualizada)
  - [Herramientas de monitoreo: desde diagnóstico local hasta observabilidad empresarial](#herramientas-de-monitoreo-desde-diagnóstico-local-hasta-observabilidad-empresarial)
    - [`htop` y herramientas nativas del guest: visibilidad limitada pero inmediata](#htop-y-herramientas-nativas-del-guest-visibilidad-limitada-pero-inmediata)
    - [Consola del hipervisor: visibilidad privilegiada de la capa de virtualización](#consola-del-hipervisor-visibilidad-privilegiada-de-la-capa-de-virtualización)
    - [Prometheus + Grafana: observabilidad centralizada para virtualización a escala](#prometheus--grafana-observabilidad-centralizada-para-virtualización-a-escala)
  - [Quédate con...](#quédate-con)

</div>

# Monitoreo y rendimiento

El monitoreo en entornos virtualizados no es simplemente observar métricas de uso de recursos, sino interpretar señales que reflejan la interacción compleja entre múltiples capas de abstracción: el sistema operativo invitado que cree tener control exclusivo del hardware, el hipervisor que media el acceso real a recursos físicos compartidos, y el hardware subyacente que ejecuta finalmente las operaciones. Una métrica que parece normal dentro de una VM —como 80% de uso de CPU— puede ocultar contención severa si el "CPU ready time" indica que las vCPUs esperan milisegundos críticos para ser planificadas; un disco que reporta latencias bajas desde el guest puede estar sufriendo colas profundas en el hipervisor debido a snapshots anidados o contención de E/S con otras VMs. Comprender qué medir, cómo interpretar las métricas en contexto virtualizado y qué herramientas emplear para observar cada capa es esencial para diagnosticar problemas de rendimiento antes de que impacten la experiencia del usuario, para dimensionar adecuadamente la infraestructura y para fundamentar decisiones de escalado o migración con datos objetivos en lugar de intuición.

## Métricas clave: interpretación contextualizada en arquitecturas virtualizadas

Las métricas de rendimiento en virtualización requieren una lectura en dos niveles: lo que reporta el sistema operativo invitado (perspectiva guest) y lo que observa el hipervisor (perspectiva host). La discrepancia entre ambas vistas no indica error de medición, sino que revela el costo de la abstracción y los puntos de contención que emergen cuando múltiples cargas de trabajo compiten por recursos finitos.

### CPU: uso, ready time y co-stop como indicadores de salud de planificación

```text
Métricas de CPU en virtualización y su interpretación:

┌─────────────────────────────────┐
│  %CPU (guest view)              │
│  ← Porcentaje de vCPU en uso   │
│  ← Útil para identificar cargas intensivas │
│  ← No revela contención de scheduling │
├─────────────────────────────────┤
│  CPU Ready Time (host view)    │
│  ← Tiempo que vCPU espera para ser planificada │
│  ← >10% sostenido = contención significativa │
│  ← Causas: overcommit, vCPUs excesivas, falta de reservas │
├─────────────────────────────────┤
│  CPU Co-Stop (multi-vCPU VMs)  │
│  ← Tiempo que una vCPU espera por sus hermanas │
│  ← Alto en VMs con muchas vCPUs mal balanceadas │
│  ← Indica ineficiencia en paralelismo guest │
├─────────────────────────────────┤
│  Steal Time (guest view)       │
│  ← Ciclos de CPU "robados" por otras VMs │
│  ← Visible en `top`/`htop` como `st` │
│  ← >5% sostenido sugiere overcommit agresivo │
└─────────────────────────────────┘
```

```bash
# Medir métricas de CPU en guest Linux (htop/top)
htop
# Columnas clave:
# CPU%: uso actual de vCPU
# ST% (steal): ciclos perdidos por contención con otras VMs

# Verificar steal time de forma programática
mpstat -P ALL 1 5 | grep -E "CPU|st"

# Salida típica bajo contención:
# 10:30:01  CPU    %usr  %nice  %sys  %iowait  %irq  %soft  %steal  %guest  %idle
# 10:30:02  all    45.2   0.0   12.1    3.4    0.0    1.2    8.7     0.0   29.4
#                                                  ↑
#                                          steal >5% indica contención
```

```bash
# Medir CPU ready time en host KVM/libvirt
virsh cpu-stats web-server-01 --total

# Salida:
# cpu_time: 123456789012        ← Tiempo total de CPU consumido (ns)
# vcpu_time: 61728394506        ← Tiempo de vCPU (ns)
# wait_time: 123456789          ← Tiempo de espera/ready (ns)

# Calcular ready time percentage:
# ready_pct = wait_time / (cpu_time + wait_time) * 100
# Ejemplo: 123456789 / (123456789012 + 123456789) * 100 ≈ 0.1% (saludable)
# Si >10%: investigar reservas, shares, o reducir overcommit
```

```bash
# Monitor en tiempo real con virt-top (KVM) o esxtop (ESXi)
virt-top

# Columnas críticas:
# %CPU: uso relativo a asignación
# rCPU: CPU física real consumida (considera ready time)
# MEM: memoria asignada vs. residente

# En ESXi esxtop: presionar 'c' para ver columna %RDY
# %RDY > 10% sostenido = acción requerida
```

> El steal time visible dentro del guest es una señal temprana de contención que el administrador del guest no puede resolver directamente: requiere intervención en el host (ajustar reservas, reducir densidad de consolidación, migrar cargas). Documentar umbrales de alerta (steal >5%, ready >10%) y establecer procesos de escalado hacia el equipo de infraestructura.

### Memoria: activa, ballooning y swap como indicadores de presión

```text
Jerarquía de métricas de memoria en virtualización:

┌─────────────────────────────────┐
│  Memoria asignada (configured) │
│  ← Máximo que la VM puede usar │
│  ← Ej: 8 GB configurados │
├─────────────────────────────────┤
│  Memoria activa (active)       │
│  ← Realmente en uso por aplicaciones guest │
│  ← Ej: 3 GB activos de 8 GB asignados │
├─────────────────────────────────┤
│  Memoria residente (RSS)       │
│  ← Páginas físicamente en RAM del host │
│  ← Si RSS << asignada: ballooning o swap │
├─────────────────────────────────┤
│  Ballooned memory              │
│  ← Memoria "reclamada" del guest por el host │
│  ← Driver balloon en guest libera páginas │
├─────────────────────────────────┤
│  Swapped memory                │
│  ← Páginas de VM intercambiadas a disco del host │
│  ← >0 MB indica presión severa, degradación crítica │
└─────────────────────────────────┘
```

```bash
# Verificar estado de memoria en guest Linux
free -h
# Salida:
#               total        used        free      shared  buff/cache   available
# Mem:           7.7G        3.1G        2.4G        128M        2.2G        4.1G
# Swap:          2.0G          0B        2.0G

# Si "available" es bajo pero "free" parece alto, el kernel está cacheando
# Si swap está en uso, hay presión de memoria (guest o host)

# Verificar si balloon driver está activo
lsmod | grep virtio_balloon
# Si está cargado, el host puede reclamar memoria dinámicamente
```

```bash
# Verificar memoria desde el host KVM
virsh domstats web-server-01 --balloon

# Salida típica:
# balloon.current=4194304        ← Memoria actual asignada (KB)
# balloon.target=8388608         ← Memoria objetivo configurada
# balloon.rss=3145728            ← Resident Set Size (RAM física real)
# balloon.usable=4000000         ← Memoria usable dentro del guest
# balloon.swap_in=0              ← Páginas leídas desde swap del host
# balloon.swap_out=0             ← Páginas escritas a swap del host

# Interpretación:
# Si balloon.rss << balloon.current: host está bajo presión
# Si balloon.swap_out > 0: VM está siendo swappeada (degradación severa)
```

```yaml
# Alertas recomendadas para memoria en Prometheus (ejemplo conceptual)
groups:
  - name: vm-memory-alerts
    rules:
      - alert: VMHighMemoryPressure
        expr: |
          (libvirt_domain_memory_balloon_rss_bytes / 
           libvirt_domain_memory_balloon_current_bytes) < 0.7
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "VM {{ $labels.domain }} bajo presión de memoria"
          description: "RSS es <70% de memoria asignada; posible ballooning o swap"

      - alert: VMSwapDetected
        expr: libvirt_domain_memory_balloon_swap_out_bytes > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "VM {{ $labels.domain }} está siendo swappeada"
          description: "Swap del host activo para esta VM; rendimiento degradado"
```

> El swapping de memoria de VM a disco del host es el escenario de degradación más severo en virtualización: la latencia de acceso a memoria aumenta de ~100 ns (RAM) a ~1-10 ms (SSD) o ~10-100 ms (HDD). Detectar swap temprano mediante alertas en `balloon.swap_out` permite intervenir antes de que los usuarios perciban lentitud extrema.

### I/O de disco: latencia, IOPS y throughput desde múltiples perspectivas

```text
Métricas de disco en virtualización y su interpretación:

┌─────────────────────────────────┐
│  Desde el guest:               │
│  • iowait (%): tiempo CPU esperando E/S │
│  • Latencia de aplicación: percibida por apps │
│  • Limitación: no ve colas del hipervisor │
├─────────────────────────────────┤
│  Desde el host/hipervisor:    │
│  • Latencia real de E/S: incluye emulación, caché, backend │
│  • IOPS agregadas por datastore: contención entre VMs │
│  • Queue depth: colas pendientes en controlador virtual │
├─────────────────────────────────┤
│  Desde el almacenamiento físico: │
│  • Latencia de dispositivo real │
│  • Utilización de discos físicos │
│  • Errores de hardware o degradación │
└─────────────────────────────────┘
```

```bash
# Medir I/O desde el guest Linux (iostat)
iostat -x 1 5

# Columnas clave:
# %util: porcentaje de tiempo el dispositivo está ocupado
# await: latencia promedio de E/S (ms)
# r_await/w_await: latencia separada lectura/escritura

# await > 20ms en SSD o > 50ms en HDD sugiere contención

# Verificar iowait en contexto de CPU
mpstat -P ALL 1 3 | grep -E "CPU|iowait"
# iowait > 20% sostenido indica que CPU está bloqueada esperando disco
```

```bash
# Medir I/O desde el host KVM (blktrace + btt para análisis detallado)
# Instalar herramientas
sudo apt install blktrace btt -y

# Traza de E/S para una VM específica
blktrace -d /dev/vda -o - | blkparse -i - > /tmp/vm-io-trace.txt

# Analizar latencias con btt
btt -i /tmp/vm-io-trace.txt | head -20

# Salida muestra distribución de latencias por operación
```

```bash
# Consultar métricas de disco mediante libvirt
virsh domblkstat web-server-01 sda

# Salida típica:
# rd_req: 123456          ← Solicitudes de lectura
# rd_bytes: 987654321     ← Bytes leídos
# wr_req: 65432           ← Solicitudes de escritura
# wr_bytes: 123456789     ← Bytes escritos
# flush_req: 1234         ← Solicitudes de flush (sync)
# rd_total_times: 45678901234  ← Tiempo total de lectura (ns)
# wr_total_times: 12345678901  ← Tiempo total de escritura (ns)

# Calcular latencia promedio:
# read_latency_avg = rd_total_times / rd_req / 1000000  ← en ms
```

```yaml
# Ejemplo: dashboard de I/O en Grafana (consulta Prometheus)
# Panel: Latencia promedio de escritura por VM
expr: |
  rate(libvirt_domain_block_wr_total_times_seconds{domain=~"$vm"}[5m]) 
  / 
  rate(libvirt_domain_block_wr_req_total{domain=~"$vm"}[5m]) 
  * 1000  # Convertir a ms

# Panel: IOPS agregadas por datastore
expr: |
  sum(rate(libvirt_domain_block_rd_req_total[datastore="$ds"][1m])) 
  + 
  sum(rate(libvirt_domain_block_wr_req_total[datastore="$ds"][1m]))
```

> La latencia de E/S en virtualización es aditiva: emulación de dispositivo + caché del hipervisor + backend de almacenamiento + dispositivo físico. Una latencia de 5 ms reportada por el guest puede ocultar 15 ms reales en el host si hay contención. Siempre correlacionar métricas de guest y host para diagnóstico preciso.

### Red: ancho de banda, paquetes por segundo y latencia de red virtualizada

```text
Métricas de red en virtualización:

┌─────────────────────────────────┐
│  Desde el guest:               │
│  • ifconfig/ip -s: bytes/paquetes por interfaz │
│  • ss/netstat: conexiones activas, retransmisiones │
│  • ping/iperf: latencia y throughput percibidos │
├─────────────────────────────────┤
│  Desde el host/hipervisor:    │
│  • Tráfico agregado por vSwitch/bridge │
│  • Drops/paquetes descartados por congestión │
│  • Latencia de conmutación virtual │
├─────────────────────────────────┤
│  Desde la red física:         │
│  • Utilización de uplinks físicos │
│  • Errores de NIC física, CRC, collisions │
│  • QoS y políticas de ancho de banda │
└─────────────────────────────────┘
```

```bash
# Medir tráfico de red en guest Linux
ip -s link show eth0
# Salida:
# 2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> ...
#     RX: bytes  packets  errors  dropped overrun mcast
#         1234567890  987654   0       0       0       0
#     TX: bytes  packets  errors  dropped carrier collsns
#         9876543210  876543   0       0       0       0

# Verificar retransmisiones TCP (indicador de congestión)
netstat -s | grep -i retrans
# TCP: 123 retransmissions

# Test de throughput con iperf3 (requiere servidor en otro extremo)
iperf3 -c 192.168.1.100 -t 30 -P 4  # 4 flujos paralelos
```

```bash
# Medir tráfico desde el host KVM
# Interfaces virtuales típicamente nombradas vnetX, tapX
ip -s link show vnet0

# Estadísticas agregadas por bridge
bridge -s link show

# Verificar drops en vSwitch (Open vSwitch ejemplo)
ovs-vsctl list interface vnet0 | grep statistics
```

```yaml
# Alertas de red en Prometheus (ejemplo)
groups:
  - name: vm-network-alerts
    rules:
      - alert: VMHighNetworkErrors
        expr: |
          rate(libvirt_domain_interface_rx_errs_total{domain=~"$vm"}[5m]) > 10
          or
          rate(libvirt_domain_interface_tx_errs_total{domain=~"$vm"}[5m]) > 10
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "VM {{ $labels.domain }} con errores de red"
          
      - alert: VMBandwidthSaturation
        expr: |
          rate(libvirt_domain_interface_rx_bytes_total{domain=~"$vm"}[1m]) 
          > 125000000  # 1 Gbps en bytes/s
        for: 5m
        labels:
          severity: info
        annotations:
          summary: "VM {{ $labels.domain }} cerca de saturación de red"
```

> En redes virtualizadas, los drops de paquetes pueden ocurrir en múltiples puntos: cola de la vNIC, buffer del vSwitch, o uplink físico. Correlacionar métricas de guest (retransmisiones TCP), hipervisor (drops en vnetX) y switch físico (counter de errores) para identificar el cuello de botella real.

## Herramientas de monitoreo: desde diagnóstico local hasta observabilidad empresarial

### `htop` y herramientas nativas del guest: visibilidad limitada pero inmediata

Las herramientas dentro del sistema operativo invitado proporcionan visibilidad rápida para diagnóstico de aplicaciones, pero su perspectiva está limitada por la abstracción de virtualización: no pueden observar contención de recursos, latencia introducida por el hipervisor o impacto de otras VMs.

```bash
# htop: monitor interactivo de procesos y recursos (guest)
htop

# Configuración útil para virtualización:
# - Activar columna "ST%" (steal time) en Setup → Display options
# - Usar vista de árbol (F5) para identificar procesos padre/hijo
# - Filtrar por usuario o comando para aislar cargas específicas

# Comandos complementarios en guest:
vmstat 1 5          # Memoria, swap, CPU, I/O en una vista consolidada
iostat -x 1 5       # Estadísticas detalladas de disco
sar -n DEV 1 5      # Historial de métricas de red (requiere sysstat)
dstat -tcdngy 1     # Vista unificada de CPU, disco, red, paging, sistema
```

```powershell
# Herramientas equivalentes en guest Windows
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
Get-Counter '\Processor(_Total)\% Processor Time'
Get-Counter '\Memory\Available MBytes'
Get-Counter '\PhysicalDisk(_Total)\Avg. Disk sec/Read'

# Resource Monitor (resmon.exe) para vista gráfica integrada
```

> Las métricas de guest son útiles para diagnosticar problemas de aplicación (procesos fugitivos, consultas lentas, configuraciones subóptimas), pero no para identificar contención de recursos virtualizados. Combinar siempre con observación desde el host para diagnóstico completo.

### Consola del hipervisor: visibilidad privilegiada de la capa de virtualización

Cada plataforma de virtualización ofrece herramientas nativas para observar el comportamiento de VMs desde la perspectiva del hipervisor, donde se revelan métricas de contención, planificación y E/S que el guest no puede percibir.

```bash
# KVM/libvirt: virsh y virt-top para monitoreo en tiempo real
virt-top  # Monitor estilo top para VMs completas

# Columnas clave:
# ID: ID interno de la VM
# S: Estado (r=running, b=blocked, etc.)
# RDRQ/WRQ: Solicitudes de lectura/escritura de disco
# RX/TX: Tráfico de red en KB/s
# %CPU/%MEM: Uso relativo a recursos asignados

# Consultas específicas con virsh
virsh domstats web-server-01  # Todas las estadísticas disponibles
virsh domifstat web-server-01 vnet0  # Estadísticas de interfaz específica
virsh domblkstat web-server-01 vda  # Estadísticas de disco específico
```

```bash
# VMware ESXi: esxtop para monitoreo avanzado
# Conectar vía SSH al host ESXi (habilitar en DCUI si está desactivado)
ssh root@esxi-host.local
esxtop

# Modos de esxtop:
# c: CPU (ver %RDY, %CSTP para contención)
# m: Memoria (ver MCTL%, SWCUR para ballooning/swap)
# d: Disco (ver DAVG/cmd para latencia real)
# n: Red (ver %DRPTX para paquetes descartados)

# Comandos útiles dentro de esxtop:
# f: seleccionar columnas a mostrar
# s: cambiar intervalo de actualización
# w: guardar configuración para sesiones futuras
```

```powershell
# Hyper-V: PowerShell para monitoreo programático
# Obtener métricas de todas las VMs
Get-VM | ForEach-Object {
    $vm = $_
    $cpu = Get-VMProcessor -VMName $vm.Name | Measure-Object -Property HostProcessorUsage -Average
    $mem = Get-VMMemory -VMName $vm.Name
    [PSCustomObject]@{
        VMName = $vm.Name
        State = $vm.State
        CPUUsageAvg = "{0:N1}%" -f $cpu.Average
        MemoryAssignedGB = [math]::Round($mem.AssignedMemory/1GB, 2)
        MemoryDemandGB = [math]::Round($mem.DynamicMemoryDemand/1GB, 2)
    }
}

# Métricas de rendimiento históricas (requiere Enable-VMResourceMetering)
Enable-VMResourceMetering -VMName "web-server-01"
Measure-VM -VMName "web-server-01" | Select-Object AvgCPU, AvgRAM, DiskAllocated, NetworkInbound, NetworkOutbound
```

```yaml
# Ejemplo: exporter de libvirt para Prometheus (prometheus-libvirt-exporter)
# Instalación en host KVM:
# 1. Descargar binario o compilar desde fuente
# 2. Ejecutar como servicio
sudo systemctl enable --now prometheus-libvirt-exporter

# Métricas expuestas (ejemplos):
# libvirt_domain_state{domain="web-01"} 1  # 1=running
# libvirt_domain_cpu_time_seconds_total{domain="web-01"} 12345.67
# libvirt_domain_memory_balloon_rss_bytes{domain="web-01"} 3221225472
# libvirt_domain_block_rd_req_total{domain="web-01",disk="vda"} 987654
# libvirt_domain_interface_rx_bytes_total{domain="web-01",interface="vnet0"} 1234567890

# Consulta Prometheus para alertar sobre CPU ready time alto:
# (libvirt_domain_cpu_wait_time_seconds_total / 
#  (libvirt_domain_cpu_time_seconds_total + libvirt_domain_cpu_wait_time_seconds_total)) 
#  * 100 > 10
```

> Las herramientas nativas del hipervisor son esenciales para diagnóstico de rendimiento, pero su interfaz puede ser compleja y no escalan para monitoreo de cientos de VMs. Para entornos grandes, integrar estas métricas en plataformas de observabilidad centralizada (Prometheus, Grafana, vRealize Operations) permite correlación, alertas proactivas y análisis histórico.

### Prometheus + Grafana: observabilidad centralizada para virtualización a escala

Para entornos con múltiples hosts y VMs, la observabilidad centralizada mediante Prometheus (recolección y almacenamiento de métricas) y Grafana (visualización y alertas) proporciona visibilidad unificada, correlación entre capas y automatización de respuestas ante incidentes.

```text
Arquitectura típica de monitoreo con Prometheus + Grafana:

┌─────────────────────────────────┐
│  Fuentes de métricas           │
│  • prometheus-libvirt-exporter (KVM) │
│  • vmware_exporter (vSphere)   │
│  • hyperv_exporter (Hyper-V)   │
│  • node_exporter (hosts físicos)│
│  • guest agents (opcional)     │
├─────────────────────────────────┤
│  Prometheus Server             │
│  • Scraping periódico de exporters │
│  • Almacenamiento de series temporales │
│  • Evaluación de reglas de alerta │
├─────────────────────────────────┤
│  Grafana                       │
│  • Dashboards personalizados por rol │
│  • Alertas visuales y notificaciones │
│  • Correlación entre métricas de capas │
├─────────────────────────────────┤
│  Alertmanager                  │
│  • Enrutamiento de alertas (email, Slack, PagerDuty) │
│  • Silenciamiento, agrupación, deduplicación │
└─────────────────────────────────┘
```

```yaml
# Ejemplo: configuración de scrape para exporters de virtualización (prometheus.yml)
scrape_configs:
  - job_name: 'libvirt-exporter'
    static_configs:
      - targets: ['kvm-host-01:9177', 'kvm-host-02:9177']
    metrics_path: /metrics
    scrape_interval: 30s

  - job_name: 'vmware-exporter'
    static_configs:
      - targets: ['vcenter-exporter:9271']
    params:
      vsphere_host: ['vcenter.local']
    scrape_interval: 60s  # vSphere APIs pueden ser lentas

  - job_name: 'node-exporter-hosts'
    static_configs:
      - targets: ['kvm-host-01:9100', 'kvm-host-02:9100']
    scrape_interval: 30s
```

```yaml
# Ejemplo: dashboard de Grafana para monitoreo de VMs (JSON conceptual simplificado)
{
  "dashboard": {
    "title": "Virtualización - Vista de VM",
    "panels": [
      {
        "title": "CPU Usage y Ready Time",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(libvirt_domain_cpu_time_seconds_total{domain=\"$vm\"}[5m]) * 100",
            "legendFormat": "CPU Usage %"
          },
          {
            "expr": "(libvirt_domain_cpu_wait_time_seconds_total{domain=\"$vm\"} / (libvirt_domain_cpu_time_seconds_total{domain=\"$vm\"} + libvirt_domain_cpu_wait_time_seconds_total{domain=\"$vm\"})) * 100",
            "legendFormat": "Ready Time %"
          }
        ],
        "thresholds": [
          {"value": 10, "colorMode": "warning", "op": "gt"},  # Ready >10%
          {"value": 20, "colorMode": "critical", "op": "gt"}   # Ready >20%
        ]
      },
      {
        "title": "Memoria: RSS vs Asignada",
        "type": "stat",
        "targets": [
          {
            "expr": "libvirt_domain_memory_balloon_rss_bytes{domain=\"$vm\"} / libvirt_domain_memory_balloon_current_bytes{domain=\"$vm\"} * 100",
            "legendFormat": "Memoria residente %"
          }
        ]
      },
      {
        "title": "Latencia de Disco (lectura/escritura)",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(libvirt_domain_block_rd_total_times_seconds{domain=\"$vm\",disk=\"$disk\"}[5m]) / rate(libvirt_domain_block_rd_req_total{domain=\"$vm\",disk=\"$disk\"}[5m]) * 1000",
            "legendFormat": "Read Latency (ms)"
          },
          {
            "expr": "rate(libvirt_domain_block_wr_total_times_seconds{domain=\"$vm\",disk=\"$disk\"}[5m]) / rate(libvirt_domain_block_wr_req_total{domain=\"$vm\",disk=\"$disk\"}[5m]) * 1000",
            "legendFormat": "Write Latency (ms)"
          }
        ]
      }
    ]
  }
}
```

```yaml
# Ejemplo: reglas de alerta para virtualización (alerts.yml)
groups:
  - name: virtualization-critical
    rules:
      - alert: VMHighCPUReady
        expr: |
          (libvirt_domain_cpu_wait_time_seconds_total / 
           (libvirt_domain_cpu_time_seconds_total + libvirt_domain_cpu_wait_time_seconds_total)) 
           * 100 > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "VM {{ $labels.domain }} con contención de CPU"
          description: "Ready time >10% por 5 minutos; revisar reservas o densidad de host"

      - alert: VMMemorySwapDetected
        expr: libvirt_domain_memory_balloon_swap_out_bytes > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "VM {{ $labels.domain }} está siendo swappeada"
          description: "Swap del host activo; rendimiento severamente degradado"

      - alert: DatastoreSpaceLow
        expr: |
          (node_filesystem_size_bytes{mountpoint="/var/lib/libvirt/images"} - 
           node_filesystem_avail_bytes{mountpoint="/var/lib/libvirt/images"}) 
           / node_filesystem_size_bytes{mountpoint="/var/lib/libvirt/images"} * 100 > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Datastore KVM >85% lleno"
          description: "Riesgo de agotamiento de almacenamiento para discos thin"
```

> La observabilidad centralizada permite correlacionar métricas entre capas: por ejemplo, un pico de latencia de disco en el guest puede correlacionarse con alta utilización del datastore en el host y errores de E/S en el almacenamiento físico. Esta visión holística es imposible con herramientas aisladas y es crítica para diagnóstico rápido en entornos complejos.

## Quédate con...

- El **monitoreo en virtualización requiere dos perspectivas**: guest (aplicación) y host (infraestructura); la discrepancia entre ambas revela contención y costos de abstracción.
- El **CPU ready time** (>10% sostenido) es la métrica clave de contención de CPU, más reveladora que el %CPU del guest; monitorizar con `virsh cpu-stats`, `esxtop` o exporters de Prometheus.
- El **steal time** visible en `htop`/`top` dentro del guest es una señal temprana de overcommit agresivo que requiere intervención en el host, no en la VM.
- La **memoria swappeada a nivel de host** (`balloon.swap_out > 0`) indica degradación crítica: latencia de memoria aumenta de ~100 ns a ~1-100 ms; alertar proactivamente.
- La **latencia de disco en virtualización es aditiva**: guest + hipervisor + almacenamiento físico; correlacionar `iostat` en guest con `domblkstat` en host para diagnóstico preciso.
- Los **drops de paquetes en red virtualizada** pueden ocurrir en vNIC, vSwitch o uplink físico; correlacionar métricas de guest (retransmisiones), host (interface stats) y switch físico para identificar el cuello de botella.
- Las **herramientas nativas del guest** (`htop`, `iostat`) son útiles para diagnóstico de aplicación, pero no revelan contención de recursos virtualizados; complementar siempre con observación desde el hipervisor.
- Las **herramientas del hipervisor** (`virt-top`, `esxtop`, PowerShell Hyper-V) proporcionan visibilidad privilegiada de planificación, ballooning y E/S, esenciales para diagnóstico de rendimiento.
- **Prometheus + Grafana** escalan el monitoreo a entornos grandes: recolección centralizada, dashboards personalizados, alertas proactivas y correlación entre capas mediante exporters específicos (libvirt, vmware, hyperv).
- Definir **umbrales de alerta contextualizados**: ready time >10%, swap_out >0, datastore >85%, latencia de disco >20ms (SSD); documentar acciones de remediación asociadas a cada alerta.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/vms/recursos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/vms/migracion" class="next">Siguiente</a>
</div>
