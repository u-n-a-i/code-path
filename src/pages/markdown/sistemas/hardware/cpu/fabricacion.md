---
title: "Fabricación y litografía"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Fabricación y litografía](#fabricación-y-litografía)
  - [El proceso de fabricación](#el-proceso-de-fabricación)
  - [Micras/nanómetros](#micrasnanómetros)
  - [La Ley de Moore](#la-ley-de-moore)
  - [Quédate con...](#quédate-con)

</div>

# Fabricación y litografía

Detrás de cada CPU, GPU o chip de memoria hay un proceso de fabricación de una complejidad casi inimaginable: miles de pasos, salas limpias más estériles que un quirófano y máquinas que cuestan decenas de millones de dólares. Este proceso, conocido como fabricación de semiconductores, define no solo el tamaño físico de los transistores, sino también su eficiencia energética, velocidad y densidad. El avance en esta área —medido en nanómetros (nm)— ha sido el motor del progreso informático durante más de medio siglo.

## El proceso de fabricación

La fabricación de una CPU comienza con un oblea de silicio (wafer), un disco circular ultrapuro de unos 300 mm de diámetro. Sobre esta oblea se construyen capas sucesivas de materiales (silicio, dióxido de silicio, cobre, etc.) mediante técnicas como:

- Fotolitografía: se proyecta un patrón de luz ultravioleta a través de una máscara sobre una capa fotosensible (fotoresist). Las áreas expuestas se endurecen o disuelven, creando estructuras microscópicas.
- Grabado (etching): se eliminan selectivamente materiales no protegidos.
- Deposición: se añaden capas de conductores o aislantes.
- Implantación iónica: se dopan zonas del silicio con impurezas para modificar su conductividad.
- Planarización químico-mecánica: se alisan las capas para preparar la siguiente.

Este ciclo se repite docenas de veces para construir los transistores y las interconexiones que forman los núcleos, caché y controladores. Al final, la oblea se corta en dies (chips individuales), que se prueban, encapsulan y montan en un zócalo.

El equipo más crítico hoy es la máquina de litografía EUV (Extreme Ultraviolet), que usa luz de 13.5 nm de longitud de onda para imprimir patrones de apenas unos nanómetros. Estas máquinas, fabricadas casi en exclusiva por la empresa holandesa ASML, son tan complejas que tardan un año en ensamblarse y cuestan más de 150 millones de euros.

## Micras/nanómetros

El tamaño de los transistores se ha medido históricamente en micras (µm) y, desde los años 90, en nanómetros (nm). Este número —como “7 nm”, “5 nm” o “3 nm”— originalmente representaba la longitud de la compuerta (gate length) del transistor MOSFET, el componente básico de la electrónica digital.

- 1971 (Intel 4004): 10.000 nm (10 µm)
- 1993 (Intel Pentium): 500 nm
- 2007 (Intel Core 2): 65 nm
- 2017 (Apple A11, AMD Zen): 10 nm / 14 nm
- 2020–2025 (Apple M-series, Snapdragon 8 Gen 3): 5 nm, 4 nm, 3 nm

Sin embargo, desde los 22 nm, el número ha dejado de ser una medida física exacta y se ha convertido más en un nombre comercial. Por ejemplo, el “3 nm” de TSMC no significa que sus transistores midan 3 nanómetros, sino que representa una generación específica con mejoras en densidad, rendimiento y eficiencia respecto al “5 nm”.

Lo que sí es cierto es que transistores más pequeños permiten:

- Más transistores por chip (la Apple M2 Ultra tiene 134.000 millones).
- Menor consumo energético por operación.
- Mayor velocidad (menos distancia para que viajen los electrones).
- Menor coste por transistor (más chips por oblea).

Pero también traen desafíos: efectos cuánticos como la tunneling (fugas de corriente), mayor complejidad de fabricación y rendimientos (yield) más bajos.

## La Ley de Moore

En 1965, Gordon Moore, cofundador de Intel, observó que el número de transistores en un chip de coste constante se duplicaba aproximadamente cada dos años. Esta observación, conocida como la Ley de Moore, se convirtió en una profecía autocumplida que guió la industria durante décadas.

Durante más de 50 años, la ley se cumplió con asombrosa precisión, impulsando el crecimiento exponencial del poder computacional. Pero desde mediados de la década de 2010, el ritmo se ha ralentizado. Las leyes de la física —especialmente los límites térmicos y cuánticos— hacen que seguir reduciendo el tamaño de los transistores sea cada vez más costoso y difícil.

Hoy, la industria ya no depende únicamente de la miniaturización, sino de innovaciones arquitectónicas:

- Chips 3D (como Intel Foveros o TSMC SoIC): apilan capas de silicio verticalmente.
- Chiplets: diseños modulares con múltiples dies interconectados (como AMD Ryzen o Apple M-series).
- Nuevos materiales: grafeno, nanotubos de carbono, transistores GAAFET (Gate-All-Around).
- Computación especializada: aceleradores para IA, criptografía o gráficos integrados en el mismo SoC.

La Ley de Moore ya no es una ley física, sino un ideal que ha evolucionado: ya no se trata solo de más transistores, sino de más inteligencia por vatio.

> Aunque como desarrollador no diseñas chips, la transición desde la escala de Moore a la era post-Moore afecta directamente tu trabajo: el rendimiento ya no crece automáticamente con cada generación de hardware. Ahora, ganar velocidad requiere mejor software, paralelismo eficiente, uso de aceleradores y algoritmos conscientes del hardware.

## Quédate con...

- La fabricación de semiconductores es un proceso de decenas de capas, basado en fotolitografía, grabado y deposición sobre obleas de silicio.
- El tamaño en nanómetros (5 nm, 3 nm) indica la generación del proceso; transistores más pequeños permiten más densidad, menor consumo y mayor velocidad.
- La Ley de Moore (duplicación de transistores cada ~2 años) ha guiado la industria, pero su ritmo se ha ralentizado por límites físicos.
- Hoy, el progreso viene de arquitecturas 3D, chiplets, materiales avanzados y aceleradores especializados, no solo de miniaturización.
- Como desarrollador, en la era post-Moore, optimizar el software y aprovechar el hardware especializado es tan importante como esperar mejoras del silicio.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/cpu/frecuencia" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
