---
title: "Arquitectura interna"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Arquitectura interna](#arquitectura-interna)
  - [El hipervisor como proceso de usuario: ejecución en espacio no privilegiado](#el-hipervisor-como-proceso-de-usuario-ejecución-en-espacio-no-privilegiado)
  - [Cadena de procesamiento de solicitudes: el camino desde la VM hasta el hardware](#cadena-de-procesamiento-de-solicitudes-el-camino-desde-la-vm-hasta-el-hardware)
  - [Aceleración por hardware: VT-x/AMD-V en entorno hosted con limitaciones](#aceleración-por-hardware-vt-xamd-v-en-entorno-hosted-con-limitaciones)
  - [Gestión de memoria: traducción anidada y compartición con el anfitrión](#gestión-de-memoria-traducción-anidada-y-compartición-con-el-anfitrión)
  - [Emulación de dispositivos: cuando el hardware no está disponible directamente](#emulación-de-dispositivos-cuando-el-hardware-no-está-disponible-directamente)
  - [Quédate con...](#quédate-con)

</div>

# Arquitectura interna

La arquitectura interna de un hipervisor de Tipo 2 se distingue fundamentalmente por su posición en la pila de privilegios del sistema: no opera como un árbitro soberano del hardware, sino como un proceso de usuario que negocia acceso a recursos a través del kernel del sistema operativo anfitrión. Esta ubicación intermedia impone una cadena de procesamiento más larga para cada operación de las máquinas virtuales, donde las solicitudes de CPU, memoria y E/S deben atravesar múltiples capas de abstracción antes de alcanzar el silicio físico. Aunque los hipervisores de Tipo 2 modernos aprovechan las mismas extensiones de virtualización por hardware que sus contrapartes bare-metal (Intel VT-x, AMD-V), la presencia del SO anfitrión como intermediario introduce latencia adicional en cada transición de contexto y operación de entrada/salida. Comprender esta arquitectura —desde el espacio de usuario del proceso hipervisor hasta los controladores del kernel anfitrión— es esencial para diagnosticar problemas de rendimiento, configurar adecuadamente la asignación de recursos y establecer expectativas realistas sobre las capacidades y limitaciones de este modelo de virtualización en entornos de desarrollo y pruebas.

## El hipervisor como proceso de usuario: ejecución en espacio no privilegiado

A diferencia de un hipervisor de Tipo 1 que opera en el nivel de privilegio más alto del sistema (Root Mode o Ring -1), un hipervisor de Tipo 2 se ejecuta en espacio de usuario (Ring 3), como cualquier otra aplicación del sistema operativo anfitrión. Esta ubicación tiene implicaciones profundas en cómo el hipervisor gestiona las máquinas virtuales y accede a los recursos físicos.

```text
Modelo de privilegios en virtualización Tipo 2:

┌─────────────────────────────────┐
│  Ring 3: Aplicaciones Usuario   │  ← Navegador, editor, herramientas
│  Ring 3: Hipervisor Tipo 2      │  ← Proceso VBoxHeadless, vmware-vmx, qemu
├─────────────────────────────────┤
│  Ring 0: Kernel del SO Anfitrión│  ← Gestión real de hardware, drivers
├─────────────────────────────────┤
│  Ring -1: Hardware (VT-x/AMD-V) │  ← Extensiones de virtualización
└─────────────────────────────────┘
```

El proceso del hipervisor debe solicitar al kernel del anfitrión permiso para utilizar las extensiones de virtualización del procesador. En Linux, esto se realiza mediante llamadas al sistema que abren dispositivos como `/dev/kvm`; en Windows, mediante APIs del kernel como `HvInitializePartition` en Hyper-V o controladores específicos en VirtualBox.

```bash
# Verificar permisos de acceso a KVM en Linux (Tipo 2 con QEMU/KVM)
ls -la /dev/kvm
# Salida típica: crw-rw-rw- 1 root kvm 10, 232 ... /dev/kvm

# El proceso del hipervisor debe pertenecer al grupo 'kvm' para acceder
groups $USER
# Debe incluir: kvm

# Verificar procesos de virtualización en ejecución
ps aux | grep -E 'qemu|kvm|vbox|vmware' | grep -v grep

# Ejemplo de salida:
# usuario  4521  5.2  8.1  3456789 654321 ?  Sl   09:15   2:34 qemu-system-x86_64 -enable-kvm ...
```

```c
// Pseudocódigo conceptual: apertura de dispositivo KVM desde espacio de usuario
int kvm_fd = open("/dev/kvm", O_RDWR);
if (kvm_fd < 0) {
    perror("No se puede acceder a KVM - verificar permisos");
    return -1;
}

// Crear una VM (partition en términos de virtualización)
int vm_fd = ioctl(kvm_fd, KVM_CREATE_VM, 0);

// Crear vCPU como hilo del proceso
int vcpu_fd = ioctl(vm_fd, KVM_CREATE_VCPU, 0);

// El kernel gestiona las transiciones VM Entry/Exit,
// pero el proceso de usuario maneja la emulación de dispositivos
```

> La ejecución en espacio de usuario significa que el hipervisor está sujeto a los límites de recursos del proceso: límites de memoria (ulimit), prioridad de planificación (nice value), y políticas de seguridad del SO (SELinux, AppArmor). Un proceso hipervisor puede ser terminado por el OOM killer del kernel si el sistema anfitrión agota la memoria, sin consideración por el estado de las VMs alojadas.

## Cadena de procesamiento de solicitudes: el camino desde la VM hasta el hardware

Cada operación generada por una máquina virtual en un entorno Tipo 2 sigue una ruta de procesamiento más compleja que en Tipo 1, atravesando múltiples capas de software antes de completar la operación solicitada. Esta cadena introduce latencia acumulativa que se manifiesta especialmente en operaciones de E/S intensivas y acceso a memoria.

```text
Ruta de una operación de escritura de disco en Tipo 2:

[VM Guest]
    ↓ (instrucción de escritura)
[Driver de disco virtual en Guest]
    ↓ (VM Exit por instrucción privilegiada)
[Hipervisor Tipo 2 - Proceso de usuario]
    ↓ (traducción a llamada del sistema)
[Kernel del SO Anfitrión - System Call]
    ↓ (scheduling, gestión de buffers)
[Driver de dispositivo en Host]
    ↓ (acceso a controlador hardware)
[Controlador de almacenamiento físico]
    ↓
[Disco físico (SSD/HDD)]

Total: 6-8 cambios de contexto vs. 3-4 en Tipo 1
```

Para operaciones de CPU y memoria, el proceso es más directo gracias a las extensiones de hardware, pero aún requiere intervención del kernel anfitrión para configurar las estructuras de control de virtualización:

```bash
# Traza de sistema para observar llamadas durante operación de VM (Linux)
# Instalar herramientas de tracing
apt-get install -y trace-cmd

# Iniciar tracing de llamadas KVM
trace-cmd record -e kvm -e vmexit sleep 5

# Analizar trazas
trace-cmd report | head -50

# Salida muestra eventos como:
# kvm_entry: vcpu 0 rip 0xffffffff81000000
# kvm_exit: vcpu 0 reason IO_INSTRUCTION rip 0xffffffff81000100
# kvm_exit: vcpu 0 reason EPT_VIOLATION rip 0xffffffff81000200
```

```python
# Ejemplo conceptual: medición de latencia de E/S en Tipo 2 vs. Tipo 1
import time
import os

def measure_io_latency(vm_type, iterations=1000):
    """
    Mide latencia promedio de operaciones de escritura
    vm_type: 'type1' o 'type2'
    """
    latencies = []
    
    for i in range(iterations):
        start = time.perf_counter_ns()
        
        # Operación de escritura simulada
        os.write(fd, b'test data')
        
        end = time.perf_counter_ns()
        latencies.append(end - start)
    
    avg_latency = sum(latencies) / len(latencies)
    
    return {
        'vm_type': vm_type,
        'avg_latency_ns': avg_latency,
        'avg_latency_us': avg_latency / 1000
    }

# Resultados típicos:
# Tipo 1: 15-25 μs por operación de disco virtual
# Tipo 2: 35-60 μs por operación de disco virtual (2-3x mayor latencia)
```

> La latencia adicional no es constante: varía según la carga del SO anfitrión. Si el host está ejecutando otras aplicaciones intensivas (compilación, renderizado, navegación con múltiples pestañas), el scheduler puede despriorizar el proceso del hipervisor, causando picos de latencia impredecibles que afectan la experiencia dentro de la VM.

## Aceleración por hardware: VT-x/AMD-V en entorno hosted con limitaciones

Los hipervisores de Tipo 2 modernos pueden aprovechar las extensiones de virtualización por hardware (Intel VT-x, AMD-V) para ejecutar código guest directamente en la CPU física, evitando la emulación por software completa. Sin embargo, la implementación difiere significativamente de Tipo 1 debido a la presencia del kernel anfitrión como intermediario.

| Característica | Tipo 1 (Bare-metal) | Tipo 2 (Hosted) | Impacto |
|---------------|---------------------|-----------------|---------|
| **Modo Root** | Hipervisor en Root Mode directo | Kernel host gestiona Root Mode | Hipervisor Tipo 2 solicita acceso vía kernel |
| **VMCS/VMCB** | Gestión directa por hipervisor | Kernel host puede validar/modificar | Overhead adicional en configuración |
| **EPT/RVI** | Configuración directa | Traducida a través de memoria virtual del host | TLB misses adicionales |
| **Interrupciones** | APICv directo | Pasan por scheduler del host | Latencia de entrega variable |

```bash
# Verificar que la aceleración por hardware está activa en VirtualBox
VBoxManage list vmsinfo "MiVM" | grep -i "hardware"

# Salida esperada:
# hardware virtualization: enabled
# nested paging: enabled
# unrestricted guest: enabled

# En QEMU/KVM, verificar modo de aceleración
qemu-system-x86_64 -enable-kvm -cpu host ...

# Sin -enable-kvm, QEMU usa TCG (emulación por software, 10-50x más lento)
```

```bash
# Comparar rendimiento con/sin aceleración por hardware (QEMU)
# Sin KVM (emulación TCG pura)
time qemu-system-x86_64 -hda disk.img -curses
# Boot time: ~180 segundos

# Con KVM (aceleración hardware)
time qemu-system-x86_64 -enable-kvm -hda disk.img -curses
# Boot time: ~25 segundos

# Diferencia: 7x más rápido con aceleración, pero aún con overhead del host
```

> La aceleración por hardware en Tipo 2 requiere que el kernel del anfitrión tenga cargados los módulos apropiados (kvm_intel/kvm_amd en Linux, Hyper-V hypervisor en Windows). En macOS, la virtualización está restringida por la arquitectura del sistema: Apple Silicon solo permite virtualización de SOs ARM nativos con aceleración completa; la emulación x86 usa traducción binaria (Rosetta 2/UTM TCG) con penalización significativa de rendimiento.

## Gestión de memoria: traducción anidada y compartición con el anfitrión

La virtualización de memoria en Tipo 2 introduce una capa adicional de complejidad: la memoria virtual de la VM debe mapearse primero al espacio de direcciones del proceso del hipervisor, y luego a la memoria física real gestionada por el kernel anfitrión. Esta doble traducción impacta el rendimiento de la TLB (Translation Lookaside Buffer) de la CPU.

```text
Traducción de memoria en Tipo 2:

Dirección Virtual Guest (GVA)
    ↓ (tablas de páginas del guest)
Dirección Física Guest (GPA)
    ↓ (EPT/RVI gestionado por KVM en kernel host)
Dirección Virtual del Proceso Hipervisor (HVA)
    ↓ (tablas de páginas del host)
Dirección Física Real (HPA)
    ↓
Acceso a RAM física
```

```bash
# Verificar uso de memoria de proceso hipervisor (Linux)
ps aux | grep qemu | awk '{print $2}' | head -1 | xargs cat /proc/$$/status | grep -E 'VmSize|VmRSS|VmSwap'

# Salida típica:
# VmSize:  4567890 kB   ← Memoria virtual asignada al proceso
# VmRSS:   2345678 kB   ← Memoria física residente real
# VmSwap:    12345 kB   ← Memoria intercambiable a disco

# Verificar páginas EPT activas (requiere debugfs habilitado)
cat /sys/kernel/debug/kvm/mmio_stats
```

El kernel anfitrión puede aplicar técnicas de optimización de memoria que afectan a las VMs:
- **Transparent Huge Pages (THP)**: puede mejorar rendimiento pero causar latencia durante asignación.
- **Kernel Samepage Merging (KSM)**: deduplica páginas idénticas entre procesos (incluyendo VMs).
- **Memory Ballooning**: el driver en la VM puede liberar memoria al host bajo presión.

```bash
# Configurar Huge Pages para reducir TLB misses en KVM Tipo 2
# Editar /etc/sysctl.conf
echo "vm.nr_hugepages = 2048" >> /etc/sysctl.conf
sysctl -p

# Verificar asignación
grep Huge /proc/meminfo

# Configurar VM para usar hugepages (libvirt XML)
<memoryBacking>
  <hugepages/>
  <nosharepages/>  ← Deshabilitar KSM para esta VM (mejor rendimiento, más memoria)
</memoryBacking>
```

> KSM (deduplicación de memoria) puede introducir vulnerabilidades de canal lateral entre VMs que comparten el mismo host. En entornos donde múltiples VMs de diferentes usuarios o niveles de confianza coexisten, considerar deshabilitar KSM (`echo 0 > /sys/kernel/mm/ksm/run`) para eliminar este vector de ataque, aceptando el costo de mayor uso de memoria física.

## Emulación de dispositivos: cuando el hardware no está disponible directamente

Una parte significativa del código de un hipervisor de Tipo 2 se dedica a emular dispositivos de hardware que no pueden ser virtualizados directamente o para los cuales no hay soporte de paravirtualización. Esta emulación ocurre completamente en espacio de usuario, añadiendo latencia considerable a las operaciones de E/S.

```text
Jerarquía de métodos de E/S en Tipo 2 (de más rápido a más lento):

1. PCI Passthrough (VFIO)
   ← Dispositivo físico asignado directamente a la VM
   ← Rendimiento: 95-98% del nativo
   ← Requiere hardware y kernel con soporte IOMMU

2. VirtIO (paravirtualización)
   ← Driver especializado en guest + backend en host
   ← Rendimiento: 85-95% del nativo
   ← Requiere drivers instalados en la VM

3. Emulación de dispositivo (QEMU)
   ← Dispositivo virtual emulado completamente en software
   ← Rendimiento: 40-70% del nativo
   ← Compatible con cualquier SO guest sin drivers especiales
```

```bash
# Verificar modo de E/S de disco en VM QEMU/KVM
virsh domblklist MiVM

# Salida:
# Target     Source
# vda        /var/lib/libvirt/images/mi-vm.qcow2
# sr0        /dev/sr0

# Verificar si usa virtio (paravirtualizado) o ide/sata (emulado)
virsh domxml MiVM | grep -A5 "<disk"

# Óptimo para Tipo 2:
<disk type='file' device='disk'>
  <target dev='vda' bus='virtio'/>  ← VirtIO para mejor rendimiento
</disk>

# Compatible pero más lento:
<disk type='file' device='disk'>
  <target dev='hda' bus='ide'/>  ← Emulación IDE, sin drivers necesarios
</disk>
```

```yaml
# Ejemplo: configuración de red en VirtualBox para balancear compatibilidad/rendimiento
network_adapter:
  type: "virtio"           # Mejor rendimiento, requiere Guest Additions
  # type: "e1000"          # Compatible universal, más lento
  # type: "pcnet"          # Legacy, solo para SOs antiguos
  
  attachment: "NAT"        # Comparte IP del host, fácil configuración
  # attachment: "Bridged"  # IP directa en red física, más exposición
  
  cable_connected: true
  speed: 1000              # 1 Gbps simulado
```

> La emulación de dispositivos es particularmente costosa para operaciones de red y disco intensivas. Para cargas de trabajo que requieren alto rendimiento de E/S en Tipo 2, siempre configurar dispositivos paravirtualizados (VirtIO, VMXNET3) e instalar las herramientas de integración correspondientes (Guest Additions, VMware Tools, virtio-win drivers).

## Quédate con...

- El hipervisor de **Tipo 2 se ejecuta en espacio de usuario (Ring 3)**, dependiendo del kernel del anfitrión para acceder a recursos físicos, lo que introduce cambios de contexto adicionales.
- La **cadena de procesamiento de solicitudes** atraviesa 6-8 capas (Guest → Hipervisor → Host Kernel → Driver → Hardware) vs. 3-4 en Tipo 1, acumulando latencia en cada transición.
- La **aceleración por hardware (VT-x/AMD-V)** está disponible pero con overhead adicional: el kernel anfitrión gestiona el modo Root y valida las estructuras de control de virtualización.
- La **traducción de memoria es anidada**: GVA → GPA → HVA → HPA, causando más TLB misses que en Tipo 1 donde EPT/RVI mapea directamente GPA → HPA.
- La **emulación de dispositivos** ocurre en espacio de usuario y es significativamente más lenta que la paravirtualización; usar VirtIO siempre que el guest lo soporte.
- El **rendimiento es variable** según la carga del host: otras aplicaciones del SO anfitrión compiten por recursos, causando latencia impredecible durante picos de uso.
- Las **optimizaciones de memoria del host** (THP, KSM, ballooning) pueden mejorar o degradar el rendimiento de las VMs; configurar conscientemente según los requisitos de aislamiento y rendimiento.
- Tipo 2 es **adecuado para desarrollo y pruebas**, pero la arquitectura inherente lo hace inadecuado para producción crítica donde se requiere rendimiento determinista y aislamiento garantizado.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/tipo2/caracteristicas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/tipo2/ejemplos" class="next">Siguiente</a>
</div>
