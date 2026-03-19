---
title: "Virtualización vs. Contenedores (Docker, Podman)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Virtualización vs. Contenedores](#virtualización-vs-contenedores)
  - [Arquitectura de aislamiento: hipervisores vs. namespaces del kernel](#arquitectura-de-aislamiento-hipervisores-vs-namespaces-del-kernel)
  - [Mecanismos de aislamiento técnico: comparación profunda de primitivas de seguridad](#mecanismos-de-aislamiento-técnico-comparación-profunda-de-primitivas-de-seguridad)
  - [Rendimiento y densidad: trade-offs entre overhead de virtualización y eficiencia de contenedores](#rendimiento-y-densidad-trade-offs-entre-overhead-de-virtualización-y-eficiencia-de-contenedores)
  - [Casos de uso ideales: cuándo elegir VMs, cuándo elegir contenedores, y cuándo combinar ambos](#casos-de-uso-ideales-cuándo-elegir-vms-cuándo-elegir-contenedores-y-cuándo-combinar-ambos)
  - [Quédate con...](#quédate-con)

</div>

# Virtualización vs. Contenedores

La comparación entre máquinas virtuales y contenedores no es una disputa binaria sobre qué tecnología es "mejor", sino un ejercicio de comprensión arquitectónica sobre cómo diferentes mecanismos de aislamiento resuelven problemas distintos en el espectro de la computación distribuida. Las máquinas virtuales logran aislamiento mediante la abstracción completa del hardware, ejecutando sistemas operativos invitados independientes con sus propios kernels, controladores y pilas de red; los contenedores, en cambio, implementan aislamiento a nivel de proceso mediante primitivas del kernel Linux (namespaces, cgroups, capabilities), compartiendo el kernel del host mientras mantienen espacios de usuario separados. Esta diferencia fundamental tiene implicaciones profundas en densidad de consolidación, tiempo de arranque, superficie de ataque, portabilidad y modelo operativo. Comprender los mecanismos subyacentes —desde las tablas de páginas anidadas de la virtualización hasta los namespaces de red de los contenedores— permite seleccionar la tecnología adecuada para cada caso de uso, evitando errores costosos como contenerizar aplicaciones monolíticas que requieren kernel personalizado o virtualizar microservicios stateless que se beneficiarían de la agilidad de los contenedores.

## Arquitectura de aislamiento: hipervisores vs. namespaces del kernel

La diferencia arquitectónica fundamental entre VMs y contenedores reside en el nivel de la pila de software donde se implementa el aislamiento y qué recursos se virtualizan versus qué recursos se comparten.

```text
Pila de aislamiento comparada:

Máquina Virtual (KVM/Xen/ESXi):
┌─────────────────────────────────┐
│  Aplicación + Dependencias     │
├─────────────────────────────────┤
│  Sistema Operativo Invitado    │  ← Kernel completo, drivers, systemd
│  (Linux/Windows/BSD)           │
├─────────────────────────────────┤
│  Hipervisor (VMM)              │  ← Trap-and-emulate, EPT/RVI
├─────────────────────────────────┤
│  Sistema Operativo Anfitrión   │  ← Solo en Tipo 2
├─────────────────────────────────┤
│  Hardware Físico               │  ← CPU, RAM, disco, NIC reales
└─────────────────────────────────┘

Contenedor (Docker/Podman/containerd):
┌─────────────────────────────────┐
│  Aplicación + Dependencias     │
├─────────────────────────────────┤
│  Runtime de Contenedor         │  ← runc, crun, kata-runtime
├─────────────────────────────────┤
│  Namespaces del Kernel         │  ← pid, net, mount, uts, ipc, user
│  Cgroups                       │  ← Límites de CPU, memoria, I/O
│  Capabilities                  │  ← Privilegios granulares
│  SELinux/AppArmor              │  ← Políticas de seguridad obligatorias
├─────────────────────────────────┤
│  Kernel del Host (compartido)  │  ← Único punto de fallo/actualización
├─────────────────────────────────┤
│  Hardware Físico               │
└─────────────────────────────────┘
```

```bash
# Verificar namespaces activos en un contenedor Docker
docker run --rm alpine nsenter --help 2>&1 | head -5

# Dentro de un contenedor en ejecución, observar aislamiento de namespaces
docker run -d --name test-ns alpine sleep 3600
docker exec test-ns ls -la /proc/self/ns/

# Salida típica:
# total 0
# dr-x--x--x 2 root root 0 Jan 15 10:30 .
# lrwxrwxrwx 1 root root 0 Jan 15 10:30 cgroup -> 'cgroup:[4026532346]'
# lrwxrwxrwx 1 root root 0 Jan 15 10:30 ipc -> 'ipc:[4026532348]'
# lrwxrwxrwx 1 root root 0 Jan 15 10:30 mnt -> 'mnt:[4026532344]'
# lrwxrwxrwx 1 root root 0 Jan 15 10:30 net -> 'net:[4026532350]'
# lrwxrwxrwx 1 root root 0 Jan 15 10:30 pid -> 'pid:[4026532347]'
# lrwxrwxrwx 1 root root 0 Jan 15 10:30 user -> 'user:[4026532343]'
# lrwxrwxrwx 1 root root 0 Jan 15 10:30 uts -> 'uts:[4026532345]'

# Comparar con el host: los valores de inode serán diferentes
ls -la /proc/1/ns/ | grep -E 'pid|net|mnt'
```

```bash
# Verificar cgroups aplicados a un contenedor
docker inspect test-ns --format '{{.HostConfig.CpuShares}} {{.HostConfig.Memory}}'

# Salida: 1024 1073741824 (1024 shares de CPU, 1GB límite de memoria)

# Verificar en el sistema de archivos cgroups del host
cat /sys/fs/cgroup/cpu/docker/<container-id>/cpu.shares
cat /sys/fs/cgroup/memory/docker/<container-id>/memory.limit_in_bytes
```

> Los namespaces proporcionan aislamiento de vista: un proceso en un namespace de PID no ve procesos de otros namespaces; un namespace de red tiene su propia pila de red, interfaces y tablas de enrutamiento. Sin embargo, todos los contenedores comparten el mismo kernel: una vulnerabilidad que permita escape de namespace o explotación de una syscall puede comprometer el host y todos los contenedores. Las VMs, al tener kernels independientes, contienen este tipo de fallos dentro del guest.

## Mecanismos de aislamiento técnico: comparación profunda de primitivas de seguridad

```text
Comparativa de mecanismos de aislamiento:

┌─────────────────────────────────┐
│  Máquina Virtual               │
│  • Aislamiento: hardware       │
│    asistido (VT-x/AMD-V)       │
│  • Memoria: tablas anidadas    │
│    (EPT/RVI), GPA→HPA mapping │
│  • CPU: modo Root/Non-Root,   │
│    VM Exit/Entry              │
│  • Red: vNIC emulada o        │
│    paravirtualizada, vSwitch  │
│  • Disco: archivo/volumen     │
│    virtual, controlador emulado│
│  • Kernel: independiente por  │
│    VM, actualizable sin afectar│
│    otras cargas               │
├─────────────────────────────────┤
│  Contenedor                   │
│  • Aislamiento: namespaces del│
│    kernel Linux               │
│  • Memoria: cgroups memory    │
│    controller, sin traducción│
│    de páginas adicional      │
│  • CPU: cgroups cpu controller│
│    + CPU quotas, sin VM Exits│
│  • Red: network namespace +  │
│    veth pairs, CNI plugins   │
│  • Disco: overlayfs/aufs para│
│    capas de imagen, bind mounts│
│  • Kernel: compartido con    │
│    host, actualización requiere│
│    reinicio de todos los contenedores│
└─────────────────────────────────┘
```

```bash
# Demostración de aislamiento de red en contenedores
# Crear dos contenedores en redes diferentes

docker network create isolated-net-1
docker network create isolated-net-2

docker run -d --name app1 --network isolated-net-1 nginx
docker run -d --name app2 --network isolated-net-2 nginx

# app1 no puede alcanzar app2 por IP o nombre
docker exec app1 ping -c 1 app2  # Falla: nombre no resuelto
docker exec app1 ping -c 1 172.20.0.2  # Falla: ruta no alcanzable (IP de app2)

# Conectar ambos a una red común para permitir comunicación
docker network connect isolated-net-1 app2
docker exec app1 ping -c 1 app2  # Ahora funciona
```

```bash
# Demostración de límites de recursos con cgroups
# Ejecutar contenedor con límites estrictos de CPU y memoria

docker run --rm -it \
  --cpus="0.5" \              # Máximo 50% de un núcleo CPU
  --memory="256m" \           # Límite de memoria 256MB
  --memory-swap="256m" \      # Sin swap adicional
  --pids-limit=50 \           # Máximo 50 procesos
  alpine sh

# Dentro del contenedor, intentar consumir recursos:
# Instalar stress-ng y ejecutar carga
apk add stress-ng
stress-ng --cpu 2 --timeout 30s  # Solo podrá usar 0.5 CPU

# Verificar límites aplicados desde el host:
cat /sys/fs/cgroup/cpu/docker/<id>/cpu.cfs_quota_us  # Debería ser 50000 (50% de 100000μs)
cat /sys/fs/cgroup/memory/docker/<id>/memory.limit_in_bytes  # 268435456 (256MB)
```

```yaml
# Comparativa de superficie de ataque
security_attack_surface:
  maquina_virtual:
    vectores_potenciales:
      - "Escape de VM mediante vulnerabilidad en hipervisor (CVE-2021-21972)"
      - "Ataques side-channel entre VMs (Spectre, Meltdown, L1TF)"
      - "Compromiso de guest no propaga automáticamente a otras VMs"
    
    mitigaciones:
      - "Parcheo oportuno del hipervisor y microcódigo de CPU"
      - "CPU pinning y reservas para reducir contención"
      - "Cifrado de memoria (AMD SEV, Intel TDX) para cargas sensibles"
  
  contenedor:
    vectores_potenciales:
      - "Escape de contenedor mediante syscall vulnerable o misconfiguración"
      - "Kernel exploit compromete todos los contenedores del host"
      - "Mounts privilegiados o capabilities excesivas facilitan escalada"
    
    mitigaciones:
      - "Ejecutar como usuario no-root (userns-remap en Docker)"
      - "Droppar capabilities innecesarias (--cap-drop ALL)"
      - "Usar seccomp profiles y AppArmor/SELinux para restringir syscalls"
      - "Considerar runtimes reforzados (gVisor, Kata Containers) para multi-tenant"
```

> Para entornos multi-tenant con cargas no confiables (plataformas PaaS públicas, CI/CD compartido), los contenedores estándar pueden no proporcionar aislamiento suficiente. En estos casos, considerar runtimes alternativos: gVisor (kernel en espacio de usuario que intercepta syscalls) o Kata Containers (cada contenedor ejecuta en una micro-VM con kernel ligero), que ofrecen aislamiento cercano a VM con overhead moderado.

## Rendimiento y densidad: trade-offs entre overhead de virtualización y eficiencia de contenedores

La diferencia arquitectónica entre VMs y contenedores se manifiesta directamente en métricas de rendimiento y densidad de consolidación. Los contenedores, al evitar la emulación de hardware y la traducción de instrucciones privilegiadas, logran tiempos de arranque órdenes de magnitud más rápidos y menor consumo de recursos base; las VMs, aunque introducen overhead, proporcionan aislamiento más robusto y compatibilidad con sistemas operativos heterogéneos.

```text
Comparativa de métricas de rendimiento típicas:

┌─────────────────────────────────┐
│  Tiempo de arranque            │
│  • VM Linux: 30-90 segundos    │
│  • Contenedor: 100-500 ms      │
│  • Diferencia: ~100x más rápido│
├─────────────────────────────────┤
│  Consumo de memoria base       │
│  • VM: 200-500 MB (kernel +   │
│    servicios del SO invitado) │
│  • Contenedor: 5-50 MB        │
│    (solo proceso + libs)      │
│  • Diferencia: ~10-50x menos  │
├─────────────────────────────────┤
│  Overhead de CPU             │
│  • VM: 2-8% (VM Exits, EPT)  │
│  • Contenedor: <1-2%         │
│    (syscalls directas)       │
├─────────────────────────────────┤
│  Latencia de E/S de disco    │
│  • VM: +15-25% (virtio-blk)  │
│  • Contenedor: +3-8%         │
│    (overlayfs + bind mounts) │
├─────────────────────────────────┤
│  Densidad por host físico    │
│  • VM: 10-50 instancias      │
│    (depende de recursos)     │
│  • Contenedor: 100-500+      │
│    (mismo kernel, menos overhead)│
└─────────────────────────────────┘
```

```bash
# Benchmark comparativo: tiempo de arranque
# VM KVM con libvirt
time virsh start test-vm --config
# Típico: 25-45 segundos hasta SSH disponible

# Contenedor Docker
time docker run --rm alpine true
# Típico: 200-400 ms desde comando hasta finalización

# Medición más precisa con múltiples iteraciones
for i in {1..10}; do
  start=$(date +%s%N)
  docker run --rm alpine true >/dev/null 2>&1
  end=$(date +%s%N)
  echo "Run $i: $(( (end-start)/1000000 )) ms"
done | awk '{sum+=$3} END {print "Average:", sum/NR, "ms"}'
```

```bash
# Benchmark de throughput de red: VM vs contenedor
# Usar iperf3 para medir ancho de banda máximo

# En host físico, iniciar servidor iperf3
iperf3 -s -p 5201

# Desde VM con virtio-net (2 vCPUs, 4GB RAM)
iperf3 -c 192.168.1.100 -t 30 -P 4
# Típico: 8-9 Gbps en enlace 10GbE (~85-90% del nativo)

# Desde contenedor con bridge network
docker run --rm networkstatic/iperf3 -c 192.168.1.100 -t 30 -P 4
# Típico: 9.5-9.8 Gbps en enlace 10GbE (~95-98% del nativo)

# Con host network mode (sin NAT/bridge overhead)
docker run --rm --network host networkstatic/iperf3 -c 192.168.1.100 -t 30 -P 4
# Típico: 9.9 Gbps (~99% del nativo, overhead mínimo)
```

```yaml
# Selección basada en perfil de rendimiento
performance_selection_guide:
  alta_frecuencia_de_despliegue:
    recomendacion: "Contenedores"
    justificacion: "Arranque en segundos vs. minutos permite CI/CD rápido, canary deployments, rollback instantáneo"
  
  cargas_con_picos_impredecibles:
    recomendacion: "Contenedores + orquestador (Kubernetes)"
    justificacion: "Escalado horizontal rápido, menor costo de recursos ociosos, mejor densidad"
  
  aplicaciones_con_kernel_personalizado:
    recomendacion: "Máquinas Virtuales"
    justificacion: "Contenedores comparten kernel del host; si se requiere módulo custom o versión específica, VM es necesaria"
  
  multi_tenancy_con_cargas_no_confiables:
    recomendacion: "VMs o contenedores con runtime reforzado (Kata, gVisor)"
    justificacion: "Aislamiento de kernel es crítico cuando diferentes tenants ejecutan código no confiable en el mismo hardware"
  
  sistemas_legacy_o_heterogéneos:
    recomendacion: "Máquinas Virtuales"
    justificacion: "Ejecutar Windows en host Linux, o kernel antiguo en hardware moderno, requiere virtualización completa"
```

> La densidad superior de contenedores no es gratuita: mayor número de procesos en el mismo kernel incrementa la contención por locks del kernel, presión en la tabla de procesos, y complejidad de troubleshooting. Monitorizar métricas del host (`/proc/sys/kernel/pid_max`, `kernel.threads-max`, cgroups pressure) cuando se ejecutan cientos de contenedores.

## Casos de uso ideales: cuándo elegir VMs, cuándo elegir contenedores, y cuándo combinar ambos

La elección entre virtualización y contenedores debe basarse en requisitos específicos de la carga de trabajo, no en preferencias tecnológicas. Cada arquitectura resuelve problemas distintos, y en muchos escenarios modernos, la combinación de ambas (contenedores ejecutándose dentro de VMs) proporciona el equilibrio óptimo entre aislamiento, portabilidad y agilidad operativa.

```text
Matriz de decisión: VM vs. Contenedor vs. Híbrido

┌─────────────────────────────────┐
│  Caso de Uso                  │ Tecnología Recomendada │
├─────────────────────────────────┤
│ Microservicios stateless      │ Contenedores + K8s    │
│ • Escalado horizontal rápido  │                       │
│ • Despliegue frecuente        │                       │
│ • Orquestación declarativa    │                       │
├─────────────────────────────────┤
│ Aplicaciones monolíticas      │ VM o Contenedor       │
│ legacy con dependencias       │ • Si requiere kernel  │
│ complejas                     │   custom: VM          │
│ • Difícil de refactorizar     │ • Si puede empaquetar│
│                               │   dependencias: contenedor│
├─────────────────────────────────┤
│ Bases de datos transaccionales│ VM (típicamente)      │
│ • Requieren kernel tuning     │ • Mejor control de    │
│ • Estado persistente crítico  │   E/S, aislamiento    │
│ • Actualizaciones planificadas│ • Contenedores posible│
│                               │   con volúmenes       │
│                               │   persistentes        │
├─────────────────────────────────┤
│ Entornos de desarrollo/pruebas│ Contenedores          │
│ • Efímeros, descartables      │ • Consistencia entre  │
│ • Múltiples configuraciones   │   dev/prod           │
│                               │ • Menor consumo de    │
│                               │   recursos locales    │
├─────────────────────────────────┤
│ Cargas multi-tenant públicas  │ VM o Kata Containers  │
│ • Aislamiento de seguridad    │ • VM: aislamiento     │
│   crítico                     │   fuerte, overhead mayor│
│ • Código no confiable         │ • Kata: equilibrio    │
│                               │   aislamiento/rendimiento│
├─────────────────────────────────┤
│ Sistemas operativos           │ Máquinas Virtuales    │
│ heterogéneos                  │ • Ejecutar Windows en │
│ • Windows en host Linux       │   host Linux          │
│ • Kernel antiguo en hardware  │ • Diferentes versiones│
│   moderno                     │   de SO en mismo hardware│
├─────────────────────────────────┤
│ Edge computing con recursos   │ Contenedores ligeros  │
│ limitados                     │ • Menor footprint de  │
│ • Dispositivos IoT, gateways  │   memoria/CPU         │
│ • Despliegue remoto           │ • Actualizaciones     │
│                               │   delta eficientes    │
└─────────────────────────────────┘
```

```yaml
# Patrón híbrido: contenedores dentro de VMs (común en Kubernetes on-premises)
# Proporciona aislamiento de kernel + agilidad de contenedores

hybrid_architecture_example:
  infraestructura_base:
    - "Cluster de VMs (KVM/ESXi) con recursos garantizados"
    - "Cada VM ejecuta un nodo Kubernetes (kubelet, container runtime)"
  
  beneficios:
    - "Aislamiento de fallos: problema en nodo K8s no afecta otros nodos"
    - "Actualizaciones de kernel por VM, sin downtime del cluster completo"
    - "Portabilidad: mismas imágenes de contenedor en cloud y on-premises"
    - "Gobernanza: políticas de seguridad aplicadas a nivel de VM y contenedor"
  
  consideraciones_operativas:
    - "Mayor complejidad: gestionar dos capas de orquestación (vCenter + K8s)"
    - "Overhead adicional: recursos para SO invitado en cada nodo"
    - "Networking: integrar CNI de K8s con vSwitch del hipervisor"
  
  herramientas_que_facilitan:
    - "Cluster API: provisionar nodos K8s como VMs de forma declarativa"
    - "KubeVirt: ejecutar VMs como recursos nativos de Kubernetes"
    - "Capsule/Kubernetes multi-tenancy: aislar tenants a nivel de namespace"
```

```bash
# Ejemplo: ejecutar contenedores Docker dentro de una VM KVM
# 1. Crear VM con soporte para virtualización anidada (nested virt)

# Habilitar nested virtualization en host KVM (Intel)
echo "options kvm-intel nested=1" | sudo tee /etc/modprobe.d/kvm-intel.conf
sudo modprobe -r kvm_intel && sudo modprobe kvm_intel

# Verificar que está habilitado
cat /sys/module/kvm_intel/parameters/nested  # Debe mostrar "Y"

# 2. En la VM guest, instalar Docker normalmente
# La VM "ve" extensiones de virtualización y puede ejecutar contenedores

# 3. Beneficio: aislamiento de kernel + portabilidad de contenedores
# Si el kernel del host se actualiza o tiene un problema, las VMs (y sus contenedores) continúan operando
```

> El patrón híbrido (contenedores en VMs) es dominante en entornos empresariales on-premises: proporciona el aislamiento y ciclo de vida de gestión de las VMs junto con la portabilidad y agilidad de los contenedores. En la nube pública, este patrón es menos común porque el proveedor ya gestiona el aislamiento físico; allí, los contenedores se ejecutan directamente sobre la infraestructura virtualizada del proveedor (EKS, AKS, GKE).

## Quédate con...

- La **diferencia arquitectónica fundamental**: VMs virtualizan hardware y ejecutan kernels independientes; contenedores comparten el kernel del host y aíslan procesos mediante namespaces y cgroups.
- El **aislamiento de VMs es más robusto**: un compromiso de kernel en un guest no propaga a otras VMs; en contenedores, un exploit de kernel puede afectar todos los contenedores del host.
- Los **contenedores son significativamente más ligeros**: arranque en segundos vs. minutos, consumo de memoria base 10-50x menor, y densidad de consolidación muy superior.
- La **selección de tecnología debe basarse en requisitos**: microservicios stateless → contenedores; sistemas heterogéneos o kernel custom → VMs; multi-tenant no confiable → VMs o runtimes reforzados (Kata, gVisor).
- Los **contenedores comparten el kernel del host**: esto habilita eficiencia pero requiere que todas las cargas sean compatibles con la misma versión de kernel y políticas de seguridad del host.
- El **patrón híbrido** (contenedores dentro de VMs) combina aislamiento de kernel con agilidad de contenedores, común en Kubernetes on-premises pero menos necesario en nube pública donde el aislamiento físico ya está gestionado.
- La **seguridad de contenedores requiere configuración explícita**: ejecutar como no-root, droppar capabilities, usar seccomp/AppArmor, y considerar runtimes reforzados para cargas sensibles; no asumir que "contenedor = seguro por defecto".
- El **rendimiento de contenedores es cercano al nativo** (<2% overhead) porque evitan VM Exits y traducción de memoria; las VMs introducen 2-8% de overhead pero proporcionan compatibilidad con SOs heterogéneos.
- La **portabilidad de contenedores** (imágenes OCI) facilita mover aplicaciones entre entornos; las VMs requieren formatos de exportación (OVF/OVA) y pueden tener dependencias de hardware virtual específico.
- Ninguna tecnología es universalmente superior: la arquitectura moderna frecuentemente combina ambas, usando VMs para aislamiento de infraestructura y contenedores para portabilidad y agilidad de aplicaciones.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/comparacion/emulacion" class="next">Siguiente</a>
</div>
