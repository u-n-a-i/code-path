---
title: "Arquitectura interna"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Arquitectura interna](#arquitectura-interna)
  - [Control directo de recursos: gestión soberana de CPU, memoria y E/S](#control-directo-de-recursos-gestión-soberana-de-cpu-memoria-y-es)
  - [Extensiones de virtualización de hardware: Intel VT-x y AMD-V](#extensiones-de-virtualización-de-hardware-intel-vt-x-y-amd-v)
  - [Minimización de sobrecarga: eliminación de capas y optimización de rutas de datos](#minimización-de-sobrecarga-eliminación-de-capas-y-optimización-de-rutas-de-datos)
  - [Quédate con...](#quédate-con)

</div>

# Arquitectura interna

La arquitectura interna de un hipervisor de Tipo 1 no es simplemente una versión "ligera" de un sistema operativo; es un diseño fundamentalmente distinto orientado a la mediación de acceso privilegiado con mínima latencia. Mientras un SO tradicional asume la propiedad exclusiva del hardware para servir a sus procesos, el hipervisor asume la propiedad exclusiva para servir a otros sistemas operativos completos. Esta distinción obliga a implementar mecanismos de control directo sobre CPU, memoria y E/S que bypassen las capas de abstracción convencionales, aprovechando extensiones de silicio específicas (VT-x/AMD-V) para transformar lo que antes era emulación por software en ejecución nativa asistida por hardware. Comprender esta arquitectura interna —desde las estructuras de control de máquinas virtuales hasta el mapeo de memoria anidado— es esencial para diagnosticar problemas de rendimiento, configurar adecuadamente la asignación de recursos y entender los límites teóricos de la consolidación en entornos de producción críticos.

## Control directo de recursos: gestión soberana de CPU, memoria y E/S

En un hipervisor de Tipo 1, la capa de virtualización posee soberanía total sobre el hardware físico. No existe un sistema operativo subyacente que gestione los controladores o planifique el acceso; el hipervisor implementa sus propios controladores minimalistas para inicializar el hardware y luego delega el acceso mediante reglas estrictas. Este control directo se manifiesta en tres dominios críticos:

1.  **CPU:** El hipervisor planifica las vCPUs (hilos de ejecución de las VMs) sobre los pCPUs (núcleos físicos) utilizando algoritmos de scheduling propios, a menudo derivados de los del kernel Linux (como Completely Fair Scheduler en KVM) pero optimizados para contextos de virtualización.
2.  **Memoria:** El hipervisor mantiene el mapa maestro de la memoria física. Las VMs ven memoria física "guest" (GPA), pero el hipervisor traduce esto a memoria física "host" (HPA) real, garantizando que una VM nunca acceda a marcos de memoria asignados a otra.
3.  **E/S:** El acceso a dispositivos (disco, red) se medía mediante emulación de dispositivos, paravirtualización o asignación directa. El hipervisor decide qué ruta tomar según el equilibrio entre compatibilidad y rendimiento.

```text
Flujo de acceso a memoria en Tipo 1:

1. VM genera dirección virtual (GVA)
   ↓
2. MMU de la CPU traduce GVA → GPA (usando tablas del Guest)
   ↓
3. Hipervisor intercepta acceso a GPA
   ↓
4. EPT/RVI traduce GPA → HPA (memoria física real)
   ↓
5. Acceso al bus de memoria físico
```

```bash
# Verificar asignación de memoria hugepages en host KVM (optimización de memoria)
# Las hugepages reducen la sobrecarga de TLB misses en la traducción de memoria
grep Huge /proc/meminfo

# Configurar hugepages para una VM específica (ejemplo libvirt)
# Esto reserva memoria física contigua, mejorando rendimiento de bases de datos
<vcpu placement='static'>4</vcpu>
<memoryBacking>
  <hugepages/>
</memoryBacking>
```

>  El control directo implica que el hipervisor es un punto único de fallo (SPOF) para todas las VMs alojadas. Si el hipervisor entra en pánico (kernel panic en KVM, PSOD en ESXi), todas las máquinas virtuales se detienen abruptamente. Por esto, la estabilidad del hipervisor se prioriza sobre la funcionalidad: se incluyen menos controladores y servicios que en un SO generalista.

## Extensiones de virtualización de hardware: Intel VT-x y AMD-V

Antes de 2005, la virtualización en x86 requería técnicas complejas como "binary translation" porque la arquitectura no distinguía entre el nivel de privilegio del SO anfitrión y el invitado (ambos querían ejecutar en Ring 0). Las extensiones de virtualización de hardware (Intel VT-x y AMD-V) resolvieron esto introduciendo un nuevo bit de modo en la CPU que separa la ejecución en **Root** (hipervisor) y **Non-Root** (guest).

Cuando una VM (Non-Root) ejecuta una instrucción privilegiada (ej: modificar registros de control, acceder a puertos de E/S), la CPU no lanza una excepción al SO, sino que genera una **VM Exit**, transfiriendo el control inmediatamente al hipervisor (Root). El hipervisor valida la operación, actualiza el estado virtual y ejecuta una **VM Entry** para reanudar la VM. Este mecanismo es transparente para el SO invitado, que cree tener control total del hardware.

| Componente | Intel VT-x | AMD-V | Función |
|------------|------------|-------|---------|
| **Modo de operación** | VMX Root / Non-Root | Root / Non-Root | Separa privilegios de hipervisor y guest |
| **Estructura de control** | VMCS (Virtual Machine Control Structure) | VMCB (Virtual Machine Control Block) | Guarda estado de la CPU al salir/entrar |
| **Traducción de memoria** | EPT (Extended Page Tables) | RVI (Rapid Virtualization Indexing) | Acelera mapeo GPA → HPA sin shadow pages |

```bash
# Verificar flags de virtualización en CPU Linux
# vmx = Intel VT-x, svm = AMD-V
lscpu | grep Virtualization

# Salida típica en Intel:
# Virtualization: Intel VT-x

# Leer MSR (Model Specific Registers) para verificar estado de VMX (avanzado)
# Requiere módulo msr cargado
modprobe msr
cat /dev/cpu/0/msr | hexdump -C | head
```

>  Aunque VT-x/AMD-V eliminan la necesidad de binary translation para la CPU, la virtualización de E/S sigue siendo costosa si se emula completamente. Por eso, incluso con hardware moderno, se recomienda usar dispositivos paravirtualizados (virtio) que reducen la cantidad de VM Exits necesarias para operaciones de disco y red.

## Minimización de sobrecarga: eliminación de capas y optimización de rutas de datos

La principal ventaja arquitectónica del Tipo 1 es la reducción de la sobrecarga (*overhead*) al eliminar el contexto de un sistema operativo anfitrión. En un Tipo 2, cada instrucción sensible debe atravesar: Guest → Hipervisor → SO Host → Hardware. En un Tipo 1, la ruta es: Guest → Hipervisor → Hardware. Esta reducción de saltos de contexto disminuye la latencia y el consumo de CPU, pero la optimización no es automática; requiere configuraciones específicas para minimizar los costos restantes.

Las fuentes principales de sobrecarga residual y su mitigación son:

1.  **VM Exits frecuentes:** Cada salida al hipervisor tiene un costo (guardar estado, cambiar tablas de páginas). Mitigación: Usar dispositivos virtuales eficientes (virtio) y evitar emulación de hardware legacy (IDE, RTL8139).
2.  **TLB Flushing:** Cambiar entre VMs requiere limpiar la Translation Lookaside Buffer de la CPU. Mitigación: Usar PCID (Process Context ID) en Intel o ASID en AMD para mantener entradas de TLB entre cambios de contexto.
3.  **Interrupciones:** Las interrupciones físicas deben ser enrutadas a la VM correcta. Mitigación: Usar APICv (Advanced Programmable Interrupt Controller virtualization) para entregar interrupciones directamente sin VM Exit.

```xml
<!-- Ejemplo: Optimización de CPU en libvirt para reducir overhead -->
<domain type='kvm'>
  <cpu mode='host-passthrough' check='none'>
    <!-- Expone flags de CPU real al guest, evitando emulación de instrucciones -->
    <cache mode='passthrough'/>
    <feature policy='require' name='vmx'/>
  </cpu>
  <features>
    <apic/>
    <pae/>
    <!-- Habilitar características de optimización de interrupciones -->
    <vmport state='off'/>
  </features>
  <clock offset='utc'>
    <timer name='hpet' present='no'/> <!-- Eliminar timers innecesarios -->
    <timer name='kvmclock' present='on'/>
  </clock>
</domain>
```

>  La optimización extrema (como `host-passthrough`) puede comprometer la migrabilidad entre hosts con CPUs diferentes. En entornos donde se requiere vMotion o Live Migration heterogénea, es preferible usar un modelo de CPU definido (ej: `Haswell-noTSX`) que exponga un conjunto común de instrucciones, sacrificando marginalmente el rendimiento por portabilidad.

## Quédate con...

- El hipervisor de Tipo 1 tiene **soberanía total sobre el hardware**, implementando sus propios controladores y planificadores sin depender de un SO anfitrión.
- Las extensiones **Intel VT-x y AMD-V** introducen modos **Root/Non-Root**, permitiendo que las VMs ejecuten código privilegiado de forma segura mediante el mecanismo de **VM Exit/VM Entry**.
- La estructura **VMCS (Intel) o VMCB (AMD)** guarda el estado de la CPU durante las transiciones, siendo crítica para el rendimiento de la virtualización.
- La traducción de memoria se optimiza mediante **EPT (Intel) o RVI (AMD)**, evitando el uso de tablas de páginas sombreadas (*shadow page tables*) que consumen mucha CPU.
- La **sobrecarga residual** proviene principalmente de VM Exits frecuentes, TLB flushes y emulación de E/S; se mitiga con dispositivos paravirtualizados (virtio) y configuración de CPU adecuada.
- El modo **`host-passthrough`** expone la CPU física directa a la VM para máximo rendimiento, pero puede limitar la capacidad de migrar la VM a hosts con hardware diferente.
- La arquitectura Tipo 1 reduce la ruta de datos crítica, eliminando el contexto del SO host y acercando el rendimiento de las VMs al **95-98% del nativo** en cargas bien configuradas.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/tipo1/caracteristicas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/tipo1/ejemplos" class="next">Siguiente</a>
</div>
