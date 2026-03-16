---
title: "Representación de números reales"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Representación de números reales (coma flotante)](#representación-de-números-reales-coma-flotante)
  - [El estándar IEEE 754](#el-estándar-ieee-754)
  - [Mantisa, exponente y signo](#mantisa-exponente-y-signo)
  - [Precisión simple y doble](#precisión-simple-y-doble)
  - [Las limitaciones y errores de redondeo en floating point](#las-limitaciones-y-errores-de-redondeo-en-floating-point)
  - [Consecuencias prácticas](#consecuencias-prácticas)
  - [Quédate con...](#quédate-con)

</div>

# Representación de números reales (coma flotante)

Los números enteros son insuficientes para representar cantidades continuas como 3.14159, 0.0001 o –2.71828. Para manejar estos números reales, las computadoras utilizan un formato llamado coma flotante (floating point), que permite representar un rango extremadamente amplio de valores —desde lo infinitesimal hasta lo astronómico— con una precisión razonable. El estándar que gobierna esta representación en prácticamente todos los sistemas modernos es el IEEE 754, adoptado desde 1985 y actualizado en 2008. Aunque poderoso, este sistema tiene limitaciones inherentes que todo programador debe conocer para evitar errores sutiles pero críticos.

## El estándar IEEE 754

El IEEE 754 define cómo se almacenan y operan los números en coma flotante, asegurando compatibilidad entre distintos procesadores, lenguajes y plataformas. Su diseño se basa en la notación científica: cualquier número real se expresa como signo × mantisa × 2exponente.

Este enfoque permite ajustar dinámicamente la escala del número mediante el exponente, mientras la mantisa guarda los dígitos significativos.

## Mantisa, exponente y signo

Un número en coma flotante se divide en tres campos dentro de una palabra binaria:

1. Signo (1 bit):
   - 0 = positivo
   - 1 = negativo
2. Exponente (k bits):
   - Almacena el exponente de la potencia de 2, pero en representación sesgada (biased).
   - Por ejemplo, en precisión simple (32 bits), el sesgo es 127. Así, un exponente real de –3 se almacena como –3 + 127 = 124.
   - Esto evita tener que usar complemento a dos para el exponente y facilita comparaciones.
3. Mantisa (n bits):
   - También llamada fracción o significando.
   - Representa los dígitos significativos del número.
   - En la mayoría de los casos, se asume un bit implícito a la izquierda del punto binario: 1.mmm...m. Esto se conoce como normalización, y permite ganar un bit extra de precisión sin almacenarlo.

> El estándar también define valores especiales: cero (exponente y mantisa cero), infinito (exponente máximo, mantisa cero), y NaN (Not a Number, exponente máximo, mantisa no cero), usados para manejar errores como divisiones por cero o raíces de negativos.

## Precisión simple y doble

IEEE 754 define varios formatos; los más comunes son:

| Formato        | Total bits | Signo | Exponente | Mantisa | Rango aproximado | Precisión decimal |
| -------------- | ---------- | ----- | --------- | ------- | ---------------- | ----------------- |
| Simple (float) | 32         | 1     | 8         | 23      | ±10⁻³⁸ a ±10³⁸   | ~7 dígitos        |
| Doble (double) | 64         | 1     | 11        | 52      | ±10⁻³⁰⁸ a ±10³⁰⁸ | ~15–16 dígitos    |

En la mayoría de los lenguajes:

- float → precisión simple (32 bits)
- double → precisión doble (64 bits)

La precisión doble es la opción predeterminada en muchos contextos (como Python o Java) porque ofrece un equilibrio excelente entre rango, precisión y rendimiento.

## Las limitaciones y errores de redondeo en floating point

A pesar de su utilidad, la aritmética en coma flotante no es exacta para la mayoría de los números decimales. Esto se debe a que muchos números que tienen una representación finita en base 10 (como 0.1) tienen una expansión infinita en base 2.

Al almacenarse en un número finito de bits, se trunca o redondea, introduciendo un pequeño error. Este error se acumula en operaciones sucesivas.

Ejemplo clásico en casi cualquier lenguaje:

```python
0.1 + 0.2 == 0.3  # ¡Devuelve False!
```

Internamente, 0.1 + 0.2 da algo como 0.30000000000000004.

## Consecuencias prácticas

Nunca compares igualdad exacta entre números en coma flotante. Usa un margen de tolerancia (epsilon):

```c
if (fabs(a - b) < 1e-9) { /* considerar iguales */ }
```

- Evita restas de números muy cercanos (pérdida de significación).
- Sumar muchos números pequeños a uno grande puede perder precisión; ordenarlos de menor a mayor mejora el resultado.
- Para cálculos financieros o donde se requiere exactitud decimal, usa tipos decimales (Decimal en Python, BigDecimal en Java) o enteros (ej. almacenar céntimos en lugar de euros).

Estos no son “errores del lenguaje”, sino consecuencias inevitables de representar un conjunto infinito y continuo (los reales) en un espacio finito de bits.

## Quédate con...

- Los números reales se representan en coma flotante según el estándar IEEE 754.
- Cada número se compone de signo (1 bit), exponente (sesgado) y mantisa (con bit implícito).
- Precisión simple (32 bits) ofrece ~7 dígitos decimales; doble (64 bits), ~15–17.
- Muchos números decimales no tienen representación exacta en binario, lo que causa errores de redondeo.
- Estos errores son normales, pero requieren técnicas adecuadas para manejar comparaciones y acumulaciones.
- Comprender estas limitaciones es esencial para escribir código numéricamente robusto, especialmente en ciencia, ingeniería o finanzas.

<div class="pagination">
  <a href="/markdown/sistemas/software/representacion/enteros" class="prev">Anterior</a>
  <a href="/markdown/sistemas/software/representacion/caracteres" class="next">Siguiente</a>
</div>
