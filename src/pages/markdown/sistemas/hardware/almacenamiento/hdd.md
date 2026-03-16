---
title: "Unidades de Disco Duro (HDD)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Unidades de Disco Duro (HDD)](#unidades-de-disco-duro-hdd)
  - [Funcionamiento mecánico (platos, cabezales)](#funcionamiento-mecánico-platos-cabezales)
  - [Velocidad de rotación (RPM)](#velocidad-de-rotación-rpm)
  - [Latencia](#latencia)
  - [Ventajas y limitaciones](#ventajas-y-limitaciones)
  - [Quédate con...](#quédate-con)

</div>

# Unidades de Disco Duro (HDD)

El disco duro (HDD, por sus siglas en inglés) fue durante más de medio siglo el estándar dominante para el almacenamiento persistente en computadoras. Aunque ha sido ampliamente reemplazado por las unidades de estado sólido (SSD) en sistemas donde el rendimiento es prioritario, el HDD sigue siendo relevante en escenarios que requieren alta capacidad a bajo costo, como servidores de archivos, respaldos masivos o almacenamiento de medios.

## Funcionamiento mecánico (platos, cabezales)

Un HDD es un dispositivo electromecánico que almacena datos en platos magnéticos giratorios, recubiertos con una fina capa de material ferromagnético. Estos platos están montados en un eje común y giran a velocidad constante, accionados por un motor.

Sobre cada superficie de los platos, un cabezal de lectura/escritura flota a apenas nanómetros de distancia, suspendido por una capa de aire generada por la rotación. Este cabezal no toca físicamente el plato (excepto en el apagado, cuando se estaciona en una zona segura), lo que evita el desgaste durante la operación.

Los datos se organizan en pistas concéntricas, y cada pista se divide en sectores (típicamente de 512 bytes o 4 KB). Para acceder a un dato, el sistema:

1. Mueve el brazo del cabezal a la pista correcta (tiempo de búsqueda, seek time).
1. Espera a que el sector deseado gire bajo el cabezal (latencia rotacional).
1. Lee o escribe los datos a medida que pasan bajo el cabezal.

Este proceso implica movimiento físico, lo que lo hace inherentemente más lento que el acceso electrónico de un SSD.

## Velocidad de rotación (RPM)

La velocidad de rotación, medida en revoluciones por minuto (RPM), es un factor clave en el rendimiento de un HDD:

- 5400 RPM: común en discos de portátiles y almacenamiento secundario; bajo consumo y ruido, pero menor rendimiento.
- 7200 RPM: estándar en discos de escritorio y servidores ligeros; equilibrio entre rendimiento y costo.
- 10.000–15.000 RPM: usado en servidores de alto rendimiento (como los antiguos Seagate Cheetah o Western Digital VelociRaptor); mayor velocidad, pero también más calor, ruido y costo.

Una mayor RPM reduce la latencia rotacional promedio (tiempo medio de espera para que un sector pase bajo el cabezal), mejorando la respuesta en accesos aleatorios.

## Latencia

La latencia total de un HDD es la suma de dos componentes mecánicos:

- Tiempo de búsqueda (seek time): 8–15 ms en discos de 7200 RPM.
- Latencia rotacional: la mitad del tiempo de una rotación completa.
  - 5400 RPM → ~5.6 ms
  - 7200 RPM → ~4.2 ms
  - 10.000 RPM → ~3.0 ms

Así, la latencia total típica de un HDD moderno es de 10–15 ms, comparado con 0.01–0.1 ms de un SSD. Esta diferencia de dos órdenes de magnitud es la razón principal por la que los sistemas operativos en HDD son notablemente más lentos al arrancar o abrir aplicaciones.

Además, los HDDs sufren fragmentación: si un archivo se almacena en sectores no contiguos, el cabezal debe moverse múltiples veces, multiplicando la latencia. Los SSDs no tienen este problema.

## Ventajas y limitaciones

Ventajas

- Costo por gigabyte muy bajo: ~$0.02/GB (frente a ~$0.07–0.10/GB de un SSD SATA).
- Alta capacidad: discos comerciales hasta 22–30 TB (tecnologías como HAMR y MAMR permitirán >50 TB en el futuro).
- Durabilidad en escritura: no tiene límite práctico de ciclos de escritura (a diferencia de la flash NAND en SSDs).
- Ideal para datos secuenciales: video, respaldos, archivos grandes, donde el acceso es lineal y la latencia mecánica tiene menos impacto.

Limitaciones

- Alta latencia: inadecuado para cargas con muchos accesos aleatorios (bases de datos, sistema operativo, juegos modernos).
- Sensible a impactos físicos: un golpe mientras está en uso puede causar un "head crash" y pérdida total de datos.
- Consumo y ruido: requiere más energía que un SSD y genera calor y ruido por la rotación y el movimiento del cabezal.
- Degradación con el tiempo: los motores y cojinetes mecánicos tienen vida útil limitada (~3–5 años en uso intensivo).

> Aunque los HDDs están en declive en PCs de consumo, siguen siendo imprescindibles en centros de datos para almacenamiento frío y respaldos. Como desarrollador, si tu aplicación maneja grandes volúmenes de datos secuenciales (video, logs, backups), un HDD puede ser suficiente; pero si requieres baja latencia o muchos accesos pequeños, un SSD es obligatorio.

## Quédate con...

- El HDD es un dispositivo mecánico: usa platos giratorios y cabezales móviles para leer/escribir datos magnéticamente.
- La velocidad de rotación (RPM) afecta directamente la latencia: 7200 RPM es el estándar; 5400 RPM para bajo consumo.
- La latencia total (10–15 ms) es miles de veces mayor que en SSDs, lo que penaliza accesos aleatorios.
- Ventajas: bajo costo por GB, alta capacidad, durabilidad en escritura.
- Limitaciones: lento en accesos aleatorios, sensible a golpes, ruido y consumo elevado.
- Usa HDDs para almacenamiento masivo secuencial; evítalos para sistema operativo, bases de datos o aplicaciones interactivas.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/almacenamiento/almacenamiento" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/almacenamiento/ssd" class="next">Siguiente</a>
</div>
