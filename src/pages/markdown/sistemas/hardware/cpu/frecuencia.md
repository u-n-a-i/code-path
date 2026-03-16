---
title: "Frecuencia y multiplicador"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Frecuencia y multiplicador](#frecuencia-y-multiplicador)
  - [Frecuencia](#frecuencia)
  - [Multiplicador](#multiplicador)
  - [IPC y GHz](#ipc-y-ghz)
  - [El reloj (clock)](#el-reloj-clock)
  - [La frecuencia base y el overclocking](#la-frecuencia-base-y-el-overclocking)
  - [El concepto de Turbo Boost o similar](#el-concepto-de-turbo-boost-o-similar)
  - [Quédate con...](#quédate-con)

</div>

# Frecuencia y multiplicador

La velocidad de una CPU a menudo se resume en una cifra: “3.6 GHz”, “5.0 GHz”, etc. Sin embargo, esta frecuencia —medida en gigahercios (GHz)— es solo una parte de la historia. No todas las CPUs con la misma frecuencia ofrecen el mismo rendimiento, y subir la frecuencia no siempre se traduce en mayor velocidad. Detrás de ese número hay un delicado equilibrio entre el reloj del sistema, el multiplicador, la eficiencia arquitectónica (IPC) y tecnologías dinámicas como Turbo Boost. Comprender estos conceptos permite ir más allá del marketing y tomar decisiones informadas, tanto al elegir hardware como al optimizar software para entornos de alto rendimiento.

## Frecuencia

La frecuencia (o frecuencia de reloj) es el número de ciclos que la CPU completa por segundo, medida en hercios (Hz). Un ciclo es la unidad temporal mínima en la que la CPU puede realizar una operación básica, como leer un registro o enviar una señal a la ALU. Por ejemplo, una CPU de 4.0 GHz realiza 4.000 millones de ciclos por segundo.

Sin embargo, no toda instrucción se completa en un ciclo. Algunas (como una suma entera) pueden terminar en uno o dos ciclos, mientras que otras (como una división o un acceso a memoria no caché) pueden tardar decenas o cientos. Por eso, la frecuencia por sí sola no determina el rendimiento real.

## Multiplicador

La frecuencia de la CPU no se genera de forma aislada. Se deriva de una señal más baja llamada reloj base (base clock o BCLK), típicamente de 100 MHz en sistemas modernos. La CPU aplica un multiplicador (clock multiplier) para escalar esta señal a su frecuencia de funcionamiento:

> Frecuencia de CPU = Base Clock×Multiplicador

Por ejemplo, si el BCLK es 100 MHz y el multiplicador es 45, la CPU funciona a 4.5 GHz.

El multiplicador es un valor que puede ajustarse (en CPUs desbloqueadas) para hacer overclocking. En cambio, modificar el BCLK afecta a otros componentes (como PCIe o memoria), por lo que es más riesgoso y menos común.

## IPC y GHz

GHz mide cuán rápido late el corazón de la CPU, pero IPC (Instructions Per Cycle, instrucciones por ciclo) mide cuán eficiente es en cada latido. Dos CPUs pueden tener la misma frecuencia, pero si una tiene mayor IPC, será más rápida.

- Una CPU antigua (como un Intel Pentium 4) podría tener 3.8 GHz pero un IPC bajo.
- Una CPU moderna (como un AMD Ryzen 7000) a 5.0 GHz puede tener un IPC 2–3 veces mayor gracias a mejoras en el pipeline, predicción de saltos y unidades de ejecución.

Por eso, al comparar CPUs, IPC × frecuencia = rendimiento teórico. Las generaciones recientes de procesadores se enfocan tanto en subir la frecuencia como en mejorar el IPC.

## El reloj (clock)

El reloj es una señal eléctrica periódica generada por un oscilador de cuarzo en la placa base. Esta señal sincroniza todas las operaciones digitales en la CPU y el resto del sistema. Cada ciclo de reloj define un instante en el que los circuitos pueden cambiar de estado de forma segura.

A frecuencias muy altas, mantener la integridad de esta señal es un desafío: las trazas de la placa deben estar cuidadosamente diseñadas para evitar distorsiones, y los voltajes deben ajustarse con precisión. Un reloj inestable puede causar errores de cálculo, corrupción de datos o reinicios.

## La frecuencia base y el overclocking

- Frecuencia base: es la velocidad garantizada por el fabricante bajo carga sostenida, sin sobrecalentamiento ni exceso de voltaje. Es el punto de partida para el rendimiento estable.
- Overclocking: consiste en aumentar manualmente la frecuencia (ajustando el multiplicador o el BCLK) más allá de la especificación de fábrica para obtener mayor rendimiento. Requiere:
  - Una CPU “desbloqueada” (con sufijo K en Intel o X en AMD).
  - Una placa base con chipset compatible (Z790, B650, etc.).
  - Un sistema de refrigeración robusto.
  - Ajustes manuales de voltaje para mantener la estabilidad.

El overclocking conlleva riesgos: mayor consumo, más calor, posible reducción de la vida útil del hardware y pérdida de garantía. Sin embargo, en entornos controlados (como renderizado o compilación continua), puede ofrecer mejoras de rendimiento significativas.

## El concepto de Turbo Boost o similar

Las CPU modernas no funcionan siempre a la frecuencia base. Incluyen tecnologías de frecuencia dinámica que ajustan automáticamente el reloj según la carga, la temperatura y el consumo:

- Intel Turbo Boost: eleva la frecuencia de uno o varios núcleos por encima de la base cuando hay margen térmico y eléctrico. Por ejemplo, una CPU con frecuencia base de 3.5 GHz puede alcanzar 5.0 GHz en un solo núcleo bajo carga ligera.
- AMD Precision Boost / XFR: tecnologías similares que ajustan la frecuencia en incrementos pequeños (a veces de 25 MHz) según las condiciones del sistema.

Estas tecnologías permiten que la CPU ofrezca máximo rendimiento cuando se necesita y bajo consumo en reposo. Sin embargo, el rendimiento sostenido (por ejemplo, en servidores o en compilaciones largas) suele estar limitado por la frecuencia base o por el thermal throttling (reducción automática por calor).

> Al diseñar aplicaciones sensibles al rendimiento, considera si tu carga de trabajo es de un solo hilo (beneficia más del Turbo Boost) o multihilo (depende más de la frecuencia base y del número de núcleos). Un algoritmo paralelo bien diseñado puede superar fácilmente a uno secuencial, incluso si este se ejecuta a mayor frecuencia.

## Quédate con...

- La frecuencia (GHz) es la velocidad del reloj, pero el rendimiento real depende también del IPC (instrucciones por ciclo).
- La frecuencia de la CPU se calcula como base clock × multiplicador; el multiplicador se ajusta en overclocking.
- El reloj sincroniza todas las operaciones; su estabilidad es crítica para la integridad del sistema.
- Overclocking permite mayor rendimiento manualmente, pero exige hardware compatible y refrigeración adecuada.
- Turbo Boost (Intel) y Precision Boost (AMD) ajustan la frecuencia dinámicamente para equilibrar rendimiento y eficiencia.
- Al optimizar software, evalúa si tu carga es monohilo (se beneficia del turbo) o multihilo (se beneficia de más núcleos y caché).

<div class="pagination">
  <a href="/markdown/sistemas/hardware/cpu/cache" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/cpu/fabricacion" class="next">Siguiente</a>
</div>
