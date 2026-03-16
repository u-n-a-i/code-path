---
title: "Representación de números enteros"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Representación de números enteros](#representación-de-números-enteros)
  - [El concepto de bit de signo](#el-concepto-de-bit-de-signo)
  - [El complemento a dos: la forma estándar para representar números negativos](#el-complemento-a-dos-la-forma-estándar-para-representar-números-negativos)
    - [Cómo funciona](#cómo-funciona)
    - [Ventajas clave](#ventajas-clave)
  - [Rangos de valores (8, 16, 32, 64 bits)](#rangos-de-valores-8-16-32-64-bits)
  - [Quédate con...](#quédate-con)

</div>

# Representación de números enteros

En una computadora, todo se reduce a bits, pero los seres humanos necesitamos trabajar con números positivos y negativos. Para representar números enteros con signo en un sistema binario que solo entiende 0 y 1, se requiere un convenio bien definido. A lo largo de la historia se han propuesto varios métodos, pero el estándar universal en la arquitectura moderna es el complemento a dos. Este sistema no solo permite codificar números negativos de forma eficiente, sino que también simplifica el diseño del hardware al permitir que las mismas operaciones aritméticas sirvan para números positivos y negativos.

## El concepto de bit de signo

Una idea intuitiva para representar números negativos es reservar un bit —normalmente el más significativo (el de la izquierda)— como bit de signo:

- 0 indica número positivo o cero.
- 1 indica número negativo.

Por ejemplo, en un byte (8 bits), podríamos usar el primer bit para el signo y los 7 restantes para la magnitud:

- 00000101 = +5
- 10000101 = –5

Este enfoque, llamado signo-magnitud, tiene dos problemas graves:

1. Dos representaciones del cero: 00000000 (+0) y 10000000 (–0), lo que complica las comparaciones.
1. Hardware complejo: sumar un número positivo y uno negativo requiere lógica adicional para manejar los signos.

Estas limitaciones llevaron al abandono de este método en favor de soluciones más elegantes.

## El complemento a dos: la forma estándar para representar números negativos

El complemento a dos resuelve los problemas del signo-magnitud y es el método utilizado por prácticamente todas las CPUs modernas (x86, ARM, RISC-V, etc.).

### Cómo funciona

Para obtener la representación en complemento a dos de un número negativo:

1. Escribe la versión binaria del número positivo.
1. Invierte todos los bits (complemento a uno).
1. Suma 1 al resultado.

Ejemplo: representar –5 en 8 bits

1. +5 en binario: 00000101
1. Invertir bits: 11111010
1. Sumar 1: 11111010 + 1 = 11111011

Así, –5₁₀ = 11111011₂ en complemento a dos.

### Ventajas clave

- Una sola representación del cero: 00000000 (en 8 bits). No existe “–0”.
- Aritmética uniforme: la suma y resta funcionan igual que con números sin signo. Por ejemplo:
  5 + (–5) = 00000101 + 11111011 = 100000000 → el noveno bit se descarta (desbordamiento), quedando 00000000.
- Rango simétrico (casi): para n bits, el rango va desde –2ⁿ⁻¹ hasta 2ⁿ⁻¹ – 1.

> El bit más significativo sigue actuando como indicador de signo (1 = negativo, 0 = positivo o cero), pero ahora forma parte integral del valor numérico, no es solo una etiqueta.

## Rangos de valores (8, 16, 32, 64 bits)

El número de bits determina cuántos valores distintos se pueden representar (2ⁿ combinaciones) y, por tanto, el rango de enteros con signo en complemento a dos:

| Bits | Rango (con signo)                               | Valores posibles  |
| ---- | ----------------------------------------------- | ----------------- |
| 8    | –2⁷ a 2⁷ – 1 → –128 a 127                       | 256               |
| 16   | –2¹⁵ a 2¹⁵ – 1 → –32 768 a 32 767               | 65 536            |
| 32   | –2³¹ a 2³¹ – 1 → –2 147 483 648 a 2 147 483 647 | ~4.3 mil millones |
| 64   | –2⁶³ a 2⁶³ – 1 → –9.22 × 10¹⁸ a 9.22 × 10¹⁸     | ~1.8 × 10¹⁹       |

Estos rangos son fundamentales en programación:

- En C/C++, int8_t, int16_t, int32_t, int64_t garantizan estos tamaños exactos.
- En Java, byte (8 bits), short (16), int (32), long (64).
- Superar el rango máximo provoca desbordamiento (overflow), que en enteros con signo tiene comportamiento indefinido en algunos lenguajes (como C) o produce resultados envueltos (wrapped) en otros (como Java).

También existen tipos sin signo (por ejemplo, uint32_t), que usan todos los bits para la magnitud, doblando el rango positivo (0 a 2ⁿ – 1), pero sin soporte para negativos.

## Quédate con...

- El complemento a dos es el estándar universal para representar enteros con signo en hardware moderno.
- Se construye invirtiendo los bits del valor positivo y sumando 1; evita duplicados del cero y simplifica la aritmética.
- El bit más significativo indica el signo, pero forma parte del valor numérico.
- Los rangos típicos son:
  - 8 bits: –128 a 127
  - 16 bits: –32 768 a 32 767
  - 32 bits: –2 147 483 648 a 2 147 483 647
  - 64 bits: ±9.22 × 10¹⁸ aproximadamente
- Conocer estos límites es crucial para evitar errores de desbordamiento y elegir el tipo de dato adecuado en tus programas.

<div class="pagination">
  <a href="/markdown/sistemas/software/representacion/numeracion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/software/representacion/reales" class="next">Siguiente</a>
</div>
