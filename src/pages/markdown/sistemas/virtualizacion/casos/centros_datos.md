---
title: "Empresas y centros de datos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Empresas y centros de datos](#empresas-y-centros-de-datos)
  - [Consolidación de servidores físicos: densidad, eficiencia y gestión de recursos compartidos](#consolidación-de-servidores-físicos-densidad-eficiencia-y-gestión-de-recursos-compartidos)
    - [Economía y métricas de consolidación](#economía-y-métricas-de-consolidación)
    - [Configuración de asignación de recursos en clústeres consolidados](#configuración-de-asignación-de-recursos-en-clústeres-consolidados)
  - [Alta disponibilidad con clústeres y réplicas: mecanismos de failover automático](#alta-disponibilidad-con-clústeres-y-réplicas-mecanismos-de-failover-automático)
    - [Arquitectura de clústeres HA](#arquitectura-de-clústeres-ha)
    - [Mecanismos de detección de fallos y fencing](#mecanismos-de-detección-de-fallos-y-fencing)
  - [Recuperación ante desastres con réplica remota: continuidad del negocio más allá del clúster local](#recuperación-ante-desastres-con-réplica-remota-continuidad-del-negocio-más-allá-del-clúster-local)
    - [Estrategias de replicación: síncrona vs. asíncrona](#estrategias-de-replicación-síncrona-vs-asíncrona)
    - [Pruebas de DR y validación de RPO/RTO](#pruebas-de-dr-y-validación-de-rporto)
  - [Quédate con...](#quédate-con)

</div>

# Empresas y centros de datos

La virtualización en entornos empresariales y centros de datos representa la madurez operacional de esta tecnología: ya no se trata simplemente de ejecutar múltiples sistemas operativos en un solo servidor, sino de transformar la infraestructura física en un recurso elástico, gestionable y resiliente que puede soportar cargas de trabajo críticas con garantías de disponibilidad medibles. La consolidación de servidores físicos en hipervisores de Tipo 1 no es únicamente una iniciativa de reducción de costos, sino una estrategia arquitectónica que habilita capacidades imposibles en infraestructura bare-metal: migración en vivo sin interrupción del servicio, reinicio automático de cargas tras fallos de hardware, y replicación geográfica de estados completos de sistemas para recuperación ante desastres. Comprender los mecanismos subyacentes de estas capacidades —desde los algoritmos de planificación de recursos en clústeres hasta los protocolos de replicación síncrona/asíncrona y los procedimientos de failover automatizado— es esencial para diseñar infraestructuras empresariales que equilibren densidad de consolidación con resiliencia operativa, evitando errores costosos como puntos únicos de fallo en la capa de virtualización, configuraciones de HA que no protegen contra los escenarios de fallo relevantes, o estrategias de DR con RPO/RTO incompatibles con los requisitos del negocio.

## Consolidación de servidores físicos: densidad, eficiencia y gestión de recursos compartidos

La consolidación de servidores mediante virtualización permite ejecutar múltiples cargas de trabajo aisladas sobre un reducido número de servidores físicos, transformando el modelo tradicional "una aplicación, un servidor" en arquitecturas de alta densidad que maximizan la utilización de recursos mientras mantienen fronteras de aislamiento y garantías de rendimiento. Esta transformación tiene implicaciones económicas profundas —reducción de CAPEX en hardware, OPEX en energía y espacio— pero también introduce complejidad operativa que debe gestionarse mediante herramientas de orquestación, políticas de asignación de recursos y monitoreo proactivo de contención.

### Economía y métricas de consolidación

```text
Comparativa de modelos pre y post-virtualización:

┌─────────────────────────────────────────────────────────────────┐
│  Modelo Tradicional (1 app = 1 servidor)                       │
├─────────────────────────────────────────────────────────────────┤
│  Servidores físicos: 10                                        │
│  Utilización promedio: 10-15%                                  │
│  Consumo energético: 10 × 300W = 3,000W                        │
│  Espacio en rack: ~10U                                         │
│  Costo hardware (5 años): 10 × $5,000 = $50,000               │
│  Costo energético (5 años): 3kW × 24h × 365d × 5y × $0.12/kWh │
│                        = ~$157,000                             │
├─────────────────────────────────────────────────────────────────┤
│  Modelo Virtualizado (consolidación 10:1)                      │
├─────────────────────────────────────────────────────────────────┤
│  Servidores físicos: 2 (para redundancia)                      │
│  Utilización promedio: 60-70%                                  │
│  Consumo energético: 2 × 500W = 1,000W                         │
│  Espacio en rack: ~4U                                          │
│  Costo hardware (5 años): 2 × $10,000 = $20,000               │
│  Costo energético (5 años): 1kW × 24h × 365d × 5y × $0.12/kWh │
│                        = ~$52,000                              │
├─────────────────────────────────────────────────────────────────┤
│  Ahorro total estimado (5 años): ~$135,000                    │
│  Ratio de consolidación típico: 8:1 a 15:1 para cargas generales│
└─────────────────────────────────────────────────────────────────┘
```

```bash
# Calcular ratio de consolidación recomendado según perfil de carga
# Script de evaluación de capacidad (conceptual)

#!/bin/bash
# consolidation-calculator.sh

echo "=== Calculadora de Consolidación de Servidores ==="
echo ""

# Recopilar métricas de servidores existentes
echo "Ingrese utilización de CPU promedio por servidor (%):"
read cpu_util

echo "Ingrese utilización de memoria promedio por servidor (GB):"
read mem_util

echo "Ingrese número de servidores físicos actuales:"
read server_count

# Calcular recursos totales actuales
total_cpu=$(echo "$cpu_util * $server_count" | bc)
total_mem=$(echo "$mem_util * $server_count" | bc)

# Calcular servidores virtuales necesarios (asumiendo 70% utilización objetivo)
target_util=70
recommended_hosts_cpu=$(echo "scale=2; $total_cpu / $target_util" | bc)
recommended_hosts_mem=$(echo "scale=2; $total_mem / 64" | bc)  # Asumiendo 64GB por host

# El mayor de los dos determina el requisito
if (( $(echo "$recommended_hosts_cpu > $recommended_hosts_mem" | bc -l) )); then
    recommended_hosts=$recommended_hosts_cpu
else
    recommended_hosts=$recommended_hosts_mem
fi

# Añadir redundancia (mínimo 2 hosts para HA)
if (( $(echo "$recommended_hosts < 2" | bc -l) )); then
    recommended_hosts=2
fi

echo ""
echo "=== Resultados ==="
echo "Servidores físicos actuales: $server_count"
echo "Servidores host recomendados: $recommended_hosts (con redundancia)"
echo "Ratio de consolidación: $(echo "scale=1; $server_count / $recommended_hosts" | bc):1"
echo "Ahorro estimado de hardware: $(echo "scale=0; ($server_count - $recommended_hosts) * 5000" | bc) USD"
```

```yaml
# Perfiles de carga y ratios de consolidación recomendados
consolidation_ratios_by_workload:
  servidores_web_stateless:
    utilizacion_typica: "15-25%"
    ratio_recomendado: "15:1 a 20:1"
    consideraciones:
      - "Cargas predecibles con picos manejables"
      - "Pueden compartir host densamente"
      - "HA mediante múltiples instancias detrás de load balancer"
  
  bases_de_datos_transaccionales:
    utilizacion_typica: "40-60%"
    ratio_recomendado: "4:1 a 8:1"
    consideraciones:
      - "Cargas intensivas en E/S y memoria"
      - "Requieren reservas de recursos garantizadas"
      - "Considerar almacenamiento dedicado o flash"
  
  servidores_de_aplicaciones:
    utilizacion_typica: "25-40%"
    ratio_recomendado: "10:1 a 12:1"
    consideraciones:
      - "Cargas variables según demanda de usuarios"
      - "Benefician de escalado horizontal"
      - "Monitorear contención de CPU durante picos"
  
  sistemas_legacy_criticos:
    utilizacion_typica: "10-20%"
    ratio_recomendado: "2:1 a 4:1"
    consideraciones:
      - "No pueden escalarse horizontalmente"
      - "Requieren aislamiento fuerte (VM dedicada)"
      - "Priorizar disponibilidad sobre densidad"
```

> La consolidación agresiva sin monitoreo de contención puede degradar el rendimiento de todas las cargas alojadas: establecer umbrales de alerta (CPU ready time >10%, memoria balloon >20%, latencia de disco >20ms) y mantener capacidad de reserva (20-30%) para absorber picos imprevistos o fallos de hosts que requieran migración de cargas.

### Configuración de asignación de recursos en clústeres consolidados

```bash
# Ejemplo: Configurar reservas y límites de recursos en VMware vSphere
# PowerCLI script para aplicar políticas de recursos consistentes

# Conectar a vCenter
Connect-VIServer -Server vcenter.local -User administrator@vsphere.local

# Obtener clúster de producción
$cluster = Get-Cluster -Name "Production-Cluster"

# Configurar DRS (Distributed Resource Scheduler) para balanceo automático
Set-Cluster -Cluster $cluster `
  -DrsEnabled $true `
  -DrsAutomationLevel "FullyAutomated" `
  -DrsMigrationThreshold 3

# Configurar HA (High Availability)
Set-Cluster -Cluster $cluster `
  -HaEnabled $true `
  -HaAdmissionControlEnabled $true `
  -HaRestartPriority "High"

# Aplicar reservas de recursos a VMs críticas
$critical_vms = Get-VM -Name "db-*", "app-core-*"

foreach ($vm in $critical_vms) {
    # Reserva de CPU (MHz garantizados)
    Get-VMResourceConfiguration -VM $vm | `
      Set-VMResourceConfiguration -CpuReservationMhz 2000
    
    # Reserva de memoria (MB garantizados)
    Get-VMResourceConfiguration -VM $vm | `
      Set-VMResourceConfiguration -MemReservationMB 4096
    
    # Límite máximo (opcional, para evitar monopolización)
    Get-VMResourceConfiguration -VM $vm | `
      Set-VMResourceConfiguration -CpuLimitMhz 4000
}

# Verificar configuración aplicada
Get-VMResourceConfiguration -VM $critical_vms | `
  Select-Object VM, CpuReservationMhz, MemReservationMB, CpuLimitMhz
```

```yaml
# Configuración de recursos en KVM/libvirt para consolidación empresarial
# Ejemplo: definición de VM con reservas y límites

resource_allocation_example:
  vm_config:
    name: "production-db-01"
    vcpus: 4
    memory:
      allocated: 16384  # MB asignados
      guaranteed: 8192  # MB garantizados (reserva)
    cpu:
      mode: host-passthrough
      placement: static
      pinning: "0-3"  # vCPUs fijadas a pCPUs específicos
    io:
      disk_bus: virtio
      io_threads: 4
      cache: none  # Bypass caché del host para consistencia
  
  host_config:
    overcommit_policy:
      cpu_ratio: "4:1"  # Máximo 4 vCPUs por pCPU
      memory_ratio: "1.5:1"  # Máximo 1.5x memoria virtual vs física
    reservation_buffer: "20%"  # Mantener 20% de recursos sin asignar
```

```bash
# Verificar contención de recursos en tiempo real (KVM/libvirt)
# Script de monitoreo de salud del clúster

#!/bin/bash
# cluster-health-check.sh

echo "=== Salud del Clúster de Virtualización ==="
echo ""

# Verificar hosts disponibles
echo "--- Hosts en el clúster ---"
virsh list --all | grep -E "running|paused" | wc -l
echo "VMs en ejecución"

# Verificar contención de CPU (ready time)
echo ""
echo "--- Contención de CPU (ready time >10% es crítico) ---"
for vm in $(virsh list --name --state-running); do
    ready=$(virsh cpu-stats "$vm" --total 2>/dev/null | grep wait_time | awk '{print $2}')
    total=$(virsh cpu-stats "$vm" --total 2>/dev/null | grep cpu_time | awk '{print $2}')
    if [ -n "$ready" ] && [ -n "$total" ]; then
        pct=$(echo "scale=2; $ready * 100 / ($total + $ready)" | bc)
        if (( $(echo "$pct > 10" | bc -l) )); then
            echo "⚠️  $vm: ${pct}% ready time (CRÍTICO)"
        elif (( $(echo "$pct > 5" | bc -l) )); then
            echo "⚡ $vm: ${pct}% ready time (ATENCIÓN)"
        fi
    fi
done

# Verificar uso de memoria del host
echo ""
echo "--- Uso de Memoria del Host ---"
free -h | grep Mem

# Verificar espacio en datastores
echo ""
echo "--- Espacio en Almacenamiento ---"
df -h /var/lib/libvirt/images | tail -1 | awk '{print "Uso: "$5" | Disponible: "$4}'
```

> Las reservas de recursos garantizan que las VMs críticas recibirán recursos mínimos incluso bajo contención severa, pero reducen la capacidad de overcommit del clúster: calcular cuidadosamente el balance entre garantías de rendimiento y densidad de consolidación, documentando las decisiones para auditoría futura.

## Alta disponibilidad con clústeres y réplicas: mecanismos de failover automático

La alta disponibilidad (HA) en entornos virtualizados permite que las cargas de trabajo se recuperen automáticamente tras fallos de hardware sin intervención manual, minimizando el tiempo de inactividad (RTO) y manteniendo la continuidad del negocio. Esta capacidad se logra mediante clústeres de hosts que comparten almacenamiento, se monitorizan mutuamente mediante heartbeats, y pueden reiniciar VMs en hosts sanos cuando se detecta un fallo.

### Arquitectura de clústeres HA

```text
Arquitectura de clúster de alta disponibilidad:

┌─────────────────────────────────────────────────────────────────┐
│  Clúster de Alta Disponibilidad (3+ hosts)                     │
├─────────────────────────────────────────────────────────────────┤
│  Host-01                    Host-02                    Host-03 │
│  ┌─────────┐               ┌─────────┐               ┌─────────┐│
│  │ VM-A    │               │ VM-B    │               │ VM-C    ││
│  │ VM-D    │               │ VM-E    │               │ VM-F    ││
│  └────┬────┘               └────┬────┘               └────┬────┘│
│       │                         │                         │    │
│  ┌────▼─────────────────────────▼─────────────────────────▼────┐│
│  │          Almacenamiento Compartido (SAN/NFS/vSAN)           ││
│  │          • Accesible por todos los hosts                    ││
│  │          • VMs almacenadas centralmente                     ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Red de Gestión (Heartbeat)                                     │
│  • Comunicación entre hosts para detección de fallos           │
│  • Múltiples paths para evitar punto único de fallo            │
├─────────────────────────────────────────────────────────────────┤
│  Plano de Control (vCenter / oVirt / Pacemaker)                │
│  • Orquesta failover automático                                │
│  • Mantiene estado del clúster                                 │
│  • Aplica políticas de HA y DRS                                │
└─────────────────────────────────────────────────────────────────┘
```

```bash
# Configurar clúster HA en Proxmox VE
# 1. Inicializar clúster en el primer nodo

pvecm create cluster-ha
# Salida: Cluster name, Cluster ID generado

# 2. Unir nodos adicionales al clúster
# En Host-02 y Host-03:
pvecm add 192.168.1.10  # IP del Host-01 (nodo inicial)

# 3. Verificar estado del clúster
pvecm status
# Salida esperada:
# Name: cluster-ha
# Config Version: 3
# Quorum information:
#   Quorum provider: corosync_votequorum
#   Nodes: 3
#   Quorum: 2
#   Flags: Quorate

# 4. Habilitar HA para VMs específicas
# La VM se reiniciará automáticamente en otro host si el host actual falla
ha-manager add vm:100 --state started --max_restarts 3 --max_restart_time 300

# 5. Verificar estado de HA
ha-manager status
```

```yaml
# Configuración de HA en VMware vSphere (conceptual vía PowerCLI)
vsphere_ha_configuration:
  cluster_settings:
    ha_enabled: true
    admission_control:
      enabled: true
      policy: "PercentageBased"
      cpu_reserve: 25  # Reservar 25% de CPU para failover
      memory_reserve: 25  # Reservar 25% de memoria para failover
    
    host_isolation_response: "PowerOffAndRestart"
    vm_monitoring: "VmMonitoringHigh"  # Reiniciar VMs si no hay heartbeat
    
    restart_priority:
      critical_vms: "High"  # db-*, app-core-*
      standard_vms: "Medium"  # web-*, api-*
      low_priority_vms: "Low"  # dev-*, test-*
  
  networking:
    heartbeat_networks:
      - "Management Network (redundante)"
      - "Dedicated HA Network (recomendado para clústeres grandes)"
    isolation_addresses:
      - "Gateway predeterminado"
      - "Dirección IP específica de monitoreo"
```

```bash
# Simular fallo de host para probar HA (entorno de pruebas únicamente)
# NUNCA ejecutar en producción sin procedimiento de cambio aprobado

# En Proxmox: simular fallo apagando host abruptamente
# (desde consola física o IPMI del host a "fallar")
ipmitool -H host-01-ipmi -U admin -P password power off

# Observar en los hosts restantes:
# 1. Heartbeat deja de recibirse de Host-01 (~15 segundos)
# 2. Clúster declara Host-01 como "failed" (~30 segundos)
# 3. Elección de líder entre hosts restantes (~10 segundos)
# 4. Reinicio de VMs de Host-01 en Host-02/03 (~60-120 segundos)

# Verificar recuperación
ha-manager status
# Las VMs de Host-01 deberían mostrar estado "running" en Host-02 o Host-03

# Restaurar Host-01 y verificar reintegración al clúster
ipmitool -H host-01-ipmi -U admin -P password power on
pvecm status  # Host-01 debería aparecer como "online" tras reinicio
```

> El quórum del clúster es crítico: con 3 hosts, se necesitan al menos 2 para mantener quórum y tomar decisiones; con 2 hosts, un fallo deja el clúster sin quórum y las VMs no se reiniciarán automáticamente. Para clústeres de 2 nodos, configurar un testigo (qdevice) en una ubicación tercera para mantener quórum tras fallo de un nodo.

### Mecanismos de detección de fallos y fencing

```text
Flujo de detección de fallos y failover automático:

[T0] Host-01 deja de enviar heartbeats
  ↓
[T+15s] Hosts restantes no reciben 3 heartbeats consecutivos
  ↓
[T+30s] Clúster inicia verificación de aislamiento de red
  ↓
[T+45s] Si Host-01 también no responde a ping de aislamiento:
        → Host-01 declarado "failed"
  ↓
[T+60s] Elección de líder mediante algoritmo de consenso (Paxos/Raft)
  ↓
[T+75s] Líder identifica VMs afectadas en Host-01
  ↓
[T+90s] Verifica recursos disponibles en Host-02/03
  ↓
[T+105s] Inicia reinicio de VMs en hosts sanos (por orden de prioridad)
  ↓
[T+180s] VMs críticas en ejecución en nuevos hosts
  ↓
[T+300s] Notificación a sistema de monitoreo / webhook / email
```

```yaml
# Configuración de fencing (aislamiento de nodos fallidos)
# Previene "split-brain" donde dos hosts creen ser el primario

fencing_configuration:
  metodos_disponibles:
    ipmi_power_off:
      descripcion: "Apagar nodo fallido vía IPMI/iDRAC/iLO"
      recomendacion: "Método preferido para clústeres físicos"
      configuracion:
        - "Configurar IPs de IPMI en base de datos del clúster"
        - "Probar conectividad IPMI desde todos los nodos"
        - "Timeout: 60 segundos antes de declarar fallo"
    
    storage_fencing:
      descripcion: "Revocar acceso a almacenamiento compartido"
      recomendacion: "Complementario a IPMI, no único método"
      configuracion:
        - "Usar almacenamiento con SCSI persistent reservations"
        - "Nodo que pierde quórum pierde acceso a LUNs"
    
    network_fencing:
      descripcion: "Aislar nodo fallido de la red"
      recomendacion: "Útil cuando IPMI no está disponible"
      configuracion:
        - "Configurar switches gestionables para bloquear puertos"
        - "Requiere integración con API del switch"
  
  politicas_de_fencing:
    - "Siempre fencear antes de reiniciar VMs en otro host"
    - "Evitar que el nodo 'fallido' pueda acceder a recursos compartidos"
    - "Documentar procedimiento de recuperación post-fencing"
```

> El fencing es esencial para prevenir corrupción de datos en escenarios de split-brain: sin fencing, dos hosts podrían intentar escribir simultáneamente en los mismos archivos de VM, corrompiendo discos virtuales. Configurar siempre al menos un método de fencing fiable y probarlo periódicamente en ventanas de mantenimiento.

## Recuperación ante desastres con réplica remota: continuidad del negocio más allá del clúster local

La replicación remota extiende la resiliencia más allá del centro de datos primario, manteniendo copias de VMs en una ubicación geográficamente distante que puede activarse ante fallos catastróficos (desastres naturales, cortes de energía prolongados, incidentes de seguridad). A diferencia de la HA local que protege contra fallos de hardware individuales, la replicación remota protege contra la pérdida completa del sitio primario.

### Estrategias de replicación: síncrona vs. asíncrona

```text
Comparativa de métodos de replicación para DR:

┌─────────────────────────────────────────────────────────────────┐
│  Replicación Síncrona                                          │
├─────────────────────────────────────────────────────────────────┤
│  Mecanismo:                                                    │
│  • Cada escritura se replica al sitio secundario               │
│    antes de confirmar al guest                                 │
│  • Ambos sitios tienen datos idénticos en todo momento         │
│                                                                │
│  RPO (Recovery Point Objective): ~0                            │
│  RTO (Recovery Time Objective): 5-30 minutos                   │
│                                                                │
│  Ventajas:                                                     │
│  • Sin pérdida de datos en failover                            │
│  • Consistencia garantizada entre sitios                       │
│                                                                │
│  Limitaciones:                                                 │
│  • Requiere enlace de baja latencia (<5ms RTT)                 │
│  • Distancia máxima ~100km por limitación de velocidad de luz  │
│  • Impacto en rendimiento de escritura (20-40%)                │
│                                                                │
│  Casos de uso: Bases de datos transaccionales críticas,        │
│                sistemas financieros, compliance estricto       │
├─────────────────────────────────────────────────────────────────┤
│  Replicación Asíncrona                                         │
├─────────────────────────────────────────────────────────────────┤
│  Mecanismo:                                                    │
│  • Escrituras se confirman localmente, luego se replican       │
│  • Sitio secundario tiene datos con retraso (segundos/minutos) │
│                                                                │
│  RPO: 5 minutos a 24 horas (configurable)                      │
│  RTO: 15-60 minutos                                            │
│                                                                │
│  Ventajas:                                                     │
│  • Funciona sobre enlaces de larga distancia                   │
│  • Sin impacto significativo en rendimiento local              │
│  • Más económico (ancho de banda menor)                        │
│                                                                │
│  Limitaciones:                                                 │
│  • Pérdida potencial de datos no replicados                    │
│  • Requiere resolución de conflictos en failover               │
│                                                                │
│  Casos de uso: La mayoría de cargas empresariales,             │
│                DR entre regiones, nube híbrida                 │
└─────────────────────────────────────────────────────────────────┘
```

```bash
# Configurar replicación asíncrona en Proxmox VE
# 1. Configurar almacenamiento remoto en el sitio secundario

# En sitio primario, añadir almacenamiento del sitio DR
pvesm add zfspool dr-pool \
  --portal 10.20.0.10 \
  --pool tank-replicator \
  --content images,backup \
  --disable false

# 2. Configurar trabajo de replicación
# Replicar VM 100 cada 15 minutos con retención de 4 puntos
pvesr create local:dr-pool 100 \
  --schedule 15min \
  --mode async \
  --rate 100M \
  --delete 4

# 3. Verificar estado de replicación
pvesr status

# Salida típica:
# ID      Type    Target          Schedule  Mode    State   Duration
# 100     zfs     dr-pool         15min     async   OK      45s

# 4. Verificar últimas réplicas
zfs list -t snapshot tank/vms | grep replication
```

```yaml
# Configuración de replicación en VMware vSphere Replication
vsphere_replication_config:
  sitio_primario:
    vcenter: "vcenter-primary.local"
    replication_server: "vr-server-primary.local"
    datastore: "vsan-datastore-primary"
  
  sitio_secundario:
    vcenter: "vcenter-dr.local"
    replication_server: "vr-server-dr.local"
    datastore: "vsan-datastore-dr"
  
  politica_de_replicacion:
    vms_criticas:
      rpo_minutes: 15  # Máximo 15 minutos de pérdida de datos
      retention_points: 10  # Mantener 10 puntos de recuperación
      quiesce_guest: true  # Consistencia a nivel de aplicación
  
    vms_estandar:
      rpo_minutes: 60
      retention_points: 5
      quiesce_guest: false
  
  red:
    bandwidth_limit: "500 Mbps"  # Limitar para no saturar enlace WAN
    compression: true  # Reducir tráfico de replicación
    encryption: true  # Cifrar tráfico entre sitios
```

```bash
# Procedimiento de failover en escenario de desastre
# Ejecutar DESDE el sitio secundario cuando el primario está indisponible

# 1. Verificar estado de las réplicas en sitio DR
pvesr status
# Confirmar que las últimas réplicas están completas

# 2. Identificar VMs a activar
# Priorizar según criticidad del negocio

# 3. Activar VMs desde la réplica (Proxmox)
# Esto convierte la réplica en una VM independiente
qm set 100 --delete replica  # Eliminar flag de réplica

# 4. Ajustar configuración de red para el sitio DR
# (IPs pueden necesitar cambio si la red DR es diferente)
qm set 100 --net0 virtio,bridge=vmbr-dr,ip=10.20.0.100/24

# 5. Iniciar VMs en orden de dependencia
qm start 100  # Base de datos primero
sleep 60
qm start 101  # Servidor de aplicaciones
sleep 30
qm start 102  # Servidor web

# 6. Actualizar DNS/load balancers para apuntar al sitio DR
# (procedimiento manual o automatizado según infraestructura)

# 7. Documentar hora de failover y RTO real alcanzado
echo "Failover completado: $(date)" >> /var/log/dr-failover.log
```

> El failover de DR no es transparente para los usuarios: las IPs pueden cambiar, el DNS necesita propagación, y las aplicaciones pueden necesitar reinicio. Documentar exhaustivamente el procedimiento, probarlo al menos anualmente, y mantener contactos actualizados de todos los responsables que deben participar en la activación.

### Pruebas de DR y validación de RPO/RTO

```yaml
# Plan de pruebas de recuperación ante desastres
dr_testing_plan:
  frecuencia:
    pruebas_completas: "Anual (failover completo del sitio)"
    pruebas_parciales: "Trimestral (restaurar VMs individuales)"
    verificaciones_automatizadas: "Mensual (integridad de réplicas)"
  
  alcance_de_prueba:
    - "Seleccionar 10-20% de VMs críticas para prueba completa"
    - "Incluir al menos una VM de cada tier (DB, app, web)"
    - "Proceder en ventana de mantenimiento aprobada"
  
  metricas_a_validar:
    rpo_real: "Medir diferencia de tiempo entre última réplica y fallo simulado"
    rto_real: "Medir tiempo desde decisión de failover hasta servicios disponibles"
    integridad_de_datos: "Verificar consistencia de bases de datos tras failover"
    conectividad_de_red: "Confirmar accesibilidad de servicios desde redes de usuarios"
  
  documentacion_requerida:
    - "Runbook de failover actualizado"
    - "Lista de contactos de emergencia verificada"
    - "Inventario de VMs críticas y prioridades de recuperación"
    - "Registro de incidencias encontradas durante la prueba"
  
  post_prueba:
    - "Revertir configuración al sitio primario (failback)"
    - "Documentar lecciones aprendidas"
    - "Actualizar procedimientos según hallazgos"
    - "Reportar resultados a stakeholders del negocio"
```

```bash
# Script de validación automática de integridad de réplicas
#!/bin/bash
# validate-replicas.sh

echo "=== Validación de Réplicas de DR ==="
echo ""

# Verificar que las réplicas recientes existen
echo "--- Estado de Réplicas ---"
pvesr status | grep -E "ID|OK|failed"

# Verificar antigüedad de última réplica por VM crítica
echo ""
echo "--- Antigüedad de Última Réplica ---"
for vm_id in 100 101 102; do
    last_snap=$(zfs list -t snapshot -H -o name,creation tank/vms | \
      grep "replication" | grep "vm-${vm_id}" | tail -1)
    
    if [ -n "$last_snap" ]; then
        snap_time=$(echo $last_snap | awk '{print $2, $3}')
        snap_epoch=$(date -d "$snap_time" +%s)
        now_epoch=$(date +%s)
        age_hours=$(( (now_epoch - snap_epoch) / 3600 ))
        
        if [ "$age_hours" -gt 1 ]; then
            echo "⚠️  VM $vm_id: última réplica hace ${age_hours}h (CRÍTICO si RPO<1h)"
        else
            echo "✓ VM $vm_id: última réplica hace ${age_hours}h"
        fi
    else
        echo "✗ VM $vm_id: SIN RÉPLICAS (CRÍTICO)"
    fi
done

# Verificar espacio disponible en sitio DR
echo ""
echo "--- Espacio en Sitio DR ---"
ssh dr-site "zpool list tank-replicator" | grep -E "NAME|tank"
```

> Las pruebas de DR revelan frecuentemente problemas no documentados: dependencias entre VMs no registradas, procedimientos de failover desactualizados, o capacidad insuficiente en el sitio DR. Tratar cada prueba como una oportunidad de mejora, no como un trámite de compliance, y mantener un backlog de acciones correctivas derivadas de las pruebas.

## Quédate con...

- La **consolidación de servidores** transforma infraestructura subutilizada (10-15%) en recursos de alta densidad (60-70%), pero requiere monitoreo proactivo de contención para evitar degradación de rendimiento.
- Los **ratios de consolidación** varían por tipo de carga: 15-20:1 para web stateless, 4-8:1 para bases de datos transaccionales, 2-4:1 para sistemas legacy críticos.
- La **alta disponibilidad (HA)** mediante clústeres protege contra fallos de hardware individuales mediante detección de heartbeats, fencing y reinicio automático en hosts sanos.
- El **quórum del clúster** es crítico: mínimo 3 hosts (o 2 hosts + testigo) para mantener quórum tras fallo de un nodo; sin quórum, el failover automático no funciona.
- El **fencing** previene corrupción de datos en escenarios split-brain: configurar siempre al menos un método fiable (IPMI, storage fencing) y probarlo periódicamente.
- La **replicación síncrona** ofrece RPO~0 pero requiere baja latencia (<5ms) y distancia limitada (~100km); la **replicación asíncrona** funciona a larga distancia con RPO de minutos a horas.
- El **RTO y RPO** deben definirse con el negocio antes de diseñar DR: no todas las cargas justifican el costo de RPO cero; priorizar recursos según criticidad.
- Las **pruebas de DR anuales** son esenciales: procedimientos no probados frecuentemente fallan cuando más se necesitan; documentar hallazgos y actualizar runbooks tras cada prueba.
- La **infraestructura de DR** debe tener capacidad suficiente para las cargas críticas: no sirve tener réplicas si el sitio DR no puede ejecutar las VMs por falta de recursos.
- La virtualización empresarial **no elimina la complejidad, la gestiona**: clústeres, HA y DR requieren diseño cuidadoso, documentación exhaustiva y disciplina operativa continua para entregar los beneficios prometidos.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/casos/seguridad" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
