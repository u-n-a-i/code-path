---
title: "Sistemas de numeración posicional"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Sistemas de numeración posicional](#sistemas-de-numeración-posicional)
  - [La base de todo: binario (base 2)](#la-base-de-todo-binario-base-2)
  - [Conversión entre binario, decimal, octal y hexadecimal](#conversión-entre-binario-decimal-octal-y-hexadecimal)
    - [Binario ↔ Decimal](#binario--decimal)
    - [Binario ↔ Octal (base 8)](#binario--octal-base-8)
    - [Binario ↔ Hexadecimal (base 16)](#binario--hexadecimal-base-16)
  - [La importancia del hexadecimal en la programación](#la-importancia-del-hexadecimal-en-la-programación)
  - [Quédate con...](#quédate-con)

</div>

# Sistemas de numeración posicional

Los sistemas de numeración posicionales son la base para representar números en cualquier contexto computacional. A diferencia de sistemas antiguos como el romano, en un sistema posicional el valor de un dígito depende tanto de su símbolo como de su posición dentro del número. Lo que distingue a cada sistema es su base: el número de símbolos únicos que utiliza. En informática, los sistemas más relevantes son el binario (base 2), el octal (base 8), el decimal (base 10) y el hexadecimal (base 16). Comprender cómo funcionan y cómo convertir entre ellos es esencial para entender cómo las computadoras almacenan y manipulan datos.

## La base de todo: binario (base 2)

El sistema binario es el lenguaje nativo de las computadoras. Usa solo dos símbolos: 0 y 1, que corresponden directamente a estados físicos del hardware (ausencia o presencia de voltaje, por ejemplo). Cada posición en un número binario representa una potencia creciente de 2, comenzando desde la derecha con 2⁰.

Por ejemplo, el número binario 1011₂ se interpreta como:

`1 × 2³ + 0 × 2² + 1 × 2¹ + 1 × 2⁰ = 8 + 0 + 2 + 1 = 11₁₀`

Dado que los circuitos digitales operan con señales binarias, todo —desde instrucciones de CPU hasta píxeles de una imagen— se codifica finalmente en secuencias de bits.

## Conversión entre binario, decimal, octal y hexadecimal

### Binario ↔ Decimal

- Binario a decimal: multiplica cada bit por la potencia de 2 correspondiente a su posición y suma los resultados.
  - Ejemplo: 1101₂ = 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13₁₀
- Decimal a binario: divide el número entre 2 repetidamente y anota los restos (de abajo hacia arriba).
  - Ejemplo: 13 ÷ 2 = 6 resto 1 → 6 ÷ 2 = 3 resto 0 → 3 ÷ 2 = 1 resto 1 → 1 ÷ 2 = 0 resto 1 → 1101₂

### Binario ↔ Octal (base 8)

El sistema octal usa los dígitos del 0 al 7. Como 8 = 2³, cada grupo de 3 bits corresponde exactamente a un dígito octal.

- Binario a octal: agrupa los bits de derecha a izquierda en grupos de 3 (añadiendo ceros a la izquierda si es necesario) y convierte cada grupo.
  - Ejemplo: 101110₂ → 101 | 110 → 5 | 6 → 56₈
- Octal a binario: convierte cada dígito octal a su equivalente de 3 bits.
  - Ejemplo: 72₈ → 111 | 010 → 111010₂

### Binario ↔ Hexadecimal (base 16)

El sistema hexadecimal usa 16 símbolos: 0–9 y A–F (donde A=10, B=11, ..., F=15). Como 16 = 2⁴, cada grupo de 4 bits equivale a un dígito hexadecimal.

- Binario a hexadecimal: agrupa los bits en conjuntos de 4 (de derecha a izquierda) y convierte.
  - Ejemplo: 11010111₂ → 1101 | 0111 → D | 7 → D7₁₆
- Hexadecimal a binario: convierte cada dígito a su representación de 4 bits.
  - Ejemplo: 3A₁₆ → 0011 | 1010 → 00111010₂ (los ceros iniciales pueden omitirse si no son significativos)

> El uso de prefijos ayuda a identificar la base: 0b para binario (0b1011), 0o para octal (0o56), 0x para hexadecimal (0xD7). Muchos lenguajes de programación (C, Python, JavaScript) adoptan esta convención.

## La importancia del hexadecimal en la programación

El sistema hexadecimal es ampliamente utilizado en programación y depuración porque ofrece una representación compacta y legible del binario. Un byte (8 bits) se representa con solo dos dígitos hexadecimales, lo que facilita:

- Inspección de memoria: volcados de memoria (memory dumps) suelen mostrarse en hexadecimal.
- Colores en diseño web: el código #FF5733 representa rojo=FF (255), verde=57 (87), azul=33 (51).
- Direcciones de memoria: en depuradores, las direcciones suelen aparecer como 0x7fff5fbff6d8.
- Máscaras y operaciones bitwise: valores como 0xFF (255) o 0xF0 (240) son comunes para aislar o combinar bits.

Además, al ser múltiplo exacto de 2, la conversión con binario es inmediata, lo que lo hace ideal como “notación abreviada” del código máquina.

## Quédate con...

- Los sistemas posicionales asignan valor a los dígitos según su posición y la base del sistema.
- El binario (base 2) es el lenguaje fundamental del hardware; cada bit representa una potencia de 2.
- Las conversiones entre sistemas se simplifican gracias a que 8 = 2³ y 16 = 2⁴, permitiendo agrupar bits en bloques de 3 (octal) o 4 (hexadecimal).
- El hexadecimal es crucial en programación por su concisión y relación directa con bytes y direcciones de memoria.
- Dominar estas conversiones te permite “leer” lo que la máquina ve, una habilidad valiosa en depuración, seguridad y desarrollo de bajo nivel.

<div class="pagination">
  <a href="/markdown/sistemas/software/representacion/unidades" class="prev">Anterior</a>
  <a href="/markdown/sistemas/software/representacion/enteros" class="next">Siguiente</a>
</div>
