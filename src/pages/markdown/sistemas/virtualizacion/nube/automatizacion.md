---
title: "Automatización y escalado"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Automatización y escalado](#automatización-y-escalado)
  - [Plantillas de imagen (AMI): capturar estados conocidos para despliegue consistente y reproducible](#plantillas-de-imagen-ami-capturar-estados-conocidos-para-despliegue-consistente-y-reproducible)
    - [Arquitectura y componentes de una AMI](#arquitectura-y-componentes-de-una-ami)
    - [Automatización de creación de imágenes con Packer](#automatización-de-creación-de-imágenes-con-packer)
  - [Grupos de autoescalado: traducción de métricas en acciones de infraestructura dinámica](#grupos-de-autoescalado-traducción-de-métricas-en-acciones-de-infraestructura-dinámica)
    - [Arquitectura y componentes de un Auto Scaling Group](#arquitectura-y-componentes-de-un-auto-scaling-group)
    - [Métricas de escalado y selección de políticas apropiadas](#métricas-de-escalado-y-selección-de-políticas-apropiadas)
  - [Infraestructura como Código (IaC): versionado, reproducibilidad y gestión declarativa de entornos](#infraestructura-como-código-iac-versionado-reproducibilidad-y-gestión-declarativa-de-entornos)
    - [Terraform vs. CloudFormation: modelos declarativos comparados](#terraform-vs-cloudformation-modelos-declarativos-comparados)
    - [Mejores prácticas para IaC en producción](#mejores-prácticas-para-iac-en-producción)
  - [Quédate con...](#quédate-con)

</div>

# Automatización y escalado

La automatización y el escalado en entornos de nube representan la evolución natural de la virtualización: de máquinas estáticas gestionadas manualmente a flujos de trabajo declarativos donde la infraestructura se define como código, se despliega mediante pipelines automatizados y se adapta dinámicamente a la demanda sin intervención humana. Esta transformación no es simplemente una conveniencia operativa, sino un cambio arquitectónico fundamental que permite tratar la infraestructura como un activo efímero y reemplazable en lugar de como "mascotas" que se cuidan y parchean individualmente. Las plantillas de imagen (AMI, imágenes personalizadas) capturan estados conocidos y probados de sistemas operativos y aplicaciones; los grupos de autoescalado traducen métricas de rendimiento en acciones de aprovisionamiento o terminación de instancias; y la infraestructura como código (IaC) versiona, audita y reproduce entornos completos mediante declaraciones ejecutables. Comprender los mecanismos subyacentes de cada componente —desde el proceso de creación de imágenes golden hasta los algoritmos de decisión de escalado y los estados de Terraform— es esencial para diseñar arquitecturas cloud que equilibren agilidad, consistencia, costo y resiliencia, evitando las trampas comunes que emergen cuando se automatizan procesos mal diseñados o se implementa escalado sin métricas significativas.

## Plantillas de imagen (AMI): capturar estados conocidos para despliegue consistente y reproducible

Las Amazon Machine Images (AMI) y sus equivalentes en otros proveedores (Azure Managed Images, GCP Custom Images) son plantillas preconfiguradas que encapsulan un sistema operativo, aplicaciones, configuraciones y datos en un formato portable que puede utilizarse para lanzar múltiples instancias idénticas. Esta capacidad es fundamental para lograr consistencia entre entornos (desarrollo, staging, producción), reducir el tiempo de aprovisionamiento y establecer un punto de recuperación conocido ante fallos o compromisos de seguridad.

### Arquitectura y componentes de una AMI

```text
Estructura interna de una AMI en AWS:

┌─────────────────────────────────┐
│  AMI Metadata                  │
│  • ID de la imagen (ami-...)   │
│  • Región de almacenamiento    │
│  • Permisos (pública/privada)  │
│  • Tags para gestión           │
├─────────────────────────────────┐
│  Snapshot del volumen raíz     │
│  • Sistema operativo           │
│  • Aplicaciones instaladas     │
│  • Configuraciones             │
│  • Datos en el momento de      │
│    la creación de la imagen    │
├─────────────────────────────────┐
│  Snapshots de volúmenes        │
│  adicionales (opcional)        │
│  • Discos de datos             │
│  • Volúmenes de aplicación     │
├─────────────────────────────────┐
│  Block Device Mapping          │
│  • Define cómo se adjuntan     │
│    los volúmenes al lanzar     │
│  • Tipo de dispositivo (EBS,   │
│    instance store)             │
│  • Tamaño, tipo, IOPS          │
└─────────────────────────────────┘
```

```bash
# Crear una AMI desde una instancia existente en AWS
# 1. Preparar la instancia para imagen (sysprep, limpieza)
# Dentro de la instancia Linux:
sudo yum clean all
sudo apt-get clean  # Debian/Ubuntu
sudo rm -rf /tmp/* /var/tmp/*
sudo truncate -s 0 /etc/machine-id
sudo cloud-init clean --logs

# 2. Crear la imagen desde AWS CLI
aws ec2 create-image \
  --instance-id i-0123456789abcdef0 \
  --name "web-server-golden-$(date +%Y%m%d)" \
  --description "Golden image para servidores web con nginx" \
  --no-reboot  # ⚠️ Usar con precaución: puede causar inconsistencia si hay escrituras pendientes

# Salida: {"ImageId": "ami-0abcdef1234567890"}

# 3. Esperar a que la imagen esté disponible
aws ec2 wait image-available --image-ids ami-0abcdef1234567890

# 4. Verificar detalles de la AMI
aws ec2 describe-images \
  --image-ids ami-0abcdef1234567890 \
  --query 'Images[0].{Name:Name,State:State,CreationDate:CreationDate,BlockDevices:BlockDeviceMappings}'
```

```bash
# Registrar AMI desde un archivo de imagen externo (importar desde on-premises)
# 1. Subir imagen a S3
aws s3 cp /images/web-server.qcow2 s3://my-import-bucket/images/

# 2. Importar como snapshot
aws ec2 import-snapshot \
  --description "Importar desde on-premises" \
  --disk-container "Format=qcow2,UserBucket={S3Bucket=my-import-bucket,S3Key=images/web-server.qcow2}"

# 3. Una vez completado el snapshot, registrar como AMI
aws ec2 register-image \
  --name "imported-web-server" \
  --block-device-mappings "DeviceName=/dev/sda1,Ebs={SnapshotId=snap-0123456789abcdef0}" \
  --architecture x86_64 \
  --root-device-name /dev/sda1 \
  --virtualization-type hvm
```

```yaml
# Ciclo de vida de gestión de AMIs (mejores prácticas)
ami_lifecycle_management:
  creación:
    - "Automatizar con Packer o pipelines CI/CD"
    - "Incluir solo software necesario (principio de mínimo privilegio)"
    - "Documentar versión de SO, aplicaciones y configuraciones"
  
  mantenimiento:
    - "Recrear imágenes mensualmente con parches de seguridad"
    - "Eliminar imágenes antiguas (>90 días) para reducir costo de almacenamiento"
    - "Mantener al menos 2 versiones: current y previous (rollback)"
  
  distribución:
    - "Compartir AMIs entre cuentas mediante modify-image-attribute"
    - "Copiar AMIs entre regiones para DR y despliegue multi-región"
    - "Usar tags para identificar entorno, propietario y fecha de expiración"
  
  seguridad:
    - "Escanear imágenes con Inspector o herramientas de terceros"
    - "No incluir credenciales, claves SSH o secretos en la imagen"
    - "Cifrar snapshots subyacentes con KMS"
```

> La opción `--no-reboot` al crear AMIs acelera el proceso pero introduce riesgo de inconsistencia: si hay escrituras pendientes en caché o bases de datos en ejecución, la imagen puede capturar estado corrupto. Para cargas de producción, preferir el reboot automático (default) o detener servicios críticos manualmente antes de crear la imagen.

### Automatización de creación de imágenes con Packer

HashiCorp Packer es una herramienta de código abierto que automatiza la creación de imágenes golden mediante plantillas declarativas, integrándose con múltiples proveedores de nube y hipervisores.

```hcl
# Ejemplo: plantilla Packer para crear AMI de servidor web (AWS)
# file: web-server.json

{
  "builders": [
    {
      "type": "amazon-ebs",
      "region": "us-east-1",
      "source_ami": "ami-0abcdef1234567890",  # Ubuntu 22.04 base
      "instance_type": "t3.small",
      "ssh_username": "ubuntu",
      "ami_name": "web-server-golden-{{timestamp}}",
      "ami_description": "Golden image para servidores web con nginx y hardening",
      "tags": {
        "Name": "web-server-golden",
        "Environment": "production",
        "Version": "1.2.0",
        "Owner": "platform-team"
      }
    }
  ],
  "provisioners": [
    {
      "type": "shell",
      "inline": [
        "sudo apt update",
        "sudo apt install -y nginx python3-pip",
        "sudo systemctl enable nginx"
      ]
    },
    {
      "type": "ansible",
      "playbook_file": "./ansible/web-server.yml",
      "user": "ubuntu"
    },
    {
      "type": "shell",
      "inline": [
        "sudo cloud-init clean --logs",
        "sudo rm -rf /tmp/* /var/tmp/*",
        "history -c"
      ]
    }
  ]
}
```

```bash
# Ejecutar Packer para crear la AMI
packer init web-server.pkr.hcl  # Para formato HCL2
packer build web-server.json

# Salida típica:
# ==> amazon-ebs: Prevalidating any provided VPC information
# ==> amazon-ebs: Launching a source AWS instance...
# ==> amazon-ebs: Waiting for instance (i-0123456789abcdef0) to become ready...
# ==> amazon-ebs: Running provisioner: shell...
# ==> amazon-ebs: Running provisioner: ansible...
# ==> amazon-ebs: Creating the AMI: web-server-golden-1704067200
# ==> amazon-ebs: AMI: ami-0abcdef1234567890
# Build 'amazon-ebs' finished after 8 minutes 32 seconds.
```

> Packer permite crear imágenes idénticas para múltiples destinos (AWS, Azure, GCP, VMware, VirtualBox) desde una sola plantilla, facilitando estrategias híbridas y multi-cloud. Sin embargo, mantener múltiples imágenes sincronizadas requiere disciplina: versionar plantillas en Git, ejecutar builds en pipelines CI/CD y documentar cambios entre versiones.

## Grupos de autoescalado: traducción de métricas en acciones de infraestructura dinámica

Los Auto Scaling Groups (ASG) son mecanismos de orquestación que mantienen automáticamente un número deseado de instancias de cómputo, escalando horizontalmente hacia arriba o hacia abajo en respuesta a métricas de demanda, horarios programados o eventos personalizados. Esta capacidad transforma la infraestructura de un recurso estático en uno elástico que se adapta a patrones de carga variables sin intervención manual.

### Arquitectura y componentes de un Auto Scaling Group

```text
Componentes fundamentales de un ASG:

┌─────────────────────────────────┐
│  Launch Template / Configuration│
│  • Define qué se escala:        │
│   - AMI, tipo de instancia      │
│   - Disco, red, IAM role        │
│   - User data para bootstrap    │
├─────────────────────────────────┤
│  Desired/Min/Max Capacity      │
│  • Desired: número objetivo     │
│    de instancias               │
│  • Min: piso para disponibilidad│
│  • Max: techo para control de   │
│    costo                       │
├─────────────────────────────────┤
│  Scaling Policies              │
│  • Target Tracking: mantener    │
│    métrica en valor objetivo   │
│  • Step Scaling: escalar en     │
│    pasos según umbrales        │
│  • Scheduled: escalar por       │
│    horario predecible          │
├─────────────────────────────────┤
│  Health Checks                 │
│  • EC2 status: falla de        │
│    hardware subyacente         │
│  • ELB status: falla de        │
│    aplicación (HTTP 5xx)       │
│  • Reemplazo automático de     │
│    instancias no saludables    │
├─────────────────────────────────┤
│  Lifecycle Hooks               │
│  • Pausar en estados Pending/  │
│    Terminating para acciones   │
│    personalizadas              │
│  • Ej: registro en CMDB,       │
│    backup antes de terminar    │
└─────────────────────────────────┘
```

```hcl
# Ejemplo: Auto Scaling Group completo en Terraform (AWS)
resource "aws_launch_template" "web" {
  name_prefix   = "web-server-"
  image_id      = "ami-0abcdef1234567890"
  instance_type = "t3.medium"
  
  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.web.id]
    subnet_id                   = aws_subnet.private[0].id
  }
  
  iam_instance_profile {
    name = aws_iam_instance_profile.web.name
  }
  
  user_data = base64encode(<<-EOF
              #!/bin/bash
              yum update -y
              yum install -y nginx
              systemctl enable nginx
              systemctl start nginx
              echo "Hello from $(hostname)" > /usr/share/nginx/html/index.html
              EOF
  )
  
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name        = "web-server"
      Environment = "production"
    }
  }
}

resource "aws_autoscaling_group" "web" {
  name                = "web-asg"
  vpc_zone_identifier = aws_subnet.private[*].id
  target_group_arns   = [aws_lb_target_group.web.arn]
  health_check_type   = "ELB"  # Usa health check del load balancer, no solo EC2
  
  min_size         = 2
  max_size         = 10
  desired_capacity = 4
  
  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }
  
  # Reemplazo automático de instancias no saludables
  health_check_grace_period = 300  # Esperar 5 min antes de marcar como unhealthy
  
  # Tags propagadas a instancias
  tag {
    key                 = "Name"
    value               = "web-server"
    propagate_at_launch = true
  }
  
  # Lifecycle hook para acciones personalizadas antes de terminar
  initial_lifecycle_hook {
    name                 = "pre-terminate-backup"
    default_result       = "CONTINUE"
    heartbeat_timeout    = 300
    lifecycle_transition = "autoscaling:EC2_INSTANCE_TERMINATING"
    notification_target_arn = aws_sns_topic.asg-notifications.arn
  }
}

# Política de escalado: Target Tracking (mantener CPU en 50%)
resource "aws_autoscaling_policy" "web_cpu" {
  name                   = "web-cpu-target-tracking"
  autoscaling_group_name = aws_autoscaling_group.web.name
  policy_type            = "TargetTrackingScaling"
  
  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value       = 50.0  # Mantener CPU promedio en 50%
    scale_in_cooldown  = 300   # Esperar 5 min antes de escalar hacia abajo
    scale_out_cooldown = 60    # Escalar hacia arriba más rápido (1 min)
  }
}

# Política de escalado programado (horario pico conocido)
resource "aws_autoscaling_schedule" "business_hours" {
  scheduled_action_name  = "business-hours-scale-up"
  min_size              = 4
  max_size              = 10
  desired_capacity      = 6
  recurrence            = "0 8 * * MON-FRI"  # 8:00 AM lunes a viernes
  autoscaling_group_name = aws_autoscaling_group.web.name
  timezone              = "America/New_York"
}
```

```bash
# Verificar estado del Auto Scaling Group (AWS CLI)
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names web-asg \
  --query 'AutoScalingGroups[0].{
    Name:AutoScalingGroupName,
    DesiredCapacity:DesiredCapacity,
    MinSize:MinSize,
    MaxSize:MaxSize,
    Instances:Instances[*].{Id:InstanceId,State:LifecycleState,Health:HealthStatus}
  }'

# Salida típica:
# {
#   "Name": "web-asg",
#   "DesiredCapacity": 4,
#   "MinSize": 2,
#   "MaxSize": 10,
#   "Instances": [
#     {"Id": "i-0123456789abcdef0", "State": "InService", "Health": "Healthy"},
#     {"Id": "i-1123456789abcdef0", "State": "InService", "Health": "Healthy"},
#     {"Id": "i-2123456789abcdef0", "State": "InService", "Health": "Healthy"},
#     {"Id": "i-3123456789abcdef0", "State": "InService", "Health": "Healthy"}
#   ]
# }

# Simular escalado manual (para pruebas)
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name web-asg \
  --desired-capacity 6

# Verificar actividades de escalado en curso
aws autoscaling describe-scaling-activities \
  --auto-scaling-group-name web-asg \
  --query 'Activities[0:5].{Action:Description,Status:StatusCode,Cause:Cause}'
```

> El `health_check_grace_period` es crítico para evitar reemplazos prematuros: las aplicaciones pueden tardar varios minutos en iniciar completamente después del boot. Un valor demasiado bajo (ej: 60 segundos) puede causar ciclos de reemplazo infinito si el health check del load balancer falla durante el bootstrap.

### Métricas de escalado y selección de políticas apropiadas

```text
Comparativa de políticas de escalado:

| Política | Cuándo usar | Ventajas | Limitaciones |
|---------|------------|----------|-------------|
| **Target Tracking** | Cargas con métrica estable (CPU, memoria, requests) | Simple de configurar, ajuste automático del threshold | Menos control fino sobre pasos de escalado |
| **Step Scaling** | Cargas con picos impredecibles, necesidad de escalar agresivamente | Control preciso sobre cuántas instancias añadir según severidad | Requiere definir múltiples breakpoints manualmente |
| **Scheduled** | Patrones predecibles (horario laboral, eventos conocidos) | Costo optimizado, sin reactividad tardía | No responde a demanda inesperada |
| **Predictive Scaling** (AWS) | Patrones cíclicos con ML para predicción | Escala antes del pico, combina con reactive | Solo disponible en AWS, requiere historial de datos |
```

```yaml
# Guía de selección de métricas para escalado
scaling_metric_selection:
  cpu_utilization:
    adecuado_para:
      - "Servidores de aplicaciones stateless"
      - "Procesamiento batch CPU-intensive"
      - "Servidores web con carga variable"
    no_adecuado_para:
      - "Aplicaciones con espera de I/O dominante"
      - "Servidores con CPU bursting (créditos)"
      - "Cargas con latencia como métrica principal"
  
  request_count_per_target:
    adecuado_para:
      - "APIs detrás de Application Load Balancer"
      - "Microservicios con tráfico variable"
      - "Aplicaciones donde latencia correlaciona con requests"
    configuración:
      - "Métrica custom de ALB: RequestCountPerTarget"
      - "Target value típico: 1000-5000 requests/segundo por instancia"
  
  custom_metrics:
    adecuado_para:
      - "Colas de mensajes (SQS, RabbitMQ)"
      - "Latencia de aplicación (P95, P99)"
      - "Métricas de negocio (usuarios activos, transacciones)"
    implementación:
      - "Publicar métricas a CloudWatch vía SDK o agent"
      - "Crear alarma con umbral apropiado"
      - "Referenciar alarma en scaling policy"
```

```bash
# Escalado basado en métrica custom: cola de mensajes SQS
# 1. Crear alarma en CloudWatch
aws cloudwatch put-metric-alarm \
  --alarm-name "high-sqs-messages" \
  --metric-name ApproximateNumberOfMessagesVisible \
  --namespace AWS/SQS \
  --statistic Sum \
  --period 60 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --dimensions Name=QueueName,Value=my-processing-queue \
  --alarm-actions arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:abc123

# 2. Asociar política de escalado a la alarma
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name processing-asg \
  --policy-name "scale-on-sqs" \
  --policy-type StepScaling \
  --step-adjustments "MetricIntervalLowerBound=0,MetricIntervalUpperBound=100,ScalingAdjustment=2" \
  --step-adjustments "MetricIntervalLowerBound=100,ScalingAdjustment=5" \
  --metric-aggregation-type Average \
  --cooldown 180
```

> Las métricas custom requieren instrumentación de la aplicación: sin visibilidad de lo que realmente importa (latencia P99, tasa de error, longitud de cola), el escalado basado solo en CPU puede ser ineficiente. Invertir en observabilidad (CloudWatch, Prometheus, Datadog) antes de implementar políticas de escalado complejas.

## Infraestructura como Código (IaC): versionado, reproducibilidad y gestión declarativa de entornos

La Infraestructura como Código transforma la configuración de infraestructura de procedimientos manuales o scripts ad hoc en declaraciones versionables, testeables y reproducibles que pueden gestionarse con las mismas prácticas de ingeniería de software: control de versiones, code review, CI/CD y testing automatizado. Esta aproximación elimina la deriva de configuración entre entornos, documenta el estado deseado de forma ejecutable y habilita la recuperación rápida ante desastres mediante recreación completa de entornos desde código.

### Terraform vs. CloudFormation: modelos declarativos comparados

```text
Comparativa: Terraform vs. CloudFormation

| Característica | Terraform | CloudFormation |
|---------------|-----------|----------------|
| Lenguaje | HCL (HashiCorp Configuration Language) | JSON o YAML |
| Multi-cloud | Sí (AWS, Azure, GCP, Kubernetes, etc.) | Solo AWS |
| Estado | Archivo de estado local o remoto (S3, Terraform Cloud) | Gestionado por AWS |
| Planificación | `terraform plan` muestra cambios antes de aplicar | Changesets (menos intuitivo) |
| Módulos | Reutilización mediante módulos públicos/privados | StackSets, nested stacks |
| Comunidad | Ecosistema grande de providers y módulos | Limitado a AWS |
| Curva de aprendizaje | Moderada (HCL es específico) | Empinada (JSON/YAML verboso) |
| Vendor lock-in | Menor (múltiples providers) | Alto (solo AWS) |
```

```hcl
# Ejemplo: infraestructura web completa en Terraform (AWS)
# file: main.tf

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # Backend remoto para estado compartido y locking
  backend "s3" {
    bucket         = "terraform-state-prod"
    key            = "web-infra/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"  # Locking para operaciones concurrentes
  }
}

provider "aws" {
  region = "us-east-1"
  
  default_tags {
    tags = {
      Project     = "web-platform"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}

# Variables para parametrización por entorno
variable "environment" {
  type        = string
  description = "Entorno (dev, staging, prod)"
  default     = "production"
}

variable "instance_type" {
  type    = string
  default = "t3.medium"
}

locals {
  common_tags = {
    Environment = var.environment
    Project     = "web-platform"
    Owner       = "platform-team"
  }
  
  instance_type_map = {
    dev     = "t3.small"
    staging = "t3.medium"
    prod    = "t3.large"
  }
}

# VPC y red
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"
  
  name = "web-vpc-${var.environment}"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  single_nat_gateway = var.environment != "prod"  # Multi-NAT solo en prod
  
  tags = local.common_tags
}

# Security Group para instancias web
resource "aws_security_group" "web" {
  name        = "web-sg-${var.environment}"
  description = "Security group for web servers"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  ingress {
    description     = "HTTPS from ALB"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = local.common_tags
}

# Auto Scaling Group (referenciando configuración anterior)
resource "aws_autoscaling_group" "web" {
  # ... configuración de ASG ...
  vpc_zone_identifier = module.vpc.private_subnets
  
  tag {
    key                 = "Name"
    value               = "web-server-${var.environment}"
    propagate_at_launch = true
  }
}

# Outputs para consumo de otros módulos o equipos
output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "ID de la VPC creada"
}

output "alb_dns_name" {
  value       = aws_lb.web.dns_name
  description = "DNS del Application Load Balancer"
}
```

```bash
# Flujo de trabajo típico con Terraform
# 1. Inicializar directorio y descargar providers
terraform init

# 2. Validar sintaxis y configuración
terraform validate

# 3. Planificar cambios (revisar antes de aplicar)
terraform plan -out=tfplan

# 4. Revisar plan (crítico para production)
terraform show tfplan

# 5. Aplicar cambios
terraform apply tfplan

# 6. Verificar estado
terraform state list

# 7. Destruir infraestructura (cuando ya no se necesita)
terraform destroy
```

```yaml
# CloudFormation equivalente (YAML)
# file: web-infra.yaml

AWSTemplateFormatVersion: '2010-09-09'
Description: 'Infraestructura web completa'

Parameters:
  Environment:
    Type: String
    Default: production
    AllowedValues:
      - dev
      - staging
      - production
  
  InstanceType:
    Type: String
    Default: t3.medium

Resources:
  WebVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: !Sub web-vpc-${Environment}
  
  WebSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for web servers
      VpcId: !Ref WebVPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          SourceSecurityGroupId: !Ref ALBSecurityGroup
  
  WebAutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      VPCZoneIdentifier: !Ref PrivateSubnets
      MinSize: 2
      MaxSize: 10
      DesiredCapacity: 4
      LaunchTemplate:
        LaunchTemplateId: !Ref WebLaunchTemplate
        Version: !GetAtt WebLaunchTemplate.LatestVersionNumber
  
Outputs:
  VPCId:
    Description: ID de la VPC creada
    Value: !Ref WebVPC
    Export:
      Name: !Sub ${AWS::StackName}-VPCId
```

> El archivo de estado de Terraform (`terraform.tfstate`) es crítico: contiene el mapeo entre recursos declarados y recursos reales en la nube, incluyendo datos sensibles (contraseñas, claves). Nunca commitar el estado a Git; usar backend remoto con cifrado (S3 + KMS, Terraform Cloud) y habilitar locking (DynamoDB) para prevenir corrupción por operaciones concurrentes.

### Mejores prácticas para IaC en producción

```yaml
# Guía de mejores prácticas para Infraestructura como Código
iac_best_practices:
  version_control:
    - "Todo el código de infraestructura en Git"
    - "Branch protection y code review obligatorio"
    - "Tags semánticos para releases (v1.2.0)"
  
  state_management:
    - "Backend remoto para estado compartido"
    - "Locking habilitado para operaciones concurrentes"
    - "Nunca editar estado manualmente (terraform state rm solo si es necesario)"
  
  modularización:
    - "Extraer patrones repetibles en módulos reutilizables"
    - "Versionar módulos independientemente del código que los consume"
    - "Documentar inputs, outputs y ejemplos de uso"
  
  testing:
    - "terraform validate en CI para sintaxis"
    - "terraform plan como gate antes de merge"
    - "Testing de integración en entorno staging antes de production"
    - "Herramientas: Terratest, kitchen-terraform, checkov para security scanning"
  
  security:
    - "Nunca hardcodear secretos en código (usar Secrets Manager, SSM Parameter Store)"
    - "Escaneo de políticas con OPA, Sentinel o checkov"
    - "Principio de mínimo privilegio en IAM roles"
  
  drift_detection:
    - "Ejecutar terraform plan periódicamente para detectar cambios manuales"
    - "Alertar cuando hay drift entre estado y realidad"
    - "Política: todo cambio manual debe migrarse a código"
  
  rollback_strategy:
    - "Mantener versiones anteriores de módulos disponibles"
    - "Documentar procedimiento de rollback"
    - "Considerar blue-green para cambios de infraestructura críticos"
```

```bash
# Pipeline CI/CD ejemplo para Terraform (GitHub Actions)
# file: .github/workflows/terraform.yml

name: Terraform CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  terraform:
    runs-on: ubuntu-latest
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      TF_VAR_environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0
      
      - name: Terraform Init
        run: terraform init
      
      - name: Terraform Validate
        run: terraform validate
      
      - name: Terraform Plan
        run: terraform plan -out=tfplan
        if: github.event_name == 'pull_request'
      
      - name: Terraform Apply
        run: terraform apply -auto-approve tfplan
        if: github.ref == 'refs/heads/main'
```

> La automatización de IaC mediante CI/CD reduce errores humanos y establece un audit trail de quién cambió qué y cuándo. Sin embargo, el apply automático en production requiere gates adicionales: aprobación manual, ventanas de mantenimiento definidas y rollback automatizado en caso de fallo.

## Quédate con...

- Las **plantillas de imagen (AMI)** capturan estados conocidos de SO y aplicaciones; automatizar su creación con Packer garantiza consistencia, reduce tiempo de despliegue y establece puntos de recuperación ante incidentes.
- El **ciclo de vida de AMIs** requiere disciplina: recrear mensualmente con parches, eliminar imágenes antiguas (>90 días), mantener al menos 2 versiones (current y previous) para rollback, y nunca incluir secretos en la imagen.
- Los **Auto Scaling Groups** traducen métricas en acciones de infraestructura; configurar correctamente `min/max/desired capacity`, `health_check_grace_period` y políticas de escalado es crítico para equilibrio entre disponibilidad y costo.
- La **selección de métricas de escalado** debe alinearse con el perfil de carga: CPU para cargas compute-bound, request count para APIs, métricas custom (colas, latencia) para aplicaciones con patrones específicos.
- **Terraform** ofrece multi-cloud, estado gestionado y ecosistema de módulos; **CloudFormation** proporciona integración nativa AWS pero con vendor lock-in; seleccionar según estrategia de proveedor (single vs. multi-cloud).
- El **archivo de estado de Terraform** es crítico y sensible: usar backend remoto (S3 + KMS), habilitar locking (DynamoDB), nunca commitar a Git, y evitar edición manual excepto en casos excepcionales.
- Las **mejores prácticas de IaC** incluyen: version control con code review, modularización para reutilización, testing en CI (validate, plan), scanning de seguridad (checkov, OPA), y detección de drift periódico.
- La **automatización CI/CD para IaC** establece audit trail y reduce errores humanos, pero requiere gates adicionales para production: aprobación manual, ventanas de mantenimiento y rollback automatizado.
- El principio fundamental: **infraestructura efímera, código permanente**; las instancias pueden destruirse y recrearse, pero el código que las define debe versionarse, testearse y mantenerse como activo crítico del negocio.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/nube/caracteristicas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/nube/diferencias" class="next">Siguiente</a>
</div>
