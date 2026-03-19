---
title: "Máquinas virtuales vs. Entornos sandbox"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Máquinas virtuales vs. Entornos sandbox](#máquinas-virtuales-vs-entornos-sandbox)
  - [Arquitectura de aislamiento: fronteras de proceso vs. fronteras de sistema completo](#arquitectura-de-aislamiento-fronteras-de-proceso-vs-fronteras-de-sistema-completo)
  - [Mecanismos de sandboxing técnico: namespaces, seccomp y emulación de kernel](#mecanismos-de-sandboxing-técnico-namespaces-seccomp-y-emulación-de-kernel)
    - [Namespaces: aislamiento de vista de recursos del sistema](#namespaces-aislamiento-de-vista-de-recursos-del-sistema)
    - [Seccomp-bpf: filtrado de syscalls mediante políticas declarativas](#seccomp-bpf-filtrado-de-syscalls-mediante-políticas-declarativas)
  - [Comparativa de seguridad: modelos de amenaza y garantías de aislamiento](#comparativa-de-seguridad-modelos-de-amenaza-y-garantías-de-aislamiento)
  - [Rendimiento y densidad: trade-offs prácticos entre overhead y aislamiento](#rendimiento-y-densidad-trade-offs-prácticos-entre-overhead-y-aislamiento)
  - [Casos de uso ideales: cuándo elegir sandbox, cuándo elegir VM](#casos-de-uso-ideales-cuándo-elegir-sandbox-cuándo-elegir-vm)
  - [Quédate con...](#quédate-con)

</div>

# Máquinas virtuales vs. Entornos sandbox

La comparación entre máquinas virtuales y entornos sandbox no es una competencia sobre qué tecnología proporciona "más seguridad", sino un análisis de modelos de aislamiento con trade-offs fundamentalmente distintos: las VMs logran contención mediante la abstracción completa del hardware y kernels independientes, proporcionando fronteras de fallo robustas pero con overhead significativo; los sandbox, en cambio, implementan aislamiento a nivel de proceso mediante primitivas del kernel (namespaces, seccomp, user namespaces), ofreciendo arranque instantáneo y densidad superior pero con una superficie de ataque que comparte el kernel del host. Comprender esta distinción es crítico para diseñar arquitecturas donde la seguridad no sea un obstáculo para la agilidad: un sandbox mal configurado puede proporcionar una falsa sensación de aislamiento que se evapora ante un exploit de kernel, mientras que una VM para cada proceso puede introducir complejidad operativa y costos que no se justifican para cargas de trabajo de bajo riesgo. Esta sección desglosa los mecanismos técnicos de sandboxing moderno (Firejail, gVisor, Bubblewrap), compara sus garantías de seguridad frente a las VMs, y establece criterios objetivos para seleccionar la tecnología adecuada según el modelo de amenaza, los requisitos de rendimiento y la naturaleza de la carga de trabajo.

## Arquitectura de aislamiento: fronteras de proceso vs. fronteras de sistema completo

La diferencia arquitectónica fundamental entre sandbox y VM reside en qué capa de la pila de software implementa la frontera de aislamiento y qué recursos se comparten versus qué recursos se virtualizan.

```text
Modelo de aislamiento comparado:

Máquina Virtual:
┌─────────────────────────────────┐
│  Aplicación + Dependencias     │
├─────────────────────────────────┤
│  Sistema Operativo Invitado    │  ← Kernel completo, espacio de usuario
│  (Linux/Windows/BSD)           │    aislado, drivers virtuales
├─────────────────────────────────┤
│  Hipervisor (VMM)              │  ← Intercepta instrucciones privilegiadas
│  • VM Exit/Entry               │  • EPT/RVI para memoria
│  • Emulación/paravirtualización│
├─────────────────────────────────┤
│  Hardware Físico               │  ← CPU, RAM, disco, NIC reales
└─────────────────────────────────┘
• Frontera: hardware virtualizado
• Escape requiere vulnerabilidad en hipervisor o hardware

Sandbox (gVisor/Firejail):
┌─────────────────────────────────┐
│  Aplicación + Dependencias     │
├─────────────────────────────────┤
│  Runtime de Sandbox            │  ← Intercepta syscalls, emula kernel
│  • gVisor: Sentry (userspace)  │  • Firejail: namespaces + seccomp
│  • Bubblewrap: wrappers        │
├─────────────────────────────────┤
│  Kernel del Host (compartido)  │  ← Único punto de fallo común
│  • Namespaces: pid, net, mount │
│  • Seccomp-bpf: filtro syscalls│
│  • User namespaces: mapeo UID  │
├─────────────────────────────────┤
│  Hardware Físico               │
└─────────────────────────────────┘
• Frontera: políticas de kernel + emulación de syscalls
• Escape requiere vulnerabilidad en kernel o configuración errónea
```

```bash
# Verificar aislamiento de namespaces en un sandbox Firejail
# Firejail usa namespaces Linux para aislar procesos

# Ejecutar aplicación en sandbox
firejail --net=none --private /bin/bash

# Dentro del sandbox, verificar aislamiento:
ls -la /proc/self/ns/
# Salida: inodes de namespaces diferentes al host

# Verificar que no hay acceso a red
ip addr show
# Salida: solo loopback, sin interfaces físicas

# Verificar sistema de archivos aislado
ls /home
# Puede mostrar directorio vacío o contenido de perfil privado
```

```bash
# gVisor: interceptación de syscalls en espacio de usuario
# gVisor ejecuta un kernel minimalista (Sentry) en userspace que emula la API del kernel

# Ejecutar contenedor con runtime gVisor en Docker
docker run --runtime=runsc --rm alpine uname -a

# Dentro del contenedor, las syscalls son interceptadas por Sentry:
# open(), read(), write(), etc. → manejadas en userspace sin tocar kernel host

# Verificar runtime usado
docker inspect <container-id> | grep -i runtime
# Salida: "runsc" (gVisor) vs "runc" (container estándar)
```

> La diferencia crítica: en una VM, el kernel invitado es un punto de fallo aislado; en un sandbox, todas las cargas comparten el kernel del host. Un exploit que escape de un sandbox (mediante vulnerabilidad de kernel, misconfiguración de seccomp, o escape de user namespace) puede comprometer el host y todas las demás cargas. Las VMs contienen este tipo de fallos dentro del guest, aunque no son inmunes a vulnerabilidades del hipervisor.

## Mecanismos de sandboxing técnico: namespaces, seccomp y emulación de kernel

Los sandbox modernos combinan múltiples primitivas de seguridad del kernel Linux para crear fronteras de aislamiento efectivas sin la overhead de virtualización completa. Comprender estos mecanismos permite configurar sandbox con garantías apropiadas para cada modelo de amenaza.

### Namespaces: aislamiento de vista de recursos del sistema

```text
Namespaces de Linux y su rol en sandboxing:

┌─────────────────────────────────┐
│  pid namespace                 │
│  • Proceso ve solo procesos    │
│    dentro de su namespace      │
│  • PID 1 dentro del namespace  │
│  • Útil para aislamiento de    │
│    procesos y signal handling  │
├─────────────────────────────────┤
│  net namespace                 │
│  • Pila de red independiente:  │
│    interfaces, routing, firewall│
│  • Sin acceso a dispositivos   │
│    de red del host por defecto │
├─────────────────────────────────┤
│  mount namespace               │
│  • Vista independiente del     │
│    sistema de archivos         │
│  • Bind mounts para exponer    │
│    solo recursos necesarios    │
├─────────────────────────────────┤
│  uts namespace                 │
│  • Hostname y domain name      │
│    aislados                    │
├─────────────────────────────────┤
│  ipc namespace                 │
│  • Memoria compartida, semáforos│
│    message queues aislados     │
├─────────────────────────────────┤
│  user namespace                │
│  • Mapeo de UID/GID: root en   │
│    sandbox ≠ root en host      │
│  • Crítico para prevenir       │
│    escalada de privilegios     │
├─────────────────────────────────┤
│  cgroup namespace              │
│  • Vista aislada de límites    │
│    de recursos                 │
└─────────────────────────────────┘
```

```bash
# Crear sandbox manual con namespaces (ejemplo educativo)
# Requiere privilegios o user namespace habilitado

# Script simplificado para aislar proceso con namespaces
unshare --fork --pid --mount --net --uts --ipc --user \
  --map-root-user \
  /bin/bash

# Dentro del nuevo namespace:
ps aux  # Solo ve el proceso bash y sus hijos
ip addr show  # Solo loopback
id  # uid=0(root) pero mapeado a usuario no-privilegiado en host
```

```bash
# Firejail: perfil de sandbox para aplicación específica
# /etc/firejail/firefox.profile (ejemplo simplificado)

# Aislamiento de red (opcional)
net none

# Sistema de archivos privado
private /home/user/.mozilla
private-tmp

# Restricción de syscalls mediante seccomp
seccomp
seccomp.drop @obsolete @debug @mount @privileged @resources

# Denegar acceso a dispositivos sensibles
blacklist /dev/snd
blacklist /dev/video*
blacklist /sys/firmware

# Ejecutar aplicación con perfil
firejail --profile=/etc/firejail/firefox.profile firefox
```

> User namespaces son críticos para sandboxing seguro: permiten que un proceso ejecute como root dentro del sandbox mientras está mapeado a un usuario no privilegiado en el host. Sin embargo, user namespaces han sido históricamente fuente de vulnerabilidades de escalada de privilegios; algunas distribuciones los deshabilitan por defecto. Evaluar la postura de seguridad de tu distribución antes de confiar en user namespaces para aislamiento fuerte.

### Seccomp-bpf: filtrado de syscalls mediante políticas declarativas

Seccomp (secure computing mode) permite restringir las llamadas al sistema que un proceso puede invocar, reduciendo drásticamente la superficie de ataque incluso si el proceso es comprometido.

```text
Flujo de filtrado seccomp:

[Aplicación invoca syscall]
    ↓
[Kernel verifica filtro seccomp-bpf asociado al proceso]
    ↓
[Coincidencia con regla ALLOW → syscall ejecutada]
[Coincidencia con regla DENY → syscall bloqueada, errno EPERM]
[Sin coincidencia → acción por defecto (típicamente DENY)]

# Los filtros se compilan a BPF (Berkeley Packet Filter)
# para evaluación eficiente en kernel space
```

```bash
# Generar perfil seccomp para una aplicación
# Usar strace para identificar syscalls necesarios

strace -c firefox 2>&1 | grep -E "^[a-z]" | awk '{print $1}' | sort -u > syscalls-needed.txt

# Crear perfil seccomp básico (ejemplo simplificado)
cat > firefox-seccomp.json << 'EOF'
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64"],
  "syscalls": [
    {
      "names": ["read", "write", "open", "close", "fstat", "mmap", "munmap"],
      "action": "SCMP_ACT_ALLOW"
    },
    {
      "names": ["execve", "ptrace", "mount", "unshare"],
      "action": "SCMP_ACT_ERRNO"
    }
  ]
}
EOF

# Aplicar perfil con Docker/runc
docker run --security-opt seccomp=firefox-seccomp.json firefox-image
```

```yaml
# gVisor: emulación de kernel en espacio de usuario
# gVisor intercepta syscalls en userspace (Sentry) en lugar de pasarlas al kernel host

gvisor_architecture:
  componentes:
    sentry: "Kernel en userspace que emula API de Linux"
    gofer: "Servidor de archivos que provee sistema de archivos aislado"
    runsc: "Runtime OCI que integra con Docker/containerd"
  
  flujo_de_syscall:
    - "Aplicación invoca syscall (ej: open())"
    - "Ptrace o ptrace-like intercepta la llamada"
    - "Sentry procesa la syscall en userspace"
    - "Si requiere acceso a host, Sentry usa syscalls mínimas y filtradas"
    - "Resultado devuelto a aplicación como si viniera del kernel"
  
  ventajas:
    - "Superficie de ataque reducida: Sentry expone menos syscalls que kernel completo"
    - "Aislamiento reforzado: vulnerabilidad en aplicación no accede directamente al kernel host"
    - "Políticas granulares: se pueden deshabilitar syscalls peligrosas por defecto"
  
  limitaciones:
    - "Overhead de rendimiento: 10-30% vs. runc estándar"
    - "Compatibilidad: no todas las syscalls están implementadas"
    - "Debugging complejo: stack traces atraviesan userspace/kernel boundary"
```

> gVisor es particularmente útil en entornos multi-tenant donde cargas no confiables se ejecutan en el mismo host: proporciona aislamiento cercano a VM con overhead moderado. Sin embargo, no es un reemplazo universal para VMs: cargas que requieren syscalls no soportadas, módulos de kernel custom, o rendimiento de E/S máximo pueden no ser adecuadas para gVisor.

## Comparativa de seguridad: modelos de amenaza y garantías de aislamiento

La elección entre sandbox y VM debe basarse en un análisis explícito del modelo de amenaza: ¿qué atacante se intenta contener, qué activos se protegen, y qué consecuencias tendría un escape?

```text
Comparativa de garantías de seguridad:

┌─────────────────────────────────┐
│  Vector de Ataque             │ Sandbox       │ VM            │
├─────────────────────────────────┤
│  Escape de proceso            │ ⚠️ Posible   │ ✅ Aislado    │
│  mediante kernel exploit      │ (kernel compartido)│ (kernel independiente)│
├─────────────────────────────────┤
│  Acceso a recursos del host   │ ⚠️ Depende   │ ✅ Previene   │
│  (archivos, red, dispositivos)│ de configuración│ por diseño │
├─────────────────────────────────┤
│  Side-channel attacks         │ ⚠️ Posible   │ ⚠️ Posible   │
│  (Spectre, Meltdown)          │ (mismo kernel)│ (mismo hardware)│
├─────────────────────────────────┤
│  Compromiso de hipervisor     │ N/A          │ ⚠️ Posible   │
│  (CVE en VMM)                 │              │ (pero raro)  │
├─────────────────────────────────┤
│  Configuración errónea        │ ⚠️ Riesgo alto│ ⚠️ Riesgo medio│
│  (seccomp mal definido,      │ (muchas opciones)│ (menos opciones)│
│   namespaces incompletos)    │              │              │
├─────────────────────────────────┤
│  Defensa en profundidad       │ ✅ Capas     │ ✅ Capas     │
│  (seccomp + namespaces +     │ múltiples    │ múltiples    │
│   AppArmor/SELinux)          │              │              │
└─────────────────────────────────┘
```

```bash
# Evaluar configuración de sandbox con herramientas de auditoría
# Checkov o docker-bench-security para contenedores

# Ejemplo: verificar que un contenedor no ejecuta como root
docker inspect <container> --format '{{.Config.User}}'
# Debería ser no-root: "1000" o "appuser"

# Verificar capabilities droppadas
docker inspect <container> --format '{{.HostConfig.CapDrop}}'
# Debería incluir: ALL, o al menos capacidades peligrosas

# Verificar perfil seccomp activo
docker inspect <container> --format '{{.HostConfig.SecurityOpt}}'
# Debería incluir: seccomp profile no "unconfined"
```

```yaml
# Modelo de amenaza: selección de tecnología por escenario
threat_model_selection:
  aplicacion_desarrollo_local:
    atacante: "Código accidentalmente malicioso o con bugs"
    activos: "Archivos del desarrollador, credenciales locales"
    tecnologia_recomendada: "Firejail o Bubblewrap"
    justificacion: "Overhead mínimo, aislamiento suficiente para errores no maliciosos"
  
  plataforma_ci_cd_multi_tenant:
    atacante: "Código de terceros potencialmente malicioso"
    activos: "Secretos de CI, artefactos de build, otros jobs"
    tecnologia_recomendada: "gVisor o VM por job"
    justificacion: "Aislamiento reforzado requerido; gVisor balancea seguridad/rendimiento"
  
  procesamiento_de_datos_sensibles:
    atacante: "Atacante sofisticado con recursos"
    activos: "Datos PII, claves criptográficas, propiedad intelectual"
    tecnologia_recomendada: "VM con cifrado de memoria (SEV/TDX)"
    justificacion: "Aislamiento de kernel crítico; sandbox no proporciona garantías suficientes"
  
  edge_iot_dispositivos_limitados:
    atacante: "Atacante remoto que explota vulnerabilidad de app"
    activos: "Funcionalidad del dispositivo, acceso a red local"
    tecnologia_recomendada: "Sandbox ligero (Bubblewrap) + seccomp estricto"
    justificacion: "Recursos limitados no permiten VM; sandbox bien configurado es suficiente"
```

> Ninguna tecnología proporciona seguridad perfecta: un sandbox mal configurado puede ser menos seguro que ejecutar sin aislamiento, y una VM con hipervisor desactualizado puede ser vulnerable a escapes conocidos. La seguridad efectiva requiere: (1) configuración explícita y minimalista, (2) parcheo oportuno de todas las capas, (3) monitoreo de intentos de escape, y (4) defensa en profundidad con múltiples capas de control.

## Rendimiento y densidad: trade-offs prácticos entre overhead y aislamiento

La ventaja principal de los sandbox sobre las VMs es el rendimiento: al evitar la virtualización de hardware y la traducción de instrucciones privilegiadas, los sandbox logran tiempos de arranque cercanos a instantáneos y overhead de ejecución mínimo. Sin embargo, esta eficiencia tiene un costo en densidad de aislamiento y garantías de seguridad.

```text
Comparativa de métricas de rendimiento típicas:

┌─────────────────────────────────┐
│  Tiempo de arranque           │
│  • VM: 30-90 segundos         │
│  • gVisor: 2-5 segundos       │
│  • Firejail: <500 ms          │
│  • Proceso nativo: <100 ms    │
├─────────────────────────────────┤
│  Consumo de memoria base      │
│  • VM: 200-500 MB (kernel +  │
│    servicios SO invitado)    │
│  • gVisor: 50-150 MB (Sentry)│
│  • Firejail: 5-20 MB         │
│    (solo namespaces + app)   │
├─────────────────────────────────┤
│  Overhead de CPU            │
│  • VM: 2-8% (VM Exits, EPT) │
│  • gVisor: 10-30% (syscall  │
│    interception)            │
│  • Firejail: <2-5%          │
│    (namespaces + seccomp)   │
├─────────────────────────────────┤
│  Latencia de syscall        │
│  • Nativo: ~100-500 ns      │
│  • Firejail: +10-20%        │
│  • gVisor: +50-200%         │
│  • VM: +20-50% (paravirt)   │
├─────────────────────────────────┤
│  Densidad por host físico   │
│  • VM: 10-50 instancias     │
│  • gVisor: 50-200 sandboxes │
│  • Firejail: 100-500+       │
│    procesos aislados        │
└─────────────────────────────────┘
```

```bash
# Benchmark de overhead de syscall con gVisor vs runc
# Usar sysbench para medir latencia de operaciones básicas

# Contenedor estándar (runc)
docker run --rm -it sysbench/sysbench \
  sysbench memory --memory-block-size=1K --memory-total-size=100G run

# Mismo contenedor con gVisor
docker run --runtime=runsc --rm -it sysbench/sysbench \
  sysbench memory --memory-block-size=1K --memory-total-size=100G run

# Comparar resultados: gVisor típicamente 10-30% más lento
# para operaciones intensivas en syscalls
```

```bash
# Benchmark de arranque: Firejail vs VM
# Medir tiempo desde comando hasta aplicación lista

# Firejail (aislamiento ligero)
time firejail --net=none firefox --new-instance --no-remote
# Típico: 2-4 segundos hasta ventana visible

# VM con aplicación (ej: Firefox en VM ligera)
time virsh start firefox-vm && \
  virsh console firefox-vm  # Hasta sesión gráfica lista
# Típico: 30-60 segundos

# Ratio: ~10-20x más rápido con sandbox para cargas interactivas
```

```yaml
# Guía de selección por perfil de rendimiento
performance_selection_guide:
  alta_frecuencia_de_invocacion:
    escenario: "Funciones serverless, jobs CI/CD efímeros"
    recomendacion: "Sandbox ligero (Firejail, Bubblewrap)"
    justificacion: "Overhead mínimo crítico cuando se ejecutan miles de invocaciones"
  
  cargas_con_syscalls_intensivas:
    escenario: "Compiladores, bases de datos, procesamiento de logs"
    recomendacion: "VM o gVisor con profiling previo"
    justificacion: "gVisor puede añadir 30%+ overhead en cargas syscall-heavy"
  
  aislamiento_multi_tenant:
    escenario: "Plataforma PaaS con código de múltiples usuarios"
    recomendacion: "gVisor o VM por tenant"
    justificacion: "Firejail no proporciona aislamiento suficiente contra atacantes sofisticados"
  
  edge_devices_con_recursos_limitados:
    escenario: "IoT, gateways, dispositivos embebidos"
    recomendacion: "Sandbox minimalista (Bubblewrap + seccomp)"
    justificacion: "VMs pueden consumir recursos prohibidos en dispositivos con <1GB RAM"
```

> El overhead de gVisor no es uniforme: cargas que invocan muchas syscalls (compilación, E/S intensiva) sufren más que cargas con computación pura. Perfilar la aplicación con `strace -c` antes de decidir si gVisor es adecuado puede evitar sorpresas de rendimiento en producción.

## Casos de uso ideales: cuándo elegir sandbox, cuándo elegir VM

La selección entre sandbox y VM debe basarse en requisitos específicos de aislamiento, rendimiento y operatividad, no en preferencias tecnológicas. Cada modelo resuelve problemas distintos, y en muchos escenarios modernos, la combinación de ambas proporciona el equilibrio óptimo.

```text
Matriz de decisión: Sandbox vs. VM vs. Híbrido

┌─────────────────────────────────┐
│  Caso de Uso                  │ Tecnología Recomendada │
├─────────────────────────────────┤
│ Aplicaciones de escritorio    │ Sandbox (Firejail)    │
│ en entorno de desarrollo      │ • Aislamiento suficiente│
│ • Aislar navegador, editor   │   para errores no      │
│ • Prevenir acceso accidental  │   maliciosos          │
│   a archivos sensibles       │ • Overhead mínimo      │
├─────────────────────────────────┤
│ Ejecución de código de       │ gVisor o VM          │
│ terceros no confiable        │ • Multi-tenant PaaS   │
│ • CI/CD con builds de usuarios│ • gVisor: equilibrio │
│ • Plugins o extensiones      │   seguridad/rendimiento│
│   de fuentes externas        │ • VM: aislamiento máximo│
├─────────────────────────────────┤
│ Procesamiento de datos       │ VM (típicamente)      │
│ sensibles o regulados        │ • Compliance requiere│
│ • PII, PHI, datos financieros│   aislamiento de kernel│
│ • Requisitos de auditoría    │ • Cifrado de memoria  │
│   estrictos                  │   (SEV/TDX) disponible│
├─────────────────────────────────┤
│ Edge computing / IoT         │ Sandbox ligero        │
│ • Dispositivos con recursos  │ • Bubblewrap + seccomp│
│   limitados                  │ • Perfil minimalista  │
│ • Aislamiento básico contra  │ • VMs pueden ser      │
│   exploits de aplicación     │   prohibitivas en RAM │
├─────────────────────────────────┤
│ Contenedores en Kubernetes   │ gVisor para cargas    │
│ multi-tenant                 │   no confiables       │
│ • Cluster compartido entre   │ • runc estándar para  │
│   equipos o organizaciones   │   cargas confiables   │
│ • RuntimeClass para selección│ • Policy-as-code para│
│   granular por workload      │   aplicar automáticamente│
├─────────────────────────────────┤
│ Análisis de malware o        │ VM con snapshot       │
│ investigación de seguridad   │ • Aislamiento fuerte  │
│ • Ejecutar muestras          │   contra escapes      │
│   potencialmente maliciosas  │ • Revertir a snapshot│
│ • Requiere contención máxima │   tras análisis       │
└─────────────────────────────────┘
```

```yaml
# Patrón híbrido: sandbox dentro de VM (máxima defensa en profundidad)
# Combina aislamiento de kernel (VM) con granularidad de sandbox

hybrid_sandbox_vm_pattern:
  arquitectura:
    - "VM proporciona aislamiento de kernel y hardware"
    - "Dentro de cada VM, sandbox (gVisor/Firejail) aísla procesos individuales"
    - "Doble capa de defensa: escape de sandbox requiere también escape de VM"
  
  casos_de_uso:
    - "Plataformas de ejecución de código no confiable (Replit, Glitch)"
    - "Entornos de investigación de malware con análisis automatizado"
    - "Procesamiento de datos sensibles con requisitos de compliance estricto"
  
  consideraciones:
    - "Overhead acumulativo: VM + sandbox puede ser 15-40% vs. nativo"
    - "Complejidad operativa: gestionar dos capas de políticas y monitoreo"
    - "Debugging más complejo: stack traces atraviesan múltiples fronteras"
  
  herramientas_que_facilitan:
    - "Kata Containers: runtime OCI que ejecuta cada contenedor en micro-VM"
    - "gVisor en VM: combinar aislamiento de kernel con emulación de syscalls"
    - "Kubernetes RuntimeClass: seleccionar runtime por workload declarativamente"
```

```bash
# Ejemplo: configurar gVisor en Kubernetes con RuntimeClass
# Permite seleccionar sandbox vs. runc estándar por deployment

# 1. Instalar runtime gVisor en nodos del cluster
# (siguiendo documentación oficial de gVisor + containerd)

# 2. Definir RuntimeClass en Kubernetes
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor
handler: runsc  # Nombre del runtime en containerd

# 3. Usar RuntimeClass en un Deployment para cargas no confiables
apiVersion: apps/v1
kind: Deployment
metadata:
  name: untrusted-workload
spec:
  template:
    spec:
      runtimeClassName: gvisor  # ← Usa gVisor en lugar de runc
      containers:
      - name: app
        image: third-party/untrusted-app:latest
        securityContext:
          runAsNonRoot: true
          allowPrivilegeEscalation: false
          capabilities:
            drop: ["ALL"]

# 4. Cargas confiables pueden usar runtime por defecto (runc)
# sin especificar runtimeClassName
```

> El patrón híbrido (sandbox dentro de VM) es particularmente valioso en entornos donde el modelo de amenaza incluye atacantes sofisticados con recursos: incluso si un atacante escapa del sandbox mediante un exploit de kernel userspace, todavía enfrenta la frontera de la VM. Sin embargo, esta defensa en profundidad tiene un costo en complejidad y rendimiento que debe justificarse mediante análisis de riesgo explícito.

## Quédate con...

- La **diferencia arquitectónica fundamental**: sandbox aíslan procesos mediante namespaces/seccomp compartiendo el kernel del host; VMs virtualizan hardware y ejecutan kernels independientes.
- El **modelo de amenaza determina la tecnología**: sandbox son adecuados para errores no maliciosos o código semi-confiable; VMs son necesarias para aislamiento fuerte contra atacantes sofisticados.
- Los **namespaces de Linux** (pid, net, mount, user) proporcionan aislamiento de vista pero no protegen contra exploits de kernel; seccomp-bpf reduce la superficie de ataque filtrando syscalls peligrosas.
- **gVisor intercepta syscalls en userspace**, proporcionando aislamiento reforzado con overhead moderado (10-30%); útil para multi-tenant pero no universalmente adecuado.
- El **rendimiento de sandbox es superior**: arranque en milisegundos vs. minutos, overhead de CPU <5% para Firejail vs. 2-8% para VMs, pero con garantías de seguridad más débiles.
- **User namespaces son críticos pero riesgosos**: permiten root en sandbox sin root en host, pero han sido fuente de vulnerabilidades; evaluar postura de la distribución antes de confiar en ellos para aislamiento fuerte.
- La **configuración explícita es esencial**: un sandbox mal configurado puede ser menos seguro que ejecutar sin aislamiento; aplicar principio de mínimo privilegio en seccomp, capabilities y mounts.
- El **patrón híbrido** (sandbox dentro de VM) proporciona defensa en profundidad máxima para cargas de alto riesgo, pero con overhead acumulativo y complejidad operativa que deben justificarse.
- **Kubernetes RuntimeClass** permite seleccionar runtime (runc, gVisor, kata) por workload de forma declarativa, facilitando políticas de seguridad granulares en clusters multi-tenant.
- Ninguna tecnología es universalmente superior: la arquitectura moderna frecuentemente combina ambas, usando sandbox para agilidad y VMs para aislamiento fuerte, seleccionadas mediante análisis explícito de modelo de amenaza y requisitos de rendimiento.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/comparacion/emulacion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/comparacion/serverless" class="next">Siguiente</a>
</div>
