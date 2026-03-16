---
title: "Métricas de durabilidad"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Métricas de durabilidad](#métricas-de-durabilidad)
  - [Métricas](#métricas)
    - [TBW (Total Bytes Written)](#tbw-total-bytes-written)
    - [DWPD (Drive Writes Per Day)](#dwpd-drive-writes-per-day)
  - [Durabilidad](#durabilidad)
  - [Vida útil](#vida-útil)
  - [Copias de seguridad](#copias-de-seguridad)
  - [Quédate con...](#quédate-con)

</div>

# Métricas de durabilidad

La durabilidad de una unidad de estado sólido (SSD) no se mide en años, sino en la cantidad de datos que puede escribirse en ella antes de que sus celdas de memoria flash comiencen a fallar. A diferencia de los discos duros (HDD), que suelen fallar por desgaste mecánico, los SSDs tienen una vida útil limitada por la fatiga del material semiconductor en las celdas NAND. Comprender las métricas que cuantifican esta durabilidad —como TBW y DWPD— es esencial para elegir el almacenamiento adecuado según la carga de trabajo, especialmente en entornos de desarrollo, servidores o aplicaciones con escrituras intensivas.

## Métricas

Las dos métricas principales utilizadas por los fabricantes para especificar la vida útil de un SSD son:

### TBW (Total Bytes Written)

TBW (Total Bytes Written) indica la cantidad total de datos que se pueden escribir en el SSD durante su vida útil. Por ejemplo, un SSD de 1 TB con una especificación de 600 TBW puede soportar 600 terabytes de escrituras acumuladas antes de que se considere fuera de garantía.

En la práctica, pocos usuarios alcanzan este límite, pero en servidores o estaciones de renderizado, es posible agotarlo en pocos años.

> El TBW escala con la capacidad. Un SSD de 2 TB del mismo modelo suele tener el doble de TBW que uno de 1 TB, ya que tiene el doble de celdas para distribuir el desgaste.

### DWPD (Drive Writes Per Day)

DWPD (Drive Writes Per Day) mide cuántas veces se puede escribir la capacidad total del SSD cada día durante el período de garantía (normalmente 5 años).

DWPD es más útil que TBW al comparar SSDs de distinta capacidad, ya que normaliza el desgaste por tamaño.

## Durabilidad

La durabilidad real depende del tipo de celda NAND:

- SLC: ~100.000 ciclos de escritura → altísimo TBW.
- MLC: ~3.000–10.000 ciclos.
- TLC: ~500–3.000 ciclos.
- QLC: ~100–1.000 ciclos → TBW más bajo, especialmente en capacidades pequeñas.

Los SSDs modernos usan técnicas para prolongar la vida útil:

- Wear leveling: distribuye las escrituras uniformemente entre todas las celdas.
- Over-provisioning: reserva un 7–28% de la NAND para reemplazar celdas fallidas y facilitar el garbage collection.
- TRIM: permite al sistema operativo informar al SSD qué bloques ya no se usan, optimizando la reescritura.

> La lectura no desgasta la NAND. Solo las escrituras y borrados consumen ciclos de vida. Por eso, SSDs usados principalmente en lectura (como para juegos o sistema operativo) duran mucho más.

## Vida útil

La vida útil útil de un SSD suele superar con creces la de un PC típico. La mayoría de los usuarios nunca agotan el TBW. Sin embargo, otros factores pueden causar fallos antes:

- Fallo del controlador o del chip de caché DRAM.
- Pérdida de datos por largos períodos sin energía (la NAND puede perder carga si está apagada >1–2 años, especialmente a altas temperaturas).
- Errores de firmware.

Por eso, la durabilidad no es solo cuestión de TBW: la calidad del controlador y el firmware son igualmente importantes.

## Copias de seguridad

Ninguna métrica de durabilidad sustituye a una estrategia de copias de seguridad. Los SSDs, como cualquier dispositivo de almacenamiento, pueden fallar de forma inesperada por causas no relacionadas con el desgaste (sobretensión, fallo de firmware, daño físico).

Regla fundamental: sigue la regla 3-2-1:

- 3 copias de tus datos.
- 2 en medios distintos.
- 1 fuera del sitio (cloud o ubicación remota).

> Algunos SSDs QLC de bajo costo, al agotar su TBW, dejan de aceptar escrituras pero permiten lecturas, facilitando la recuperación. Otros simplemente se bloquean. Verifica el comportamiento post-TBW del modelo que elijas si la integridad de los datos es crítica.

## Quédate con...

- TBW (Total Bytes Written) y DWPD (Drive Writes Per Day) son las métricas clave para evaluar la durabilidad de un SSD.
- La durabilidad depende del tipo de celda (SLC > MLC > TLC > QLC) y de tecnologías como wear leveling y over-provisioning.
- La vida útil real suele ser mayor que el TBW, pero no es infinita; los fallos pueden ocurrir por causas no relacionadas con el desgaste.
- Las lecturas no consumen ciclos de escritura; los SSDs de uso ligero (sistema, juegos) rara vez agotan su TBW.
- Nunca confíes solo en la durabilidad del SSD: implementa siempre una estrategia robusta de copias de seguridad.
- En cargas de escritura intensiva (bases de datos, logging, VMs), elige SSDs con alto TBW/DWPD (TLC profesional o MLC), no QLC de consumo.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/almacenamiento/ssd" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/almacenamiento/optico" class="next">Siguiente</a>
</div>
