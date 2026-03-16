---
title: "Codificación de caracteres"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Codificación de caracteres](#codificación-de-caracteres)
  - [Caracteres y codificación](#caracteres-y-codificación)
  - [ASCII: la codificación original](#ascii-la-codificación-original)
  - [Limitaciones de ASCII](#limitaciones-de-ascii)
  - [Unicode y UTF-8: el estándar universal](#unicode-y-utf-8-el-estándar-universal)
  - [Funcionamiento de UTF-8 y su eficiencia de almacenamiento](#funcionamiento-de-utf-8-y-su-eficiencia-de-almacenamiento)
  - [Reglas de codificación UTF-8](#reglas-de-codificación-utf-8)
  - [Quédate con...](#quédate-con)

</div>

# Codificación de caracteres

En una computadora, todo es binario: ceros y unos. Pero los seres humanos nos comunicamos con letras, números, símbolos y signos de puntuación —miles de ellos, en docenas de idiomas. La codificación de caracteres es el puente que permite traducir esos símbolos legibles en secuencias de bytes que la máquina puede almacenar, transmitir y procesar. Sin una codificación estandarizada, el texto sería una torre de Babel digital: un archivo creado en un sistema podría mostrarse como garabatos en otro. Comprender cómo evolucionaron las codificaciones —desde el limitado ASCII hasta el universal Unicode— es clave para manejar texto correctamente en cualquier aplicación moderna.

## Caracteres y codificación

Un carácter es la unidad mínima de un sistema de escritura: una letra (‘A’), un dígito (‘5’), un signo de puntuación (‘¿’), un emoji (‘🌍’) o incluso un control invisible (como el salto de línea).
La codificación asigna a cada carácter un número único, llamado punto de código (code point). Ese número, a su vez, se representa como una secuencia de bytes según un esquema específico (como UTF-8 o UTF-16).

El reto no es solo asignar números, sino hacerlo de forma que:

- Sea compatible entre sistemas.
- Soporte múltiples idiomas.
- Sea eficiente en espacio y rendimiento.

## ASCII: la codificación original

ASCII (American Standard Code for Information Interchange), publicado en 1963, fue el primer estándar ampliamente adoptado. Usa 7 bits, lo que permite representar 128 caracteres (0 a 127):

- 0–31: caracteres de control (como tabulador \t o retorno de carro \r).
- 32–126: caracteres imprimibles (letras mayúsculas/minúsculas del alfabeto latino, dígitos, símbolos como +, %, @).
- 127: carácter de borrado (DEL).

Como un byte tiene 8 bits, muchos sistemas usaban el octavo bit para extender ASCII (creando “ASCII extendido”), pero sin estandarización: cada fabricante definía sus propios símbolos para los valores 128–255. Esto generó incompatibilidades graves al intercambiar archivos entre plataformas.

## Limitaciones de ASCII

- Solo cubre el inglés básico: no incluye tildes (á, ñ), letras acentuadas (é, ü), ni caracteres de otros alfabetos (cirílico, árabe, chino, etc.).
- No es global: imposible representar textos multilingües o incluso documentos en español, francés o alemán sin recurrir a extensiones incompatibles.
- Fragilidad en intercambio: un documento con ‘ñ’ guardado en Windows-1252 aparecería como ‘±’ en un sistema que espera ISO-8859-1.

Estas limitaciones hicieron evidente la necesidad de un estándar verdaderamente universal.

## Unicode y UTF-8: el estándar universal

Unicode no es una codificación, sino un estándar que asigna un punto de código único a cada carácter del mundo, vivo o histórico. Hasta 2024, Unicode define más de 150 000 caracteres, incluyendo:

- Todos los alfabetos modernos (latino, griego, cirílico, árabe, devanágari, kanji, etc.).
- Símbolos matemáticos, técnicos y monetarios.
- Emojis, pictogramas y caracteres históricos (como jeroglíficos egipcios).

Los puntos de código Unicode se escriben como U+XXXX, por ejemplo:

- U+0041 = ‘A’
- U+00F1 = ‘ñ’
- U+1F30D = ‘🌍’

Pero Unicode no dice cómo almacenar esos puntos de código en bytes. Para eso existen las codificaciones Unicode, siendo UTF-8 la más importante.

## Funcionamiento de UTF-8 y su eficiencia de almacenamiento

UTF-8 (Unicode Transformation Format – 8-bit) es una codificación de longitud variable que representa los puntos de código Unicode como secuencias de 1 a 4 bytes. Su diseño es brillante por dos razones:

1. Compatibilidad total con ASCII: todos los caracteres ASCII (U+0000 a U+007F) se codifican exactamente igual que en ASCII: un solo byte con el mismo valor. Esto significa que cualquier archivo ASCII válido es también un archivo UTF-8 válido.
2. Eficiencia en espacio: los caracteres más comunes (especialmente en textos occidentales) ocupan solo 1 o 2 bytes, mientras que los menos frecuentes (como ideogramas chinos) usan 3 o 4.

## Reglas de codificación UTF-8

| Puntos de código   | Bytes | Formato binario (x = bits del código) |
| ------------------ | ----- | ------------------------------------- |
| U+0000 – U+007F    | 1     | 0xxxxxxx                              |
| U+0080 – U+07FF    | 2     | 110xxxxx 10xxxxxx                     |
| U+0800 – U+FFFF    | 3     | 1110xxxx 10xxxxxx 10xxxxxx            |
| U+10000 – U+10FFFF | 4     | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx   |

Ejemplos:

- ‘A’ (U+0041) → 01000001 → 1 byte
- ‘ñ’ (U+00F1) → 11000011 10110001 → 2 bytes
- ‘€’ (U+20AC) → 11100010 10000010 10101100 → 3 bytes
- ‘🌍’ (U+1F30D) → 11110000 10011111 10000011 10001101 → 4 bytes

Esta variabilidad hace que UTF-8 sea extremadamente eficiente para textos predominantemente latinos (donde la mayoría de los caracteres caben en 1–2 bytes), mientras sigue siendo capaz de representar cualquier carácter Unicode.

> UTF-8 es el estándar dominante en la web (más del 98% de los sitios lo usan), en sistemas Unix/Linux, en APIs modernas y en formatos como JSON y XML. Su combinación de compatibilidad, eficiencia y universalidad lo ha convertido en el lingua franca del texto digital.

## Quédate con...

- ASCII fue pionero, pero solo soporta 128 caracteres y es insuficiente para idiomas no ingleses.
- Unicode asigna un punto de código único a cada carácter del mundo, resolviendo el problema de la fragmentación.
- UTF-8 es la codificación Unicode más usada: compatible con ASCII, eficiente en espacio y capaz de representar cualquier carácter.
- En UTF-8, los caracteres ocupan 1 a 4 bytes, dependiendo de su rango Unicode.
- Usar UTF-8 como codificación predeterminada en tus proyectos evita errores de visualización, mejora la interoperabilidad y prepara tu software para un mundo multilingüe.

<div class="pagination">
  <a href="/markdown/sistemas/software/representacion/reales" class="prev">Anterior</a>
  <a href="/markdown/sistemas/software/representacion/multimedia" class="next">Siguiente</a>
</div>
