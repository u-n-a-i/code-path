---
title: "Serverless y funciones (FaaS)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Serverless y funciones (FaaS)](#serverless-y-funciones-faas)
  - [Arquitectura de abstracción: de la gestión de infraestructura a la ejecución de lógica](#arquitectura-de-abstracción-de-la-gestión-de-infraestructura-a-la-ejecución-de-lógica)
  - [Modelo de ejecución FaaS: funciones efímeras, escalado a cero y facturación por invocación](#modelo-de-ejecución-faas-funciones-efímeras-escalado-a-cero-y-facturación-por-invocación)
  - [Cold starts: latencia de inicialización y estrategias de mitigación](#cold-starts-latencia-de-inicialización-y-estrategias-de-mitigación)
  - [Límites y restricciones: timeouts, memoria y acoplamiento al proveedor](#límites-y-restricciones-timeouts-memoria-y-acoplamiento-al-proveedor)
  - [Casos de uso ideales: cuándo elegir FaaS, cuándo evitarlo](#casos-de-uso-ideales-cuándo-elegir-faas-cuándo-evitarlo)
  - [Quédate con...](#quédate-con)

</div>

# Serverless y funciones (FaaS)

Serverless y las Funciones como Servicio (FaaS) representan el nivel más alto de abstracción en el espectro de la computación en nube: mientras la virtualización tradicional requiere gestionar sistemas operativos completos y los contenedores exigen orquestación de runtimes, FaaS permite ejecutar código sin ninguna preocupación por la infraestructura subyacente —ni servidores, ni VMs, ni contenedores, ni siquiera procesos persistentes. Esta abstracción radical transforma el modelo operativo de "gestionar capacidad" a "ejecutar lógica": el desarrollador proporciona código, el proveedor de nube gestiona el aprovisionamiento, escalado, parcheo y disponibilidad de la infraestructura que lo ejecuta. Sin embargo, esta conveniencia operativa introduce trade-offs arquitectónicos significativos: latencia de arranque en frío, límites estrictos de tiempo de ejecución y memoria, acoplamiento a APIs del proveedor, y un modelo de costos que puede volverse impredecible para cargas sostenidas. Comprender los mecanismos subyacentes de FaaS —desde el modelo de ejecución efímera hasta las estrategias de mitigación de cold starts y las implicaciones de vendor lock-in— es esencial para seleccionar casos de uso donde serverless proporciona ventajas reales sobre arquitecturas basadas en contenedores o VMs, evitando errores costosos como migrar aplicaciones stateful de larga ejecución a un modelo diseñado para funciones efímeras y stateless.

## Arquitectura de abstracción: de la gestión de infraestructura a la ejecución de lógica

Serverless no significa "sin servidores" —los servidores físicos existen y ejecutan el código— sino "sin gestión de servidores" por parte del desarrollador. FaaS lleva este principio al extremo: en lugar de desplegar aplicaciones en instancias persistentes, se despliegan funciones que se ejecutan solo cuando son invocadas, escalan automáticamente a cero cuando no hay demanda, y se facturan únicamente por el tiempo de ejecución real medido en incrementos de 100 milisegundos.

```text
Pila de abstracción comparada:

Infraestructura Tradicional (VMs):
┌─────────────────────────────────┐
│  Aplicación                    │
├─────────────────────────────────┤
│  Sistema Operativo             │  ← Gestionas parches, actualizaciones
├─────────────────────────────────┤
│  Hipervisor                    │  ← Gestionas capacidad, scaling
├─────────────────────────────────┤
│  Hardware Físico               │  ← Gestionas mantenimiento, fallos
└─────────────────────────────────┘
• Responsabilidad: 100% infraestructura + aplicación
• Escalado: manual o mediante Auto Scaling Groups
• Facturación: por hora de instancia (encendida o no)

Contenedores (Kubernetes):
┌─────────────────────────────────┐
│  Aplicación                    │
├─────────────────────────────────┤
│  Runtime de Contenedor         │  ← Gestionas imágenes, orchestration
├─────────────────────────────────┤
│  Sistema Operativo del Nodo    │  ← Gestionas actualizaciones de nodo
├─────────────────────────────────┤
│  Infraestructura Subyacente    │  ← Gestionada por proveedor/cloud
└─────────────────────────────────┘
• Responsabilidad: 50% infraestructura + 100% aplicación
• Escalado: automático mediante HPA/VPA
• Facturación: por hora de nodo del cluster

Serverless/FaaS:
┌─────────────────────────────────┐
│  Función (código)              │  ← Solo tu lógica de negocio
├─────────────────────────────────┤
│  Plataforma FaaS               │  ← Gestionada completamente por proveedor
│  • Aprovisionamiento           │
│  • Escalado automático         │
│  • Parcheo y seguridad         │
│  • Disponibilidad y DR         │
├─────────────────────────────────┤
│  Infraestructura Subyacente    │  ← Invisible para el desarrollador
└─────────────────────────────────┘
• Responsabilidad: 100% aplicación (solo código)
• Escalado: automático a cero y hasta miles de instancias
• Facturación: por milisegundo de ejecución + invocaciones
```

```yaml
# Comparativa de responsabilidad operativa por modelo
operational_responsibility:
  maquinas_virtuales:
    gestionas:
      - "Sistema operativo (parches, actualizaciones, hardening)"
      - "Runtime de aplicación (lenguaje, versión, dependencias)"
      - "Escalado horizontal/vertical"
      - "Disponibilidad y recuperación ante fallos"
      - "Capacidad y planificación"
    no_gestionas:
      - "Hardware físico (en cloud)"
      - "Hipervisor (en cloud)"
  
  contenedores:
    gestionas:
      - "Imágenes de contenedor (build, versionado, seguridad)"
      - "Orquestación (deployments, services, ingress)"
      - "Runtime de aplicación"
      - "Escalado de pods (HPA)"
    no_gestionas:
      - "Sistema operativo del nodo (parcialmente)"
      - "Infraestructura subyacente"
  
  serverless_faas:
    gestionas:
      - "Código de la función"
      - "Dependencias de la función"
      - "Configuración de triggers y permisos"
    no_gestionas:
      - "Sistema operativo"
      - "Runtime (versión gestionada por proveedor)"
      - "Escalado (automático e ilimitado)"
      - "Disponibilidad y DR"
      - "Capacidad y planificación"
```

> Serverless no elimina la complejidad, la redistribuye: la complejidad operativa de gestionar infraestructura se reemplaza con complejidad arquitectónica de diseñar aplicaciones stateless, manejar límites de ejecución, gestionar cold starts, y navegar las limitaciones y acoplamientos específicos del proveedor.

## Modelo de ejecución FaaS: funciones efímeras, escalado a cero y facturación por invocación

El modelo de ejecución de FaaS difiere fundamentalmente de las arquitecturas tradicionales: en lugar de procesos long-running que esperan solicitudes, las funciones FaaS son efímeras, se instancian bajo demanda, ejecutan la lógica asignada, y se destruyen inmediatamente después de completar. Este modelo tiene implicaciones profundas en diseño de aplicaciones, patrones de integración y economía de la ejecución.

```text
Ciclo de vida de una función FaaS:

[Trigger/Evento ocurre]
    ↓
[Plataforma FaaS detecta invocación]
    ↓
[¿Hay instancia caliente disponible?]
    ├─ SÍ → Reutilizar instancia (warm start)
    └─ NO → Crear nueva instancia (cold start)
        ↓
        [Descargar código y dependencias]
        [Inicializar runtime]
        [Ejecutar función handler]
        ↓
[ Ejecutar lógica de negocio ]
    ↓
[Devolver respuesta]
    ↓
[Instancia permanece caliente por ~5-15 minutos]
    ↓
[Si no hay más invocaciones → instancia se destruye]
    ↓
[Escalar a cero: costo $0 cuando no hay tráfico]
```

```python
# Ejemplo: Función AWS Lambda (Python)
# Solo la lógica de negocio, sin gestión de infraestructura

import json
import boto3

# Código que se ejecuta UNA VEZ por instancia (initialization)
# Reutilizado entre invocaciones en la misma instancia caliente
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

def lambda_handler(event, context):
    """
    Handler que se ejecuta POR CADA invocación
    
    Args:
        event: Diccionario con datos del trigger
        context: Objeto con metadatos de ejecución
    
    Returns:
        dict: Respuesta HTTP o datos procesados
    """
    # Información de ejecución disponible
    function_name = context.function_name
    memory_limit = context.memory_limit_in_mb
    remaining_time = context.get_remaining_time_in_millis()
    request_id = context.aws_request_id
    
    # Lógica de negocio
    for record in event.get('Records', []):
        user_id = record.get('userId')
        user_data = table.get_item(Key={'id': user_id})
        
        # Procesamiento...
    
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Processing complete'})
    }

# Nota: variables globales persisten entre invocaciones en la misma instancia
# pero NO hay garantía de que la próxima invocación reuse la misma instancia
```

```yaml
# Configuración de función Lambda (AWS SAM / CloudFormation)
# serverless-template.yaml

AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  ProcessUserFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: process-user-function
      Handler: index.lambda_handler
      Runtime: python3.11
      CodeUri: ./src/
      Timeout: 30              # Máximo 15 minutos en Lambda
      MemorySize: 512          # 128MB - 10GB, afecta CPU asignada
      ReservedConcurrency: 100 # Límite de ejecuciones paralelas
      
      # Triggers/Event sources
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /users
            Method: post
        S3Event:
          Type: S3
          Properties:
            Bucket: !Ref UploadBucket
            Events: s3:ObjectCreated:*
        ScheduledEvent:
          Type: Schedule
          Properties:
            Schedule: rate(1 hour)
            Input: '{"action": "cleanup"}'
      
      # IAM permissions (principio de mínimo privilegio)
      Policies:
        - DynamoDBReadPolicy:
            TableName: !Ref UsersTable
        - S3ReadPolicy:
            BucketName: !Ref UploadBucket
      
      # Configuración de VPC (si necesita acceso a recursos privados)
      VpcConfig:
        SecurityGroupIds:
          - sg-0123456789abcdef0
        SubnetIds:
          - subnet-0123456789abcdef0
          - subnet-fedcba9876543210
      
      # Environment variables (cifradas con KMS)
      Environment:
        Variables:
          TABLE_NAME: !Ref UsersTable
          LOG_LEVEL: INFO
```

```bash
# Desplegar función con AWS SAM CLI
sam build --template serverless-template.yaml
sam deploy --guided

# Invocar función para testing
aws lambda invoke \
  --function-name process-user-function \
  --payload '{"userId": "user-123"}' \
  --cli-binary-format raw-in-base64-out \
  response.json

# Ver logs en CloudWatch
aws logs tail /aws/lambda/process-user-function --follow

# Ver métricas de ejecución
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=process-user-function \
  --start-time $(date -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date +%Y-%m-%dT%H:%M:%S) \
  --period 60 \
  --statistics Average Maximum \
  --output table
```

> Las funciones FaaS son stateless por diseño: no hay garantía de que dos invocaciones consecutivas se ejecuten en la misma instancia, y las instancias pueden ser destruidas en cualquier momento después de completar. Cualquier estado debe externalizarse a servicios persistentes (DynamoDB, S3, Redis, bases de datos) —no confiar en variables globales, sistema de archivos local, o conexiones persistentes.

## Cold starts: latencia de inicialización y estrategias de mitigación

El cold start es la principal limitación de rendimiento en FaaS: cuando una función se invoca y no hay instancias calientes disponibles, la plataforma debe crear una nueva instancia, descargar código, inicializar el runtime y ejecutar el handler, introduciendo latencia adicional que puede variar desde 100ms hasta varios segundos dependiendo del runtime, tamaño del código, y configuración de la función.

```text
Desglose de latencia en cold start:

┌─────────────────────────────────┐
│  Fase 1: Aprovisionamiento     │
│  • Asignar capacidad de cómputo│
│  • Crear entorno de ejecución  │
│  • Duración: 50-200 ms         │
├─────────────────────────────────┤
│  Fase 2: Descarga de código    │
│  • Descargar código desde S3   │
│  • Extraer dependencias        │
│  • Duración: 100-500 ms        │
│    (depende del tamaño del     │
│    deployment package)         │
├─────────────────────────────────┤
│  Fase 3: Inicialización        │
│  • Inicializar runtime         │
│  • Ejecutar código global      │
│  • Establecer conexiones       │
│  • Duración: 200-2000 ms       │
│    (depende del runtime y      │
│    lógica de init)             │
├─────────────────────────────────┤
│  Fase 4: Ejecución del handler │
│  • Ejecutar lógica de negocio  │
│  • Duración: variable según    │
│    complejidad de la función   │
└─────────────────────────────────┘

Cold start total típico:
• Python/Node.js: 200-800 ms
• Java/.NET: 1000-5000 ms (JVM/CLR initialization)
• Custom runtime: variable según implementación
```

```python
# Estrategias para mitigar cold starts en Lambda

# 1. Optimizar tamaño del deployment package
# Solo incluir dependencias necesarias, usar layers para dependencias compartidas

# 2. Inicialización fuera del handler (código global)
import boto3
import json

# Este código se ejecuta UNA VEZ por instancia (durante init)
# Reutilizado entre invocaciones en instancia caliente
dynamodb = boto3.resource('dynamodb')  # ← Conexión reutilizable
table = dynamodb.Table('MyTable')

def lambda_handler(event, context):
    # Este código se ejecuta POR CADA invocación
    # Mantener lo más ligero posible
    user_id = event.get('userId')
    result = table.get_item(Key={'id': user_id})
    return result

# 3. Usar Provisioned Concurrency (paga por instancias siempre calientes)
# Elimina cold starts pero tiene costo incluso sin tráfico

# 4. Elegir runtimes con menor overhead de inicialización
# Python/Node.js < Go < Java/.NET para cold start
```

```yaml
# Configuración de Provisioned Concurrency en AWS SAM
# Mantiene N instancias siempre calientes, eliminando cold starts

Resources:
  ProcessUserFunction:
    Type: AWS::Serverless::Function
    Properties:
      # ... configuración básica ...
      
      # Provisioned Concurrency
      ProvisionedConcurrencyConfig:
        ProvisionedConcurrentExecutions: 10  # Mantener 10 instancias calientes
      
      # Auto-scaling para provisioned concurrency
      AutoPublishAlias: live
      DeploymentPreference:
        Type: AllAtOnce

# Alias con provisioned concurrency
  FunctionAlias:
    Type: AWS::Lambda::Alias
    Properties:
      FunctionName: !Ref ProcessUserFunction
      FunctionVersion: !GetAtt ProcessUserFunction.Version
      Name: live
      ProvisionedConcurrencyConfig:
        ProvisionedConcurrentExecutions: 10
```

```bash
# Monitorear cold starts en CloudWatch
# Las métricas de Lambda incluyen InitDuration para cold starts

aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name InitDuration \
  --dimensions Name=FunctionName,Value=process-user-function \
  --start-time $(date -d '24 hours ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average Maximum \
  --output table

# InitDuration solo aparece en invocaciones con cold start
# Comparar con Duration total para identificar impacto
```

> Provisioned Concurrency elimina cold starts pero introduce costo fijo: pagas por las instancias provisionadas incluso si no hay tráfico. Usar estratégicamente para funciones críticas con SLA de latencia estricto, combinado con escalado automático basado en métricas de utilización.

## Límites y restricciones: timeouts, memoria y acoplamiento al proveedor

Las plataformas FaaS imponen límites estrictos diseñados para garantizar escalabilidad automática y aislamiento entre tenants. Estos límites determinan qué cargas de trabajo son adecuadas para FaaS y cuáles requieren arquitecturas alternativas.

```text
Límites típicos en AWS Lambda (varía por proveedor):

┌─────────────────────────────────┐
│  Tiempo de ejecución           │
│  • Máximo: 15 minutos (900s)   │
│  • Timeout configurable:       │
│    1s - 900s                   │
│  • Implicación: procesos       │
│    largos requieren arquitectura│
│    alternativa (Step Functions,│
│    ECS, EC2)                   │
├─────────────────────────────────┤
│  Memoria                       │
│  • Rango: 128 MB - 10 GB       │
│  • CPU asignada proporcional   │
│    a memoria (1769 MHz por GB) │
│  • Implicación: aumentar       │
│    memoria también aumenta CPU │
├─────────────────────────────────┤
│  Tamaño de código              │
│  • Deployment package: 50 MB   │
│    (subida directa)            │
│  • Con S3: 250 MB (comprimido) │
│  • Capas: 250 MB adicionales   │
│  • Implicación: aplicaciones   │
│    grandes requieren           │
│    optimización o container    │
│    images (hasta 10 GB)        │
├─────────────────────────────────┤
│  Concurrencia                  │
│  • Por defecto: 1000           │
│    ejecuciones paralelas       │
│  • Configurable por función    │
│  • Reserved concurrency para   │
│    garantizar capacidad        │
├─────────────────────────────────┤
│  Estado y almacenamiento       │
│  • /tmp: 512 MB - 10 GB        │
│    (efímero, se pierde tras    │
│    ejecución)                  │
│  • Sin estado persistente local│
│  • Implicación: externalizar   │
│    estado a servicios managed  │
└─────────────────────────────────┘
```

```yaml
# Comparativa de límites por proveedor
provider_limits_comparison:
  aws_lambda:
    timeout_max: "15 minutos (900s)"
    memory_range: "128 MB - 10 GB"
    package_size: "250 MB (zip), 10 GB (container image)"
    tmp_storage: "512 MB - 10 GB"
    concurrent_executions: "1000 por defecto, configurable"
    pricing: "$0.0000166667 por GB-segundo + $0.20 por millón de invocaciones"
  
  azure_functions:
    timeout_max: "10 minutos (Consumption), 60 min (Premium)"
    memory_range: "128 MB - 14 GB"
    package_size: "100 MB (zip), sin límite explícito (Premium)"
    tmp_storage: "1 GB (Consumption), más en Premium"
    concurrent_executions: "200 por defecto, configurable"
    pricing: "Similar a Lambda, con plan gratuito generoso"
  
  google_cloud_functions:
    timeout_max: "9 minutos (540s)"
    memory_range: "128 MB - 32 GB"
    package_size: "512 MB (zip), 10 GB (container)"
    tmp_storage: "/tmp disponible, tamaño variable"
    concurrent_executions: "1000 por defecto"
    pricing: "2 millones de invocaciones gratis/mes"
```

```python
# Patrón para procesos que exceden timeout de Lambda
# Usar Step Functions para orquestar múltiples funciones

import boto3

stepfunctions = boto3.client('stepfunctions')

def lambda_handler(event, context):
    """
    Iniciar ejecución de Step Function para procesos largos
    en lugar de ejecutar directamente en Lambda
    """
    response = stepfunctions.start_execution(
        stateMachineArn='arn:aws:states:us-east-1:123456789012:stateMachine:LongRunningProcess',
        input=json.dumps(event)
    )
    
    return {
        'statusCode': 202,
        'body': json.dumps({
            'executionArn': response['executionArn'],
            'message': 'Process started, check status via execution ARN'
        })
    }

# Step Function puede orquestar múltiples Lambdas con waits, retries,
# y puede ejecutarse por hasta 1 año (vs. 15 min de Lambda individual)
```

> El vendor lock-in en FaaS es significativo: cada proveedor tiene APIs, triggers, formatos de evento, y servicios integrados específicos. Migrar una función Lambda a Azure Functions o GCP Cloud Functions requiere reescribir código de integración, configurar triggers equivalentes, y potencialmente refactorizar lógica que depende de servicios managed específicos del proveedor.

## Casos de uso ideales: cuándo elegir FaaS, cuándo evitarlo

FaaS no es una solución universal: brilla en escenarios específicos donde sus características (escalado automático, facturación por uso, cero gestión operativa) alinean con los requisitos de la carga de trabajo, pero puede ser costoso o inadecuado para otros patrones.

```text
Matriz de decisión: FaaS vs. Contenedores vs. VMs

┌─────────────────────────────────┐
│  Caso de Uso                  │ Tecnología Recomendada │
├─────────────────────────────────┤
│ APIs con tráfico variable      │ FaaS (Lambda + API GW)│
│ • Picos impredecibles          │ • Escalado automático │
│ • Tráfico intermitente         │ • Costo $0 sin tráfico│
│ • Desarrollo rápido            │ • Sin gestión de infra│
├─────────────────────────────────┤
│ Procesamiento de eventos       │ FaaS                │
│ • S3 uploads, DynamoDB streams │ • Triggers nativos  │
│ • Colas de mensajes (SQS, Kafka)│ • Escalado por mensaje│
│ • Transformación en tiempo real│ • Stateless por diseño│
├─────────────────────────────────┤
│ Tareas programadas (cron)      │ FaaS                │
│ • Limpieza, backups, reports   │ • Schedule triggers │
│ • Ejecución infrecuente        │ • Sin costo cuando  │
│ • Duración < 15 minutos        │   no se ejecuta     │
├─────────────────────────────────┤
│ Aplicaciones web stateful      │ Contenedores (ECS/EKS)│
│ • Sesiones de usuario          │ • Conexiones        │
│ • WebSockets persistentes      │   persistentes      │
│ • Estado en memoria            │ • Menor cold start  │
├─────────────────────────────────┤
│ Procesos de larga duración     │ Contenedores o VMs  │
│ • Ejecución > 15 minutos       │ • Sin timeout estricto│
│ • Batch processing grande      │ • Control de recursos│
│ • Machine learning training    │ • GPUs especializadas│
├─────────────────────────────────┤
│ Aplicaciones con tráfico       │ Contenedores        │
│ constante y predecible         │ • Costo más predecible│
│ • Uso > 70% continuo           │ • Menor costo por   │
│ • Latencia crítica             │   ejecución constante│
├─────────────────────────────────┤
│ Legacy o dependencias          │ VMs                 │
│ complejas                      │ • Kernel custom     │
│ • SO específico requerido      │ • Sin límites de    │
│ • Hardware especializado       │   runtime           │
└─────────────────────────────────┘
```

```yaml
# Análisis de costos: FaaS vs. Contenedores por patrón de carga
cost_analysis_by_pattern:
  trafico_intermitente:
    patron: "100,000 invocaciones/día, 500ms duración, 512MB memoria"
    faas_costo_mensual:
      invocaciones: "100,000 × 30 × $0.20/1M = $0.60"
      computo: "100,000 × 30 × 0.5GB × 0.5s × $0.0000166667/GB-s = ~$12.50"
      total: "~$13-15/mes"
    contenedores_costo_mensual:
      instancia: "t3.small (2 vCPU, 2GB) = ~$15/mes"
      total: "~$15-20/mes (siempre encendido)"
    recomendacion: "FaaS (costo similar pero escalado automático incluido)"
  
  trafico_constante:
    patron: "1,000,000 invocaciones/día, 500ms duración, 512MB memoria"
    faas_costo_mensual:
      invocaciones: "1M × 30 × $0.20/1M = $6.00"
      computo: "1M × 30 × 0.5GB × 0.5s × $0.0000166667/GB-s = ~$125"
      total: "~$130-150/mes"
    contenedores_costo_mensual:
      instancia: "t3.medium (2 vCPU, 4GB) = ~$30/mes"
      replicas: "3 instancias para HA = ~$90/mes"
      total: "~$90-120/mes (siempre encendido)"
    recomendacion: "Contenedores (costo menor para carga constante)"
  
  picos_impredecibles:
    patron: "Promedio 10,000/día, picos a 500,000/día ocasionalmente"
    faas_costo_mensual:
      promedio: "~$15/mes base"
      picos: "pago solo por invocaciones extra durante picos"
      total: "Variable, pero sin sobreprovisionamiento"
    contenedores_costo_mensual:
      para_picos: "Necesitas capacidad para 500,000/día = ~$200-300/mes"
      o_auto_scaling: "Complejidad adicional, cold starts de instancias"
      total: "~$200-300/mes o complejidad de ASG"
    recomendacion: "FaaS (pago solo por lo que usas, escalado automático)"
```

> La regla práctica: FaaS es más económico para cargas con utilización <20-30% (tráfico intermitente, picos impredecibles); contenedores/VMs son más económicos para cargas con utilización >70% constante. Sin embargo, el valor de FaaS no es solo costo: es la eliminación de gestión operativa, el escalado automático sin configuración, y la capacidad de enfocarse exclusivamente en lógica de negocio.

## Quédate con...

- **Serverless/FaaS es el nivel más alto de abstracción** en cloud: solo gestionas código, el proveedor gestiona infraestructura, escalado, disponibilidad y parcheo automáticamente.
- El **modelo de ejecución es efímero**: funciones se instancian bajo demanda, ejecutan lógica, y se destruyen; no hay garantía de persistencia entre invocaciones, todo estado debe externalizarse.
- Los **cold starts introducen latencia** (200ms-5s dependiendo del runtime); mitigar con inicialización fuera del handler, runtimes ligeros (Python/Node.js), o Provisioned Concurrency (con costo fijo).
- Los **límites estrictos** (15 min timeout, 10GB memoria, 250MB-10GB código) determinan viabilidad: procesos largos o con dependencias grandes requieren arquitecturas alternativas (Step Functions, contenedores).
- La **facturación es por uso real**: milisegundos de ejecución + invocaciones; económico para cargas intermitentes (<30% utilización), potencialmente más caro que contenedores para cargas constantes.
- El **vendor lock-in es significativo**: APIs, triggers, formatos de evento y servicios integrados son específicos del proveedor; migrar entre AWS/Azure/GCP requiere refactorización sustancial.
- Los **casos de uso ideales** para FaaS: APIs con tráfico variable, procesamiento de eventos (S3, DynamoDB, colas), tareas programadas infrecuentes, y desarrollo rápido sin gestión operativa.
- **Evitar FaaS para**: aplicaciones stateful con sesiones persistentes, procesos >15 minutos, cargas con tráfico constante >70% utilización, o requisitos de kernel/hardware especializado.
- La **decisión no es binaria**: arquitecturas modernas frecuentemente combinan FaaS (para triggers, procesamiento de eventos) con contenedores (para cargas sostenidas) y VMs (para requisitos especializados) según el perfil de cada componente.
- El **valor principal de FaaS** no es solo costo: es la eliminación de gestión operativa, el escalado automático a cero, y la capacidad de enfocarse exclusivamente en lógica de negocio sin preocuparse por infraestructura.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/comparacion/aislados" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/comparacion/elegir" class="next">Siguiente</a>
</div>
