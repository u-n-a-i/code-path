---
title: "Almacenamiento óptico"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Almacenamiento óptico](#almacenamiento-óptico)
  - [Almacenamiento óptico](#almacenamiento-óptico-1)
  - [CD](#cd)
  - [DVD](#dvd)
  - [Blu-ray](#blu-ray)
  - [Sus capacidades](#sus-capacidades)
  - [Relevancia actual](#relevancia-actual)
  - [Quédate con...](#quédate-con)

</div>

# Almacenamiento óptico

El almacenamiento óptico es una tecnología que utiliza láseres para leer y escribir datos en discos recubiertos con una capa reflectante. Aunque ha sido ampliamente desplazado por el almacenamiento en estado sólido y la nube, los formatos ópticos como el CD, DVD y Blu-ray tuvieron un papel fundamental en la distribución de software, música, video y respaldos durante décadas. Hoy, su uso es marginal en entornos de consumo, pero persiste en nichos específicos como la preservación de datos a largo plazo, la distribución física de contenido y ciertos sistemas industriales.

## Almacenamiento óptico

El principio básico del almacenamiento óptico consiste en grabar microscópicos hoyos (pits) y zonas planas (lands) en una capa de policarbonato del disco. Un láser de baja potencia lee estos cambios en la reflexión: los pits dispersan la luz, mientras que los lands la reflejan directamente a un sensor. En discos regrabables (CD-RW, DVD-RW, etc.), se usa una capa de material de cambio de fase que puede alternar entre estados cristalino y amorfo mediante pulsos de láser de distinta intensidad.

La principal ventaja del almacenamiento óptico es su bajo costo por unidad, portabilidad física y resistencia a campos magnéticos. Sin embargo, sufre de baja velocidad, capacidad limitada (comparada con SSDs o HDDs) y vulnerabilidad a rayones, luz solar y humedad.

## CD

El Compact Disc (CD), introducido en 1982 por Sony y Philips, fue el primer formato óptico de uso masivo.

- Capacidad: 650–700 MB (≈80 minutos de audio).
- Tecnología: láser infrarrojo (780 nm).
- Variantes:
  - CD-ROM: solo lectura (software, enciclopedias).
  - CD-R: grabable una vez.
  - CD-RW: regrabable (~1.000 ciclos).

El CD revolucionó la distribución de software y música, pero su capacidad se volvió insuficiente con el auge del video digital.

## DVD

El Digital Versatile Disc (DVD), lanzado en 1995, mejoró la densidad mediante un láser de menor longitud de onda y pistas más estrechas.

- Capacidad:
  - DVD-5 (capa simple): 4.7 GB.
  - DVD-9 (doble capa): 8.5 GB.
  - Versiones duales (DVD-10, DVD-18): hasta 17 GB (poco comunes).
- Tecnología: láser rojo (650 nm).
- Uso: películas, juegos de consola (PS2, Xbox), instaladores de software.

El DVD se convirtió en el estándar para video doméstico hasta la llegada del Blu-ray.

## Blu-ray

El Blu-ray Disc (BD), lanzado en 2006 tras una guerra de formatos con HD DVD, utiliza un láser azul-violeta de menor longitud de onda, permitiendo una mayor densidad de datos.

- Capacidad:
  - BD-25: 25 GB (capa simple).
  - BD-50: 50 GB (doble capa).
  - BD-100/128: 100–128 GB (triple/cuádruple capa, usados en Ultra HD 4K).
- Tecnología: láser azul (405 nm).
- Uso: video 4K Ultra HD, distribución de juegos (PS4/PS5, Xbox Series), respaldos de alta fidelidad.

Blu-ray sigue siendo relevante en la industria del entretenimiento, especialmente en mercados donde el ancho de banda para streaming es limitado o costoso.

## Sus capacidades

| Formato | Capacidad típica | Láser      | Velocidad máxima (lectura) |
| ------- | ---------------- | ---------- | -------------------------- |
| CD      | 700 MB           | Infrarrojo | 10× → ~1.5 MB/s            |
| DVD     | 4.7–8.5 GB       | Rojo       | 16× → ~22 MB/s             |
| Blu-ray | 25–128 GB        | Azul       | 12× → ~54 MB/s             |

Aunque estas velocidades eran competitivas en su época, hoy son muy inferiores a las de un SSD SATA (550 MB/s) o NVMe (7.000+ MB/s).

## Relevancia actual

El almacenamiento óptico ha perdido casi toda su relevancia en el ámbito del desarrollo y la informática general, pero persiste en algunos nichos:

- Preservación a largo plazo: los discos M-DISC (una variante de DVD/Blu-ray) prometen durabilidad de 1.000 años, usados en archivos gubernamentales y bibliotecas.
- Distribución física: películas 4K en Blu-ray ofrecen mejor calidad y sin compresión que muchos streams; algunos juegos aún se distribuyen en disco por tamaño o región.
- Sistemas industriales/legacy: maquinaria antigua, sistemas embebidos o equipos médicos que dependen de instaladores en CD/DVD.
- Respaldos offline: en entornos de alta seguridad, los discos ópticos proporcionan una forma de air-gapped backup (desconectado de la red).

Sin embargo, la mayoría de los PCs modernos ya no incluyen unidades ópticas, y los sistemas operativos han reducido el soporte para instalaciones desde CD/DVD. La nube, los USB de gran capacidad y los discos externos han reemplazado casi por completo al óptico en el flujo de trabajo diario.

> Si trabajas con software legacy o en entornos regulados (sanidad, gobierno), es posible que aún necesites manejar imágenes ISO o unidades ópticas virtuales (como Daemon Tools o Windows montaje de ISO). Pero para el desarrollo moderno, el almacenamiento óptico es más un concepto histórico que una herramienta práctica.

## Quédate con...

- El almacenamiento óptico usa láseres para leer datos en discos; fue clave en las décadas de 1990–2010.
- CD (700 MB), DVD (4.7–8.5 GB) y Blu-ray (25–128 GB) representan tres generaciones de mayor densidad.
- Su velocidad y capacidad son insignificantes frente a SSDs y HDDs modernos.
- Hoy, su uso se limita a preservación a largo plazo, distribución de video 4K y sistemas legacy.
- La mayoría de los equipos nuevos no incluyen unidades ópticas; el software se distribuye por USB o descarga.
- Como desarrollador, es útil entender su historia, pero rara vez lo usarás en proyectos actuales —a menos que trabajes con sistemas heredados o regulaciones específicas.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/almacenamiento/durabilidad" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/almacenamiento/raid" class="next">Siguiente</a>
</div>
