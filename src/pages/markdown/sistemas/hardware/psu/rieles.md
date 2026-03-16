---
title: "Rieles de voltaje"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Rieles de voltaje](#rieles-de-voltaje)
  - [Rieles de voltaje](#rieles-de-voltaje-1)
  - [El riel de +12V (componentes principales)](#el-riel-de-12v-componentes-principales)
  - [+5V](#5v)
  - [+3.3V](#33v)
  - [La importancia del riel único](#la-importancia-del-riel-único)
  - [Quédate con...](#quédate-con)

</div>

# Rieles de voltaje

Dentro de una fuente de alimentación (PSU), la energía no se entrega como una sola corriente homogénea, sino a través de rieles de voltaje (voltage rails): circuitos independientes que suministran voltajes específicos a distintos componentes del sistema. Cada riel está diseñado para entregar una cantidad controlada de corriente a un nivel de voltaje preciso, con tolerancias estrictas. Comprender cómo se distribuye la energía a través de estos rieles —especialmente el crítico +12 V— es fundamental para garantizar la estabilidad del sistema, evitar sobrecargas y seleccionar una PSU adecuada para configuraciones exigentes, como servidores de desarrollo, estaciones de IA o sistemas con GPUs de alta gama.

## Rieles de voltaje

Una PSU moderna genera tres voltajes principales mediante circuitos reguladores separados:

- +12 V: alimenta los componentes de mayor consumo: CPU, GPU, ventiladores y discos duros.
- +5 V: usado por discos SSD SATA, USB, chips del chipset y algunos periféricos.
- +3.3 V: alimenta la RAM, los chips lógicos de la placa base y algunos sensores.

Cada uno de estos rieles tiene un límite máximo de corriente (amperios) y potencia (vatios) que puede entregar, definido por el diseño de la PSU. Estos límites se especifican en la etiqueta de la fuente y son tan importantes como la potencia total.

## El riel de +12V (componentes principales)

El riel de +12 V es, con diferencia, el más importante en sistemas modernos. Desde mediados de la década de 2000, la industria ha migrado hacia la centralización del consumo en este riel, porque es más eficiente transmitir alta potencia a alto voltaje y baja corriente (menos pérdidas por calor).

- CPU: se conecta mediante el conector EPS 4+4 pin (8-pin), que lleva +12 V directamente al VRM de la placa.
- GPU: usa conectores PCIe 6+2 pin, que también entregan +12 V.
- Discos duros mecánicos y ventiladores: también dependen de +12 V.

En una PSU de 750 W de gama media, más del 90% de la potencia total (680–720 W) se entrega a través del riel +12 V. Por eso, al evaluar una fuente, la capacidad del riel +12 V (en amperios o vatios) es más relevante que la potencia total etiquetada.

## +5V

El riel de +5 V alimenta dispositivos de consumo moderado:

- Puertos USB (especialmente USB 3.0/3.1).
- Discos SSD SATA y algunos HDDs antiguos.
- Chips del chipset y controladores de red/audio.
- Luces LED y periféricos básicos.

Su demanda ha disminuido con el tiempo, ya que muchos componentes han migrado a +12 V o a voltajes más bajos regulados localmente. Aun así, sigue siendo necesario, y una PSU debe entregar al menos 20–30 A en este riel para sistemas modernos.

## +3.3V

El riel de +3.3 V es el de menor potencia, pero esencial para la estabilidad del sistema:

- Módulos de RAM (DDR4/DDR5).
- Circuitos lógicos de la placa base (chipset, BIOS/UEFI).
- Algunos sensores y chips de gestión.

Al igual que +5 V, su carga ha disminuido, ya que la CPU y GPU ahora regulan sus propios voltajes internos desde +12 V. Sin embargo, cualquier inestabilidad en +3.3 V puede causar fallos de arranque o corrupción de memoria.

## La importancia del riel único

Históricamente, las PSU usaban múltiples rieles +12 V (por ejemplo, +12V1, +12V2), cada uno con su propio límite de corriente (por seguridad). Esto obligaba a distribuir los cables de CPU y GPU entre rieles distintos. Sin embargo, con el aumento del consumo de las GPUs modernas (que pueden requerir 300–450 W solo en +12 V), los múltiples rieles se volvieron problemáticos: si una GPU excedía el límite de su riel, la PSU se apagaba por protección, incluso si la potencia total estaba dentro del rango.

Hoy, la mayoría de las PSU de gama media y alta usan un riel +12 V único (single +12V rail), que combina toda la capacidad de +12 V en un solo circuito. Esto ofrece varias ventajas:

- Mayor flexibilidad: no hay que preocuparse por en qué conector se enchufa la GPU o la CPU.
- Mejor soporte para GPUs de alta gama: una RTX 4090 puede consumir picos de 600 W en +12 V; un riel único lo maneja sin activar protecciones innecesarias.
- Simplificación del diseño: menos circuitos de protección redundantes.

Las PSU con riel único incluyen protecciones globales (OCP, OPP) que actúan solo en caso de fallo real, no por distribución arbitraria de carga.

> Aunque el riel único es preferible en sistemas de alto rendimiento, las PSU con múltiples rieles siguen siendo seguras y adecuadas para sistemas de oficina o gama baja. La clave está en que la PSU esté bien diseñada y certificada (80 PLUS, marcas reconocidas).

## Quédate con...

- Los rieles de voltaje (+12 V, +5 V, +3.3 V) distribuyen energía a distintos componentes con requisitos específicos.
- El riel +12 V es el más crítico: alimenta CPU, GPU y ventiladores; concentra más del 90% de la potencia en sistemas modernos.
- +5 V y +3.3 V son necesarios para RAM, USB, chipset y periféricos, pero con menor demanda que en el pasado.
- Un riel +12 V único es preferible en sistemas de alto rendimiento, ya que evita apagados por distribución de carga y soporta GPUs modernas.
- Al elegir una PSU, verifica la corriente (A) o potencia (W) del riel +12 V, no solo la potencia total etiquetada.
- Una fuente de calidad garantiza que cada riel mantenga su voltaje dentro de los márgenes aceptables (±5%), esencial para la estabilidad del sistema.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/psu/formato" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/psu/certificacion" class="next">Siguiente</a>
</div>
