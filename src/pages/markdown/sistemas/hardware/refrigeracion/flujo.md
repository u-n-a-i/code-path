---
title: "Flujo de aire en el gabinete"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Flujo de aire en el gabinete](#flujo-de-aire-en-el-gabinete)
  - [Configuración de ventiladores](#configuración-de-ventiladores)
  - [Presión positiva](#presión-positiva)
  - [Presión negativa](#presión-negativa)
  - [Presión neutra](#presión-neutra)
  - [Quédate con...](#quédate-con)

</div>

# Flujo de aire en el gabinete

El flujo de aire dentro del gabinete es el sistema circulatorio de una computadora: distribuye aire fresco a los componentes calientes y expulsa el aire caliente antes de que se acumule y degrade el rendimiento. Aunque a menudo se pasa por alto, una configuración térmica bien pensada —más que la potencia bruta de los disipadores— puede marcar la diferencia entre un sistema que opera en silencio a 70 °C y uno que suena como un reactor a 90 °C.

## Configuración de ventiladores

La disposición típica de ventiladores sigue un principio simple: entradas de aire frío en la parte delantera e inferior; salidas de aire caliente en la parte trasera y superior. Esto aprovecha la convección natural: el aire caliente asciende, por lo que expulsarlo por arriba y atrás es más eficiente.

- Entradas (intake):
  - Frente: principal fuente de aire frío.
  - Inferior: útil si el gabinete tiene rejillas en la base (común en gabinetes para GPUs grandes).
- Salidas (exhaust):
  - Trasero: expulsa aire caliente directamente desde la CPU y VRM.
  - Superior: ideal para disipar el calor de la GPU y del radiador de un AIO.

La regla general es:

- Al menos un ventilador trasero de salida.
- Dos o más ventiladores frontales de entrada en sistemas de alto rendimiento.
- Evitar configuraciones simétricas (igual número de entrada y salida) si el objetivo es presión positiva (ver más abajo).

> Los ventiladores delanteros deben tener alta tasa de flujo (CFM); los traseros y superiores, alta presión estática para superar la resistencia del disipador o radiador.

## Presión positiva

La presión positiva ocurre cuando el volumen de aire que entra supera al que sale. Esto tiene dos ventajas clave:

1. Menos acumulación de polvo: el exceso de aire sale por rendijas no selladas (ranuras PCIe, puertos I/O), impidiendo que el polvo exterior entre por esas mismas aberturas.
2. Mejor flujo interno: el aire se dirige de forma más predecible a través de los componentes, en lugar de ser aspirado caóticamente por todas las aberturas.

Cómo lograrla: usa más ventiladores de entrada o de mayor CFM que de salida. Por ejemplo:

- 3× ventiladores frontales (intake) + 2× (1 trasero + 1 superior, exhaust).

Es la configuración recomendada para la mayoría de los sistemas, especialmente en entornos con polvo (oficinas, hogares con mascotas).

## Presión negativa

La presión negativa ocurre cuando más aire sale del gabinete del que entra. Esto crea un efecto de succión que puede parecer eficaz, pero tiene desventajas significativas:

- Más polvo: el aire (y el polvo) es aspirado por cualquier rendija no sellada, acumulándose rápidamente en disipadores y radiadores.
- Flujo de aire menos controlado: el aire entra por caminos no óptimos, reduciendo la eficiencia térmica.

Cuándo usarla: casi nunca es deseable. Solo podría considerarse en gabinetes sellados con filtros en todas las entradas, pero incluso entonces, la presión positiva es preferible.

## Presión neutra

La presión neutra (o equilibrada) ocurre cuando el volumen de aire que entra es igual al que sale. En teoría, ofrece un buen equilibrio, pero en la práctica es difícil de mantener:

- Los ventiladores tienen tolerancias de fabricación.
- El polvo acumulado reduce el flujo de forma asimétrica con el tiempo.
- La disposición de componentes (GPU, cables) rompe la simetría del flujo.

Además, no ofrece los beneficios de la presión positiva en cuanto a control de polvo.

> La presión de aire no se mide en “más ventiladores = mejor”, sino en el balance neto de flujo. Un solo ventilador trasero con un disipador de CPU que actúa como extractor puede crear presión negativa, incluso sin ventiladores delanteros.

## Quédate con...

- El flujo de aire ideal entra por delante/inferior y sale por atrás/arriba, siguiendo la convección natural.
- La presión positiva (más entrada que salida) reduce el polvo y mejora el flujo interno; es la configuración recomendada.
- La presión negativa atrae polvo y debe evitarse.
- La presión neutra es frágil y poco práctica en sistemas reales.
- Usa filtros antipolvo en todas las entradas de aire: son tan importantes como los ventiladores.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/refrigeracion/refrigeracion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/refrigeracion/monitoreo" class="next">Siguiente</a>
</div>
