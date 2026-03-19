---
title: "¿Qué es un hipervisor de Tipo 1?"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [¿Qué es un hipervisor de Tipo 1?](#qué-es-un-hipervisor-de-tipo-1)
  - [Definición técnica: ejecución directa sobre el hardware físico](#definición-técnica-ejecución-directa-sobre-el-hardware-físico)
  - [Eliminación del sistema operativo anfitrión: impacto en rendimiento y estabilidad](#eliminación-del-sistema-operativo-anfitrión-impacto-en-rendimiento-y-estabilidad)
  - [Hipervisor nativo como sistema operativo especializado](#hipervisor-nativo-como-sistema-operativo-especializado)
  - [Quédate con...](#quédate-con)

</div>

# ¿Qué es un hipervisor de Tipo 1?

El hipervisor de Tipo 1, comúnmente denominado nativo o bare-metal, representa la evolución definitiva de la virtualización hacia la eficiencia operativa y el rendimiento de producción. A diferencia de su contraparte de Tipo 2, que depende de un sistema operativo generalista para gestionar el hardware, el hipervisor de Tipo 1 se instala directamente sobre los recursos físicos del servidor, eliminando la capa intermedia del sistema operativo anfitrión y sus sobrecargas inherentes. Esta arquitectura no es simplemente una optimización de rendimiento; es un cambio fundamental en el modelo de confianza y gestión de recursos, donde el hipervisor asume el rol de sistema operativo especializado cuyo único propósito es crear, ejecutar y aislar máquinas virtuales. Comprender esta distinción es crítico para diseñar infraestructuras empresariales, ya que define los límites de seguridad, la capacidad de escalado y la estrategia de mantenimiento de todo el centro de datos.

## Definición técnica: ejecución directa sobre el hardware físico

Un hipervisor de Tipo 1 se define por su posición en la pila de software: se ejecuta directamente sobre el hardware físico (bare-metal), sin requerir un sistema operativo subyacente para gestionar los recursos básicos. Esto no significa que el hipervisor carezca de código de gestión; por el contrario, incluye un kernel minimalista altamente optimizado que contiene únicamente los controladores necesarios para interactuar con CPU, memoria, almacenamiento y red, eliminando subsistemas innecesarios como interfaces gráficas de usuario, pilas de sonido o servicios de escritorio.

```text
Comparativa de pila de software:

Hipervisor Tipo 2 (Hosted):
┌───────────────────────┐
│  Máquina Virtual (VM) │
├───────────────────────┤
│  Hipervisor (App)     │
├───────────────────────┤
│  SO Anfitrión (Host)  │  ← Capa adicional, overhead de contexto
├───────────────────────┤
│  Hardware Físico      │
└───────────────────────┘

Hipervisor Tipo 1 (Bare-metal):
┌───────────────────────┐
│  Máquina Virtual (VM) │
├───────────────────────┤
│  Hipervisor (Kernel)  │  ← Acceso directo, sin intermediarios
├───────────────────────┤
│  Hardware Físico      │
└───────────────────────┘
```

Esta eliminación de la capa intermedia reduce la latencia en las operaciones de E/S y planificación de CPU, ya que las instrucciones de las VMs no deben atravesar el kernel de un SO generalista antes de llegar al hardware. El hipervisor se convierte en el único "propietario" legítimo del hardware, otorgando recursos a las VMs bajo demanda mediante mecanismos de particionamiento estricto.

> La denominación "bare-metal" puede ser ligeramente engañosa: la mayoría de los hipervisores Tipo 1 modernos (como ESXi o Hyper-V) incluyen una consola de gestión o una "partición padre" que ejecuta un SO ligero para tareas administrativas. Sin embargo, este componente no interfiere en la ruta crítica de datos de las VMs y no se considera un SO anfitrión en el sentido tradicional.

## Eliminación del sistema operativo anfitrión: impacto en rendimiento y estabilidad

La ausencia de un sistema operativo anfitrión generalista (como Windows 10 o Ubuntu Desktop) tiene implicaciones profundas en la estabilidad y el rendimiento del entorno virtualizado. En un hipervisor de Tipo 2, el SO anfitrión compite por recursos con las VMs: una actualización automática, un proceso en segundo plano o un pico de uso en el host pueden degradar el rendimiento de todas las máquinas virtuales alojadas. En un Tipo 1, el hipervisor controla exclusivamente la asignación de recursos, garantizando que las cargas de trabajo reciban los ciclos de CPU y ancho de banda de memoria reservados, independientemente de otras actividades.

```bash
# Verificación conceptual de entorno
# En un host Tipo 1 (ej. ESXi shell), no existen procesos de usuario típicos
esxcli system version get

# Salida típica muestra solo versión del hipervisor, no distro Linux/Windows
# Product: VMware ESXi
# Version: 7.0.3
# Build: 12345678

# En contraste, un host Tipo 2 mostraría procesos del SO base
# ps aux | grep -E 'firefox|explorer|systemd'  ← Procesos que compiten por recursos
```

Además, la superficie de ataque se reduce drásticamente. Un SO generalista tiene cientos de servicios ejecutándose (impresión, bluetooth, redes sociales, actualizadores), cada uno potencialmente vulnerable. Un hipervisor Tipo 1 expone únicamente los servicios estrictamente necesarios para la gestión y la virtualización, minimizando los vectores de entrada para un atacante.

> La estabilidad de un Tipo 1 depende de la calidad de sus controladores de hardware. Al no contar con la amplia compatibilidad de un SO como Linux o Windows, es crucial verificar la Lista de Compatibilidad de Hardware (HCL) del proveedor antes de la instalación. Un controlador inestable en un hipervisor bare-metal puede provocar la caída de todas las VMs alojadas, no solo de una aplicación.

## Hipervisor nativo como sistema operativo especializado

Desde una perspectiva arquitectónica, un hipervisor de Tipo 1 funciona esencialmente como un sistema operativo especializado de propósito único. Al igual que un SO tradicional, gestiona memoria, planifica procesos (en este caso, VMs), maneja interrupciones y proporciona abstracción de dispositivos. Sin embargo, su diseño está optimizado para un objetivo específico: maximizar la densidad y el aislamiento de cargas de trabajo virtuales.

Esta especialización permite funciones avanzadas que serían complejas o ineficientes en un entorno hosted:
- **Gestión de memoria avanzada:** Técnicas como Transparent Page Sharing (TPS) o ballooning se implementan a nivel de kernel del hipervisor con mayor eficiencia.
- **Planificación de CPU determinista:** Algoritmos de scheduling diseñados para evitar la contención entre vCPUs de diferentes VMs.
- **Passthrough de hardware:** Asignación directa de dispositivos físicos (GPUs, NICs) a VMs específicas con mínima intervención del hipervisor.

```yaml
# Ejemplo conceptual: Configuración de recurso en hipervisor nativo
# El hipervisor reserva memoria física antes de iniciar la VM
vm_config:
  name: "db-production-01"
  memory_reservation: "64GB"  # Garantizado físicamente por el hipervisor
  memory_limit: "64GB"        # No puede exceder lo asignado
  cpu_shares: "high"          # Prioridad en el scheduler del hipervisor
  hardware_acceleration: true # Uso directo de VT-x/AMD-V sin traducción host
```

> En arquitecturas como Microsoft Hyper-V, existe un matiz técnico: el sistema operativo "host" (Windows Server) se ejecuta realmente en una partición privilegiada (Parent Partition) sobre el hipervisor, no debajo de él. Aunque operacionalmente se gestiona como Tipo 1, arquitectónicamente todas las cargas (incluida la de gestión) pasan por la capa de virtualización. Esto ofrece lo mejor de ambos mundos: gestión familiar de Windows con aislamiento de hipervisor nativo.

## Quédate con...

- Un hipervisor de **Tipo 1 (bare-metal)** se ejecuta directamente sobre el hardware físico, eliminando la capa de un sistema operativo anfitrión generalista.
- La ausencia de SO host reduce la **sobrecarga de rendimiento** y elimina la contención de recursos por procesos en segundo plano del anfitrión.
- La **superficie de ataque** es significativamente menor al no existir servicios innecesarios (impresión, UI, actualizadores de consumo) expuestos al entorno.
- Operativamente, funciona como un **SO especializado**: gestiona memoria, CPU y E/S, pero optimizado exclusivamente para alojar máquinas virtuales.
- La **compatibilidad de hardware** es crítica: depende estrictamente de la Lista de Compatibilidad (HCL) del proveedor, a diferencia de la amplia compatibilidad de los SOs tradicionales.
- En producciones empresariales, el Tipo 1 es el estándar debido a su **estabilidad, escalabilidad y capacidades de gestión avanzada** (vMotion, HA, DRS) que requieren control directo del hardware.
- Arquitecturas como **Hyper-V** introducen un matiz donde la gestión corre en una partición privilegiada sobre el hipervisor, manteniendo las ventajas del Tipo 1 con la usabilidad de un SO conocido.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/tipo1/arquitectura" class="next">Siguiente</a>
</div>
