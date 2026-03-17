---
title: "Representación de datos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Representación de datos](#representación-de-datos)
  - [Texto](#texto)
  - [Imágenes](#imágenes)
  - [Audio](#audio)
  - [Video](#video)
  - [Formatos comunes](#formatos-comunes)
  - [Quédate con...](#quédate-con)

</div>

# Representación de datos

La comunicación entre sistemas heterogéneos exige que la información conserve su significado independientemente de las arquitecturas que la procesan. Un texto escrito en un servidor Linux debe interpretarse idénticamente en un cliente móvil; una imagen capturada en un dispositivo con formato de color RGB debe renderizarse correctamente en una pantalla que opera con YUV; un archivo de audio comprimido con un códec específico debe decodificarse sin pérdida de fidelidad perceptible. La capa de presentación resuelve esta complejidad transformando datos entre formatos internos de aplicación y representaciones estandarizadas para transmisión, gestionando codificaciones de caracteres, esquemas de compresión y estructuras de intercambio que permiten la interoperabilidad sin ambigüedad semántica.

## Texto

La representación de texto en sistemas digitales requiere mapear símbolos abstractos —letras, dígitos, signos de puntuación— a secuencias de bits interpretables por máquinas. Esta tarea, aparentemente trivial, encierra desafíos profundos de compatibilidad: distintos sistemas operativos, lenguajes de programación y regiones geográficas han adoptado históricamente convenciones divergentes para codificar los mismos caracteres.

ASCII (*American Standard Code for Information Interchange*) estableció la primera convención ampliamente adoptada: 7 bits para representar 128 caracteres, suficientes para el alfabeto latino básico, dígitos y símbolos de control. Su simplicidad facilitó la interoperabilidad temprana, pero resultó insuficiente para idiomas con alfabetos no latinos o sistemas de escritura logográficos. Extensiones como ISO-8859-1 añadieron un octavo bit para caracteres europeos, pero fragmentaron el ecosistema: un archivo codificado en ISO-8859-15 podía volverse ilegible en un sistema que esperaba ISO-8859-1.

Unicode resolvió esta fragmentación definiendo un espacio de códigos único para todos los sistemas de escritura humanos, independientemente de plataforma o idioma. UTF-8, su codificación más extendida, representa caracteres ASCII con un solo byte (preservando compatibilidad con sistemas legacy) y emplea secuencias multibyte para caracteres adicionales. Esta eficiencia diferencial explica su adopción masiva en la web: documentos predominantemente en inglés ocupan casi lo mismo que en ASCII, mientras que textos multilingües mantienen integridad sin cambiar de codificación.

>  La detección automática de codificación es un problema no resuelto: sin metadatos explícitos, distinguir entre UTF-8 y ISO-8859-1 para un documento en español puede ser ambiguo. Por esta razón, protocolos modernos como HTTP exigen declarar la codificación en cabeceras (`Content-Type: text/html; charset=utf-8`), y formatos como JSON asumen UTF-8 por defecto.

## Imágenes

Las imágenes digitales representan escenas visuales mediante muestreo espacial y cuantización de color. Cada píxel almacena valores que describen intensidad luminosa y cromática, típicamente en modelos como RGB (rojo, verde, azul) para pantallas o CMYK (cian, magenta, amarillo, negro) para impresión. La resolución —número de píxeles por unidad de área— y la profundidad de color —bits por canal— determinan la fidelidad de la representación y el volumen de datos resultante.

Los formatos de imagen equilibran calidad, tamaño y funcionalidad mediante estrategias de compresión distintas. JPEG emplea compresión con pérdida basada en la transformada discreta del coseno, descartando información visual menos perceptible para el ojo humano; esto reduce drásticamente el tamaño de archivo pero introduce artefactos en recompresiones sucesivas. PNG utiliza compresión sin pérdida (DEFLATE) y soporta canal alfa para transparencia, ideal para gráficos con bordes nítidos o superposiciones. WebP y AVIF representan evoluciones modernas que combinan técnicas predictivas y transformadas avanzadas para mejorar la relación calidad-tamaño respecto a sus predecesores.

La metainformación acompaña frecuentemente a los datos de píxeles: dimensiones, perfil de color (sRGB, Adobe RGB), fecha de captura, coordenadas GPS. Estándares como EXIF (*Exchangeable Image File Format*) definen estructuras para estos metadatos, permitiendo que aplicaciones de edición, visualización o indexación interpreten correctamente el contexto de la imagen.

## Audio

La representación digital de audio transforma ondas sonoras continuas en secuencias discretas mediante muestreo y cuantización. La frecuencia de muestreo (típicamente 44.1 kHz para audio CD) determina el ancho de banda reproducible según el teorema de Nyquist; la profundidad de bits (16, 24 o 32 bits) define el rango dinámico y el ruido de cuantización. Audio sin comprimir (PCM) preserva fidelidad máxima pero genera volúmenes de datos elevados: un minuto de estéreo a 44.1 kHz/16 bits ocupa aproximadamente 10 MB.

Los códecs de audio aplican compresión para reducir este costo. MP3 (*MPEG-1 Audio Layer III*) popularizó la compresión con pérdida basada en modelos psicoacústicos: elimina componentes sonoros enmascarados por otros más prominentes, imperceptibles para la audición humana en condiciones normales. AAC (*Advanced Audio Coding*) mejora esta aproximación con técnicas de predicción y resolución frecuencial más fina, ofreciendo mejor calidad a tasas de bits equivalentes. Para aplicaciones que exigen integridad absoluta —producción musical, archivado—, formatos sin pérdida como FLAC (*Free Lossless Audio Codec*) reducen el tamaño mediante compresión estadística reversible, típicamente al 50–60% del original.

>  La elección de códec no solo afecta calidad y tamaño, sino también compatibilidad y latencia. MP3 es universalmente soportado pero introduce retrasos de codificación/decodificación; Opus, diseñado para comunicaciones en tiempo real, minimiza latencia a costa de menor adopción en dispositivos legacy.

## Video

El video digital combina secuencias de imágenes (frames) con pistas de audio sincronizadas, generando volúmenes de datos que exigen compresión agresiva para ser transmisibles. Un frame sin comprimir a 1080p (1920×1080 píxeles, 24 bits por píxel) ocupa ~6 MB; a 30 fps, el flujo crudo supera los 1.4 Gbps, inviable para la mayoría de canales de distribución.

Los códecs de video explotan redundancias temporales y espaciales para reducir esta carga. La compresión intra-frame (como en JPEG) elimina redundancia dentro de un frame; la inter-frame identifica regiones que permanecen estáticas o se desplazan entre frames consecutivos, codificando solo diferencias y vectores de movimiento. Estándares como H.264/AVC y H.265/HEVC organizan frames en tipos I (intra), P (predictivos) y B (bidireccionales), logrando relaciones de compresión de 100:1 o superiores con calidad perceptualmente aceptable.

Los contenedores (MP4, MKV, WebM) empaquetan pistas de video, audio, subtítulos y metadatos en una estructura única, definiendo cómo se sincronizan y multiplexan durante la reproducción. Un mismo códec de video (por ejemplo, H.264) puede alojarse en contenedores distintos según el ecosistema: MP4 para compatibilidad universal, MKV para características avanzadas como subtítulos múltiples, WebM para web abierta.

>  La compresión de video introduce latencia de codificación y dependencia entre frames: perder un frame I puede corruptar la decodificación de frames P/B subsiguientes hasta el próximo I. Protocolos de streaming adaptativo (HLS, DASH) mitigan este riesgo segmentando el contenido en chunks independientes y ofreciendo múltiples calidades para adaptarse a condiciones de red variables.

## Formatos comunes

La interoperabilidad práctica depende de acuerdos sobre estructuras de datos que aplicaciones diversas puedan interpretar sin ambigüedad. Dos familias dominan el intercambio estructurado: JSON y XML.

JSON (*JavaScript Object Notation*) representa datos como pares clave-valor y arreglos anidados, usando una sintaxis minimalista derivada de JavaScript. Su legibilidad humana, parsado eficiente y mapeo directo a estructuras nativas de lenguajes modernos lo han convertido en el estándar de facto para APIs web y configuración de aplicaciones. Sin embargo, carece de esquema nativo: la validación de estructura requiere convenciones externas (JSON Schema) o documentación informal.

XML (*eXtensible Markup Language*) define datos mediante etiquetas anidadas con atributos, soportando esquemas formales (XSD) para validación estricta, espacios de nombres para evitar colisiones y transformaciones (XSLT) para conversión entre formatos. Esta expressividad lo hace adecuado para documentos complejos con requisitos de interoperabilidad a largo plazo (SOAP, Office OpenXML), pero su verbosidad incrementa overhead de transmisión y complejidad de parsado.

Para medios, los formatos reflejan compromisos entre calidad, compatibilidad y funcionalidad:

| Formato | Tipo | Compresión | Uso típico |
|---------|------|------------|------------|
| JPEG | Imagen | Con pérdida (DCT) | Fotografía web, cámaras digitales |
| PNG | Imagen | Sin pérdida (DEFLATE) | Gráficos, transparencia, capturas de pantalla |
| MP3 | Audio | Con pérdida (psicoacústica) | Música distribuida, podcasts |
| AAC | Audio | Con pérdida (avanzada) | Streaming (YouTube, Apple Music), broadcasting |
| MP4 | Video contenedor | Múltiples códecs (H.264, AAC) | Video on-demand, redes sociales |
| WebM | Video contenedor | VP9/AV1, Opus | Web abierta, HTML5 video |

>  La elección de formato no es neutral: JPEG no soporta transparencia, MP3 carece de metadatos estandarizados robustos, y MP4 puede incluir DRM que limita la portabilidad. Evaluar requisitos de calidad, edición futura, compatibilidad de plataforma y licencias es esencial antes de estandarizar un formato en un proyecto.

## Quédate con...

*   La capa de presentación transforma datos entre formatos internos de aplicación y representaciones estandarizadas para garantizar interoperabilidad entre sistemas heterogéneos.
*   UTF-8 es la codificación de texto dominante: preserva compatibilidad con ASCII mediante compresión diferencial y soporta todos los sistemas de escritura Unicode.
*   Los formatos de imagen, audio y video equilibran calidad, tamaño y funcionalidad mediante estrategias de compresión con o sin pérdida según el caso de uso.
*   JSON prioriza simplicidad y eficiencia para intercambio de datos estructurados; XML ofrece expressividad y validación formal para documentos complejos con requisitos de largo plazo.
*   Los contenedores multimedia (MP4, MKV, WebM) empaquetan pistas de video, audio y metadatos, independizando el códec de la estructura de distribución.
*   La elección de formato y codificación implica compromisos entre calidad, compatibilidad, latencia y licencias; no existe una opción universalmente óptima.



<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/presentacion/compresion" class="next">Siguiente</a>
</div>
