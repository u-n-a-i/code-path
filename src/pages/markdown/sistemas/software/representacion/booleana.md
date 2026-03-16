---
title: "Lógica booleana y operaciones a nivel de bit"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Lógica booleana y operaciones a nivel de bit](#lógica-booleana-y-operaciones-a-nivel-de-bit)
  - [Álgebra de Boole](#álgebra-de-boole)
  - [Operadores lógicos (AND, OR, NOT, XOR)](#operadores-lógicos-and-or-not-xor)
  - [Operaciones de desplazamiento (Shift) y su uso en programación](#operaciones-de-desplazamiento-shift-y-su-uso-en-programación)
  - [Usos comunes en programación](#usos-comunes-en-programación)
  - [Quédate con...](#quédate-con)

</div>

# Lógica booleana y operaciones a nivel de bit

La lógica booleana es la base matemática sobre la que se construyen todos los circuitos digitales y, por extensión, los programas informáticos. Desarrollada por George Boole en el siglo XIX, su álgebra opera con solo dos valores —verdadero (1) y falso (0)— y un conjunto reducido de operadores que permiten modelar decisiones, condiciones y estados. En programación, esta lógica no solo se usa para controlar el flujo de ejecución (if, while), sino también para manipular directamente los bits dentro de los datos, una técnica esencial en sistemas embebidos, criptografía, compresión y optimización de bajo nivel.

## Álgebra de Boole

El álgebra de Boole es un sistema algebraico en el que las variables solo pueden tomar dos valores: 0 o 1. Sus operaciones fundamentales son AND, OR y NOT, y cumple propiedades como la conmutatividad, asociatividad, distributividad y la existencia de elementos neutros e inversos. A diferencia del álgebra tradicional, aquí no hay números intermedios ni operaciones como la suma o la multiplicación en el sentido aritmético; todo se reduce a combinaciones lógicas.

Esta simplicidad es precisamente su fuerza: permite diseñar circuitos electrónicos (puertas lógicas) que implementan estas operaciones físicamente, formando la base de CPUs, memorias y otros componentes digitales. En software, el álgebra booleana se manifiesta tanto en expresiones condicionales como en operaciones bit a bit sobre enteros.

## Operadores lógicos (AND, OR, NOT, XOR)

En programación, existen dos contextos para estos operadores: lógico (para expresiones booleanas) y bit a bit (para manipular enteros). Aunque comparten nombres, sus comportamientos y usos difieren.

Operadores bit a bit
Actúan sobre cada bit de los operandos de forma independiente:

- AND (&):
  Devuelve 1 solo si ambos bits son 1.
  Ejemplo: 1010 & 1100 = 1000
  Usos: enmascarar bits (aislar campos específicos), verificar flags.
- OR (|):
  Devuelve 1 si al menos uno de los bits es 1.
  Ejemplo: 1010 | 1100 = 1110
  Usos: activar bits específicos sin afectar otros.
- NOT (~):
  Invierte todos los bits (0 → 1, 1 → 0).
  Ejemplo (8 bits): ~00001010 = 11110101
  Usos: crear máscaras complementarias, operaciones de inversión.
- XOR (^):
  Devuelve 1 si los bits son distintos.
  Ejemplo: 1010 ^ 1100 = 0110
  Propiedad clave: a ^ a = 0 y a ^ 0 = a.
  Usos: cifrado simple, intercambio de variables sin auxiliar, detección de cambios.

> No confundir con los operadores lógicos de cortocircuito (&&, || en C/Java/JavaScript), que evalúan expresiones booleanas completas y detienen la evaluación si el resultado ya está determinado (por ejemplo, false && x() nunca llama a x()).

## Operaciones de desplazamiento (Shift) y su uso en programación

Las operaciones de desplazamiento mueven los bits de un número entero hacia la izquierda o la derecha, llenando los espacios vacíos con ceros (o con el bit de signo en desplazamientos aritméticos).

- Desplazamiento lógico a la izquierda (<<):
  Mueve todos los bits n posiciones a la izquierda; los bits salientes se descartan, y los nuevos bits a la derecha son 0.
  Ejemplo: 00000101 << 2 = 00010100
  Equivalente a multiplicar por 2ⁿ: 5 << 2 = 20.
- Desplazamiento lógico a la derecha (>> o >>>):
  - En muchos lenguajes (>>> en Java, >> en Python para enteros sin signo), llena con ceros.
    Ejemplo: 00010100 >>> 2 = 00000101 → divide entre 2ⁿ (truncando).
  - En desplazamiento aritmético (>> en C/C++/Java para enteros con signo), se preserva el bit de signo para mantener el valor negativo.
    Ejemplo: 11111011 >> 2 = 11111110 (–5 desplazado sigue siendo negativo).

## Usos comunes en programación

- Multiplicación/división rápida por potencias de dos: útil en sistemas embebidos sin unidad de punto flotante.
- Empaquetado y desempaquetado de datos: combinar varios valores pequeños en un solo entero (por ejemplo, RGBA en un uint32_t: (R << 24) | (G << 16) | (B << 8) | A).
- Manipulación de flags: cada bit representa una opción activada/desactivada
- Algoritmos criptográficos y de hash: donde las rotaciones y mezclas de bits son fundamentales.

```c
#define FLAG_A 0x01
#define FLAG_B 0x02
int flags = FLAG_A | FLAG_B; // activar A y B
if (flags & FLAG_A) { /* A está activo */ }
```

Estas operaciones son extremadamente rápidas en hardware, ya que corresponden directamente a instrucciones de la CPU. Aunque los compiladores modernos optimizan automáticamente muchas operaciones aritméticas a desplazamientos, entenderlas te permite escribir código más eficiente y comprender mejor cómo funcionan protocolos, formatos binarios y sistemas de bajo nivel.

## Quédate con...

- La lógica booleana (0/1, AND/OR/NOT) es la base de la computación digital, tanto en hardware como en software.
- Los operadores bit a bit (&, |, ~, ^) manipulan directamente los bits de los enteros, útiles para flags, enmascaramiento y optimización.
- XOR tiene propiedades únicas: anula valores idénticos y es reversible, lo que lo hace valioso en criptografía y algoritmos.
- Las operaciones de desplazamiento (<<, >>) equivalen a multiplicar o dividir por potencias de dos y son esenciales para empaquetar datos y trabajar con registros de hardware.
- Dominar estas operaciones te da control fino sobre la representación de los datos y mejora tu capacidad para depurar, optimizar y diseñar sistemas eficientes.

<div class="pagination">
  <a href="/markdown/sistemas/software/representacion/multimedia" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
