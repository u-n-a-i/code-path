---
title: "Unidades de información"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Unidades de información](#unidades-de-información)
  - [Qué es un bit](#qué-es-un-bit)
  - [Qué es un byte](#qué-es-un-byte)
  - [Múltiplos del byte](#múltiplos-del-byte)
  - [Por qué 8 bits](#por-qué-8-bits)
  - [Relación con los demás capítulos](#relación-con-los-demás-capítulos)
  - [Quédate con...](#quédate-con)

</div>

# Unidades de información

En la base de todo el procesamiento digital está una idea aparentemente simple pero profundamente poderosa: la información puede representarse mediante estados binarios. Esta abstracción —el bit— es el ladrillo fundamental con el que se construyen todos los sistemas informáticos. A partir de él, se forman unidades mayores como el byte, que permiten codificar caracteres, números, colores y comandos ejecutables. Comprender estas unidades no solo es esencial para razonar sobre memoria, almacenamiento o rendimiento, sino también para entender cómo se estructuran los datos en capas superiores: desde la representación de enteros hasta la codificación de texto o imágenes.

## Qué es un bit

El bit (binary digit) es la unidad mínima de información en un sistema digital. Representa un estado lógico con solo dos posibilidades: 0 o 1. Detrás de esta abstracción hay siempre una realidad física: un transistor encendido o apagado, un voltaje alto o bajo, un punto magnético orientado en una dirección u otra. Esta dualidad es la base de la lógica booleana y permite que las computadoras realicen cálculos, tomen decisiones y almacenen datos de forma fiable y reproducible.

Aunque un bit por sí solo tiene poca utilidad práctica, su poder emerge cuando se agrupa con otros bits. Cada bit adicional duplica el número de combinaciones posibles: 2 bits permiten 4 estados (00, 01, 10, 11); 3 bits, 8 estados; y así sucesivamente.

## Qué es un byte

Un byte es un grupo de 8 bits contiguos y constituye la unidad básica de direccionamiento en la mayoría de los sistemas modernos. Gracias a sus 8 posiciones binarias, un byte puede representar 2⁸ = 256 valores distintos, numerados del 0 al 255 (o del -128 al 127 si se interpreta como entero con signo).

Históricamente, el byte se consolidó como unidad estándar porque:

- Era suficiente para codificar todos los caracteres del alfabeto latino, dígitos y símbolos comunes mediante el estándar ASCII (que usa 7 bits, dejando 1 bit para paridad o expansión).
- Se alineaba bien con la arquitectura de los primeros microprocesadores (como el Intel 8080 o el Motorola 6800), que operaban naturalmente con palabras de 8 bits.
- Ofrecía un buen equilibrio entre eficiencia de hardware y capacidad expresiva.

Hoy, aunque existen arquitecturas con bytes de distinto tamaño (muy raras), el estándar de facto es el byte de 8 bits, reconocido formalmente por normas como ISO/IEC 2382.

> En programación, el tipo de dato char en C o byte en Java representa exactamente un byte (8 bits). Esto refuerza su papel como unidad atómica de datos en la mayoría de los lenguajes.

## Múltiplos del byte

Para expresar cantidades grandes de memoria o almacenamiento, se usan múltiplos del byte. Aquí surge una fuente común de confusión: existen dos sistemas de notación, uno decimal y otro binario.

Sistema decimal (SI – usado por fabricantes de hardware)

KB (kilobyte) = 10³ = 1 000 bytes  
MB (megabyte) = 10⁶ = 1 000 000 bytes  
GB (gigabyte) = 10⁹ = 1 000 000 000 bytes  
TB (terabyte) = 10¹² bytes

Este sistema es el que usan los fabricantes de discos duros y memorias USB: un “disco de 1 TB” contiene 1 billón de bytes.

Sistema binario (IEC – usado por sistemas operativos y desarrolladores)

KiB (kibibyte) = 2¹⁰ = 1 024 bytes  
MiB (mebibyte) = 2²⁰ = 1 048 576 bytes  
GiB (gibibyte) = 2³⁰ ≈ 1 073 741 824 bytes  
TiB (tebibyte) = 2⁴⁰ bytes

Los sistemas operativos suelen reportar tamaños en este sistema (aunque a veces usan “GB” incorrectamente cuando quieren decir “GiB”), lo que explica por qué un disco etiquetado como “500 GB” aparece en tu ordenador como ~465 GiB.

| Prefijo | Nombre      | Base      | Valor                 |
| ------- | ----------- | --------- | --------------------- |
| K / Ki  | kilo / kibi | 10³ / 2¹⁰ | 1 000 / 1 024         |
| M / Mi  | mega / mebi | 10⁶ / 2²⁰ | 1 000 000 / 1 048 576 |
| G / Gi  | giga / gibi | 10⁹ / 2³⁰ | ~1e9 / ~1.07e9        |

Adoptar los prefijos IEC (KiB, MiB, etc.) evita ambigüedades, especialmente en contextos técnicos.

## Por qué 8 bits

La elección de 8 bits por byte no fue arbitraria, sino el resultado de convergencias históricas y técnicas:

- Los primeros códigos de caracteres (como ASCII) requerían al menos 7 bits; añadir un octavo permitía detección de errores (bit de paridad) o futuras extensiones.
- Arquitecturas como IBM System/360 (1964) y microprocesadores de los años 70 (Intel 8080, Zilog Z80) adoptaron el byte de 8 bits como unidad natural de procesamiento.
- El tamaño facilitaba operaciones aritméticas y lógicas eficientes en hardware, y se alineaba bien con palabras de 16, 32 o 64 bits (múltiplos de 8).

Aunque existieron sistemas con bytes de 6, 7 o 9 bits, el estándar de 8 bits prevaleció por su versatilidad y eficiencia.

## Relación con los demás capítulos

Las unidades de información son el fundamento sobre el que se construyen conceptos más avanzados:

- En la representación de números enteros, el rango de valores posibles depende directamente del número de bytes: un entero de 4 bytes (32 bits) puede representar más de 4 mil millones de valores.
- En la codificación de caracteres, cada letra, símbolo o emoji se asigna a una secuencia de bytes (por ejemplo, UTF-8 usa 1 a 4 bytes por carácter).
- En imágenes y multimedia, la profundidad de color se mide en bits por canal (8 bits = 256 niveles de rojo, verde o azul), y el tamaño total de una imagen depende del número de píxeles multiplicado por los bytes por píxel.
- En la lógica booleana y operaciones bitwise, manipular bits individuales dentro de un byte permite optimizaciones de bajo nivel, compresión de datos o implementación de banderas (flags) compactas.

## Quédate con...

- El bit es la unidad mínima de información: 0 o 1, representando un estado físico binario.
- El byte (8 bits) es la unidad básica de datos en la mayoría de los sistemas, capaz de representar 256 valores distintos.
- Existen dos sistemas de múltiplos: decimal (KB, MB, usados por fabricantes) y binario (KiB, MiB, usados en software); conocer la diferencia evita confusiones sobre capacidades reales.
- La adopción del byte de 8 bits responde a razones históricas, técnicas y de eficiencia en hardware.
- Estas unidades subyacen a casi todos los temas de representación de datos: desde enteros y texto hasta imágenes y operaciones a nivel de bit.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/software/representacion/numeracion" class="next">Siguiente</a>
</div>
