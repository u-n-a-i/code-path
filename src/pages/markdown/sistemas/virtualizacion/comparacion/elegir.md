---
title: "Cuándo usar qué"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Cuándo usar qué](#cuándo-usar-qué)
  - [Matriz de decisión: evaluación multidimensional de tecnologías de aislamiento](#matriz-de-decisión-evaluación-multidimensional-de-tecnologías-de-aislamiento)
  - [Casos de uso específicos: recomendaciones tecnológicas por escenario](#casos-de-uso-específicos-recomendaciones-tecnológicas-por-escenario)
  - [Migración y evolución: transición entre tecnologías según madurez del sistema](#migración-y-evolución-transición-entre-tecnologías-según-madurez-del-sistema)
  - [Quédate con...](#quédate-con)

</div>

# Cuándo usar qué

La selección de tecnologías de virtualización y aislamiento no es un ejercicio de preferencias tecnológicas ni de adopción de modas arquitectónicas, sino un proceso de evaluación sistemática de trade-offs entre aislamiento, rendimiento, portabilidad y complejidad operativa. Cada tecnología —máquinas virtuales, contenedores, sandbox, serverless/FaaS— resuelve problemas específicos con garantías distintas: las VMs proporcionan aislamiento fuerte mediante kernels independientes pero introducen overhead de recursos; los contenedores ofrecen agilidad y densidad superior pero comparten el kernel del host; los sandbox equilibran seguridad y rendimiento mediante primitivas de kernel filtradas; y FaaS elimina completamente la gestión operativa pero impone límites estrictos de ejecución y acoplamiento al proveedor. Comprender estas compensaciones mediante una matriz de decisión explícita permite seleccionar la tecnología adecuada para cada carga de trabajo, evitando errores costosos como virtualizar microservicios stateless que se beneficiarían de contenedores, contenerizar aplicaciones monolíticas que requieren kernel personalizado, o migrar procesos de larga duración a FaaS con timeouts de 15 minutos. Esta sección proporciona un framework objetivo para tomar decisiones arquitectónicas fundamentadas, evaluando cada tecnología contra criterios de seguridad, rendimiento, operatividad y costo según el contexto específico de cada caso de uso.

## Matriz de decisión: evaluación multidimensional de tecnologías de aislamiento

La selección de tecnología debe basarse en una evaluación explícita de cuatro dimensiones fundamentales que frecuentemente están en tensión: el nivel de aislamiento requerido por el modelo de amenaza, el rendimiento necesario para la carga de trabajo, la portabilidad deseada entre entornos, y la complejidad operativa que el equipo puede sostener.

```text
Matriz de decisión por dimensión:

┌─────────────────────────────────────────────────────────────────────────┐
│  Dimensión          │ VM      │ Contenedor │ Sandbox   │ FaaS        │
├─────────────────────────────────────────────────────────────────────────┤
│  Aislamiento        │ ████████│ ████░░░░░░ │ █████░░░░░│ ████░░░░░░  │
│  (fuerte a débil)   │ (kernel │ (kernel    │ (namespaces│ (kernel     │
│                     │  indep.)│ compartido)│ + seccomp) │ compartido) │
├─────────────────────────────────────────────────────────────────────────┤
│  Rendimiento        │ █████░░░│ ███████░░░ │ ███████░░░│ █████░░░░░  │
│  (nativo a overhead)│ (2-8%)  │ (<2%)      │ (<5%)     │ (cold start)│
├─────────────────────────────────────────────────────────────────────────┤
│  Portabilidad       │ █████░░░│ ███████░░░ │ ███░░░░░░░│ ██░░░░░░░░  │
│  (multi-cloud a     │ (OVF/OVA│ (OCI images│ (host-    │ (vendor     │
│   vendor lock-in)   │  portable)│ portable)  │ specific) │ specific)   │
├─────────────────────────────────────────────────────────────────────────┤
│  Complejidad        │ ███████░│ ██████░░░░ │ ████░░░░░░│ ██░░░░░░░░  │
│  (alta a baja)      │ (gestión│ (orchest.  │ (config.  │ (solo código│
│                     │  completa)│ requerida) │ manual)   │  desplegar) │
├─────────────────────────────────────────────────────────────────────────┤
│  Tiempo de arranque │ 30-90s  │ 1-5s       │ <1s       │ 0.2-5s      │
├─────────────────────────────────────────────────────────────────────────┤
│  Densidad por host  │ 10-50   │ 100-500+   │ 100-500+  │ N/A         │
├─────────────────────────────────────────────────────────────────────────┤
│  Costo relativo     │ Alto    │ Medio      │ Medio-Bajo│ Variable    │
│  (para carga const.)│         │            │           │ (bajo si    │
│                     │         │            │           │  intermitente)│
└─────────────────────────────────────────────────────────────────────────┘
```

```yaml
# Framework de evaluación por criterios de selección
selection_framework:
  aislamiento_requerido:
    preguntas_clave:
      - "¿Las cargas son de múltiples tenants no confiables?"
      - "¿Existe riesgo de código malicioso o comprometido?"
      - "¿Hay requisitos de compliance que exigen aislamiento de kernel?"
      - "¿Un escape comprometería datos críticos o toda la plataforma?"
    
    umbrales:
      aislamiento_fuerte: "VM o Kata Containers"
      aislamiento_moderado: "gVisor o sandbox reforzado"
      aislamiento_basico: "Contenedores estándar o Firejail"
  
  rendimiento_requerido:
    preguntas_clave:
      - "¿La carga es sensible a latencia de arranque?"
      - "¿Requiere E/S intensiva de disco o red?"
      - "¿Hay límites estrictos de tiempo de respuesta (SLA)?"
      - "¿La carga ejecuta por más de 15 minutos continuos?"
    
    umbrales:
      latencia_critica: "VM con CPU pinning o bare-metal"
      rendimiento_alto: "Contenedores con runtime estándar (runc)"
      rendimiento_moderado: "gVisor o sandbox con seccomp"
      latencia_tolerante: "FaaS (aceptar cold starts)"
  
  portabilidad_requerida:
    preguntas_clave:
      - "¿Necesitas ejecutar en múltiples proveedores de nube?"
      - "¿Hay requisito de hybrid cloud (on-premises + cloud)?"
      - "¿Quieres evitar vendor lock-in a largo plazo?"
      - "¿El equipo necesita consistencia entre dev/staging/prod?"
    
    umbrales:
      multi_cloud: "Contenedores OCI + Kubernetes"
      hybrid_cloud: "VMs o contenedores con runtime portable"
      single_provider: "FaaS o servicios managed del proveedor"
  
  complejidad_operativa:
    preguntas_clave:
      - "¿El equipo tiene capacidad para gestionar infraestructura?"
      - "¿Hay recursos para mantenimiento, parcheo y monitoreo?"
      - "¿Se requiere escalado automático sin configuración compleja?"
      - "¿El tiempo de desarrollo es más crítico que el control?"
    
    umbrales:
      equipo_pequeno: "FaaS o servicios managed"
      equipo_mediano: "Contenedores con orquestador managed (EKS, AKS)"
      equipo_grande: "VMs o Kubernetes self-managed para control máximo"
```

```bash
# Script de evaluación rápida (bash conceptual)
#!/bin/bash
# evaluate-technology.sh

echo "=== Evaluación de Tecnología de Aislamiento ==="
echo ""

# Preguntas de evaluación
echo "1. ¿Las cargas son de múltiples tenants no confiables? (y/n)"
read multi_tenant

echo "2. ¿Requiere ejecución > 15 minutos continuos? (y/n)"
read long_running

echo "3. ¿Necesitas multi-cloud o hybrid cloud? (y/n)"
read multi_cloud

echo "4. ¿El equipo puede gestionar infraestructura? (y/n)"
read ops_capacity

echo "5. ¿Tráfico constante >70% utilización o intermitente?"
read traffic_pattern

# Lógica de recomendación
if [ "$multi_tenant" = "y" ]; then
    echo ""
    echo "→ Recomendación: VM o Kata Containers (aislamiento fuerte requerido)"
elif [ "$long_running" = "y" ]; then
    echo ""
    echo "→ Recomendación: VM o Contenedores (FaaS tiene límite de 15 min)"
elif [ "$traffic_pattern" = "intermitente" ] && [ "$ops_capacity" = "n" ]; then
    echo ""
    echo "→ Recomendación: FaaS (escalado automático, sin gestión operativa)"
elif [ "$multi_cloud" = "y" ]; then
    echo ""
    echo "→ Recomendación: Contenedores + Kubernetes (portabilidad máxima)"
else
    echo ""
    echo "→ Recomendación: Contenedores (equilibrio agilidad/control)"
fi
```

> Ninguna tecnología es universalmente superior: la decisión óptima depende del contexto específico de cada carga de trabajo. Una arquitectura moderna frecuentemente combina múltiples tecnologías, seleccionando cada una según sus fortalezas para el caso de uso particular.

## Casos de uso específicos: recomendaciones tecnológicas por escenario

La siguiente matriz proporciona recomendaciones concretas para escenarios comunes, fundamentadas en las características técnicas de cada tecnología y los trade-offs documentados en secciones anteriores.

```text
Matriz de recomendación por caso de uso:

┌─────────────────────────────────────────────────────────────────────────┐
│  Caso de Uso                    │ Tecnología     │ Justificación       │
├─────────────────────────────────────────────────────────────────────────┤
│ Microservicios stateless        │ Contenedores   │ Escalado rápido,    │
│ • APIs REST/GraphQL            │ + Kubernetes   │ densidad alta,      │
│ • Comunicación service-to-service│               │ portabilidad OCI    │
│ • Despliegue frecuente         │                │                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Aplicaciones monolíticas legacy │ VM             │ Kernel específico,  │
│ • Dependencias de SO antiguo   │                │ sin refactorización │
│ • Difícil de contenerizar      │                │ requerida,          │
│ • Requiere kernel tuning       │                │ aislamiento completo│
├─────────────────────────────────────────────────────────────────────────┤
│ Procesamiento de eventos        │ FaaS           │ Triggers nativos,   │
│ • S3 uploads, DynamoDB streams │ (Lambda,       │ escalado por evento,│
│ • Colas de mensajes (SQS, Kafka)│ Functions)    │ costo $0 sin tráfico│
│ • Transformación en tiempo real│                │                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Bases de datos transaccionales  │ VM             │ Control de E/S,     │
│ • Estado persistente crítico   │                │ kernel tuning,      │
│ • Requieren kernel específico  │                │ actualizaciones     │
│ • Actualizaciones planificadas │                │ controladas         │
├─────────────────────────────────────────────────────────────────────────┤
│ CI/CD multi-tenant              │ gVisor o VM    │ Aislamiento entre   │
│ • Builds de código de terceros │ por job        │ jobs, código no     │
│ • Ejecución de tests no        │                │ confiable,          │
│   confiables                   │                │ equilibrio seguridad│
├─────────────────────────────────────────────────────────────────────────┤
│ Desarrollo local                │ Contenedores   │ Consistencia        │
│ • Entornos reproducibles       │ (Docker/Podman)│ dev/prod,           │
│ • Múltiples configuraciones    │                │ arranque rápido,    │
│ • Pruebas efímeras             │                │ bajo consumo        │
├─────────────────────────────────────────────────────────────────────────┤
│ Edge computing / IoT            │ Sandbox ligero │ Recursos limitados, │
│ • Dispositivos con <1GB RAM    │ (Bubblewrap)   │ aislamiento básico, │
│ • Procesamiento local          │ + seccomp      │ sin overhead de VM  │
│ • Actualizaciones remotas      │                │                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Análisis de malware             │ VM con         │ Aislamiento máximo, │
│ • Ejecución de muestras        │ snapshots      │ capacidad de        │
│   potencialmente maliciosas    │                │ revertir,           │
│ • Requiere contención fuerte   │                │ sin riesgo al host  │
├─────────────────────────────────────────────────────────────────────────┤
│ Aplicaciones web con sesiones   │ Contenedores   │ Conexiones          │
│ persistentes                   │ + orchestration│ persistentes,       │
│ • WebSockets, long polling     │                │ estado en memoria,  │
│ • Estado en memoria local      │                │ sin cold starts     │
├─────────────────────────────────────────────────────────────────────────┤
│ Tareas programadas (cron)       │ FaaS           │ Sin costo cuando no │
│ • Limpieza, backups, reports   │ (Schedule      │ se ejecuta,         │
│ • Ejecución infrecuente        │ triggers)      │ sin gestión de      │
│ • Duración < 15 minutos        │                │ servidores          │
├─────────────────────────────────────────────────────────────────────────┤
│ Plataforma PaaS pública         │ gVisor o       │ Multi-tenant con    │
│ • Ejecución de código de       │ Kata Containers│ código no confiable,│
│   usuarios externos            │                │ aislamiento reforzado│
│ • Requiere seguridad fuerte    │                │ sin overhead de VM  │
├─────────────────────────────────────────────────────────────────────────┤
│ High Performance Computing      │ VM o Bare-metal│ Máximo rendimiento, │
│ • Cálculo científico           │                │ acceso a hardware   │
│ • GPU/FPGA especializado       │                │ especializado,      │
│ • Latencia ultra-baja          │                │ sin virtualización  │
└─────────────────────────────────────────────────────────────────────────┘
```

```yaml
# Patrón arquitectónico híbrido: combinar tecnologías por componente
hybrid_architecture_pattern:
  escenario: "Plataforma de e-commerce con componentes diversos"
  
  componentes:
    frontend_web:
      tecnologia: "Contenedores + Kubernetes"
      justificacion: "Tráfico variable, despliegues frecuentes, stateless"
    
    api_gateway:
      tecnologia: "FaaS (Lambda + API Gateway)"
      justificacion: "Tráfico impredecible, escalado automático, sin gestión"
    
    procesamiento_pagos:
      tecnologia: "VM con aislamiento reforzado"
      justificacion: "Compliance PCI-DSS, aislamiento fuerte requerido"
    
    cola_de_pedidos:
      tecnologia: "FaaS triggered por SQS"
      justificacion: "Procesamiento por evento, escalado por mensaje"
    
    base_de_datos:
      tecnologia: "VM o RDS managed"
      justificacion: "Estado persistente, E/S intensiva, actualizaciones controladas"
    
    analisis_fraude:
      tecnologia: "Contenedores con GPU"
      justificacion: "ML inference, requiere aceleración hardware"
    
    tareas_limpieza:
      tecnologia: "FaaS con Schedule trigger"
      justificacion: "Ejecución infrecuente, sin costo cuando no corre"
  
  beneficios:
    - "Cada componente usa tecnología óptima para su perfil"
    - "Balance entre agilidad (FaaS/contenedores) y control (VMs)"
    - "Costo optimizado según patrón de uso de cada componente"
  
  consideraciones:
    - "Mayor complejidad operativa: múltiples tecnologías que gestionar"
    - "Requiere equipo con habilidades diversas"
    - "Monitoreo unificado necesario para visibilidad transversal"
```

> El patrón híbrido es dominante en arquitecturas empresariales modernas: rara vez una sola tecnología satisface óptimamente todos los componentes de un sistema complejo. La clave es establecer criterios claros de selección por componente y mantener consistencia dentro de cada categoría (ej: todos los microservicios stateless en contenedores, todas las funciones event-driven en FaaS).

## Migración y evolución: transición entre tecnologías según madurez del sistema

Las arquitecturas no son estáticas: evolucionan según cambian los requisitos de negocio, la madurez del equipo, la escala de la operación y las restricciones de costo. Comprender cuándo y cómo migrar entre tecnologías es tan importante como la selección inicial.

```text
Patrones de evolución arquitectónica:

┌─────────────────────────────────┐
│  Fase 1: Inicio (MVP)          │
│  • Equipo pequeño              │
│  • Incertidumbre de requisitos │
│  • Prioridad: velocidad        │
│  → FaaS o contenedores managed │
├─────────────────────────────────┤
│  Fase 2: Crecimiento           │
│  • Tráfico predecible          │
│  • Equipo en expansión         │
│  • Prioridad: costo + control  │
│  → Migrar cargas estables a    │
│    contenedores/VMs            │
├─────────────────────────────────┤
│  Fase 3: Madurez               │
│  • Múltiples líneas de producto│
│  • Requisitos de compliance    │
│  • Prioridad: aislamiento +    │
│    gobernanza                  │
│  → Arquitectura híbrida con    │
│    tecnologías por componente  │
├─────────────────────────────────┤
│  Fase 4: Optimización          │
│  • Escala masiva               │
│  • Costos significativos       │
│  • Prioridad: eficiencia       │
│  → Evaluación continua,        │
│    migración basada en métricas│
└─────────────────────────────────┘
```

```yaml
# Criterios para migrar entre tecnologías
migration_triggers:
  faas_a_contenedores:
    señales:
      - "Costo mensual de FaaS > 2-3x equivalente en contenedores"
      - "Funciones consistentemente cerca del timeout (15 min)"
      - "Cold starts impactando SLA de latencia"
      - "Tráfico constante >70% de capacidad provisionada"
    
    proceso:
      - "Perfilar costo real con Cloud Cost Management tools"
      - "Identificar funciones candidatas (alto volumen, ejecución larga)"
      - "Refactorizar para statelessness en contenedores"
      - "Migrar gradualmente con feature flags"
  
  contenedores_a_vms:
    señales:
      - "Requisitos de compliance exigen aislamiento de kernel"
      - "Necesidad de kernel custom o módulos específicos"
      - "Problemas de noisy neighbor en cluster multi-tenant"
      - "Cargas críticas que requieren garantías de rendimiento"
    
    proceso:
      - "Evaluar requerimientos de compliance explícitamente"
      - "Considerar Kata Containers como paso intermedio"
      - "Migrar cargas críticas primero, mantener resto en contenedores"
      - "Implementar monitoreo de rendimiento comparativo"
  
  vms_a_contenedores:
    señales:
      - "Equipos requieren mayor agilidad de despliegue"
      - "Subutilización consistente de capacidad de VMs"
      - "Necesidad de densidad mayor por host"
      - "Adopción de prácticas DevOps/CI/CD avanzadas"
    
    proceso:
      - "Identificar aplicaciones stateless candidatas"
      - "Refactorizar para twelve-factor app principles"
      - "Crear imágenes de contenedor optimizadas"
      - "Migrar con canary deployments y rollback automático"
```

```bash
# Herramientas para evaluar migración
# 1. Análisis de costo (AWS Cost Explorer ejemplo)

aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-12-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE \
  --query 'ResultsByTime[*].{Month:TimePeriod,Services:Groups}' \
  --output table

# 2. Análisis de utilización de instancias
aws compute-optimizer get-recommendation-summaries \
  --filter-names FilterName=EffectiveRecommendationPreferences \
  --filter-values EnhancedInfrastructureMetrics/Active

# 3. Análisis de cold starts en Lambda
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-function \
  --filter-pattern "Init Duration" \
  --start-time $(date -d '7 days ago' +%s)000 \
  --end-time $(date +%s)000
```

> Las migraciones entre tecnologías son costosas y riesgosas: requieren refactorización de código, cambios en pipelines de CI/CD, actualización de procedimientos operativos, y potencial downtime. Justificar cada migración con métricas objetivas (costo, rendimiento, incidentes de seguridad) en lugar de preferencias tecnológicas, y planificar migraciones graduales con capacidad de rollback.

## Quédate con...

- La **matriz de decisión** evalúa cuatro dimensiones: aislamiento (VMs), rendimiento (contenedores/sandbox), portabilidad (contenedores OCI), y complejidad (FaaS más simple).
- **Microservicios stateless** → Contenedores + Kubernetes; **Aplicaciones legacy** → VMs; **Procesamiento de eventos** → FaaS; **Bases de datos** → VMs o servicios managed.
- El **patrón híbrido** es dominante en arquitecturas empresariales: combinar tecnologías por componente según sus fortalezas específicas, no buscar una solución universal.
- Las **señales de migración** deben ser métricas objetivas: costo comparativo, utilización de capacidad, incidentes de seguridad, SLA de latencia; no preferencias tecnológicas.
- **FaaS es económico** para cargas intermitentes (<30% utilización); **contenedores/VMs** son más económicos para cargas constantes (>70% utilización).
- El **aislamiento fuerte** (multi-tenant no confiable, compliance estricto) requiere VMs o runtimes reforzados (Kata, gVisor); contenedores estándar no son suficientes.
- La **portabilidad multi-cloud** favorece contenedores OCI + Kubernetes; FaaS y servicios managed introducen vendor lock-in significativo.
- La **complejidad operativa** disminuye de VMs → Contenedores → Sandbox → FaaS; seleccionar según capacidad del equipo y prioridades de negocio.
- Las **migraciones entre tecnologías** son costosas y riesgosas: justificar con datos, planificar gradualmente, mantener capacidad de rollback en cada fase.
- Ninguna tecnología es permanente: las arquitecturas evolucionan según madurez del sistema, escala de operación y requisitos cambiantes; revisar decisiones periódicamente contra métricas actuales.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/comparacion/serverless" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/comparacion/microvms" class="next">Siguiente</a>
</div>
