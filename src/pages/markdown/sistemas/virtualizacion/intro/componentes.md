---
title: "Componentes esenciales"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Componentes esenciales](#componentes-esenciales)
  - [Hipervisor: la capa de control que hace posible la abstracción](#hipervisor-la-capa-de-control-que-hace-posible-la-abstracción)
  - [Máquina anfitriona (host) vs. máquina invitada (guest): roles y responsabilidades en la arquitectura virtualizada](#máquina-anfitriona-host-vs-máquina-invitada-guest-roles-y-responsabilidades-en-la-arquitectura-virtualizada)
  - [Recursos compartidos: mecanismos de multiplexación y aislamiento para CPU, memoria, disco y red](#recursos-compartidos-mecanismos-de-multiplexación-y-aislamiento-para-cpu-memoria-disco-y-red)
    - [CPU: planificación de vCPUs y extensiones de hardware](#cpu-planificación-de-vcpus-y-extensiones-de-hardware)
    - [Memoria: tablas de páginas anidadas y técnicas de sobrecompromiso](#memoria-tablas-de-páginas-anidadas-y-técnicas-de-sobrecompromiso)
    - [Almacenamiento: discos virtuales, controladores paravirtualizados y caché](#almacenamiento-discos-virtuales-controladores-paravirtualizados-y-caché)
    - [Red: switches virtuales, NICs paravirtualizadas y aislamiento de tráfico](#red-switches-virtuales-nics-paravirtualizadas-y-aislamiento-de-tráfico)
  - [Quédate con...](#quédate-con)

</div>

# Componentes esenciales

La virtualización no es magia: es ingeniería de sistemas aplicada mediante una arquitectura de capas bien definida. Comprender sus componentes esenciales —hipervisor, host, guest y la gestión de recursos compartidos— no es un ejercicio académico, sino un requisito para diseñar, operar y solucionar problemas en infraestructuras virtualizadas con rigor. Cada componente tiene responsabilidades técnicas precisas: el hipervisor intercepta y traduce instrucciones privilegiadas, el host proporciona el sustrato físico, el guest ejecuta cargas de trabajo aisladas, y los mecanismos de asignación de recursos garantizan que la multiplexación no degrade el rendimiento ni comprometa el aislamiento. Dominar esta arquitectura permite tomar decisiones informadas sobre configuración, capacidad y seguridad, evitando errores comunes como el sobrecompromiso de recursos o la exposición de superficies de ataque innecesarias.

## Hipervisor: la capa de control que hace posible la abstracción

El hipervisor (también llamado Virtual Machine Monitor, VMM) es el componente fundamental de la virtualización: una capa de software que crea, ejecuta y gestiona máquinas virtuales, actuando como árbitro entre los recursos físicos y las demandas de los sistemas invitados. Su función crítica es **interceptar instrucciones sensibles** (aquellas que acceden a hardware o modifican estado privilegiado) y **traducirlas** a operaciones seguras sobre el hardware real, manteniendo la ilusión de que cada VM tiene control exclusivo del sistema.

Existen dos mecanismos principales de interceptación:

| Mecanismo | Funcionamiento | Ventajas | Limitaciones |
|-----------|---------------|----------|-------------|
| **Trap-and-emulate** | Instrucciones privilegiadas generan excepciones que el hipervisor maneja | Transparente para el guest, sin modificar SO | Requiere hardware con soporte (VT-x/AMD-V) para eficiencia |
| **Paravirtualización** | El guest usa hypercalls explícitos para operaciones privilegiadas | Menor overhead, mayor rendimiento | Requiere modificar el kernel del guest (no siempre posible) |

```c
// Pseudocódigo conceptual de trap-and-emulate en hipervisor
void handle_vm_exit(VM *vm, CPUState *cpu) {
    switch (cpu->exit_reason) {
        case EXIT_REASON_PRIVILEGED_INSTRUCTION:
            // Intercepta instrucción sensible (ej: CLI, STI, IN, OUT)
            emulate_instruction(cpu, cpu->instruction);
            break;
        case EXIT_REASON_MEMORY_ACCESS:
            // Maneja acceso a memoria no mapeada o protegida
            handle_ept_violation(vm, cpu->fault_address);
            break;
        case EXIT_REASON_IO_INSTRUCTION:
            // Emula acceso a dispositivo de E/S virtual
            emulate_io_port(vm, cpu->port, cpu->direction);
            break;
    }
    // Reanuda ejecución de la VM
    vm_resume(vm);
}
```

> El hipervisor opera en el nivel de privilegio más alto del sistema (a menudo llamado "root mode" o "ring -1"), por encima del kernel del SO invitado (ring 0). Esta jerarquía es esencial para garantizar que ninguna VM pueda escapar a su entorno aislado sin vulnerabilidades explícitas.

## Máquina anfitriona (host) vs. máquina invitada (guest): roles y responsabilidades en la arquitectura virtualizada

La distinción entre host y guest define la frontera de control y responsabilidad en una infraestructura virtualizada:

```text
Jerarquía de privilegios en virtualización de hardware:

┌─────────────────────────────┐
│  Guest OS (Ring 0 virtual)  │  ← Cree tener control total, pero está confinado
├─────────────────────────────┤
│  Hipervisor (Root Mode)     │  ← Control real del hardware, gestiona traps
├─────────────────────────────┤
│  Hardware físico            │  ← CPU, memoria, dispositivos reales
└─────────────────────────────┘
```

| Componente | Rol técnico | Responsabilidades clave |
|------------|-------------|------------------------|
| **Host (anfitrión)** | Plataforma física o SO base que aloja el hipervisor | Proveer recursos físicos, ejecutar el hipervisor, gestionar acceso a dispositivos |
| **Guest (invitado)** | Sistema operativo ejecutándose dentro de una VM | Ejecutar aplicaciones, gestionar sus propios recursos lógicos, respetar límites asignados |

En hipervisores Tipo 1 (bare-metal), el host es esencialmente el firmware + hipervisor; en Tipo 2, el host es un SO convencional (Windows, Linux, macOS) que ejecuta el hipervisor como aplicación.

```bash
# Identificar rol en sistema KVM/Linux
# En el host físico:
lsmod | grep kvm  # → kvm_intel/kvm_amd cargados = host de virtualización

# Dentro de una VM:
systemd-detect-virt  # → Devuelve "kvm" si se ejecuta como guest
# Salida típica: kvm
```

> En entornos de producción, el host debe estar hardenizado: servicios mínimos, parches actualizados, acceso restringido. Un compromiso del host compromete potencialmente todas las VMs que gestiona, independientemente del aislamiento entre guests.

## Recursos compartidos: mecanismos de multiplexación y aislamiento para CPU, memoria, disco y red

La virtualización permite que múltiples VMs compartan recursos físicos finitos mediante mecanismos de planificación, asignación y aislamiento. Cada recurso requiere estrategias específicas para equilibrar rendimiento, equidad y seguridad.

### CPU: planificación de vCPUs y extensiones de hardware

Las vCPUs de una VM son hilos del proceso del hipervisor planificados por el scheduler del host. Las extensiones de virtualización (Intel VT-x, AMD-V) permiten ejecutar código guest en modo "non-root", donde instrucciones privilegiadas generan VM-exits controlados.

```bash
# Verificar planificación de vCPUs en KVM (host)
ps -eLo pid,tid,class,rtprio,ni,pri,psr,pcpu,stat,comm | grep kvm

# Ejemplo de salida:
# 12345 12346 TS   -      0  19   2  12.5 Sl   qemu-kvm

# Limitar vCPUs a núcleos físicos específicos (CPU pinning)
virsh emulatorpin mi-vm --cpulist 0-3 --live
```

> El "CPU ready time" (tiempo que una vCPU espera para ser planificada) es una métrica crítica de contención. Valores sostenidos >10-20% indican sobrecompromiso y degradación del rendimiento guest.

### Memoria: tablas de páginas anidadas y técnicas de sobrecompromiso

La virtualización de memoria mapea la memoria física guest (GPA) a memoria física real (HPA) mediante tablas de páginas anidadas (EPT en Intel, RVI en AMD), evitando traps por cada acceso a memoria.

Técnicas avanzadas de gestión:
- **Ballooning**: driver en el guest que "infla" para liberar memoria al host bajo presión.
- **Memory deduplication**: identificar páginas idénticas entre VMs y almacenar una sola copia física (KSM en Linux).
- **Swap de memoria de VM**: intercambiar páginas de memoria de VM a disco cuando el host está bajo presión (impacto severo en rendimiento).

```bash
# Habilitar KSM (Kernel Samepage Merging) en host Linux
echo 1 > /sys/kernel/mm/ksm/run
echo 1000 > /sys/kernel/mm/ksm/pages_to_scan
echo 500 > /sys/kernel/mm/ksm/sleep_millisecs

# Monitorizar páginas deduplicadas
watch -n 5 'grep . /sys/kernel/mm/ksm/*'
```

> La deduplicación de memoria puede introducir vulnerabilidades side-channel (ej: ataques de canal lateral basados en tiempo). Evaluar su uso en entornos multi-tenant con cargas no confiables; en muchos casos, deshabilitar KSM es la opción más segura.

### Almacenamiento: discos virtuales, controladores paravirtualizados y caché

Los discos de VM son archivos o volúmenes lógicos (`.qcow2`, `.vmdk`, LVM) gestionados por el hipervisor. El rendimiento depende de:
- **Formato de disco**: qcow2 permite snapshots y compresión; raw ofrece mejor rendimiento secuencial.
- **Controlador de disco**: virtio (paravirtualizado) reduce traps vs. emulación IDE/SATA.
- **Política de caché**: `cache=none` (direct I/O) para bases de datos; `cache=writeback` para cargas generales.

```xml
<!-- Ejemplo: configuración de disco de alto rendimiento en libvirt -->
<disk type='file' device='disk'>
  <driver name='qemu' type='qcow2' cache='none' io='native' discard='unmap'/>
  <source file='/mnt/fast-ssd/vm-disk.qcow2'/>
  <target dev='vda' bus='virtio'/>
  <iotune>
    <read_bytes_sec>104857600</read_bytes_sec>  <!-- 100 MB/s límite -->
    <write_bytes_sec>52428800</write_bytes_sec>  <!-- 50 MB/s límite -->
  </iotune>
</disk>
```

> El thin provisioning (asignación bajo demanda) ahorra espacio pero fragmenta discos físicos y puede causar fallos si el pool se llena. Monitorizar capacidad real vs. asignada y establecer alertas proactivas (>80% uso) es esencial para evitar interrupciones.

### Red: switches virtuales, NICs paravirtualizadas y aislamiento de tráfico

La virtualización de red crea interfaces virtuales (vNICs) conectadas a switches virtuales (vSwitch, Open vSwitch, Linux bridge) que enrutan tráfico entre VMs y redes físicas.

Componentes clave:
- **Modelo de NIC**: virtio-net (paravirtualizado) ofrece menor latencia que emulación e1000/rtl8139.
- **Aislamiento**: VLANs, grupos de puertos y políticas de firewall en el vSwitch segmentan tráfico.
- **SR-IOV**: asignación directa de funciones virtuales de NIC física para rendimiento cercano a bare-metal.

```bash
# Configurar Open vSwitch con VLAN tagging para aislamiento multi-tenant
ovs-vsctl add-br br-tenantA
ovs-vsctl set bridge br-tenantA vlan_mode=secure-tag
ovs-vsctl add-port br-tenantA eth0 tag=100  # VLAN 100 para tenant A

# Asignar vNIC con virtio a una VM (libvirt XML)
<interface type='bridge'>
  <source bridge='br-tenantA'/>
  <model type='virtio'/>
  <mac address='52:54:00:12:34:56'/>
</interface>
```

> El tráfico entre VMs en el mismo host puede permanecer completamente en el vSwitch sin tocar la red física, lo que mejora rendimiento pero requiere monitoreo interno (mirroring, sFlow) para visibilidad de seguridad y troubleshooting.

## Quédate con...

- El **hipervisor** es el árbitro de la virtualización: intercepta instrucciones sensibles mediante trap-and-emulate o hypercalls, operando en el nivel de privilegio más alto (root mode).
- La distinción **host/guest** define la frontera de control: un compromiso del host pone en riesgo todas las VMs, independientemente del aislamiento entre guests.
- La **CPU virtualizada** depende de extensiones de hardware (VT-x/AMD-V) y planificación del scheduler del host; monitorizar "CPU ready time" para detectar contención.
- La **memoria virtualizada** usa tablas anidadas (EPT/RVI) y técnicas como ballooning o KSM; evaluar riesgos de side-channel antes de habilitar deduplicación en entornos multi-tenant.
- El **almacenamiento virtual** combina formatos (qcow2/raw), controladores (virtio) y políticas de caché; el thin provisioning requiere monitorización proactiva de capacidad.
- La **red virtualizada** segmenta tráfico mediante vSwitches y VLANs; virtio-net y SR-IOV optimizan rendimiento, pero la visibilidad requiere herramientas específicas de monitoreo interno.
- Cada recurso compartido introduce trade-offs entre rendimiento, aislamiento y complejidad: la configuración óptima depende siempre de los requisitos específicos de la carga de trabajo.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/intro/tipos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/intro/casos" class="next">Siguiente</a>
</div>
