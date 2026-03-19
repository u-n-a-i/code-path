---
title: "Historia y evolución"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Historia y evolución](#historia-y-evolución)
  - [Orígenes en mainframes: la era del CP/CMS y el nacimiento del concepto (1960–1970)](#orígenes-en-mainframes-la-era-del-cpcms-y-el-nacimiento-del-concepto-19601970)
  - [El "invierno" de la virtualización y el auge de la computación personal (1980–1990)](#el-invierno-de-la-virtualización-y-el-auge-de-la-computación-personal-19801990)
  - [El renacimiento en x86: VMware, Xen y la revolución del software (2000–2010)](#el-renacimiento-en-x86-vmware-xen-y-la-revolución-del-software-20002010)
  - [Revolución en la eficiencia del centro de datos: consolidación y agilidad operativa (2010–presente)](#revolución-en-la-eficiencia-del-centro-de-datos-consolidación-y-agilidad-operativa-2010presente)
  - [Quédate con...](#quédate-con)

</div>

# Historia y evolución

La historia de la virtualización es un recorrido cíclico de innovación, olvido y renacimiento que refleja la evolución misma de la arquitectura de computadoras. Lo que hoy consideramos una tecnología habilitadora de la nube pública nació en realidad en los mainframes de IBM hace más de medio siglo, como respuesta a un problema que sigue vigente: cómo compartir recursos costosos y escasos entre múltiples usuarios manteniendo aislamiento y seguridad. Su resurgimiento en la era x86 a principios de los 2000 no fue una invención nueva, sino la adaptación de principios probados a una arquitectura que originalmente no fue diseñada para ser virtualizable. Comprender esta trayectoria no es solo un ejercicio histórico: revela por qué ciertas decisiones de diseño persisten, cómo las limitaciones de hardware moldearon las soluciones de software, y por qué la virtualización se convirtió en el cimiento sobre el que se construyó la computación en nube moderna.

## Orígenes en mainframes: la era del CP/CMS y el nacimiento del concepto (1960–1970)

La virtualización no nació con VMware ni con Linux. Sus raíces se remontan al **IBM System/360 Modelo 67** (1965) y al sistema operativo **CP/CMS** (Control Program/Cambridge Monitor System), desarrollado por el laboratorio de investigación de IBM en Cambridge. En una época donde un mainframe costaba millones de dólares y el tiempo de CPU se facturaba por segundos, la necesidad de compartir el hardware entre múltiples usuarios de forma segura y eficiente era crítica.

El equipo de IBM liderado por Robert Creasy y Les Comeau diseñó una arquitectura radical: el **Control Program (CP)** actuaba como una capa de software que creaba máquinas virtuales completas, cada una ejecutando su propia instancia de CMS (un sistema operativo monousuario ligero). Cada VM creía tener acceso exclusivo al hardware, mientras el CP gestionaba la asignación real de recursos mediante técnicas de *trap-and-emulate* para instrucciones privilegiadas.

```text
Arquitectura CP/CMS (simplificada):

┌─────────────────────────┐
│  VM1: CMS  │  VM2: CMS  │  ← Sistemas invitados aislados
├─────────────────────────┤
│     Control Program (CP)│  ← Hipervisor primitivo
├─────────────────────────┤
│     Hardware S/360-67   │  ← CPU, memoria, canales I/O
└─────────────────────────┘
```

Este diseño introdujo conceptos que perduran:
- **Aislamiento completo**: fallos o errores en una VM no propagaban a otras.
- **Tiempo compartido con garantías**: asignación de ciclos de CPU y memoria mediante colas y prioridades.
- **Portabilidad incipiente**: las VMs podían guardarse y restaurarse como archivos (*checkpointing*).

> La arquitectura S/360 fue diseñada con la virtualización en mente: todas las instrucciones sensibles eran "trap-able", permitiendo al CP interceptarlas. Esta propiedad, ausente en x86 inicial, retrasó décadas la virtualización eficiente en arquitecturas de commodity.

## El "invierno" de la virtualización y el auge de la computación personal (1980–1990)

Con la democratización de los microordenadores y la arquitectura x86 en los 80 y 90, la virtualización cayó en desuso. Los PCs eran baratos, dedicados a un solo usuario, y los sistemas operativos como MS-DOS o Windows 3.x no requerían aislamiento multiusuario. Además, la arquitectura x86 original **no era virtualizable en sentido estricto**: ciertas instrucciones privilegiadas no generaban traps cuando se ejecutaban en modo usuario, violando el criterio de Popek y Goldberg para virtualización eficiente.

Durante este periodo, la virtualización sobrevivió en nichos:
- **Emuladores** como BOCHS o Virtual PC (de Connectix) usaban traducción binaria dinámica para simular hardware x86, con penalizaciones de rendimiento del 50-90%.
- **Mainframes y sistemas RISC** (IBM zSeries, HP-UX, AIX) mantenían tecnologías de particionamiento lógico (LPAR) heredadas de los 70.

## El renacimiento en x86: VMware, Xen y la revolución del software (2000–2010)

El punto de inflexión llegó en 1998–1999, cuando un equipo de Stanford (incluyendo a Ed Bugnion y Mendel Rosen) demostró que era posible virtualizar x86 mediante **binario translation**: interceptar y recompilar dinámicamente bloques de código no virtualizable, combinado con ejecución directa para el resto. Esta técnica fue la base de **VMware Workstation** (1999) y, más tarde, **VMware ESX** (2001), el primer hipervisor bare-metal para x86.

Paralelamente, surgieron alternativas de código abierto:
- **Xen** (Universidad de Cambridge, 2003): adoptó un enfoque de *paravirtualización*, modificando el kernel del SO invitado para reemplazar instrucciones no virtualizables con llamadas hiperconscientes (*hypercalls*). Esto lograba rendimiento cercano al nativo, pero requería SOs adaptados.
- **KVM** (Kernel-based Virtual Machine, 2006): aprovechó las extensiones de virtualización por hardware (**Intel VT-x** lanzado en 2005, **AMD-V** en 2006) para convertir el kernel de Linux en un hipervisor Tipo 1. Cada VM era un proceso Linux estándar, gestionado con herramientas existentes (`qemu`, `libvirt`).

```bash
# KVM: verificar módulos cargados en Linux
lsmod | grep kvm

# Salida típica en Intel:
# kvm_intel             286720  0
# kvm                   696320  1 kvm_intel

# En AMD:
# kvm_amd               327680  0
# kvm                   696320  1 kvm_amd
```

> La llegada de VT-x/AMD-V resolvió el problema fundamental de x86: permitió ejecutar código en modo "non-root" con instrucciones privilegiadas que automáticamente generan traps al hipervisor. Esto eliminó la necesidad de binary translation o paravirtualización para la mayoría de cargas, acercando el rendimiento de las VMs al 95-98% del nativo.

## Revolución en la eficiencia del centro de datos: consolidación y agilidad operativa (2010–presente)

La maduración de la virtualización en x86 transformó radicalmente la economía y operación de los centros de datos:

| Métrica pre-virtualización | Post-virtualización | Impacto |
|---------------------------|---------------------|---------|
| Utilización típica de servidor | 10-15% | 60-80% | Reducción de hardware físico 5:1 o mayor |
| Tiempo de aprovisionamiento | Días/semanas | Minutos | Agilidad para desarrollo y despliegue |
| Recuperación ante fallos | Restauración manual desde backup | Snapshot + migración en vivo | RTO/RPO drásticamente reducidos |
| Aislamiento de entornos | Servidores físicos dedicados | VMs por aplicación | Seguridad y cumplimiento simplificados |

Esta eficiencia habilitó tres tendencias estratégicas:
1. **Consolidación masiva**: ejecutar decenas de VMs heterogéneas en un solo servidor físico, reduciendo costos de CAPEX (hardware) y OPEX (energía, refrigeración, espacio).
2. **Infraestructura definida por software**: redes (NSX, Open vSwitch), almacenamiento (vSAN, Ceph) y seguridad gestionadas mediante APIs, no configuración manual.
3. **Cimiento para la nube**: proveedores como AWS, Azure y GCP construyeron sus plataformas IaaS sobre hipervisores altamente optimizados (Nitro/KVM, Hyper-V, KVM respectivamente), exponiendo VMs como recursos elásticos bajo demanda.

> La virtualización no eliminó la complejidad: la gestionó. Al convertir recursos físicos estáticos en entidades lógicas programables, permitió orquestar infraestructura a escala mediante software, sentando las bases para la automatización, la infraestructura como código y, finalmente, la computación en nube.

## Quédate con...

- La virtualización nació en **mainframes IBM (CP/CMS, años 60)** como solución para compartir recursos caros entre usuarios con aislamiento garantizado.
- El **criterio de Popek y Goldberg** define cuándo una arquitectura es virtualizable eficientemente; x86 inicial no lo cumplía, lo que retrasó su adopción masiva.
- **VMware (binary translation)**, **Xen (paravirtualización)** y **KVM (hardware-assisted)** resolvieron la virtualización en x86 mediante enfoques complementarios que convergieron con la llegada de VT-x/AMD-V.
- Las **extensiones de hardware (VT-x/AMD-V)** fueron el catalizador que permitió virtualización eficiente en commodity hardware, cerrando la brecha de rendimiento con mainframes.
- La revolución no fue solo técnica: la virtualización transformó la **economía del centro de datos**, permitiendo consolidación, agilidad operativa y sentando las bases de la nube pública.
- Comprender esta evolución ayuda a tomar decisiones informadas hoy: cuándo usar VMs vs. contenedores, cómo evaluar hipervisores, y por qué ciertas arquitecturas (como Firecracker o Kata) combinan lo mejor de ambos mundos.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/intro/intro" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/intro/ventajas" class="next">Siguiente</a>
</div>
