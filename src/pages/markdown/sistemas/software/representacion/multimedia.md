---
title: "Representación de imágenes y multimedia"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Representación de imágenes y multimedia](#representación-de-imágenes-y-multimedia)
  - [Cómo se tratan las imágenes](#cómo-se-tratan-las-imágenes)
  - [Cómo se tratan los audios](#cómo-se-tratan-los-audios)
  - [Cómo se tratan los videos](#cómo-se-tratan-los-videos)
  - [Modelos de color (RGB, CMYK)](#modelos-de-color-rgb-cmyk)
  - [Profundidad de color](#profundidad-de-color)
  - [Formatos de imagen: bitmap vs. vectorial](#formatos-de-imagen-bitmap-vs-vectorial)
  - [Compresión con y sin pérdida (JPEG, PNG)](#compresión-con-y-sin-pérdida-jpeg-png)
  - [Quédate con...](#quédate-con)

</div>

# Representación de imágenes y multimedia

Los sistemas digitales no “entienden” imágenes, sonidos o videos como lo hacemos los humanos. En cambio, transforman estas experiencias sensoriales en datos estructurados que pueden almacenarse, transmitirse y reproducirse. Esta transformación implica decisiones sobre cómo muestrear el mundo real, qué información conservar, cómo codificarla eficientemente y qué modelo usar para representar colores o formas. Comprender estos principios —desde los modelos de color hasta los algoritmos de compresión— es esencial no solo para trabajar con multimedia, sino también para tomar decisiones informadas sobre calidad, tamaño de archivo y compatibilidad.

## Cómo se tratan las imágenes

Una imagen digital se representa como una cuadrícula de píxeles (picture elements), donde cada píxel contiene información sobre su color y brillo. Esta representación se conoce como gráfico de mapa de bits (bitmap). La imagen se define por:

- Su resolución: número de píxeles en ancho × alto (por ejemplo, 1920×1080).
- Su profundidad de color: cuántos bits se usan por píxel para codificar el color.
- Su modelo de color: cómo se interpretan esos bits (RGB, CMYK, etc.).

Cada píxel se almacena como uno o varios valores numéricos. Por ejemplo, en RGB con 8 bits por canal, un píxel rojo brillante sería (255, 0, 0).

## Cómo se tratan los audios

El sonido es una onda analógica continua en el tiempo. Para digitalizarlo, se aplica el muestreo: se toman mediciones de la amplitud de la onda a intervalos regulares. Dos parámetros definen la calidad del audio digital:

- Frecuencia de muestreo: cuántas muestras por segundo se toman (medida en Hz).
  Ejemplos: 44.1 kHz (CD), 48 kHz (video), 8 kHz (voz telefónica).
- Profundidad de bits: cuántos bits se usan para representar cada muestra.
  Ejemplos: 16 bits (CD), 24 bits (audio profesional).

El resultado es una secuencia de números que aproxima la onda original. Cuanto mayor sea la frecuencia y la profundidad, más fiel será la reproducción —pero también mayor el tamaño del archivo.

## Cómo se tratan los videos

Un video es una secuencia de imágenes (fotogramas o frames) mostradas rápidamente para crear la ilusión de movimiento, acompañada generalmente de una pista de audio sincronizada. Los parámetros clave incluyen:

- Tasa de fotogramas (frame rate): cuántos frames por segundo (fps).
  Ejemplos: 24 fps (cine), 30 fps (TV), 60 fps (videojuegos).
- Resolución y profundidad de color de cada frame.
- Sincronización audiovisual: los datos de audio y video se entrelazan en un contenedor (como MP4 o AVI) con marcas de tiempo para mantenerlos alineados.

Dado que los videos generan cantidades masivas de datos (un minuto de video 1080p sin comprimir puede superar los 10 GB), la compresión es esencial.

## Modelos de color (RGB, CMYK)

El modelo de color define cómo se generan o reproducen los colores a partir de componentes básicos.

- RGB (Red, Green, Blue):
  - Modelo aditivo, usado en pantallas (móviles, monitores, TVs).
  - Combina luz roja, verde y azul.
  - Negro = ausencia de luz (0, 0, 0); blanco = máxima intensidad (255, 255, 255).
  - Es el estándar en entornos digitales.
- CMYK (Cyan, Magenta, Yellow, Key/Black):
  - Modelo sustractivo, usado en impresión.
  - Combina tintas que absorben (sustraen) longitudes de onda de la luz blanca.
  - Blanco = papel sin tinta; negro = combinación de colores (aunque se añade tinta negra pura para precisión).
  - No se usa directamente en pantallas; los diseños en CMYK deben convertirse a RGB para visualización digital.

> Otros modelos como HSV/HSL (matiz, saturación, luminosidad) son útiles para edición gráfica porque se alinean mejor con la percepción humana del color, pero internamente los dispositivos siguen usando RGB.

## Profundidad de color

La profundidad de color indica cuántos bits se usan para representar el color de un píxel. Determina el número de colores distintos que se pueden mostrar:

- 8 bits total (256 colores): usado en GIFs antiguos.
- 24 bits (8 bits por canal en RGB): 16.7 millones de colores (256³). Estándar en fotografía y web.
- 32 bits: 24 bits de color + 8 bits de canal alfa (transparencia).
- 48 bits o más: usado en edición profesional (16 bits por canal), para evitar bandas (banding) en gradientes suaves.

Mayor profundidad mejora la calidad visual, pero aumenta el tamaño del archivo y los requisitos de procesamiento.

## Formatos de imagen: bitmap vs. vectorial

Existen dos grandes familias de formatos gráficos:

- Bitmap (ráster):
  - Almacena cada píxel individualmente.
  - Calidad depende de la resolución: al ampliar, se pixela.
  - Ideal para fotos y composiciones complejas.
  - Ejemplos: JPEG, PNG, BMP, GIF.
- Vectorial:
  - Describe la imagen mediante instrucciones matemáticas: líneas, curvas, formas, colores.
  - Se puede escalar a cualquier tamaño sin pérdida de calidad.
  - Ideal para logotipos, iconos, tipografía y gráficos simples.
  - Ejemplos: SVG, EPS, AI, PDF (para gráficos vectoriales).

La elección entre uno u otro depende del uso: una foto debe ser bitmap; un logo, preferiblemente vectorial.

## Compresión con y sin pérdida (JPEG, PNG)

Para reducir el tamaño de los archivos multimedia, se aplican algoritmos de compresión:

- Sin pérdida (lossless):
  - Se puede reconstruir exactamente el dato original.
  - Ideal cuando la fidelidad es crítica (imágenes médicas, código QR, transparencias).
  - PNG usa compresión sin pérdida (basada en DEFLATE). Soporta transparencia y es ideal para gráficos con áreas uniformes.
  - GIF también es sin pérdida, pero limitado a 256 colores.
- Con pérdida (lossy):
  - Elimina información perceptualmente redundante (detalles que el ojo humano apenas nota).
  - Logra ratios de compresión mucho mayores, pero con degradación progresiva.
  - JPEG es el estándar para fotografías: descarta detalles finos y suaviza colores, especialmente en zonas de alto contraste.
  - No es adecuado para texto, líneas afiladas o transparencias.

> Volver a comprimir un archivo con pérdida (como guardar varias veces un JPEG) acumula artefactos y degrada aún más la calidad. Por eso, en flujos de trabajo profesionales, se edita en formatos sin pérdida (como TIFF o RAW) y se exporta a JPEG solo al final.

## Quédate con...

- Las imágenes se representan como mapas de bits (píxeles); el audio, mediante muestreo; el video, como secuencia de frames + audio.
- RGB es para pantallas (luz); CMYK, para impresión (tinta).
- La profundidad de color determina la gama de colores: 24 bits = 16.7 millones; 32 bits añade transparencia.
- Bitmap (JPEG, PNG) para fotos; vectorial (SVG) para gráficos escalables.
- Compresión sin pérdida (PNG) preserva todos los datos; con pérdida (JPEG) reduce tamaño sacrificando calidad imperceptible.
- Elegir el formato y la configuración adecuados equilibra calidad, tamaño y propósito —una habilidad clave en desarrollo, diseño y ciencia de datos.

<div class="pagination">
  <a href="/markdown/sistemas/software/representacion/caracteres" class="prev">Anterior</a>
  <a href="/markdown/sistemas/software/representacion/booleana" class="next">Siguiente</a>
</div>
