---
title: "Características de las VMs en la nube"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Características de las VMs en la nube](#características-de-las-vms-en-la-nube)
  - [Tipos de instancias: especialización de recursos virtualizados para patrones de carga específicos](#tipos-de-instancias-especialización-de-recursos-virtualizados-para-patrones-de-carga-específicos)
    - [Familias de instancias y sus características técnicas](#familias-de-instancias-y-sus-características-técnicas)
    - [Instancias burstable y modelos de pricing diferenciados](#instancias-burstable-y-modelos-de-pricing-diferenciados)
  - [Almacenamiento efímero vs. persistente: ciclos de vida independientes y características de rendimiento](#almacenamiento-efímero-vs-persistente-ciclos-de-vida-independientes-y-características-de-rendimiento)
    - [Almacenamiento persistente (EBS, Azure Disk, Persistent Disk)](#almacenamiento-persistente-ebs-azure-disk-persistent-disk)
    - [Almacenamiento efímero (instance store, disco temporal)](#almacenamiento-efímero-instance-store-disco-temporal)
  - [Redes virtuales: aislamiento lógico, segmentación y seguridad distribuida](#redes-virtuales-aislamiento-lógico-segmentación-y-seguridad-distribuida)
    - [Arquitectura de VPC/VNet: componentes y flujo de tráfico](#arquitectura-de-vpcvnet-componentes-y-flujo-de-tráfico)
    - [Security Groups vs. Network ACLs: capas de defensa en profundidad](#security-groups-vs-network-acls-capas-de-defensa-en-profundidad)
    - [VPC Peering y conectividad híbrida](#vpc-peering-y-conectividad-híbrida)
  - [Quédate con...](#quédate-con)

</div>

# Características de las VMs en la nube

Las máquinas virtuales en entornos de nube pública no son simplemente instancias de hipervisores tradicionales alojadas en centros de datos remotos; representan una abstracción superior donde el cómputo, el almacenamiento y la red se exponen como servicios elásticos, programables y facturables bajo demanda. Esta transformación implica diferencias arquitectónicas fundamentales respecto a la virtualización on-premises: el almacenamiento se desacopla físicamente del cómputo permitiendo ciclos de vida independientes, la red se define mediante software con políticas de seguridad distribuidas, y los tipos de instancia se especializan mediante combinaciones predefinidas de recursos optimizados para patrones de carga específicos. Comprender estas características —desde la selección estratégica de tipos de instancia hasta la gestión de almacenamiento efímero versus persistente y la configuración de redes virtuales aisladas— es esencial para diseñar arquitecturas cloud que equilibren rendimiento, costo, resiliencia y seguridad. Esta sección desglosa los mecanismos subyacentes de cada característica, sus implicaciones operativas y las mejores prácticas para evitar errores comunes que emergen cuando se trasladan mentalidades de virtualización tradicional a un modelo de nube sin adaptar los diseños arquitectónicos.

## Tipos de instancias: especialización de recursos virtualizados para patrones de carga específicos

Los proveedores de nube ofrecen catálogos extensos de tipos de instancia, cada uno representando una combinación predefinida de vCPUs, memoria, capacidades de E/S y características de red optimizadas para casos de uso particulares. Esta especialización no es arbitraria: refleja decisiones arquitectónicas sobre topología de CPU, generación de hardware subyacente, capacidades de aceleración y modelos de pricing que impactan directamente el rendimiento y costo de las cargas de trabajo.

### Familias de instancias y sus características técnicas

```text
Clasificación de tipos de instancia por perfil de recursos:

┌─────────────────────────────────┐
│  General Purpose               │
│  • Ratio CPU:RAM ~1:4          │
│  • Casos de uso: servidores    │
│    web, microservicios, dev/test│
│  • Ejemplos: AWS t3/m5,        │
│    Azure D-series, GCP n2      │
├─────────────────────────────────┤
│  Compute Optimized             │
│  • Ratio CPU:RAM ~1:2          │
│  • Alta frecuencia de CPU      │
│  • Casos de uso: batch         │
│    processing, servidores de   │
│    aplicaciones, gaming        │
│  • Ejemplos: AWS c6i,          │
│    Azure F-series, GCP c2      │
├─────────────────────────────────┤
│  Memory Optimized              │
│  • Ratio CPU:RAM ~1:8 o mayor  │
│  • Gran capacidad de memoria   │
│  • Casos de uso: bases de      │
│    datos in-memory, análisis,  │
│    caché distribuido           │
│  • Ejemplos: AWS r6i,          │
│    Azure E-series, GCP m2      │
├─────────────────────────────────┤
│  Storage Optimized             │
│  • Discos locales NVMe de      │
│    alta IOPS y throughput      │
│  • Casos de uso: data          │
│    warehouses, procesamiento   │
│    de logs, bases de datos NoSQL│
│  • Ejemplos: AWS i4i,          │
│    Azure L-series, GCP n2-highio│
├─────────────────────────────────┤
│  Accelerated Computing         │
│  • GPUs (NVIDIA T4, A100),     │
│    FPGAs, chips de inferencia  │
│  • Casos de uso: ML/AI,        │
│    renderizado, HPC,           │
│    transcodificación           │
│  • Ejemplos: AWS p4/g5,        │
│    Azure NC/ND, GCP a2-ultragpu│
└─────────────────────────────────┘
```

```bash
# Consultar tipos de instancia disponibles en AWS con filtros específicos
aws ec2 describe-instance-types \
  --filters "Name=processor-info.supported-architecture,Values=x86_64" \
  --query "InstanceTypes[?MemoryInfo.SizeInMiB >= \`16384\`].{
    Type: InstanceType,
    VCpus: VcpuInfo.DefaultVCpus,
    Memory: MemoryInfo.SizeInMiB,
    Network: NetworkInfo.NetworkPerformance,
    EBSOptimized: EbsInfo.EbsOptimizedSupport
  }" \
  --output table

# Filtrar por características especializadas:
# Instancias con GPU:
aws ec2 describe-instance-types \
  --filters "Name=gpu-info.count,Values=1" \
  --query "InstanceTypes[].{Type:InstanceType,GPU:GpuInfo.Gpus[0].Name}"

# Instancias con Enhanced Networking (ENA/SR-IOV):
aws ec2 describe-instance-types \
  --filters "Name=network-info.efa-supported,Values=true" \
  --query "InstanceTypes[].{Type:InstanceType,MaxBandwidth:NetworkInfo.MaximumNetworkBandwidth}"
```

```yaml
# Selección estratégica de tipo de instancia (ejemplo Terraform con mapeo)
# Permite cambiar tipo de instancia por entorno sin modificar lógica

variable "environment" {
  type    = string
  default = "production"
}

locals {
  instance_type_map = {
    development = {
      aws   = "t3.small"
      azure = "Standard_B2s"
      gcp   = "e2-small"
    }
    staging = {
      aws   = "t3.medium"
      azure = "Standard_D2s_v3"
      gcp   = "n2-standard-2"
    }
    production = {
      aws   = "m5.xlarge"
      azure = "Standard_D4s_v3"
      gcp   = "n2-standard-4"
    }
  }
}

resource "aws_instance" "web" {
  instance_type = local.instance_type_map[var.environment]["aws"]
  # ... resto de configuración
}
```

```bash
# Right-sizing: analizar utilización real para ajustar tipo de instancia
# AWS CloudWatch métricas clave para evaluación

aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0 \
  --start-time $(date -d '7 days ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date +%Y-%m-%dT%H:%M:%S) \
  --period 3600 \
  --statistics Average Maximum \
  --output table

# Criterios de right-sizing:
# • CPU promedio <30% por 7 días → considerar downsize
# • CPU promedio >70% sostenido → considerar upsize
# • Memoria >80% constante → migrar a familia memory-optimized
```

> El right-sizing continuo es crítico en la nube: una instancia sobredimensionada genera costo innecesario acumulado por hora; una subdimensionada degrada la experiencia del usuario y puede causar timeouts o fallos en cascada. Implementar monitoreo automatizado con alertas de utilización y revisar periódicamente (mensual o trimestral) las recomendaciones de los proveedores (AWS Trusted Advisor, Azure Advisor, GCP Recommender).

### Instancias burstable y modelos de pricing diferenciados

Algunas familias de instancias, particularmente en el segmento de general purpose de entrada, utilizan un modelo de CPU burstable que permite picos de rendimiento por encima de la línea base asignada, acumulando "créditos de CPU" durante períodos de baja utilización.

```text
Mecanismo de CPU burstable (ej: AWS t3/t4g, Azure B-series):

┌─────────────────────────────────┐
│  Línea base de CPU             │
│  • t3.small: 20% de 2 vCPUs    │
│  • t3.medium: 20% de 2 vCPUs   │
│  • Crédito acumulado cuando    │
│    uso < línea base            │
├─────────────────────────────────┤
│  Burst capability              │
│  • Hasta 100% de CPU cuando    │
│    hay créditos disponibles    │
│  • 1 crédito = 1 vCPU a 100%   │
│    por 1 minuto                │
│  • Límite máximo de créditos   │
│    acumulables                 │
├─────────────────────────────────┤
│  Modos de operación            │
│  • Standard: burst con         │
│    créditos, sin cargo extra   │
│  • Unlimited: burst más allá   │
│    de créditos, con cargo extra│
│  • T3 Unlimited puede generar  │
│    costos sorpresa si no se    │
│    monitoriza                  │
└─────────────────────────────────┘
```

```bash
# Verificar estado de créditos de CPU en instancia burstable AWS
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUCreditBalance \
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0 \
  --start-time $(date -d '24 hours ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average Minimum Maximum \
  --output table

# CPUCreditUsage: créditos consumidos por período
# CPUCreditBalance: créditos disponibles restantes

# Alertar si balance < 10 créditos (riesgo de throttling)
aws cloudwatch put-metric-alarm \
  --alarm-name "Low-CPU-Credits-Warning" \
  --metric-name CPUCreditBalance \
  --namespace AWS/EC2 \
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0 \
  --statistic Average \
  --period 300 \
  --threshold 10 \
  --comparison-operator LessThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts
```

> Las instancias burstable son ideales para cargas con utilización variable (servidores de desarrollo, aplicaciones con picos intermitentes, entornos de prueba), pero peligrosas para cargas sostenidas de alta CPU: el agotamiento de créditos causa throttling inmediato, degradando el rendimiento a la línea base (ej: 20% de 2 vCPUs). Para cargas consistentes, preferir instancias de propósito general no burstable (m5, D-series, n2).

## Almacenamiento efímero vs. persistente: ciclos de vida independientes y características de rendimiento

Una de las diferencias arquitectónicas más significativas entre virtualización on-premises y nube es la separación física entre cómputo y almacenamiento: los discos virtuales no residen en el mismo servidor físico que la VM, permitiendo que persistan independientemente del ciclo de vida de la instancia. Esta separación habilita capacidades como migración en vivo, recuperación ante fallos y escalado independiente, pero introduce consideraciones de latencia, costo y gestión de datos que deben comprenderse para diseñar arquitecturas eficientes.

### Almacenamiento persistente (EBS, Azure Disk, Persistent Disk)

```text
Características del almacenamiento persistente en nube:

┌─────────────────────────────────┐
│  Ciclo de vida independiente   │
│  • El disco existe separadamente│
│    de la VM                    │
│  • Puede adjuntarse/desadjuntarse│
│  • Sobrevive a terminación de  │
│    instancia (configurable)    │
├─────────────────────────────────┤
│  Tipos de rendimiento          │
│  • HDD: bajo costo, throughput │
│    moderado (Azure Standard,   │
│    AWS st1/sc1)                │
│  • SSD general: balance costo/ │
│    rendimiento (gp3, Standard) │
│  • SSD provisionado: IOPS      │
│    garantizadas (io2, Premium) │
├─────────────────────────────────┤
│  Características avanzadas     │
│  • Snapshots automáticos       │
│  • Replicación dentro de       │
│    región (típicamente 3 copias)│
│  • Cifrado en reposo por       │
│    defecto                     │
│  • Multi-attach: algunos tipos │
│    permiten adjuntar a múltiples│
│    VMs simultáneamente         │
└─────────────────────────────────┘
```

```bash
# Crear y adjuntar volumen EBS en AWS
aws ec2 create-volume \
  --availability-zone us-east-1a \
  --volume-type gp3 \
  --size 100 \
  --iops 3000 \
  --throughput 125 \
  --encrypted \
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=web-data}]' \
  --query 'VolumeId' --output text

# Adjuntar volumen a instancia
aws ec2 attach-volume \
  --volume-id vol-0123456789abcdef0 \
  --instance-id i-0123456789abcdef0 \
  --device /dev/sdf

# Dentro de la VM Linux, inicializar el disco
lsblk  # Verificar que aparece como /dev/sdf
sudo fdisk /dev/sdf  # Crear partición
sudo mkfs.ext4 /dev/sdf1
sudo mkdir -p /data
sudo mount /dev/sdf1 /data

# Para montaje persistente, añadir a /etc/fstab
# Usar UUID en lugar de nombre de dispositivo
echo "$(blkid -s UUID -o value /dev/sdf1) /data ext4 defaults,nofail 0 2" | sudo tee -a /etc/fstab
```

```yaml
# Configuración de disco persistente en Terraform (AWS)
resource "aws_ebs_volume" "data" {
  availability_zone = "us-east-1a"
  size              = 100
  type              = "gp3"
  iops              = 3000
  throughput        = 125
  encrypted         = true
  
  tags = {
    Name = "web-data"
  }
}

resource "aws_volume_attachment" "data_attach" {
  device_name = "/dev/sdf"
  volume_id   = aws_ebs_volume.data.id
  instance_id = aws_instance.web.id
  
  # Skip destroy para preservar disco si instancia se elimina
  skip_destroy = true
}

# Configurar para que el disco NO se elimine con la instancia
resource "aws_instance" "web" {
  # ... configuración ...
  
  root_block_device {
    delete_on_termination = false  # Preservar disco raíz al terminar instancia
  }
}
```

```bash
# Crear snapshot para backup o replicación
aws ec2 create-snapshot \
  --volume-id vol-0123456789abcdef0 \
  --description "Backup pre-patch $(date +%Y-%m-%d)" \
  --tag-specifications 'ResourceType=snapshot,Tags=[{Key=Backup-Type,Value=Manual}]'

# Verificar progreso del snapshot
aws ec2 describe-snapshots \
  --snapshot-ids snap-0123456789abcdef0 \
  --query 'Snapshots[0].{Status:Status,Progress:Progress,StartTime:StartTime}'

# Restaurar desde snapshot a nuevo volumen
aws ec2 create-volume \
  --snapshot-id snap-0123456789abcdef0 \
  --availability-zone us-east-1a \
  --volume-type gp3
```

> Los snapshots en la nube son incrementales: el primero copia todos los bloques, los subsiguientes solo capturan cambios desde el snapshot anterior. Esto reduce tiempo y costo de almacenamiento, pero significa que eliminar el snapshot base puede invalidar toda la cadena. Implementar políticas de retención que preserven al menos un snapshot completo periódico.

### Almacenamiento efímero (instance store, disco temporal)

El almacenamiento efímero reside físicamente en el mismo servidor que la VM, ofreciendo latencia ultra-baja y alto throughput, pero con la limitación crítica de que los datos se pierden al detener, terminar o fallar la instancia.

```text
Comparativa: almacenamiento persistente vs. efímero

| Característica | Persistente (EBS/Disk) | Efímero (Instance Store) |
|---------------|----------------------|-------------------------|
| Ubicación física | Red SAN distribuida | Disco local en el host |
| Persistencia | Sobrevive a reinicios/paradas | Se pierde al stop/terminate |
| Latencia | 1-10 ms típico | <1 ms (acceso directo) |
| IOPS máximas | Hasta 260,000 (io2 Block Express) | Hasta 3,500,000 (i4i) |
| Throughput | Hasta 4,750 MB/s | Hasta 35,000 MB/s |
| Costo | $/GB-mes + IOPS provisionadas | Incluido en precio de instancia |
| Casos de uso | Datos persistentes, BD transaccionales | Caché, buffers, datos temporales |
| Replicación | Automática (típicamente 3 copias) | Sin replicación, riesgo de pérdida |
```

```bash
# Identificar discos efímeros en instancia AWS con instance store
lsblk

# Salida típica en instancia i4i (storage optimized):
# NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
# nvme0n1 259:0    0  100G  0 disk /        ← EBS raíz
# nvme1n1 259:1    0  1.9T  0 disk /mnt/i1  ← Instance store 1
# nvme2n1 259:2    0  1.9T  0 disk /mnt/i2  ← Instance store 2

# Configurar RAID 0 sobre múltiples discos efímeros para máximo rendimiento
sudo mdadm --create /dev/md0 --level=0 --raid-devices=2 /dev/nvme1n1 /dev/nvme2n1
sudo mkfs.ext4 /dev/md0
sudo mkdir -p /mnt/ephemeral
sudo mount /dev/md0 /mnt/ephemeral

# Importante: montar en /etc/fstab con opción _netdev o noauto
# Los discos efímeros no están disponibles inmediatamente al boot
echo "/dev/md0 /mnt/ephemeral ext4 defaults,noatime,nofail 0 0" | sudo tee -a /etc/fstab
```

```yaml
# Casos de uso apropiados para almacenamiento efímero:
ephemeral_storage_use_cases:
  adecuado_para:
    - "Caché de aplicaciones (Redis, Memcached) con persistencia opcional"
    - "Buffers de procesamiento de datos transitorios"
    - "Scratch space para ETL, renderizado, compilaciones"
    - "Bases de datos con replicación propia (Cassandra, Elasticsearch)"
  
  no_adecuado_para:
    - "Datos que deben sobrevivir a reinicios o fallos"
    - "Registros de auditoría o compliance"
    - "Bases de datos transaccionales sin replicación"
    - "Archivos de configuración críticos"

  mejores_practicas:
    - "Implementar replicación a nivel de aplicación"
    - "Configurar monitoreo de salud de discos locales"
    - "Planificar para pérdida súbita de datos"
    - "Usar Auto Scaling Groups para reemplazo automático de instancias"
```

> El almacenamiento efímero es ideal para arquitecturas stateless donde la aplicación maneja replicación y recuperación (ej: Cassandra replica datos entre nodos, Elasticsearch mantiene copias de shards). Para estas cargas, el rendimiento superior del instance store justifica la complejidad operativa de gestionar pérdida potencial de datos.

## Redes virtuales: aislamiento lógico, segmentación y seguridad distribuida

Las redes virtuales en la nube (VPC en AWS, VNet en Azure, VPC en GCP) representan una abstracción fundamental: permiten definir topologías de red completas —subredes, tablas de enrutamiento, gateways, firewalls— mediante software, sin dependencia de configuración física de switches o routers. Esta capacidad habilita aislamiento multi-tenant, segmentación por entorno o aplicación, y políticas de seguridad granulares aplicadas a nivel de interfaz de red virtual.

### Arquitectura de VPC/VNet: componentes y flujo de tráfico

```text
Componentes fundamentales de una red virtual en nube:

┌─────────────────────────────────┐
│  VPC / VNet                    │
│  • Contenedor lógico de red    │
│  • Aislamiento completo de     │
│    otras VPCs (a menos que se  │
│    configure peering)          │
│  • Rango CIDR privado definido │
│    (ej: 10.0.0.0/16)           │
├─────────────────────────────────┤
│  Subnets                       │
│  • Segmentos dentro de la VPC  │
│  • Típicamente por función     │
│    (public, private, database) │
│  • Cada subnet en una zona de  │
│    disponibilidad específica   │
├─────────────────────────────────┤
│  Internet Gateway (IGW)        │
│  • Puente entre VPC e internet │
│  • Requiere ruta explícita en  │
│    route table                 │
│  • No es un firewall           │
├─────────────────────────────────┤
│  NAT Gateway / Instance        │
│  • Permite tráfico saliente    │
│    desde subnets privadas      │
│  • Tráfico entrante bloqueado  │
│    por defecto                 │
│  • Costo por hora + GB         │
│    procesado                   │
├─────────────────────────────────┤
│  Security Groups               │
│  • Firewall stateful a nivel   │
│    de interfaz de red (NIC)    │
│  • Reglas de entrada/salida    │
│  • Referencias a otros SGs     │
│    posibles                    │
├─────────────────────────────────┤
│  Network ACLs                  │
│  • Firewall stateless a nivel  │
│    de subnet                   │
│  • Reglas numeradas, orden     │
│    importante                  │
│  • Capa adicional de defensa   │
└─────────────────────────────────┘
```

```bash
# Crear VPC y componentes de red en AWS mediante CLI
# 1. Crear VPC con rango CIDR
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=production-vpc}]' \
  --query 'Vpc.VpcId' --output text

# 2. Crear subnets públicas y privadas en diferentes AZs
aws ec2 create-subnet \
  --vpc-id vpc-0123456789abcdef0 \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-subnet-1a}]'

aws ec2 create-subnet \
  --vpc-id vpc-0123456789abcdef0 \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-subnet-1b}]'

# 3. Crear Internet Gateway y adjuntar a VPC
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=prod-igw}]'
aws ec2 attach-internet-gateway \
  --internet-gateway-id igw-0123456789abcdef0 \
  --vpc-id vpc-0123456789abcdef0

# 4. Crear route table para subnet pública
aws ec2 create-route-table \
  --vpc-id vpc-0123456789abcdef0 \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=public-rt}]'
aws ec2 create-route \
  --route-table-id rtb-0123456789abcdef0 \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id igw-0123456789abcdef0

# 5. Asociar route table con subnet pública
aws ec2 associate-route-table \
  --route-table-id rtb-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0
```

```yaml
# Definición de VPC completa en Terraform (AWS)
# Incluye subnets, route tables, NAT Gateway para patrón público/privado

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "production-vpc"
  }
}

# Subnets públicas (con ruta a Internet Gateway)
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "public-subnet-${count.index + 1}"
    Type = "Public"
  }
}

# Subnets privadas (sin ruta directa a internet)
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "private-subnet-${count.index + 1}"
    Type = "Private"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name = "prod-igw"
  }
}

# NAT Gateway para subnets privadas (tráfico saliente)
resource "aws_eip" "nat" {
  domain = "vpc"
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
  
  tags = {
    Name = "prod-nat-gw"
  }
}

# Route tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
}
```

### Security Groups vs. Network ACLs: capas de defensa en profundidad

```text
Comparativa: Security Groups vs. Network ACLs

| Característica | Security Groups | Network ACLs |
|---------------|----------------|-------------|
| Nivel de aplicación | Interfaz de red (NIC) | Subnet completa |
| Estado | Stateful (respuesta automática) | Stateless (reglas explícitas entrada/salida) |
| Reglas | Solo allow (todo lo demás deny) | Allow y Deny explícitos |
| Orden de evaluación | Todas las reglas aplican | Orden numérico, primera coincidencia gana |
| Referencias | Puede referenciar otros SGs | Solo CIDR blocks |
| Casos de uso | Firewall principal por instancia | Capa adicional, compliance, segmentación gruesa |
```

```bash
# Crear Security Group para servidor web (AWS)
aws ec2 create-security-group \
  --group-name web-sg \
  --description "Security group for web servers" \
  --vpc-id vpc-0123456789abcdef0

# Añadir reglas de entrada
aws ec2 authorize-security-group-ingress \
  --group-id sg-0123456789abcdef0 \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 \
  --tag-specifications 'ResourceType=security-group-rule,Tags=[{Key=Name,Value=HTTP}]'

aws ec2 authorize-security-group-ingress \
  --group-id sg-0123456789abcdef0 \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# SSH solo desde IP específica (mejor práctica: usar bastion o Systems Manager)
aws ec2 authorize-security-group-ingress \
  --group-id sg-0123456789abcdef0 \
  --protocol tcp \
  --port 22 \
  --cidr 203.0.113.0/24  # Reemplazar con IP corporativa

# Regla de salida: permitir todo por defecto (stateful devuelve respuesta)
aws ec2 authorize-security-group-egress \
  --group-id sg-0123456789abcdef0 \
  --protocol -1 \
  --cidr 0.0.0.0/0

# Referenciar otro Security Group (ej: permitir tráfico desde load balancer)
aws ec2 authorize-security-group-ingress \
  --group-id sg-0123456789abcdef0 \
  --protocol tcp \
  --port 8080 \
  --source-group sg-loadbalancer-123456
```

```yaml
# Network ACL para capa adicional de seguridad (Terraform AWS)
resource "aws_network_acl" "private" {
  vpc_id     = aws_vpc.main.id
  subnet_ids = [aws_subnet.private[0].id, aws_subnet.private[1].id]
  
  tags = {
    Name = "private-nacl"
  }
}

# Regla de entrada: permitir tráfico desde VPC
resource "aws_network_acl_rule" "private_inbound" {
  network_acl_id = aws_network_acl.private.id
  rule_number    = 100
  egress         = false
  protocol       = "-1"
  rule_action    = "allow"
  cidr_block     = "10.0.0.0/16"
}

# Regla de entrada: denegar todo lo demás (implícito, pero explícito para claridad)
resource "aws_network_acl_rule" "private_inbound_deny" {
  network_acl_id = aws_network_acl.private.id
  rule_number    = 32767
  egress         = false
  protocol       = "-1"
  rule_action    = "deny"
  cidr_block     = "0.0.0.0/0"
}

# Regla de salida: permitir tráfico saliente
resource "aws_network_acl_rule" "private_outbound" {
  network_acl_id = aws_network_acl.private.id
  rule_number    = 100
  egress         = true
  protocol       = "-1"
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
}
```

> Security Groups son la capa primaria de firewall en la nube: stateful, fáciles de gestionar y suficientes para la mayoría de casos de uso. Network ACLs proporcionan una capa adicional de defensa en profundidad, útil para compliance que requiere segmentación a nivel de subnet o para bloquear rangos de IP específicos antes de que lleguen a los Security Groups.

### VPC Peering y conectividad híbrida

```text
Opciones de conectividad entre redes virtuales:

┌─────────────────────────────────┐
│  VPC Peering                   │
│  • Conexión directa entre dos  │
│    VPCs (misma o diferente     │
│    cuenta/región)              │
│  • Tráfico por backbone de     │
│    proveedor, no pasa por      │
│    internet                    │
│  • No transitivo: si A↔B y     │
│    B↔C, A no puede llegar a C  │
│  • Sin ancho de banda limitado │
│  • Gratis (solo costo de       │
│    transferencia de datos)     │
├─────────────────────────────────┤
│  Transit Gateway               │
│  • Hub central para múltiples  │
│    VPCs y redes on-premises    │
│  • Enrutamiento transitivo     │
│    soportado                   │
│  • Tablas de enrutamiento      │
│    centralizadas               │
│  • Costo por hora + GB         │
│    procesado                   │
├─────────────────────────────────┤
│  VPN Site-to-Site              │
│  • Túnel IPSec sobre internet  │
│  • Conecta VPC con datacenter  │
│    on-premises                 │
│  • Ancho de banda limitado     │
│    (~1.25 Gbps por túnel)      │
│  • Redundancia requiere        │
│    múltiples túneles           │
├─────────────────────────────────┤
│  Direct Connect / ExpressRoute │
│  • Conexión física dedicada    │
│  • Ancho de banda garantizado  │
│    (1-100 Gbps)                │
│  • Latencia consistente        │
│  • Costo de puerto +           │
│    transferencia               │
└─────────────────────────────────┘
```

```bash
# Crear VPC Peering entre dos VPCs (AWS)
aws ec2 create-vpc-peering-connection \
  --vpc-id vpc-0123456789abcdef0 \
  --peer-vpc-id vpc-fedcba9876543210 \
  --tag-specifications 'ResourceType=vpc-peering-connection,Tags=[{Key=Name,Value=prod-to-dr}]'

# Aceptar peering (desde cuenta/región de la VPC destino)
aws ec2 accept-vpc-peering-connection \
  --vpc-peering-connection-id pcx-0123456789abcdef0

# Añadir rutas en ambas VPCs para permitir tráfico
aws ec2 create-route \
  --route-table-id rtb-0123456789abcdef0 \
  --destination-cidr-block 10.1.0.0/16 \
  --vpc-peering-connection-id pcx-0123456789abcdef0
```

> VPC Peering es ideal para conectividad simple entre pocas VPCs, pero no escala bien: una malla completa de N VPCs requiere N×(N-1)/2 conexiones peering. Para arquitecturas multi-cuenta o multi-región complejas, Transit Gateway (AWS), Virtual WAN (Azure) o Cloud Interconnect (GCP) proporcionan gestión centralizada y enrutamiento transitivo.

## Quédate con...

- Los **tipos de instancia** (general purpose, compute-optimized, memory-optimized, storage-optimized, accelerated) son combinaciones predefinidas de recursos; seleccionar correctamente requiere entender el perfil de carga (CPU-bound, memory-bound, I/O-bound) no solo especificaciones técnicas.
- Las **instancias burstable** (t3, B-series) son económicas para cargas variables pero peligrosas para CPU sostenida: el agotamiento de créditos causa throttling inmediato; monitorizar `CPUCreditBalance` y alertar antes de llegar a cero.
- El **almacenamiento persistente** (EBS, Azure Disk) tiene ciclo de vida independiente de la VM, permite snapshots y replicación, pero introduce latencia de red; configurar `delete_on_termination = false` para preservar datos críticos.
- El **almacenamiento efímero** (instance store) ofrece latencia ultra-baja y alto throughput pero se pierde al stop/terminate; ideal para caché, buffers y aplicaciones con replicación propia (Cassandra, Elasticsearch).
- Las **VPCs/VNets** proporcionan aislamiento lógico completo; diseñar con subnets por función (public, private, database) y zonas de disponibilidad múltiples para resiliencia.
- **Security Groups** (stateful, nivel NIC) son la capa primaria de firewall; **Network ACLs** (stateless, nivel subnet) proporcionan defensa en profundidad adicional para compliance o segmentación gruesa.
- **VPC Peering** no es transitivo: si A↔B y B↔C, A no alcanza C; usar Transit Gateway para arquitecturas hub-and-spoke con enrutamiento transitivo entre múltiples VPCs.
- El **right-sizing continuo** es crítico en la nube: revisar métricas de utilización periódicamente y ajustar tipos de instancia para equilibrar rendimiento y costo; aprovechar herramientas de recomendación (Trusted Advisor, Advisor, Recommender).
- La **separación cómputo/almacenamiento** en la nube habilita migración en vivo y recuperación ante fallos, pero requiere diseñar para latencia de red en operaciones de E/S; usar almacenamiento local efímero solo para datos que pueden perderse o están replicados a nivel de aplicación.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/nube/proveedores" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/nube/automatizacion" class="next">Siguiente</a>
</div>
