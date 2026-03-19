---
title: "La nube como evolución de la virtualización"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [La nube como evolución de la virtualización](#la-nube-como-evolución-de-la-virtualización)
  - [Infraestructura como Servicio (IaaS): máquinas virtuales bajo demanda como primitiva fundamental](#infraestructura-como-servicio-iaas-máquinas-virtuales-bajo-demanda-como-primitiva-fundamental)
    - [Tipos de instancias y especialización de recursos virtualizados](#tipos-de-instancias-y-especialización-de-recursos-virtualizados)
  - [Abstracción total del hardware físico: de la gestión de servidores a la orquestación de servicios](#abstracción-total-del-hardware-físico-de-la-gestión-de-servidores-a-la-orquestación-de-servicios)
    - [Capas de abstracción en arquitectura cloud](#capas-de-abstracción-en-arquitectura-cloud)
    - [Beneficios operativos de la abstracción total](#beneficios-operativos-de-la-abstracción-total)
    - [Limitaciones y trade-offs de la abstracción cloud](#limitaciones-y-trade-offs-de-la-abstracción-cloud)
  - [Quédate con...](#quédate-con)

</div>


# La nube como evolución de la virtualización

La computación en nube no representa una ruptura con la virtualización, sino su culminación lógica: la transformación de recursos virtualizados aislados en servicios elásticos, programables y consumibles bajo demanda mediante APIs estandarizadas. Mientras la virtualización tradicional desacopló el software del hardware dentro de los límites de un centro de datos físico, la nube extiende este principio de abstracción a escala global, convirtiendo la infraestructura en un recurso utilitario comparable a la electricidad o el agua: no se posee el generador, se consume energía pagando por lo utilizado. Esta evolución no es meramente comercial; implica cambios arquitectónicos profundos en cómo se gestionan la identidad, la red, el almacenamiento y la gobernanza de recursos distribuidos geográficamente. Comprender la nube como una capa de orquestación sobre virtualización —no como un reemplazo mágico— es esencial para diseñar arquitecturas híbridas coherentes, evitar vendor lock-in inadvertido y tomar decisiones fundamentadas sobre qué cargas de trabajo migrar, cuándo mantener infraestructura on-premises y cómo gestionar los trade-offs entre control, agilidad y costo en un mundo donde la infraestructura se define mediante código.

## Infraestructura como Servicio (IaaS): máquinas virtuales bajo demanda como primitiva fundamental

El modelo IaaS representa la oferta más básica de computación en nube: exponer máquinas virtuales como recursos elásticos que pueden aprovisionarse, configurarse y eliminarse mediante APIs o consolas web, con facturación basada en consumo real (por segundo, por hora). Detrás de esta simplicidad aparente se oculta una arquitectura distribuida compleja que orquesta hipervisores, almacenamiento compartido, redes definidas por software y sistemas de identidad para proporcionar la ilusión de un centro de datos infinito y siempre disponible.

```text
Arquitectura conceptual de una plataforma IaaS:

┌─────────────────────────────────┐
│  Plano de control (Control Plane)│
│  • API Gateway: autenticación, │
│    autorización, throttling     │
│  • Scheduler: decide dónde     │
│    colocar nuevas VMs           │
│  • Orchestrator: gestiona      │
│    ciclo de vida, dependencias  │
│  • Metadata service: configuración│
│    dinámica para guests         │
├─────────────────────────────────┤
│  Plano de datos (Data Plane)   │
│  • Hipervisores (KVM, Nitro,   │
│    Hyper-V) ejecutando VMs     │
│  • Almacenamiento distribuido  │
│    (EBS, Azure Disk, Ceph)     │
│  • Red definida por software   │
│    (VPC, NSX, Open vSwitch)    │
│  • Balanceadores, firewalls    │
│    virtuales como servicio      │
├─────────────────────────────────┤
│  Infraestructura física        │
│  • Servidores en racks         │
│  • Redes de alta velocidad     │
│  • Sistemas de energía/refrigeración│
│  • Zonas de disponibilidad     │
└─────────────────────────────────┘
```

```bash
# Ejemplo: aprovisionar una VM en AWS EC2 mediante AWS CLI
# 1. Seleccionar AMI (Amazon Machine Image) - plantilla preconfigurada
aws ec2 describe-images --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04*" \
  --query "Images[0].ImageId" --output text

# 2. Lanzar instancia con configuración específica
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.medium \
  --key-name my-key-pair \
  --security-group-ids sg-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=web-server-01}]' \
  --query 'Instances[0].InstanceId' --output text

# 3. La instancia arranca en ~30-90 segundos, accesible vía SSH
# 4. Facturación inicia al estado "running", se detiene al "terminated"
```

```yaml
# Ejemplo equivalente en Terraform (infraestructura como código)
# Aprovisionamiento declarativo, portable entre proveedores
resource "aws_instance" "web_server" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t3.medium"
  key_name      = "my-key-pair"
  
  vpc_security_group_ids = ["sg-0123456789abcdef0"]
  subnet_id              = "subnet-0123456789abcdef0"
  
  tags = {
    Name = "web-server-01"
    Environment = "production"
  }
  
  # Metadata para configuración dinámica (cloud-init)
  user_data = <<-EOF
              #!/bin/bash
              apt update && apt install -y nginx
              systemctl enable --now nginx
              EOF
}
```

> La abstracción IaaS no elimina la necesidad de comprender virtualización: las decisiones sobre tipo de instancia (CPU-optimized, memory-optimized), almacenamiento (EBS gp3 vs io2) y red (placement groups, enhanced networking) impactan directamente el rendimiento y costo. Una VM mal dimensionada en la nube puede ser tan ineficiente como on-premises, con el agravante de que el costo se acumula por hora de uso.

### Tipos de instancias y especialización de recursos virtualizados

Los proveedores de nube ofrecen catálogos extensos de tipos de instancia, cada uno optimizado para patrones de carga específicos mediante combinaciones predefinidas de vCPUs, memoria, almacenamiento y capacidades de red.

| Familia | Caso de uso ideal | Características técnicas | Ejemplos |
|---------|------------------|-------------------------|----------|
| **General Purpose** | Cargas equilibradas, servidores web, microservicios | Ratio CPU:RAM ~1:4, networking estándar | AWS t3/m5, Azure D-series, GCP n2-standard |
| **Compute Optimized** | Procesamiento batch, servidores de aplicaciones, gaming | Alta frecuencia de CPU, ratio ~1:2 | AWS c6i, Azure F-series, GCP c2-standard |
| **Memory Optimized** | Bases de datos in-memory, análisis en memoria, caché | RAM abundante, ratio ~1:8 o mayor | AWS r6i, Azure E-series, GCP m2-ultramem |
| **Storage Optimized** | Data warehouses, procesamiento de logs, bases de datos NoSQL | Discos locales NVMe de alta IOPS | AWS i4i, Azure L-series, GCP n2-highio |
| **Accelerated Computing** | ML/AI, renderizado, HPC, transcodificación | GPUs (NVIDIA T4, A100), FPGAs, Inferentia | AWS p4/g5, Azure NC/ND-series, GCP a2-ultragpu |

```bash
# Consultar tipos de instancia disponibles en AWS (CLI)
aws ec2 describe-instance-types \
  --filters "Name=processor-info.supported-architecture,Values=x86_64" \
  --query "InstanceTypes[?MemoryInfo.SizeInMiB >= `16384`].{Type:InstanceType,VCpus:VCpuInfo.DefaultVCpus,Memory:MemoryInfo.SizeInMiB,Network:NetworkInfo.NetworkPerformance}" \
  --output table

# Filtrar por características específicas:
# - GPU: --filters "Name=gpu-info.count,Values=1"
# - Enhanced networking: --filters "Name=network-info.efa-supported,Values=true"
# - Burstable CPU: --filters "Name=processor-info.sustained-clock-speed-in-ghz,Values=2.5"
```

```yaml
# Selección estratégica de tipo de instancia (ejemplo conceptual)
instance_selection_criteria:
  workload_profile:
    cpu_bound: "c6i.large"      # Alta frecuencia, pocas vCPUs
    memory_bound: "r6i.xlarge"  # Mucha RAM, CPU moderada
    io_bound: "i4i.large"       # NVMe local para baja latencia
    balanced: "m6i.large"       # Ratio equilibrado para uso general
  
  cost_optimization:
    use_spot: true              # Instancias spot para cargas tolerantes a interrupción (70-90% descuento)
    reserved_capacity: "1-year-all-upfront"  # Para cargas estables predecibles
    right_sizing: "monitor CloudWatch metrics for 2 weeks before resizing"
  
  performance_requirements:
    placement_group: "cluster"  # Para baja latencia entre instancias (HPC, bases de datos distribuidas)
    enhanced_networking: true   #ENA/SR-IOV para >10 Gbps y menor jitter
    ebs_optimized: true         # Canal dedicado para almacenamiento EBS
```

> El "right-sizing" continuo es crítico en la nube: una instancia sobredimensionada genera costo innecesario; una subdimensionada degrada la experiencia del usuario. Implementar monitoreo automatizado (CloudWatch, Azure Monitor, Stackdriver) con alertas de utilización y scripts de ajuste periódico (o usar Auto Scaling) para mantener el equilibrio entre rendimiento y costo.

## Abstracción total del hardware físico: de la gestión de servidores a la orquestación de servicios

La promesa fundamental de la nube es la abstracción completa del hardware subyacente: el consumidor de servicios IaaS no conoce ni gestiona los servidores físicos, los switches, los controladores de almacenamiento o los sistemas de refrigeración que ejecutan sus cargas de trabajo. Esta abstracción se logra mediante múltiples capas de software que transforman recursos físicos heterogéneos en servicios homogéneos y programables.

### Capas de abstracción en arquitectura cloud

```text
Pila de abstracción en IaaS:

┌─────────────────────────────────┐
│  Usuario / Aplicación          │
│  • Ve: VMs, discos, redes como APIs │
│  • Gestiona: configuración, escalado, │
│    políticas de seguridad       │
├─────────────────────────────────┤
│  Orquestación (Control Plane)  │
│  • Nova (OpenStack), EC2 Control │
│  • Traduce APIs a operaciones  │
│    de infraestructura           │
│  • Gestiona estado, colas,     │
│    reintentos, auditoría        │
├─────────────────────────────────┤
│  Virtualización (Data Plane)   │
│  • Hipervisores optimizados    │
│    (Nitro/KVM, Hyper-V)         │
│  • Aislamiento multi-tenant    │
│    mediante hardware dedicado  │
│  • Paravirtualización para     │
│    rendimiento cercano a nativo│
├─────────────────────────────────┤
│  Hardware físico abstraído     │
│  • Servidores commodity        │
│  • Redes definidas por software│
│  • Almacenamiento distribuido  │
│  • El usuario nunca interactúa │
│    directamente con esta capa  │
└─────────────────────────────────┘
```

```bash
# Ejemplo: la misma operación de creación de disco en tres niveles de abstracción

# Nivel físico (on-premises tradicional):
# 1. Conectar disco físico a RAID controller
# 2. Configurar LUN en SAN management console
# 3. Presentar LUN a host ESXi/KVM
# 4. Crear datastore y asignar a VM
# Tiempo: horas/días, requiere acceso físico o IPMI

# Nivel virtualización (vSphere/KVM):
# 1. Crear volumen en datastore compartido vía vCenter/libvirt
# 2. Adjuntar a VM existente
# Tiempo: minutos, requiere acceso a consola de gestión

# Nivel nube (AWS EBS):
aws ec2 create-volume \
  --availability-zone us-east-1a \
  --volume-type gp3 \
  --size 100 \
  --encrypted \
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=web-data}]'

aws ec2 attach-volume \
  --volume-id vol-0123456789abcdef0 \
  --instance-id i-0123456789abcdef0 \
  --device /dev/sdf

# Tiempo: ~30 segundos, completamente vía API, sin conocimiento del hardware subyacente
```

### Beneficios operativos de la abstracción total

```text
Impacto de la abstracción de hardware en operaciones IT:

┌─────────────────────────────────┐
│  Agilidad                      │
│  • Aprovisionamiento en minutos │
│    vs. semanas (compra/entrega)│
│  • Pruebas de arquitectura      │
│    sin compromiso de CAPEX     │
│  • Experimentación de bajo     │
│    riesgo con recursos efímeros│
├─────────────────────────────────┐
│  Elasticidad                   │
│  • Escalado horizontal automático│
│    basado en métricas en tiempo│
│    real (Auto Scaling Groups)  │
│  • Picos de carga absorbidos   │
│    sin sobreprovisionamiento   │
│    permanente                  │
│  • Reducción a cero cuando no  │
│    hay demanda (serverless)    │
├─────────────────────────────────┐
│  Resiliencia integrada         │
│  • Zonas de disponibilidad     │
│    (datacenters físicamente    │
│    separados) como primitiva   │
│  • Replicación asíncrona       │
│    entre regiones para DR      │
│  • Snapshots y AMIs como       │
│    mecanismos de recuperación  │
├─────────────────────────────────┐
│  Enfoque en valor de negocio   │
│  • Equipos de desarrollo       │
│    gestionan infraestructura   │
│    como código, no hardware    │
│  • Operaciones se centran en   │
│    políticas, no en tareas     │
│    manuales repetitivas        │
└─────────────────────────────────┘
```

```yaml
# Ejemplo: Auto Scaling Group en AWS (declarativo, basado en políticas)
resource "aws_autoscaling_group" "web_asg" {
  name                = "web-server-asg"
  vpc_zone_identifier = ["subnet-0123456789abcdef0", "subnet-fedcba9876543210"]
  target_group_arns   = [aws_lb_target_group.web.arn]
  health_check_type   = "ELB"
  
  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }
  
  # Políticas de escalado
  min_size             = 2
  max_size             = 20
  desired_capacity     = 4
  
  # Escalado basado en métricas de CloudWatch
  tag {
    key                 = "Name"
    value               = "web-server"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_policy" "scale_on_cpu" {
  name                   = "scale-on-high-cpu"
  autoscaling_group_name = aws_autoscaling_group.web_asg.name
  adjustment_type        = "ChangeInCapacity"
  scaling_adjustment     = 2
  cooldown               = 300
  policy_type            = "SimpleScaling"
  
  metric_aggregation_type = "Average"
  
  # Trigger: CPU > 70% por 5 minutos
  metric_alarm {
    alarm_name          = "high-cpu-utilization"
    comparison_operator = "GreaterThanThreshold"
    evaluation_periods  = "2"
    metric_name         = "CPUUtilization"
    namespace           = "AWS/EC2"
    period              = "120"
    statistic           = "Average"
    threshold           = "70"
  }
}
```

> La abstracción total no elimina la complejidad, la redistribuye: el usuario ya no gestiona hardware físico, pero debe dominar APIs, políticas de IAM, configuración de redes virtuales y estrategias de costo. La curva de aprendizaje se desplaza de habilidades de infraestructura tradicional a competencias de ingeniería de plataformas y automatización.

### Limitaciones y trade-offs de la abstracción cloud

```text
Consideraciones críticas al adoptar abstracción total:

┌─────────────────────────────────┐
│  Menor control sobre hardware  │
│  • No se puede seleccionar     │
│    modelo específico de CPU    │
│  • Actualizaciones de firmware │
│    gestionadas por proveedor   │
│  • Diagnóstico de fallos       │
│    físicos limitado a logs     │
│    de alto nivel               │
├─────────────────────────────────┤
│  Dependencia de conectividad   │
│  • Sin acceso a consola física │
│    ni IPMI directo             │
│  • Fallos de red pueden       │
│    aislar completamente la    │
│    capacidad de gestión       │
│  • Requiere estrategia de     │
│    acceso de emergencia       │
│    (bastion hosts, VPN)       │
├─────────────────────────────────┤
│  Modelo de costos variable     │
│  • Pago por uso puede         │
│    generar sorpresas si no    │
│    se monitoriza              │
│  • Costos de transferencia    │
│    de datos entre regiones    │
│    o hacia internet           │
│  • "Cloud waste": recursos    │
│    olvidados que siguen       │
│    facturando                 │
├─────────────────────────────────┤
│  Compliance y soberanía de    │
│  datos                        │
│  • Ubicación física de datos │
│    puede estar sujeta a      │
│    regulaciones específicas  │
│  • Certificaciones del       │
│    proveedor no siempre      │
│    transfieren al cliente    │
│  • Auditoría requiere        │
│    integración con APIs de   │
│    logging del proveedor     │
└─────────────────────────────────┘
```

```bash
# Estrategias para mitigar riesgos de abstracción cloud

# 1. Gobernanza de costos: alertas y presupuestos
aws budgets create-budget \
  --account-id 123456789012 \
  --budget '{"BudgetName":"Monthly-EC2-Limit","BudgetLimit":{"Amount":"1000","Unit":"USD"},"TimeUnit":"MONTHLY","BudgetType":"COST"}' \
  --notifications-with-subscribers '[{"Notification":{"NotificationType":"ACTUAL","ComparisonOperator":"GREATER_THAN","Threshold":80},"Subscriber":{"SubscriptionType":"EMAIL","Address":"ops@company.com"}}]'

# 2. Tagging obligatorio para atribución de costos
# Política IAM que requiere tags en creación de recursos
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Action": "ec2:RunInstances",
    "Resource": "arn:aws:ec2:*:*:instance/*",
    "Condition": {
      "Null": {
        "aws:RequestTag/Environment": "true",
        "aws:RequestTag/CostCenter": "true"
      }
    }
  }]
}

# 3. Backup y portabilidad: no asumir vendor lock-in
# Exportar configuraciones críticas como código (Terraform, CloudFormation)
# Mantener imágenes base en formatos portables (OVF/OVA) cuando sea posible
# Documentar dependencias de servicios managed específicos del proveedor
```

> La abstracción total es poderosa pero no universal: cargas de trabajo con requisitos de latencia ultra-baja, hardware especializado (GPUs específicas, FPGAs personalizados) o compliance estricto de ubicación de datos pueden requerir modelos híbridos (cloud + on-premises) o proveedores especializados. Evaluar cada caso de uso contra los trade-offs de control, costo y complejidad antes de migrar.

## Quédate con...

- La **nube es virtualización orquestada a escala**: IaaS expone VMs como servicios elásticos bajo demanda, pero la arquitectura subyacente sigue basándose en hipervisores, almacenamiento compartido y redes definidas por software.
- Los **tipos de instancia** (general purpose, compute-optimized, memory-optimized, etc.) son combinaciones predefinidas de recursos virtualizados; seleccionar correctamente requiere entender el perfil de carga de la aplicación, no solo especificaciones técnicas.
- La **abstracción total del hardware** habilita agilidad, elasticidad y resiliencia integrada, pero redistribuye la complejidad: de gestionar servidores físicos a dominar APIs, políticas de IAM y estrategias de costo.
- El **Auto Scaling** y la infraestructura como código (Terraform, CloudFormation) son habilitadores clave para aprovechar la elasticidad cloud; sin automatización, se pierde la ventaja operativa fundamental.
- La **gobernanza de costos** es crítica en modelo de pago por uso: implementar tagging obligatorio, alertas de presupuesto y procesos de limpieza de recursos efímeros para evitar "cloud waste".
- La **portabilidad entre proveedores** no es automática: APIs, servicios managed y modelos de seguridad difieren; diseñar con abstracciones portables (Terraform, contenedores) cuando la flexibilidad futura sea prioritaria.
- La **abstracción total tiene límites**: cargas con requisitos de hardware especializado, latencia ultra-baja o compliance estricto pueden requerir modelos híbridos; evaluar trade-offs de control vs. agilidad para cada caso de uso.
- La **curva de aprendizaje se desplaza**: de habilidades de infraestructura tradicional (RAID, firmware, cableado) a competencias de ingeniería de plataformas (APIs, automatización, observabilidad distribuida).

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/nube/proveedores" class="next">Siguiente</a>
</div>