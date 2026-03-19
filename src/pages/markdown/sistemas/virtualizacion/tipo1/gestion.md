---
title: "Gestión centralizada"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Gestión centralizada](#gestión-centralizada)
  - [Plataformas de gestión: vCenter, System Center y oVirt Engine como plano de control unificado](#plataformas-de-gestión-vcenter-system-center-y-ovirt-engine-como-plano-de-control-unificado)
  - [Migración en vivo: trasladar VMs entre hosts sin interrupción del servicio](#migración-en-vivo-trasladar-vms-entre-hosts-sin-interrupción-del-servicio)
  - [Balanceo de carga dinámico: DRS, Optimización Dinámica y políticas de colocación](#balanceo-de-carga-dinámico-drs-optimización-dinámica-y-políticas-de-colocación)
  - [Alta disponibilidad: recuperación automática ante fallos de hardware](#alta-disponibilidad-recuperación-automática-ante-fallos-de-hardware)
  - [Réplica entre sitios: continuidad de negocio mediante sincronización geográfica](#réplica-entre-sitios-continuidad-de-negocio-mediante-sincronización-geográfica)
  - [Quédate con...](#quédate-con)

</div>

# Gestión centralizada

La virtualización a escala empresarial trasciende la capacidad de ejecutar múltiples máquinas virtuales en un solo servidor: el verdadero valor operativo emerge cuando decenas o cientos de hosts físicos se gestionan como un recurso computacional unificado y elástico. La gestión centralizada mediante plataformas como vCenter, System Center o oVirt Engine no es simplemente una interfaz gráfica conveniente; es el plano de control que habilita funciones avanzadas de orquestación, automatización y resiliencia que definen la infraestructura moderna. Estas herramientas abstraen la complejidad del hardware subyacente, exponiendo APIs y políticas declarativas que permiten migrar cargas de trabajo en vivo, rebalancear recursos dinámicamente, garantizar continuidad ante fallos y replicar estados entre sitios geográficos. Comprender esta capa de gestión es esencial para diseñar arquitecturas que equilibren rendimiento, disponibilidad y operatividad, ya que muchas de las capacidades más potentes de la virtualización (vMotion, DRS, HA) solo están disponibles cuando los hosts se agrupan y coordinan bajo un plano de control común.

## Plataformas de gestión: vCenter, System Center y oVirt Engine como plano de control unificado

Cada ecosistema de hipervisores de Tipo 1 ofrece su propia solución de gestión centralizada, diseñada para orquestar clústeres de hosts, gestionar recursos compartidos y exponer interfaces de automatización. Aunque difieren en implementación, todas comparten responsabilidades arquitectónicas fundamentales: inventario unificado, planificación de recursos, ejecución de políticas y exposición de APIs para integración con herramientas de orquestación superiores (Terraform, Ansible, Kubernetes).

| Plataforma | Ecosistema | Arquitectura clave | API principal |
|-----------|-----------|-----------------|--------------|
| **VMware vCenter Server** | vSphere/ESXi | Appliance virtual (VCSA) o instalación en Windows | vSphere API (REST/SOAP), PowerCLI |
| **Microsoft System Center VMM** | Hyper-V/Windows Server | Servicio Windows + SQL Server backend | System Center API, PowerShell DSC |
| **oVirt Engine** | KVM/RHEL | Aplicación Java EE + PostgreSQL + Apache | oVirt API (REST), Ansible modules |

```bash
# Ejemplo: consultar inventario de hosts mediante API de vCenter (REST)
# Requiere token de sesión obtenido previamente vía /api/session

curl -k -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "vmware-api-session-id: $TOKEN" \
  https://vcenter.local/api/vcenter/host

# Respuesta simplificada:
# [
#   {"host": "host-101", "name": "esxi-01.local", "connection_state": "CONNECTED"},
#   {"host": "host-102", "name": "esxi-02.local", "connection_state": "CONNECTED"}
# ]
```

```powershell
# Ejemplo: consultar clúster Hyper-V mediante System Center VMM (PowerShell)
# Requiere módulo VirtualMachineManager instalado

Get-SCVMHostCluster | Select-Object Name, HostCount, DynamicOptimizationEnabled

# Salida típica:
# Name                 HostCount DynamicOptimizationEnabled
# ----                 --------- --------------------------
# Cluster-Production   8         True
# Cluster-DR           4         False
```

> La gestión centralizada introduce un punto único de fallo operativo: si vCenter, VMM o oVirt Engine caen, las VMs continúan ejecutándose en sus hosts, pero se pierden capacidades de orquestación, migración automática y monitoreo unificado. Por esto, estas plataformas deben desplegarse en configuración de alta disponibilidad (nodos múltiples, bases de datos replicadas) y con backups frecuentes de su configuración.

## Migración en vivo: trasladar VMs entre hosts sin interrupción del servicio

La migración en vivo (live migration) es una de las capacidades más transformadoras de la virtualización gestionada: permite mover una máquina virtual en ejecución de un host físico a otro sin downtime perceptible para las aplicaciones. Esta funcionalidad es crítica para mantenimiento de hardware, balanceo de cargas y recuperación ante fallos planificados.

El mecanismo subyacente varía ligeramente entre plataformas, pero sigue un patrón común:

1.  **Pre-copia de memoria**: el hipervisor de origen copia iterativamente las páginas de memoria de la VM al destino mientras la VM sigue ejecutándose.
2.  **Iteraciones delta**: en cada ronda, solo se transfieren las páginas modificadas desde la iteración anterior.
3.  **Fase de convergencia**: cuando el conjunto de páginas "sucias" es suficientemente pequeño, se pausa brevemente la VM (milisegundos), se transfiere el estado final de CPU y registros, y se reanuda en el destino.
4.  **Redirección de red y almacenamiento**: las tablas de conmutación y las rutas de almacenamiento se actualizan para apuntar al nuevo host.

```text
Diagrama simplificado de vMotion (VMware):

[Host A]                          [Host B]
┌─────────────┐                  ┌─────────────┐
│ VM ejecutándose │                │             │
│             │                  │             │
│ Memoria: 0x1000 → 0xFFFF │    │ Memoria: (vacía) │
└──────┬──────┘                  └──────┬──────┘
       │                                │
       │ 1. Pre-copia iterativa de RAM │
       │──────────────────────────────▶│
       │                                │
       │ 2. Copia de estado CPU/registros │
       │──────────────────────────────▶│
       │                                │
       │ 3. Redirección de red (MAC move) │
       │◀──────────────────────────────│
       │                                │
[VM ahora ejecutándose en Host B sin interrupción]
```

```bash
# Ejemplo: migrar una VM en vivo mediante oVirt API (REST)
# Requiere autenticación y VM en estado "up"

curl -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "host": {
      "name": "kvm-node-02"
    },
    "allow_partial_migration": false
  }' \
  "https://ovirt-engine.local/ovirt-engine/api/vms/vm-123/migrate"
```

> La migración en vivo requiere almacenamiento compartido (NFS, iSCSI, vSAN) accesible por ambos hosts, o tecnologías de migración de almacenamiento simultáneo (Storage vMotion). Además, la red entre hosts debe tener ancho de banda suficiente y latencia baja (<10ms recomendado) para garantizar que la fase de convergencia complete antes de que la VM genere más páginas "sucias" de las que se pueden transferir.

## Balanceo de carga dinámico: DRS, Optimización Dinámica y políticas de colocación

El balanceo de carga automático evita la contención de recursos mediante el reubicación inteligente de VMs entre hosts del clúster. En lugar de asignar VMs estáticamente, el plano de control monitoriza métricas en tiempo real (uso de CPU, memoria, I/O) y aplica políticas para redistribuir cargas según objetivos definidos.

| Plataforma | Nombre de la función | Criterios de decisión | Acciones automáticas |
|-----------|---------------------|----------------------|---------------------|
| **VMware** | DRS (Distributed Resource Scheduler) | Uso de CPU/memoria, afinidad/anti-afinidad, reservas | vMotion automático o recomendado |
| **Hyper-V** | Dynamic Optimization + PRO Tips | Métricas de rendimiento, umbrales configurados | Live Migration automático |
| **oVirt** | Scheduling Policy + Load Balancing | CPU, memoria, afinidad, estado de host | Migración automática o manual |

```yaml
# Ejemplo conceptual: política de balanceo en formato YAML (oVirt)
scheduling_policy:
  name: "production-balanced"
  thresholds:
    cpu_high: 80%      # Trigger migración si host >80% CPU
    memory_high: 85%   # Trigger migración si host >85% memoria
    imbalance_threshold: 20%  # Migrar si diferencia entre hosts >20%
  rules:
    - type: "anti-affinity"
      description: "No ejecutar dos instancias de la misma app en el mismo host"
      scope: "cluster"
    - type: "power-saving"
      description: "Consolidar cargas en horas valle para apagar hosts no usados"
      schedule: "weekend 02:00-06:00"
```

```powershell
# Habilitar optimización dinámica en clúster Hyper-V (PowerShell)
$cluster = Get-SCVMHostCluster -Name "Cluster-Production"
Set-SCVMHostCluster -VMHostCluster $cluster `
  -DynamicOptimizationEnabled $true `
  -DynamicOptimizationIntervalMinutes 10 `
  -PowerOptimizationEnabled $true
```

> El balanceo automático puede generar "migraciones oscilantes" si los umbrales están mal configurados: una VM se mueve de Host A a B, lo que desbalancea B y provoca que otra VM regrese a A, creando un ciclo. Implementar histéresis (diferencia mínima para trigger) y ventanas de enfriamiento entre migraciones es esencial para estabilidad operativa.

## Alta disponibilidad: recuperación automática ante fallos de hardware

La alta disponibilidad (HA) garantiza que las cargas de trabajo se recuperen automáticamente tras un fallo físico inesperado (pérdida de host, fallo de red, corte de energía). A diferencia del balanceo de carga (que actúa ante contención), HA responde a eventos de fallo mediante detección, aislamiento y reinicio controlado.

Mecanismo típico de HA:
1.  **Heartbeat entre hosts**: cada nodo envía señales periódicas a través de una red de gestión dedicada.
2.  **Detección de fallo**: si un host deja de responder tras N intentos, se declara "down".
3.  **Elección de líder**: los hosts restantes eligen un coordinador (mediante algoritmos como Paxos o Raft) para evitar decisiones divididas.
4.  **Reinicio de VMs**: las VMs que se ejecutaban en el host caído se reinician en nodos sanos, respetando reservas de recursos y políticas de afinidad.

```text
Secuencia de recuperación HA:

[T0] Host-03 deja de enviar heartbeats
[T+30s] Clúster declara Host-03 como "failed"
[T+45s] Elección de líder completa entre Host-01, 02, 04
[T+60s] Inventario de VMs afectadas: vm-db-01, vm-app-03
[T+90s] Reinicio de vm-db-01 en Host-01 (tiene reserva de memoria)
[T+120s] Reinicio de vm-app-03 en Host-02
[T+180s] Notificación a sistema de monitoreo / webhook
```

```bash
# Configurar política HA en Proxmox VE (CLI)
# Habilitar HA para una VM específica
ha-manager add vm:101 --state started --max_restarts 3

# Ver estado del clúster HA
ha-manager status

# Salida típica:
# Quorum: OK
# Node: pve-01 (online)
# Node: pve-02 (online)
# Service: vm:101 (running on pve-01)
```

> HA no es backup ni replicación de datos: solo reinicia VMs en otro host. Si el fallo fue corrupción de disco o datos, la VM reiniciada heredará el mismo problema. Una estrategia robusta combina HA (para RTO bajo) con replicación asíncrona de almacenamiento y backups inmutables (para protección de datos).

## Réplica entre sitios: continuidad de negocio mediante sincronización geográfica

La réplica entre sitios extiende la resiliencia más allá del clúster local, copiando estados de VMs a un centro de datos remoto para recuperación ante desastres (DR) o distribución geográfica de cargas. A diferencia de la migración en vivo (que mueve una VM), la réplica mantiene una copia secundaria actualizada que puede activarse ante fallo del sitio primario.

Enfoques técnicos comunes:

| Método | Sincronía | RPO típico | Casos de uso |
|--------|-----------|------------|-------------|
| **Replicación a nivel de hipervisor** (vSphere Replication) | Asíncrona | 5 min - 15 min | DR empresarial, testing de failover |
| **Replicación a nivel de almacenamiento** (SAN replication) | Síncrona o asíncrona | <1s (síncrona) / minutos (asíncrona) | Bases de datos críticas, cumplimiento regulatorio |
| **Replicación a nivel de aplicación** (database native) | Variable | Depende de la app | Aplicaciones con lógica de réplica propia |

```yaml
# Ejemplo conceptual: política de réplica en vSphere Replication
replication_policy:
  source_site: "Madrid-DC"
  target_site: "Barcelona-DR"
  vms:
    - name: "vm-db-primary"
      rpo_minutes: 15
      recovery_point_objective: "15min"
      retention: "24h"  # Mantener snapshots de recuperación por 24h
      network_mapping:
        source: "VM Network Prod"
        target: "VM Network DR"
      failover_mode: "manual"  # Requiere aprobación humana para activar DR
```

> La réplica asíncrona introduce un RPO (Recovery Point Objective) no cero: en caso de fallo catastrófico del sitio primario, se perderán los datos generados desde la última réplica exitosa. Evaluar el RPO aceptable para cada carga de trabajo y ajustar la frecuencia de réplica en consecuencia. Para aplicaciones transaccionales críticas, considerar replicación síncrona a costa de mayor latencia de escritura.

## Quédate con...

- La **gestión centralizada** (vCenter, System Center, oVirt) es el plano de control que habilita funciones avanzadas de orquestación; sin ella, la virtualización se limita a hosts aislados sin capacidades de clúster.
- La **migración en vivo** (vMotion, Live Migration) traslada VMs entre hosts sin downtime mediante pre-copia iterativa de memoria y convergencia rápida; requiere almacenamiento compartido y red de baja latencia.
- El **balanceo de carga dinámico** (DRS, Dynamic Optimization) redistribuye VMs automáticamente según métricas de uso, pero requiere configuración cuidadosa de umbrales e histéresis para evitar migraciones oscilantes.
- La **alta disponibilidad (HA)** detecta fallos de host mediante heartbeats y reinicia VMs en nodos sanos; reduce RTO pero no protege contra corrupción de datos (no sustituye backups).
- La **réplica entre sitios** extiende la resiliencia geográficamente, con RPO variable según el método (hipervisor, almacenamiento o aplicación); la replicación asíncrona implica pérdida potencial de datos recientes.
- Todas estas funciones introducen dependencias operativas: el plano de control debe estar en HA, la red de gestión debe ser redundante, y las políticas deben documentarse y probarse regularmente mediante simulacros de failover.
- La automatización mediante APIs (PowerCLI, REST, Ansible) es esencial para gestionar estas capacidades a escala; la interfaz gráfica es útil para configuración inicial, pero no escala para operaciones repetitivas o entornos dinámicos.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/tipo1/ejemplos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/tipo1/ventajas" class="next">Siguiente</a>
</div>
