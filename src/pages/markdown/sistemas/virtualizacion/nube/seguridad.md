---
title: "Consideraciones de seguridad y costos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Consideraciones de seguridad y costos](#consideraciones-de-seguridad-y-costos)
  - [Aislamiento de redes y gestión de identidad: principios de mínimo privilegio aplicados a infraestructura virtualizada](#aislamiento-de-redes-y-gestión-de-identidad-principios-de-mínimo-privilegio-aplicados-a-infraestructura-virtualizada)
    - [Segmentación de red: defensa en profundidad mediante VPCs, subnets y firewalls distribuidos](#segmentación-de-red-defensa-en-profundidad-mediante-vpcs-subnets-y-firewalls-distribuidos)
    - [IAM Roles e Instance Profiles: reemplazo de credenciales estáticas por identidad temporal](#iam-roles-e-instance-profiles-reemplazo-de-credenciales-estáticas-por-identidad-temporal)
    - [SSM Session Manager: acceso seguro sin SSH ni puertos abiertos](#ssm-session-manager-acceso-seguro-sin-ssh-ni-puertos-abiertos)
  - [Evitar instancias "siempre encendidas": estrategias para eliminar costo de recursos infrautilizados](#evitar-instancias-siempre-encendidas-estrategias-para-eliminar-costo-de-recursos-infrautilizados)
    - [Identificación de recursos infrautilizados: métricas y umbrales de acción](#identificación-de-recursos-infrautilizados-métricas-y-umbrales-de-acción)
    - [Estrategias de automatización: scheduled start/stop y auto-scaling](#estrategias-de-automatización-scheduled-startstop-y-auto-scaling)
    - [Gobernanza de costos: tagging, alertas y políticas de limpieza automatizada](#gobernanza-de-costos-tagging-alertas-y-políticas-de-limpieza-automatizada)
  - [Quédate con...](#quédate-con)

</div>

# Consideraciones de seguridad y costos

La seguridad y la gestión de costos en entornos de nube virtualizada no son disciplinas independientes, sino dos caras de la misma moneda arquitectónica: decisiones de diseño que mejoran la postura de seguridad (aislamiento de red, principio de mínimo privilegio, rotación de credenciales) frecuentemente reducen la superficie de ataque y, como efecto secundario beneficioso, eliminan recursos innecesarios que generan costo. Por el contrario, prácticas que priorizan la conveniencia operativa sobre la disciplina arquitectónica —claves SSH estáticas compartidas entre equipos, instancias "siempre encendidas" por miedo a perder configuración, reglas de firewall permisivas para evitar troubleshooting— introducen simultáneamente vulnerabilidades de seguridad y deuda de costo acumulativa. Comprender esta interconexión es esencial para diseñar arquitecturas cloud donde la seguridad no sea un impuesto sobre la agilidad, sino un habilitador de operaciones eficientes y sostenibles. Esta sección desglosa mecanismos técnicos para aislar redes mediante segmentación lógica, reemplazar credenciales estáticas por roles temporales con rotación automática, y eliminar el costo oculto de recursos infrautilizados mediante estrategias de escalado dinámico y gobernanza automatizada.

## Aislamiento de redes y gestión de identidad: principios de mínimo privilegio aplicados a infraestructura virtualizada

La seguridad en virtualización cloud se construye sobre dos pilares fundamentales: aislamiento de red mediante segmentación lógica y gestión de identidad basada en roles temporales en lugar de credenciales estáticas. Estos mecanismos implementan el principio de mínimo privilegio a nivel de infraestructura, limitando tanto el impacto potencial de un compromiso como la superficie de ataque expuesta.

### Segmentación de red: defensa en profundidad mediante VPCs, subnets y firewalls distribuidos

```text
Arquitectura de aislamiento de red en nube:

┌─────────────────────────────────┐
│  VPC (Virtual Private Cloud)   │
│  • Aislamiento lógico completo │
│  • Rango CIDR privado definido │
│  • Sin enrutamiento por defecto│
│    entre VPCs                  │
├─────────────────────────────────┤
│  Subnets por función           │
│  • Public: recursos con IP     │
│    pública (ALB, bastion)      │
│  • Private: aplicaciones sin   │
│    exposición directa          │
│  • Isolated: bases de datos,   │
│    sin ruta a internet         │
│  • Cada subnet en AZ específica│
├─────────────────────────────────┤
│  Security Groups (stateful)    │
│  • Firewall a nivel de NIC     │
│  • Reglas de entrada/salida    │
│  • Referencias a otros SGs     │
│  • Solo reglas ALLOW (deny implícito)│
├─────────────────────────────────┤
│  Network ACLs (stateless)      │
│  • Firewall a nivel de subnet  │
│  • Reglas numeradas, orden     │
│    significativo               │
│  • ALLOW y DENY explícitos     │
│  • Capa adicional de defensa   │
└─────────────────────────────────┘
```

```hcl
# Ejemplo: Security Groups con principio de mínimo privilegio (Terraform AWS)
resource "aws_security_group" "web" {
  name        = "web-sg-production"
  description = "Security group for web tier"
  vpc_id      = aws_vpc.main.id
  
  # HTTP/HTTPS solo desde Application Load Balancer
  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]  # Referencia a otro SG, no CIDR
  }
  
  ingress {
    description     = "HTTPS from ALB"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  # SSH solo desde bastion host (no desde internet)
  ingress {
    description     = "SSH from bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }
  
  # Egress: solo lo necesario
  egress {
    description     = "HTTPS to internet for updates"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
  }
  
  egress {
    description     = "DNS queries"
    from_port       = 53
    to_port         = 53
    protocol        = "udp"
    cidr_blocks     = ["10.0.0.0/16"]  # Solo VPC local
  }
  
  tags = {
    Name        = "web-sg-production"
    Environment = "production"
  }
}

# Network ACL para capa adicional en subnet privada
resource "aws_network_acl" "private" {
  vpc_id     = aws_vpc.main.id
  subnet_ids = aws_subnet.private[*].id
  
  # Regla de entrada: permitir solo desde subnet pública
  ingress {
    rule_no    = 100
    protocol   = "tcp"
    rule_action = "allow"
    cidr_block = "10.0.101.0/24"  # Subnet pública
    from_port  = 1024
    to_port    = 65535
  }
  
  # Denegar todo lo demás (explícito para auditoría)
  ingress {
    rule_no    = 32767
    protocol   = "-1"
    rule_action = "deny"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }
  
  # Egress: permitir respuestas y salidas controladas
  egress {
    rule_no    = 100
    protocol   = "-1"
    rule_action = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }
  
  tags = {
    Name = "private-nacl"
  }
}
```

> Security Groups son stateful: una regla de entrada permite automáticamente la respuesta de salida sin regla explícita. Network ACLs son stateless: requieren reglas explícitas tanto para entrada como para salida. Usar Security Groups como firewall principal y NACLs como capa adicional para compliance o segmentación gruesa.

### IAM Roles e Instance Profiles: reemplazo de credenciales estáticas por identidad temporal

El uso de claves SSH estáticas, credenciales de API hardcodeadas o secretos almacenados en archivos de configuración representa uno de los vectores de ataque más comunes en entornos cloud. Las identidades temporales mediante IAM Roles eliminan este riesgo al proporcionar credenciales rotadas automáticamente, con alcance limitado y auditabilidad completa.

```text
Flujo de credenciales temporales con IAM Roles:

[Instancia EC2 se inicia]
    ↓
[Metadata service (169.254.169.254) expone role credentials]
    ↓
[SDK/Application solicita credenciales vía IMDSv2]
    ↓
[STS devuelve credenciales temporales (access key, secret key, token)]
    ↓
[Credenciales válidas por 1-6 horas, rotación automática]
    ↓
[Aplicación usa credenciales para llamadas AWS]
    ↓
[CloudTrail registra cada llamada con identidad del role]

# Ventajas sobre claves estáticas:
# • Sin almacenamiento de secretos en disco
# • Rotación automática sin intervención
# • Alcance limitado por políticas del role
# • Auditoría completa vía CloudTrail
# • Revocación inmediata desasociando el role
```

```hcl
# Ejemplo: IAM Role para instancia EC2 con políticas de mínimo privilegio (Terraform)
resource "aws_iam_role" "ec2_web_role" {
  name = "ec2-web-production-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

# Política adjunta: solo lo necesario para la aplicación
resource "aws_iam_role_policy" "ec2_web_policy" {
  name = "ec2-web-policy"
  role = aws_iam_role.ec2_web_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # Leer configuración desde Parameter Store
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:us-east-1:123456789012:parameter/web-app/*"
      },
      
      # Escribir logs en CloudWatch (solo log group específico)
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:us-east-1:123456789012:log-group:/web-app/production:*"
      },
      
      # Leer objetos de S3 para assets (solo bucket específico, solo lectura)
      {
        Effect = "Allow"
        Action = ["s3:GetObject"]
        Resource = "arn:aws:s3:::web-assets-production/*"
      },
      
      # Denegar explícitamente acciones peligrosas (defensa en profundidad)
      {
        Effect = "Deny"
        Action = [
          "iam:*",
          "organizations:*",
          "account:*"
        ]
        Resource = "*"
      }
    ]
  })
}

# Instance Profile para asociar role a EC2
resource "aws_iam_instance_profile" "ec2_web_profile" {
  name = "ec2-web-production-profile"
  role = aws_iam_role.ec2_web_role.id
}

# Asociar profile al Launch Template
resource "aws_launch_template" "web" {
  # ... configuración ...
  
  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_web_profile.name
  }
}
```

```bash
# Dentro de la instancia, usar SDK para obtener credenciales temporales
# Ejemplo Python con boto3 (no requiere configuración manual de credenciales)

import boto3

# El SDK automáticamente obtiene credenciales desde IMDSv2
s3 = boto3.client('s3')  # Usa el role asociado a la instancia

# Listar objetos del bucket permitido por política
response = s3.list_objects_v2(Bucket='web-assets-production', Prefix='images/')
print(f"Found {response['KeyCount']} objects")

# Intentar acción no permitida generará AccessDenied
try:
    s3.delete_object(Bucket='web-assets-production', Key='images/test.png')
except boto3.exceptions.S3AccessDeniedError:
    print("Acción denegada por política IAM - comportamiento esperado")
```

> IMDSv2 (Instance Metadata Service v2) requiere tokens de sesión para acceder a metadata, mitigando ataques SSRF que explotaban IMDSv1. Habilitar IMDSv2 obligatorio en todas las instancias: `--metadata-options "HttpTokens=required,HttpPutResponseHopLimit=1"` en launch templates.

### SSM Session Manager: acceso seguro sin SSH ni puertos abiertos

El acceso tradicional mediante SSH requiere puertos abiertos en Security Groups, gestión de claves SSH y exposición a ataques de fuerza bruta. AWS Systems Manager Session Manager proporciona acceso interactivo a instancias mediante el plano de control de AWS, sin necesidad de conectividad de red directa ni gestión de credenciales.

```bash
# Requisitos previos para Session Manager:
# 1. IAM role con política AmazonSSMManagedInstanceCore adjunto a la instancia
# 2. Conectividad de la instancia a SSM endpoints (público o VPC endpoints)
# 3. Usuario con permisos ssm:StartSession en IAM

# Conectar a instancia sin SSH
aws ssm start-session \
  --target i-0123456789abcdef0 \
  --region us-east-1

# Salida:
# Starting session with SessionId: session-abc123...
# sh-4.2$  # Prompt de shell dentro de la instancia

# Session Manager registra toda la actividad en CloudTrail
# Opcionalmente, enviar logs a CloudWatch Logs o S3 para auditoría
```

```hcl
# Configurar logging de sesiones en CloudWatch (Terraform)
resource "aws_ssm_document" "session_logging" {
  name          = "SessionManager-WithLogging"
  document_type = "Session"
  
  content = jsonencode({
    schemaVersion = "1.0"
    description   = "Document to hold regional settings for Session Manager"
    sessionType   = "Standard_Stream"
    inputs = {
      s3BucketName     = aws_s3_bucket.ssm-logs.id
      s3KeyPrefix      = "session-logs/"
      cloudWatchLogGroupName = "/aws/ssm/session-logs"
      cloudWatchEncryptionEnabled = true
      s3EncryptionEnabled = true
    }
  })
}

# Política IAM para permitir start-session con logging
resource "aws_iam_policy" "ssm_session_with_logging" {
  name = "SSM-Session-WithLogging"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:StartSession",
          "ssm:ResumeSession",
          "ssm:EndSession"
        ]
        Resource = "arn:aws:ec2:us-east-1:123456789012:instance/*"
        Condition = {
          Bool = {
            "ssm:SessionDocumentAccessCheck" = "true"
          }
        }
      },
      {
        Effect = "Allow"
        Action = ["ssm:DescribeSessions"]
        Resource = "*"
      }
    ]
  })
}
```

> Session Manager elimina la necesidad de bastion hosts, reduce la superficie de ataque al no exponer puertos SSH, y proporciona audit trail completo de todas las sesiones en CloudTrail. Para cumplimiento regulatorio, habilitar logging de comandos ejecutados y retención de logs según política de la organización.

## Evitar instancias "siempre encendidas": estrategias para eliminar costo de recursos infrautilizados

El costo más silencioso y frecuente en entornos cloud es el de recursos infrautilizados que permanecen ejecutándose "por si acaso": instancias de desarrollo encendidas las 24 horas, servidores de prueba olvidados tras un proyecto, o producción sobredimensionada por precaución. A diferencia del modelo on-premises donde el costo marginal de una instancia adicional es cercano a cero (ya se pagó el hardware), en la nube cada hora de ejecución genera costo acumulativo. Implementar estrategias para identificar, automatizar y eliminar recursos innecesarios es esencial para controlar gastos sin comprometer disponibilidad.

### Identificación de recursos infrautilizados: métricas y umbrales de acción

```text
Métricas clave para detectar instancias subutilizadas:

┌─────────────────────────────────┐
│  CPU Utilization               │
│  • Promedio <10% por 7 días    │
│  • Picos <30% incluso en hora  │
│    pico                        │
│  • Acción: downsize o programar│
│    apagado                     │
├─────────────────────────────────┤
│  Network I/O                   │
│  • Tráfico de entrada/salida   │
│    consistentemente bajo       │
│  • Sin picos correlacionados   │
│    con eventos de negocio      │
│  • Acción: investigar si es    │
│    carga legítima o recurso    │
│    olvidado                    │
├─────────────────────────────────┤
│  Disk I/O                      │
│  • Operaciones de lectura/     │
│    escritura mínimas          │
│  • Espacio utilizado <20% del  │
│    volumen asignado            │
│  • Acción: reducir tamaño de   │
│    disco o eliminar si es      │
│    volumen huérfano            │
├─────────────────────────────────┤
│  Estado de conexión            │
│  • Sin conexiones activas a    │
│    puertos de aplicación       │
│  • Health checks pasando pero  │
│    sin tráfico real            │
│  • Acción: verificar si es     │
│    instancia de standby o      │
│    recurso olvidado            │
└─────────────────────────────────┘
```

```bash
# Consultar métricas de utilización en AWS CloudWatch
# CPU promedio de última semana para instancia específica

aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0 \
  --start-time $(date -d '7 days ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date +%Y-%m-%dT%H:%M:%S) \
  --period 3600 \
  --statistics Average Maximum \
  --output table

# Salida: identificar instancias con CPU promedio <10%
# +--------------------------------------+
# |     Average     |     Maximum       |
# +--------------------------------------+
# |     3.2%        |     15.8%         |  ← Candidata para downsize/apagado
# +--------------------------------------+
```

```yaml
# AWS Trusted Advisor checks para optimización de costos
# (Disponible en consola o vía API para cuentas Business/Enterprise)

trusted_advisor_cost_checks:
  low_utilization_amazon_ec2_instances:
    criterio: "CPU <5% y network <7 MB en últimos 7 días"
    acción_recomendada: "Terminar o cambiar a tipo de instancia más pequeño"
    
  underutilized_amazon_ebs_volumes:
    criterio: "Volumen conectado pero sin actividad de E/S en 7 días"
    acción_recomendada: "Crear snapshot y eliminar volumen si no es crítico"
    
  idle_load_balancers:
    criterio: "ALB/NLB sin tráfico en últimos 7 días"
    acción_recomendada: "Eliminar si no está en uso activo"
    
  unassociated_elastic_ip_addresses:
    criterio: "IP elástica reservada pero no asociada a recurso"
    acción_recomendada: "Liberar IP para evitar cargo (~$3-4/mes c/u)"
```

### Estrategias de automatización: scheduled start/stop y auto-scaling

```bash
# Programar apagado automático de instancias de desarrollo fuera de horario laboral
# Usando AWS Instance Scheduler (solución de referencia) o Lambda personalizado

# Ejemplo: Lambda function para start/stop de instancias etiquetadas
# File: lambda_start_stop.py

import boto3
import os

ec2 = boto3.client('ec2')

def lambda_handler(event, context):
    # Filtrar instancias por tag: AutoStop=true y Environment=dev
    instances = ec2.describe_instances(
        Filters=[
            {'Name': 'tag:AutoStop', 'Values': ['true']},
            {'Name': 'tag:Environment', 'Values': ['dev', 'staging']},
            {'Name': 'instance-state-name', 'Values': ['running', 'stopped']}
        ]
    )
    
    action = event.get('action', 'stop')  # 'start' o 'stop'
    
    for reservation in instances['Reservations']:
        for instance in reservation['Instances']:
            instance_id = instance['InstanceId']
            current_state = instance['State']['Name']
            
            if action == 'stop' and current_state == 'running':
                ec2.stop_instances(InstanceIds=[instance_id])
                print(f"Stopped {instance_id}")
            elif action == 'start' and current_state == 'stopped':
                ec2.start_instances(InstanceIds=[instance_id])
                print(f"Started {instance_id}")
    
    return {'statusCode': 200, 'body': f'{action} completed'}
```

```hcl
# Configurar EventBridge rules para disparar Lambda en horario programado (Terraform)
resource "aws_cloudwatch_event_rule" "stop_dev_nightly" {
  name                = "stop-dev-instances-nightly"
  description         = "Detener instancias de desarrollo a las 8 PM"
  schedule_expression = "cron(0 20 * * MON-FRI)"  # 8 PM UTC, lunes a viernes
}

resource "aws_cloudwatch_event_rule" "start_dev_morning" {
  name                = "start-dev-instances-morning"
  description         = "Iniciar instancias de desarrollo a las 8 AM"
  schedule_expression = "cron(0 12 * * MON-FRI)"  # 8 AM UTC = 3 AM EST
}

resource "aws_cloudwatch_event_target" "stop_target" {
  rule      = aws_cloudwatch_event_rule.stop_dev_nightly.name
  target_id = "StopDevInstances"
  arn       = aws_lambda_instance_scheduler.arn
  input     = jsonencode({ "action": "stop" })
}

resource "aws_cloudwatch_event_target" "start_target" {
  rule      = aws_cloudwatch_event_rule.start_dev_morning.name
  target_id = "StartDevInstances"
  arn       = aws_lambda_instance_scheduler.arn
  input     = jsonencode({ "action": "start" })
}

# Tags requeridos en instancias para ser gestionadas
# AutoStop=true, Environment=dev
```

```yaml
# Auto Scaling para producción: escalar a cero cuando no hay demanda
# Útil para entornos de staging o aplicaciones con patrones predecibles

resource "aws_autoscaling_policy" "scale_to_zero" {
  name                   = "scale-to-zero-low-traffic"
  autoscaling_group_name = aws_autoscaling_group.staging.name
  policy_type            = "StepScaling"
  
  # Escalar a 0 si request count < 10 por 30 minutos
  step_adjustment {
    metric_interval_lower_bound = "-Infinity"
    metric_interval_upper_bound = "0"
    scaling_adjustment          = -10  # Reducir a mínimo (0 si min_size=0)
  }
  
  metric_aggregation_type = "Average"
  cooldown                = 300
}

# Configurar ASG para permitir min_size=0
resource "aws_autoscaling_group" "staging" {
  min_size         = 0  # Permitir escalar a cero
  max_size         = 5
  desired_capacity = 1
  
  # ... resto de configuración ...
}
```

> Escalar a cero (min_size=0) es poderoso para reducir costos, pero introduce cold start latency: la primera solicitud después de período de inactividad disparará escalado, causando demora de 2-5 minutos mientras se aprovisiona la instancia. Mitigar con: (1) mantener al menos 1 instancia para cargas críticas, (2) usar provisioned concurrency en Lambda para serverless, o (3) aceptar la latencia inicial para entornos no productivos.

### Gobernanza de costos: tagging, alertas y políticas de limpieza automatizada

```yaml
# Framework de gobernanza de costos en cloud
cost_governance_framework:
  tagging_obligatorio:
    politica_iam: "Denegar creación de recursos sin tags requeridos"
    tags_requeridos:
      - Environment: "dev/staging/prod"
      - CostCenter: "identificador de centro de costos"
      - Owner: "equipo o individuo responsable"
      - AutoDelete: "true/false para recursos efímeros"
    
    ejemplo_policy:
      Effect: Deny
      Action: "ec2:RunInstances"
      Resource: "arn:aws:ec2:*:*:instance/*"
      Condition:
        Null:
          aws:RequestTag/Environment: true
          aws:RequestTag/CostCenter: true
  
  alertas_de_presupuesto:
    configuracion:
      - "Alerta al 80% del presupuesto mensual asignado"
      - "Alerta forecasted si proyección >100%"
      - "Notificaciones a ops@ y finance@ por email/Slack"
    
    accion_automatica:
      - "Ejecutar script de identificación de recursos sin tag"
      - "Enviar reporte semanal de top 10 recursos por costo"
  
  limpieza_automatizada:
    criterios:
      - "Recursos con tag AutoDelete=true y edad >7 días"
      - "Snapshots con tag Backup-Type=Manual y edad >30 días"
      - "Volúmenes EBS no adjuntos por >24 horas"
      - "IPs elásticas no asociadas por >1 hora"
    
    implementacion:
      - "Lambda ejecutada diariamente vía EventBridge"
      - "Notificación previa 24h antes de eliminación"
      - "Dry-run mode para revisión antes de acción destructiva"
```

```bash
# Script de limpieza de recursos huérfanos (ejemplo: volúmenes EBS no adjuntos)
#!/bin/bash
# cleanup-orphaned-volumes.sh

DRY_RUN=${1:-true}  # Ejecutar con 'false' para acción real
RETENTION_HOURS=24

# Encontrar volúmenes disponibles por más de RETENTION_HOURS
orphaned=$(aws ec2 describe-volumes \
  --filters "Name=status,Values=available" \
  --query "Volumes[?((@.CreateTime < \`$(date -d "$RETENTION_HOURS hours ago" -Iseconds)\`) && contains(Attachments, `null`))].VolumeId" \
  --output text)

if [ -n "$orphaned" ]; then
  echo "Volúmenes huérfanos encontrados:"
  echo "$orphaned"
  
  if [ "$DRY_RUN" = "false" ]; then
    for vol in $orphaned; do
      echo "Eliminando volumen $vol..."
      aws ec2 delete-volume --volume-id "$vol"
    done
  else
    echo "DRY RUN: usar '$0 false' para eliminar realmente"
  fi
else
  echo "No se encontraron volúmenes huérfanos"
fi
```

> La limpieza automatizada requiere precaución: un volumen "huérfano" podría ser parte de un proceso de migración o backup en progreso. Implementar siempre modo dry-run por defecto, notificación previa a equipos responsables, y exclusión de recursos con tags de protección (DoNotDelete=true, BackupInProgress=true).

## Quédate con...

- El **aislamiento de red** mediante VPCs, subnets segmentadas y Security Groups implementa defensa en profundidad; usar referencias a Security Groups en lugar de CIDR abiertos para minimizar superficie de ataque.
- **IAM Roles con credenciales temporales** reemplazan claves SSH estáticas y secretos hardcodeados; habilitar IMDSv2 obligatorio para mitigar ataques SSRF al metadata service.
- **SSM Session Manager** proporciona acceso seguro a instancias sin puertos SSH abiertos, con audit trail completo en CloudTrail; preferir sobre SSH tradicional para cumplimiento y seguridad.
- La **identificación de recursos infrautilizados** requiere monitoreo proactivo de métricas (CPU <10%, network/disk I/O bajo); usar Trusted Advisor o consultas CloudWatch personalizadas para detectar candidatos de optimización.
- Las **estrategias de automatización** (scheduled start/stop, auto-scaling a cero) eliminan costo de recursos innecesarios; considerar cold start latency y mantener al menos 1 instancia para cargas críticas.
- El **tagging obligatorio** mediante políticas IAM es fundamental para atribución de costos y gobernanza; requerir tags como Environment, CostCenter y Owner en creación de recursos.
- Las **alertas de presupuesto** (80%, 100% forecasted) y limpieza automatizada con modo dry-run previenen "cloud waste"; notificar antes de acciones destructivas y respetar tags de protección.
- La **gobernanza de costos** no es un evento único, sino un proceso continuo: revisar recomendaciones de optimización mensualmente, ajustar políticas según patrones de uso y mantener documentación actualizada de criterios de limpieza.
- El principio fundamental: en la nube, **cada recurso encendido genera costo acumulativo**; diseñar para eficiencia desde el inicio, automatizar la eliminación de lo innecesario, y tratar la seguridad y el costo como objetivos complementarios, no contradictorios.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/nube/diferencias" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>