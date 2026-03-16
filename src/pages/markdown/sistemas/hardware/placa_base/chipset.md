---
title: "Chipset"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Chipset](#chipset)
  - [Qué es y qué controla](#qué-es-y-qué-controla)
  - [Evolución de los chipsets](#evolución-de-los-chipsets)
  - [Relación con CPU y memoria](#relación-con-cpu-y-memoria)
  - [La función del Northbridge y Southbridge (o su equivalente moderno)](#la-función-del-northbridge-y-southbridge-o-su-equivalente-moderno)
  - [Manejo de la memoria, CPU y E/S](#manejo-de-la-memoria-cpu-y-es)
  - [Quédate con...](#quédate-con)

</div>

# Chipset

El chipset es un conjunto de circuitos integrados en la placa base que gestiona la comunicación entre la CPU y los demás componentes del sistema: memoria, almacenamiento, periféricos y tarjetas de expansión. Aunque su visibilidad para el usuario final es mínima, su papel es fundamental: actúa como el “centro de control de tráfico” del sistema, determinando qué componentes pueden conectarse, a qué velocidad y con qué nivel de eficiencia. Para un desarrollador, entender el chipset es útil no solo para elegir hardware adecuado a las necesidades de una aplicación (por ejemplo, número de líneas PCIe para aceleradores), sino también para interpretar cuellos de botella en E/S o latencias en el acceso a dispositivos periféricos.

## Qué es y qué controla

En esencia, el chipset es un controlador de E/S avanzado. Su función principal es extender las capacidades de la CPU, gestionando componentes que no están directamente integrados en el procesador. Controla:

- Las interfaces de almacenamiento (SATA, M.2 para SSDs NVMe).
- Los puertos USB, Ethernet, audio integrado, y en algunos casos Wi-Fi/Bluetooth.
- Las ranuras PCI Express adicionales (más allá de las dedicadas directamente a la GPU).
- La interconexión con la memoria (en diseños antiguos) y la gestión de latencias.
- Las señales de reloj, reset y gestión térmica del sistema.

Además, el chipset influye en características como el número máximo de dispositivos USB conectables, la versión de SATA soportada (III vs. más recientes), o si el sistema admite overclocking (en placas con chipsets “K” de Intel o “X” de AMD).

## Evolución de los chipsets

Los chipsets han evolucionado drásticamente en las últimas dos décadas, impulsados por la necesidad de reducir latencias y simplificar la arquitectura del sistema:

- En los años 90 y principios de los 2000, los chipsets se dividían en dos chips físicos: el Northbridge (puente norte) y el Southbridge (puente sur), conectados por un bus interno (como el FSB o DMI).
- Con la integración del controlador de memoria y el controlador PCIe (para la GPU) directamente en la CPU —primero en AMD con la arquitectura Athlon 64 (2003), luego en Intel con Nehalem (2008)—, el Northbridge perdió su razón de ser.
- Hoy, lo que antes era el Southbridge se ha consolidado en un único chip llamado simplemente chipset, o Platform Controller Hub (PCH) en la terminología de Intel. AMD lo denomina FCH (Fusion Controller Hub) en algunos contextos, aunque en sus plataformas modernas también se refiere al chipset de forma genérica.

Esta evolución ha reducido significativamente la latencia entre CPU y memoria, y ha simplificado el diseño de las placas base, permitiendo mayor ancho de banda para la GPU y otros componentes críticos.

## Relación con CPU y memoria

La relación entre chipset, CPU y memoria ha cambiado radicalmente:

**Antes:** la CPU se comunicaba con el Northbridge a través del Front Side Bus (FSB); el Northbridge gestionaba la memoria RAM y la GPU; el Southbridge, el resto de E/S. Esto creaba un cuello de botella, ya que todo el tráfico pasaba por el FSB.

**Hoy:** la CPU contiene internamente el controlador de memoria y, al menos, las líneas PCIe para la GPU principal. La memoria RAM se conecta directamente a la CPU, lo que mejora el ancho de banda y reduce la latencia.

El chipset actual se conecta a la CPU mediante un enlace de alta velocidad punto a punto (Intel DMI o AMD Infinity Fabric), y solo gestiona E/S secundaria: puertos USB, SATA, PCIe adicionales, etc.

Esto significa que el rendimiento de la memoria y la GPU ya no depende del chipset, sino exclusivamente de la CPU y de los módulos de RAM. El chipset influye, en cambio, en el rendimiento del almacenamiento secundario y los periféricos.

## La función del Northbridge y Southbridge (o su equivalente moderno)

Aunque ya no existen como chips separados en sistemas modernos, sus funciones siguen presentes, redistribuidas:

- Northbridge (histórico):
  - Conectaba CPU, RAM y GPU.
  - Era el componente más crítico para el rendimiento.
  - Requería refrigeración activa en sistemas de alto rendimiento.
- Southbridge (histórico):
  - Gestionaba E/S lenta: disco duro, USB, audio, LAN, BIOS.
  - Estaba conectado al Northbridge, no directamente a la CPU.
- Equivalente moderno:
  - Las funciones del Northbridge están integradas en la CPU.
  - Las funciones del Southbridge están en el chipset (PCH/FCH), que ahora se conecta directamente a la CPU mediante un enlace dedicado (por ejemplo, DMI 4.0 en Intel, que ofrece ~32 GB/s de ancho de banda).

Esta integración ha eliminado el cuello de botella del FSB y ha permitido que la memoria y la GPU operen a su máxima velocidad, independientemente del chipset.

## Manejo de la memoria, CPU y E/S

**Memoria:** hoy en día, el chipset no maneja la memoria principal. El controlador de memoria está en la CPU, y los módulos RAM se conectan directamente a ella. El chipset solo puede influir indirectamente en configuraciones avanzadas (como overclocking de memoria en placas con chipsets que lo permiten).

**CPU:** el chipset no controla la ejecución de instrucciones, pero sí gestiona señales de gestión como el reloj del sistema, el arranque inicial (junto con la BIOS/UEFI) y la comunicación con sensores térmicos. También puede limitar funciones como el overclocking según su modelo (por ejemplo, en Intel, solo los chipsets con letra “Z” lo permiten).

**E/S:** esta es la función principal del chipset moderno. Por ejemplo:

- Un chipset Intel Z790 puede ofrecer hasta 12 puertos USB (incluyendo USB 3.2 Gen 2x2), 8 líneas SATA, y 12 líneas PCIe 4.0 adicionales.
- Un chipset AMD B650 ofrece PCIe 4.0 para M.2 y USB 3.2, con soporte para overclocking de RAM (EXPO).

Si conectas un SSD NVMe en una ranura M.2 controlada por el chipset (no por la CPU), su ancho de banda estará limitado por el enlace DMI/Infinity Fabric, no por PCIe directo. Esto puede afectar el rendimiento en sistemas con múltiples SSDs rápidos.

> En sistemas embebidos o servidores, existen chipsets especializados (como Intel C600 para Xeon o AMD SP5 para EPYC) que ofrecen más líneas PCIe, mayor número de canales de memoria y soporte para ECC, características esenciales en entornos de alta disponibilidad.

## Quédate con...

- El chipset es el controlador central de E/S en la placa base, gestionando almacenamiento, USB, audio, red y PCIe secundario.
- Ha evolucionado de una arquitectura de dos chips (Northbridge/Southbridge) a un único chip (PCH/FCH), con las funciones críticas (memoria, GPU) integradas en la CPU.
- Hoy, la memoria y la GPU se conectan directamente a la CPU, lo que mejora rendimiento y reduce latencia.
- El chipset moderno no afecta el rendimiento de la RAM o la GPU principal, pero sí el de dispositivos como SSDs SATA, puertos USB o tarjetas PCIe adicionales.
- La elección del chipset determina capacidades clave: número de puertos, soporte para overclocking, versiones de PCIe/USB/SATA, y compatibilidad con generaciones de CPU.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/placa_base/formatos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/placa_base/zocalos" class="next">Siguiente</a>
</div>
