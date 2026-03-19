---
title: "Diferencias clave vs. virtualización local"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Diferencias clave vs. virtualización local](#diferencias-clave-vs-virtualización-local)
  - [Pago por uso: transformación del modelo económico de CAPEX a OPEX variable](#pago-por-uso-transformación-del-modelo-económico-de-capex-a-opex-variable)
    - [Estructura de costos en nube vs. on-premises](#estructura-de-costos-en-nube-vs-on-premises)
    - [Costos ocultos y factores de sorpresa en facturación cloud](#costos-ocultos-y-factores-de-sorpresa-en-facturación-cloud)
  - [Elasticidad ilimitada (en teoría): escalado horizontal masivo con limitaciones prácticas](#elasticidad-ilimitada-en-teoría-escalado-horizontal-masivo-con-limitaciones-prácticas)
    - [Límites de servicio y gestión de quotas](#límites-de-servicio-y-gestión-de-quotas)
    - [Diseñar aplicaciones para elasticidad real](#diseñar-aplicaciones-para-elasticidad-real)
  - [Menor control sobre el hardware subyacente: trade-offs de abstracción y mitigaciones](#menor-control-sobre-el-hardware-subyacente-trade-offs-de-abstracción-y-mitigaciones)
    - [Limitaciones de control en entornos cloud](#limitaciones-de-control-en-entornos-cloud)
    - [Diagnóstico y troubleshooting con visibilidad limitada](#diagnóstico-y-troubleshooting-con-visibilidad-limitada)
  - [Quédate con...](#quédate-con)

</div>

# Diferencias clave vs. virtualización local

La migración de virtualización on-premises a nube pública no es simplemente un cambio de ubicación física de los servidores, sino una transformación fundamental del modelo económico, operativo y arquitectónico sobre el que se construye la infraestructura IT. Mientras la virtualización local convierte CAPEX (inversión inicial en hardware) en costos fijos depreciados a lo largo de años, la nube transforma esos costos en OPEX variable basado en consumo real, introduciendo una ecuación económica radicalmente diferente donde el costo marginal de una instancia adicional es cercano a cero pero se acumula continuamente mientras el recurso existe. Esta diferencia económica se refleja en capacidades operativas distintas: la elasticidad teóricamente ilimitada de la nube permite escalar de 10 a 10,000 instancias en minutos, pero requiere rediseñar aplicaciones para statelessness y tolerancia a fallos; el menor control sobre hardware subyacente elimina tareas de mantenimiento físico pero introduce dependencias de proveedor y limita opciones de optimización específica. Comprender estas diferencias en profundidad —más allá de la superficie de "pagas por lo que usas"— es esencial para evitar errores costosos como migrar arquitecturas monolíticas sin modificar, subestimar costos de transferencia de datos, o asumir que las mismas prácticas de virtualización local aplican sin adaptación en un entorno donde la infraestructura es efímera por diseño.

## Pago por uso: transformación del modelo económico de CAPEX a OPEX variable

El modelo de pago por uso representa el cambio más disruptivo entre virtualización local y nube: en lugar de adquirir hardware con vida útil de 3-5 años y depreciarlo contablemente, se consume capacidad de cómputo como un servicio utilitario con facturación por segundo, minuto u hora de uso real. Esta transformación tiene implicaciones profundas en planificación financiera, gobernanza de costos y diseño arquitectónico que van más allá de la simple conveniencia de no comprar servidores.

### Estructura de costos en nube vs. on-premises

```text
Comparativa de modelos económicos:

┌─────────────────────────────────┐
│  Virtualización Local          │
│  • CAPEX inicial alto          │
│    (servidores, storage, red)  │
│  • Depreciación 3-5 años       │
│  • Costos fijos independientes │
│    de utilización real         │
│  • OPEX: energía, refrigeración│
│    espacio, mantenimiento      │
│  • Capacidad planificada para  │
│    picos máximos (subutilizada)│
│  • Costo marginal de instancia │
│    adicional: ~$0 (ya pagado)  │
├─────────────────────────────────┤
│  Nube Pública                  │
│  • CAPEX inicial: ~$0          │
│  • OPEX variable por consumo   │
│  • Facturación por segundo/hora│
│  • Costos de transferencia de  │
│    datos (egress fees)         │
│  • Descuentos por compromiso   │
│    (Reserved Instances, Savings│
│    Plans)                      │
│  • Costo marginal de instancia │
│    adicional: $0.01-0.50/hora  │
└─────────────────────────────────┘
```

```bash
# Calcular costo estimado de instancia EC2 en AWS
# Instancia: t3.medium (2 vCPU, 4 GB RAM) en us-east-1

aws ec2 describe-instance-type-offerings \
  --location-type region \
  --filters "Name=instance-type,Values=t3.medium" \
  --query 'InstanceTypeOfferings[0]'

# Consultar precios mediante AWS Pricing API (o manualmente)
# t3.medium On-Demand Linux: ~$0.0416/hora (us-east-1)

# Costo mensual estimado (730 horas/mes):
# $0.0416 × 730 = $30.37/mes por instancia

# Comparativa con costo on-premises equivalente:
# Servidor físico: $10,000 (48 vCPU, 256 GB RAM, 3 años)
# Costo por vCPU-hora: $10,000 / (48 vCPU × 26,280 horas) = ~$0.008/hora
# Pero: solo si utilización 100% constante
# Con 30% utilización real: $0.008 / 0.30 = ~$0.027/hora

# Punto de equilibrio: nube más cara para cargas estables 24/7,
# más económica para cargas variables o temporales
```

```yaml
# Estrategias de optimización de costos en nube
cost_optimization_strategies:
  on_demand:
    uso: "Cargas impredecibles, desarrollo, pruebas"
    ventaja: "Máxima flexibilidad, sin compromiso"
    desventaja: "Precio más alto por hora"
  
  reserved_instances:
    uso: "Cargas estables predecibles (bases de datos, servicios core)"
    ventaja: "Descuento 30-75% vs. On-Demand"
    desventaja: "Compromiso 1-3 años, penalización por cambio"
    tipos:
      - "All Upfront: pago completo inicial, máximo descuento"
      - "Partial Upfront: parte inicial + mensual"
      - "No Upfront: sin pago inicial, descuento menor"
  
  savings_plans:
    uso: "Compromiso de gasto hourly ($/hora) en lugar de instancia específica"
    ventaja: "Flexibilidad para cambiar tipo/familia de instancia"
    desventaja: "Compromiso de gasto, no de capacidad específica"
  
  spot_instances:
    uso: "Cargas tolerantes a interrupción (batch, procesamiento, CI/CD)"
    ventaja: "Descuento 70-90% vs. On-Demand"
    desventaja: "Puede terminarse con 2 min de aviso si hay demanda"
    mitigación: "Usar ASG con mix de On-Demand + Spot, checkpointing"
```

```bash
# Implementar instancia Spot con ASG para optimización de costos
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name processing-asg \
  --mixed-instances-policy "InstancesDistribution={OnDemandBaseCapacity=2,OnDemandPercentageAboveBaseCapacity=20,SpotAllocationStrategy=capacity-optimized},LaunchTemplateOverrides=[{InstanceType=m5.large},{InstanceType=m5a.large},{InstanceType=m5d.large}]" \
  --min-size 2 \
  --max-size 20 \
  --desired-capacity 10

# Monitorear interrupciones de Spot
aws ec2 describe-spot-instance-requests \
  --filters "Name=state,Values=active" \
  --query 'SpotInstanceRequests[*].{Id:SpotInstanceRequestId,Type:Type,Status:Status}'
```

> El "cloud waste" es un riesgo significativo en modelo de pago por uso: recursos olvidados (instancias detenidas pero no terminadas, volúmenes EBS huérfanos, IPs elásticas no asociadas, snapshots antiguos) continúan facturando indefinidamente. Implementar gobernanza automatizada: tags obligatorios, alertas de presupuesto, scripts de limpieza semanal y políticas de terminación automática para recursos efímeros.

### Costos ocultos y factores de sorpresa en facturación cloud

```text
Costos frecuentemente subestimados en migraciones a nube:

┌─────────────────────────────────┐
│  Transferencia de datos (egress)│
│  • Salida a internet: $0.05-0.09│
│    por GB (varía por región)   │
│  • Entre regiones: $0.02-0.05  │
│    por GB                      │
│  • Entre AZs misma región:     │
│    $0.01 por GB                │
│  • Entrada a cloud: gratis     │
│  • Impacto: aplicaciones con   │
│    mucho tráfico de salida     │
│    pueden tener bills sorpresa │
├─────────────────────────────────┤
│  Almacenamiento de snapshots   │
│  • Acumulado incrementalmente  │
│  • No siempre visible en       │
│    consola principal           │
│  • Puede superar costo de      │
│    volúmenes activos           │
├─────────────────────────────────┤
│  IPs Elásticas no asociadas    │
│  • Cargo por IP reservada no   │
│    utilizada (~$3-4/mes c/u)   │
│  • Fácil de olvidar tras       │
│    terminación de instancias   │
├─────────────────────────────────┤
│  NAT Gateway                   │
│  • Costo por hora (~$0.045/h)  │
│  • + Costo por GB procesado    │
│    (~$0.045/GB)                │
│  • Puede ser significativo     │
│    para tráfico saliente alto  │
├─────────────────────────────────┤
│  API calls y servicios managed │
│  • Lambda: por invocación +    │
│    tiempo de ejecución         │
│  • DynamoDB: por RCU/WCU +     │
│    almacenamiento              │
│  • CloudWatch: por métricas,   │
│    logs, dashboards            │
└─────────────────────────────────┘
```

```bash
# Configurar alertas de presupuesto en AWS
aws budgets create-budget \
  --account-id 123456789012 \
  --budget '{
    "BudgetName": "Monthly-Production-Limit",
    "BudgetLimit": {"Amount": "5000", "Unit": "USD"},
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST",
    "CostFilters": {"TagKeyValue": ["user:Environment$production"]}
  }' \
  --notifications-with-subscribers '[
    {
      "Notification": {
        "NotificationType": "ACTUAL",
        "ComparisonOperator": "GREATER_THAN",
        "Threshold": 80,
        "ThresholdType": "PERCENTAGE"
      },
      "Subscriber": {"SubscriptionType": "EMAIL", "Address": "ops@company.com"}
    },
    {
      "Notification": {
        "NotificationType": "FORECASTED",
        "ComparisonOperator": "GREATER_THAN",
        "Threshold": 100,
        "ThresholdType": "PERCENTAGE"
      },
      "Subscriber": {"SubscriptionType": "EMAIL", "Address": "finance@company.com"}
    }
  ]'

# Identificar recursos sin tags (difícil de atribuir costos)
aws resourcegroupstaggingapi get-resources \
  --tag-filters "Key=Environment" \
  --query 'ResourceTagMappingList[?ResourceARN!=`null`].ResourceARN'
```

> Implementar tagging obligatorio mediante políticas IAM que denieguen creación de recursos sin tags específicos (Environment, CostCenter, Owner). Esto permite atribución precisa de costos por equipo/proyecto y facilita identificación de recursos huérfanos para limpieza.

## Elasticidad ilimitada (en teoría): escalado horizontal masivo con limitaciones prácticas

La promesa de elasticidad ilimitada es uno de los atractivos principales de la nube: la capacidad de escalar de 10 a 10,000 instancias en minutos para absorber picos de demanda impredecibles. Sin embargo, esta elasticidad no es realmente infinita: está sujeta a límites de servicio (quotas), disponibilidad de capacidad en regiones específicas, y requiere arquitecturas de aplicación diseñadas para escalado horizontal masivo. Comprender las limitaciones prácticas detrás de la promesa teórica es esencial para diseñar sistemas que realmente aprovechen la elasticidad cloud sin encontrarse con sorpresas durante eventos de alta demanda.

### Límites de servicio y gestión de quotas

```text
Límites típicos en proveedores de nube (AWS ejemplo):

┌─────────────────────────────────┐
│  Cómputo                       │
│  • Instancias EC2 por región:  │
│    20-1000 (depende de tipo)   │
│  • vCPUs totales: límite por   │
│    familia de instancias       │
│  • Auto Scaling Groups: 100    │
│    por región                  │
├─────────────────────────────────┤
│  Red                           │
│  • VPCs por región: 5 (default)│
│  • Security Groups por ENI: 5  │
│  • Reglas por Security Group:  │
│    60 inbound + 60 outbound    │
│  • Elastic IPs: 5 por región   │
│    (sin usar = cargo)          │
├─────────────────────────────────┤
│  Almacenamiento                │
│  • Volúmenes EBS por región:   │
│    50-5000                     │
│  • Snapshots: sin límite       │
│    explícito, pero costo       │
│  • S3 buckets: 100 por cuenta  │
├─────────────────────────────────┤
│  Balanceo de carga             │
│  • Load Balancers: 50 por      │
│    región (default)            │
│  • Target Groups: 3000 por     │
│    región                      │
│  • Listeners: 100 por LB       │
└─────────────────────────────────┘
```

```bash
# Verificar límites de servicio en AWS
aws service-quotas list-service-quotas \
  --service-code ec2 \
  --query 'Quotas[?QuotaName!=`null`].{QuotaName:QuotaName,Value:Value,Usage:UsageMetric}}' \
  --output table

# Solicitar aumento de límite
aws service-quotas request-service-quota-increase \
  --service-code ec2 \
  --quota-code L-1216C47A \  # Running On-Demand Standard instances
  --desired-value 500

# Verificar estado de solicitud
aws service-quotas list-requested-service-quota-change-history \
  --service-code ec2
```

```yaml
# Estrategias para manejar límites de elasticidad
elasticity_limit_strategies:
  planificación:
    - "Identificar límites críticos antes de eventos de alta demanda"
    - "Solicitar aumentos de quota con 2-4 semanas de anticipación"
    - "Documentar límites actuales y objetivos por región"
  
  arquitectura:
    - "Diseñar para multi-AZ desde el inicio (no como afterthought)"
    - "Considerar multi-región para cargas críticas (DR + capacidad)"
    - "Implementar circuit breakers para degradación elegante si se alcanzan límites"
  
  monitoreo:
    - "Alertas cuando uso de quota >70%"
    - "Dashboard de límites restantes por servicio crítico"
    - "Revisión trimestral de límites vs. proyección de crecimiento"
  
  mitigación:
    - "Usar múltiples tipos de instancia (no depender de uno solo)"
    - "Implementar colas de mensajes para absorber picos temporales"
    - "Considerar arquitectura serverless para componentes con picos extremos"
```

> Los límites de servicio varían por región: regiones más nuevas o pequeñas pueden tener capacidad física limitada. Para eventos planificados (Black Friday, lanzamientos de producto), contactar al proveedor de nube con anticipación para garantizar capacidad reservada en la región objetivo.

### Diseñar aplicaciones para elasticidad real

```text
Requisitos arquitectónicos para aprovechar elasticidad cloud:

┌─────────────────────────────────┐
│  Stateless por diseño          │
│  • Sesiones de usuario en      │
│    almacén externo (Redis,     │
│    DynamoDB), no en memoria    │
│    local de la instancia       │
│  • Configuración externalizada │
│    (Parameter Store, AppConfig)│
│  • Logs enviados a servicio    │
│    central (CloudWatch, S3)    │
├─────────────────────────────────┤
│  Bases de datos escalables     │
│  • Read replicas para cargas   │
│    de lectura                  │
│  • Sharding/partitioning para  │
│    escrituras                  │
│  • Considerar servicios managed│
│    (RDS, Aurora, DynamoDB)     │
│    con auto-scaling integrado  │
├─────────────────────────────────┤
│  Colas de mensajería           │
│  • Desacoplar componentes      │
│    mediante colas (SQS, Kafka) │
│  • Buffer para picos de carga  │
│  • Procesamiento asíncrono     │
│    cuando sea posible          │
├─────────────────────────────────┤
│  Health checks significativos  │
│  • No solo "¿el proceso corre?"│
│  • Verificar dependencias      │
│    (DB, cache, APIs externas)  │
│  • Timeouts apropiados para    │
│    evitar reemplazos prematuros│
└─────────────────────────────────┘
```

```hcl
# Ejemplo: arquitectura escalable con Terraform (AWS)
# Session storage externo (ElastiCache Redis)

resource "aws_elasticache_cluster" "session_store" {
  cluster_id           = "session-store"
  engine               = "redis"
  node_type            = "cache.r5.large"
  num_cache_nodes      = 3  # Cluster mode para alta disponibilidad
  parameter_group_name = "default.redis6.x"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.session.name
  security_group_ids   = [aws_security_group.cache.id]
}

# Auto Scaling Group con session statelessness
resource "aws_autoscaling_group" "web" {
  # ... configuración ASG ...
  
  # User data que configura sesión externa
  user_data = base64encode(<<-EOF
              #!/bin/bash
              yum install -y nginx php-fpm php-pecl-redis
              
              # Configurar PHP para usar Redis para sesiones
              cat > /etc/php.d/50-session.ini << EOL
              session.save_handler = redis
              session.save_path = "tcp://${aws_elasticache_cluster.session_store.cache_nodes[0].address}:6379"
              EOL
              
              systemctl enable nginx php-fpm
              systemctl start nginx php-fpm
              EOF
  )
}

# Queue para procesamiento asíncrono
resource "aws_sqs_queue" "processing_queue" {
  name                       = "processing-queue"
  delay_seconds             = 0
  max_message_size          = 262144
  message_retention_seconds = 345600  # 4 días
  receive_wait_time_seconds = 20      # Long polling
  visibility_timeout_seconds = 300    # 5 minutos para procesamiento
}

# ASG de workers que procesan cola
resource "aws_autoscaling_group" "workers" {
  # ... configuración ...
  
  # Política de escalado basada en cola
  # Ver sección anterior de Scaling Policies con métricas SQS
}
```

> La statelessness es el requisito más crítico y frecuentemente olvidado: aplicaciones que almacenan estado localmente (sesiones en memoria, archivos subidos localmente, configuraciones hardcodeadas) no pueden escalar horizontalmente sin complejidad adicional significativa. Externalizar todo estado antes de implementar auto-scaling.

## Menor control sobre el hardware subyacente: trade-offs de abstracción y mitigaciones

La abstracción total del hardware físico en la nube elimina tareas operativas de mantenimiento (actualizaciones de firmware, reemplazo de discos fallidos, gestión de BIOS) pero introduce limitaciones en optimización específica, diagnóstico de problemas de bajo nivel y cumplimiento de requisitos regulatorios que pueden requerir conocimiento de ubicación física exacta o características de hardware específicas.

### Limitaciones de control en entornos cloud

```text
Comparativa de control: on-premises vs. cloud

┌─────────────────────────────────┐
│  Virtualización Local          │
│  • Acceso físico a servidores  │
│  • Control total de BIOS/UEFI  │
│  • Selección específica de     │
│    modelo de CPU, RAM, disco   │
│  • Actualizaciones de firmware │
│    en ventana propia           │
│  • Diagnóstico con herramientas│
│    de hardware (IPMI, iDRAC)   │
│  • Aislamiento físico garantido│
├─────────────────────────────────┤
│  Nube Pública                  │
│  • Sin acceso físico           │
│  • BIOS/UEFI gestionado por    │
│    proveedor                   │
│  • Familia de instancia, no    │
│    modelo específico de CPU    │
│  • Actualizaciones de firmware │
│    transparentes (pueden       │
│    causar reinicios inesperados│
│    en casos excepcionales)     │
│  • Diagnóstico limitado a logs │
│    y métricas de alto nivel    │
│  • Aislamiento multi-tenant    │
│    (compartir hardware físico) │
└─────────────────────────────────┘
```

```bash
# Información limitada disponible sobre hardware subyacente en EC2
# Metadata service proporciona información básica

curl http://169.254.169.254/latest/meta-data/instance-type
# Salida: m5.large

curl http://169.254.169.254/latest/meta-data/placement/availability-zone
# Salida: us-east-1a

curl http://169.254.169.254/latest/meta-data/instance-id
# Salida: i-0123456789abcdef0

# Información de CPU (limitada)
curl http://169.254.169.254/latest/meta-data/instance-type-processor-info
# Salida: {"vcpuInfo": {"defaultVCpus": 2}, ...}

# Lo que NO puedes obtener:
# - Modelo exacto de CPU (varía dentro de misma familia)
# - Número de serie del servidor físico
# - Ubicación física exacta del datacenter
# - Historial de mantenimiento del hardware
```

```yaml
# Mitigaciones para limitaciones de control en cloud
hardware_control_mitigations:
  dedicación_de_hardware:
    opciones:
      - "Dedicated Instances: instancias en hardware dedicado (sin otros tenants)"
      - "Dedicated Hosts: servidor físico completo asignado a tu cuenta"
      - "Bare Metal Instances: sin hipervisor, acceso directo a hardware"
    casos_de_uso:
      - "Licenciamiento que requiere hardware dedicado (Oracle, Windows Server)"
      - "Compliance regulatorio que exige aislamiento físico"
      - "Aplicaciones sensibles a noisy neighbors"
    limitaciones:
      - "Costo significativamente mayor (30-50% premium)"
      - "Disponibilidad limitada en algunas regiones"
      - "Tiempo de aprovisionamiento más largo"
  
  confidential_computing:
    opciones:
      - "Cifrado de memoria en uso (AMD SEV-SNP, Intel TDX)"
      - "Enclaves confidenciales (Nitro Enclaves, Azure Confidential VMs)"
    casos_de_uso:
      - "Procesamiento de datos sensibles con requisitos de privacidad"
      - "Cargas multi-tenant donde el proveedor no debe acceder a datos"
      - "Compliance con regulaciones de soberanía de datos"
  
  placement_groups:
    opciones:
      - "Cluster: baja latencia entre instancias (HPC, bases de datos distribuidas)"
      - "Partition: aislamiento de fallos por partition (big data)"
      - "Spread: máximo aislamiento (instancias críticas en hardware diferente)"
    limitaciones:
      - "Capacity constraints más estrictos"
      - "Puede fallar lanzamiento si no hay capacidad en el group"
```

```bash
# Lanzar instancia en Dedicated Host (AWS)
# 1. Allocar Dedicated Host
aws ec2 allocate-hosts \
  --auto-placement "on" \
  --instance-type "m5.large" \
  --availability-zone "us-east-1a" \
  --quantity 1 \
  --tag-specifications 'ResourceType=dedicated-host,Tags=[{Key=Name,Value=dedicated-host-prod}]'

# 2. Lanzar instancia en el host dedicado
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type m5.large \
  --placement Tenancy=host,HostId=h-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0

# Verificar tenancy de instancia
aws ec2 describe-instances \
  --instance-ids i-0123456789abcdef0 \
  --query 'Reservations[0].Instances[0].Placement.Tenancy'
# Salida: "host"
```

> Dedicated Hosts permiten cumplir requisitos de licenciamiento que requieren conocimiento de sockets físicos o núcleos específicos (común en licencias Oracle, Windows Server con Software Assurance). Sin embargo, el costo premium y la complejidad operativa adicional deben justificarse mediante análisis de TCO comparado con alternativas.

### Diagnóstico y troubleshooting con visibilidad limitada

```text
Estrategias de diagnóstico en entornos cloud:

┌─────────────────────────────────┐
│  Métricas disponibles          │
│  • CloudWatch: CPU, red, disco,│
│    status checks               │
│  • Limitación: no hay métricas │
│    de hardware físico (temp,   │
│    voltaje, errores ECC)       │
├─────────────────────────────────┤
│  Logs accesibles               │
│  • System logs desde consola   │
│  • Application logs enviados   │
│    a servicio central          │
│  • Limitación: si la instancia │
│    no boot, acceso limitado    │
├─────────────────────────────────┤
│  Herramientas de diagnóstico   │
│  • EC2 Rescue for Linux:       │
│    diagnóstico y reparación    │
│    remoto sin SSH              │
│  • Serial Console: acceso a    │
│    consola serial para debug   │
│    de boot                     │
│  • Limitación: requiere        │
│    habilitación previa         │
├─────────────────────────────────┤
│  Escalamiento a proveedor      │
│  • Support tickets para        │
│    problemas de hardware       │
│    subyacente                  │
│  • SLA de respuesta según      │
│    nivel de soporte            │
│  • Limitación: información     │
│    compartida puede ser        │
│    limitada por multi-tenancy  │
└─────────────────────────────────┘
```

```bash
# Habilitar EC2 Serial Console para diagnóstico de boot
# 1. Habilitar a nivel de cuenta
aws ec2 enable-serial-console-access

# 2. Habilitar para instancia específica
aws ec2 modify-instance-attribute \
  --instance-id i-0123456789abcdef0 \
  --disable-api-termination \
  --attribute disableApiTermination \
  --value true

# 3. Acceder a consola serial (requiere IAM permissions)
aws ec2 get-serial-console-access-status \
  --instance-id i-0123456789abcdef0

# 4. Conectar a consola (sesión interactiva)
aws ec2 start-instance-serial-console-session \
  --instance-id i-0123456789abcdef0 \
  --serial-port 0
```

```yaml
# Checklist de troubleshooting en cloud
cloud_troubleshooting_checklist:
  nivel_instancia:
    - "Verificar status checks (system status, instance status)"
    - "Revisar system logs desde consola EC2"
    - "Conectar vía SSM Session Manager (si configurado)"
    - "Usar EC2 Rescue para diagnóstico automatizado"
  
  nivel_red:
    - "Verificar Security Groups y NACLs"
    - "Revisar route tables y estado de IGW/NAT"
    - "Usar VPC Flow Logs para diagnosticar tráfico"
    - "Probar conectividad con Reachability Analyzer"
  
  nivel_almacenamiento:
    - "Verificar estado de volúmenes EBS (attached, optimizing, impaired)"
    - "Revisar métricas de disco (BurstBalance, QueueLength)"
    - "Comprobar espacio disponible dentro de la instancia"
  
  escalamiento_proveedor:
    - "Recolectar información: instance ID, región, síntomas, timeline"
    - "Verificar health dashboard de la región"
    - "Crear caso de soporte con nivel de severidad apropiado"
    - "Documentar resolución para runbook futuro"
```

> SSM Session Manager es preferible sobre SSH para acceso a instancias: no requiere puertos abiertos en Security Groups, proporciona audit trail completo de sesiones en CloudTrail, y funciona incluso sin conectividad de red pública (solo ruta a SSM endpoint). Habilitar SSM desde el inicio de despliegue de instancias.

## Quédate con...

- El **modelo de pago por uso** transforma CAPEX fijo en OPEX variable: ventajoso para cargas impredecibles o temporales, pero requiere gobernanza estricta para evitar "cloud waste" de recursos olvidados que continúan facturando.
- Las **estrategias de optimización de costos** (Reserved Instances, Savings Plans, Spot Instances) pueden reducir factura 30-90%, pero cada una tiene trade-offs de flexibilidad y compromiso que deben alinearse con el perfil de carga.
- Los **costos ocultos** (egress fees, snapshots acumulados, NAT Gateway, IPs no asociadas) frecuentemente causan facturas sorpresa; implementar alertas de presupuesto y tagging obligatorio para atribución y limpieza.
- La **elasticidad ilimitada es teórica**: límites de servicio (quotas) existen y deben gestionarse proactivamente; solicitar aumentos con 2-4 semanas de anticipación antes de eventos de alta demanda.
- El **diseño stateless** es requisito fundamental para escalado horizontal real: externalizar sesiones, configuración y estado antes de implementar auto-scaling; sin esto, la elasticidad cloud no es aprovechable.
- El **menor control sobre hardware** elimina mantenimiento pero limita optimización específica y diagnóstico; usar Dedicated Hosts, Bare Metal o Confidential VMs cuando compliance o licenciamiento lo requieran.
- **SSM Session Manager** es preferible sobre SSH para acceso a instancias: sin puertos abiertos, audit trail completo en CloudTrail, y funciona sin conectividad pública.
- La **decisión cloud vs. on-premises** no es binaria: modelos híbridos (cloud + datacenter propio) pueden optimizar costos y control según el perfil de cada carga de trabajo; evaluar TCO completo incluyendo costos operativos ocultos.
- El principio fundamental: en la nube, **la infraestructura es efímera pero el costo es acumulativo**; diseñar para destrucción y recreación automática, con gobernanza que elimine recursos no utilizados automáticamente.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/nube/automatizacion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/nube/seguridad" class="next">Siguiente</a>
</div>
