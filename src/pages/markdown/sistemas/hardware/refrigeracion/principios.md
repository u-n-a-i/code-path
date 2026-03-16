---
title: "Principios de la transferencia de calor"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Principios de la transferencia de calor](#principios-de-la-transferencia-de-calor)
  - [Importancia de la refrigeración](#importancia-de-la-refrigeración)
  - [Calor y rendimiento](#calor-y-rendimiento)
  - [Thermal throttling](#thermal-throttling)
  - [Conducción](#conducción)
  - [Convección](#convección)
  - [Radiación](#radiación)
  - [El concepto de TDP (Thermal Design Power)](#el-concepto-de-tdp-thermal-design-power)
  - [Quédate con...](#quédate-con)

</div>

# Principios de la transferencia de calor

La refrigeración en una computadora no es un lujo, sino una necesidad física. A medida que los electrones fluyen a través de los transistores de la CPU, GPU y otros componentes, una parte de su energía se disipa en forma de calor. Si este calor no se disipa eficazmente, la temperatura del silicio aumenta, lo que puede provocar inestabilidad, daño permanente o activación de mecanismos de protección que reducen el rendimiento. Comprender los principios fundamentales de la transferencia de calor —conducción, convección y radiación—, junto con conceptos como el TDP y el thermal throttling, permite diseñar sistemas más eficientes, prevenir fallos y aprovechar al máximo el hardware sin comprometer su vida útil.

## Importancia de la refrigeración

La refrigeración adecuada garantiza que los componentes operen dentro de sus límites térmicos seguros, típicamente entre 60 °C y 85 °C para CPUs y GPUs modernas. Más allá de la estabilidad, una buena refrigeración:

- Mantiene el rendimiento: evita que el sistema reduzca frecuencias por calor.
- Prolonga la vida útil: el calor acelera la degradación por electromigración en los circuitos.
- Reduce el ruido: un sistema bien refrigerado no necesita que los ventiladores giren a máxima velocidad constantemente.
- Permite overclocking: extraer más calor permite subir voltajes y frecuencias de forma segura.

En entornos de desarrollo intensivo (compilación, entrenamiento de modelos, simulaciones), donde las cargas son sostenidas al 100%, la refrigeración es tan crítica como la CPU o la RAM.

## Calor y rendimiento

Existe una relación directa entre temperatura y rendimiento. Los semiconductores se vuelven menos eficientes a altas temperaturas: los transistores pierden precisión, las fugas de corriente aumentan y el ruido eléctrico crece. Para protegerse, los chips modernos incluyen sensores térmicos y circuitos de gestión que ajustan dinámicamente el comportamiento del sistema.

## Thermal throttling

El thermal throttling (estrangulamiento térmico) es un mecanismo de protección automático que reduce la frecuencia de reloj (y a veces el voltaje) de la CPU o GPU cuando superan un umbral de temperatura predeterminado (por ejemplo, 95 °C). Esto disminuye el consumo de energía y, por tanto, la generación de calor, permitiendo que el chip se enfríe.

- Consecuencias: caídas repentinas de rendimiento, frames por segundo inestables en juegos, compilaciones más lentas.
- Detección: herramientas como HWInfo, Core Temp o Open Hardware Monitor muestran cuándo se activa el throttling.
- Prevención: mejorar la refrigeración, limpiar el polvo, reemplazar la pasta térmica o ajustar la configuración de energía.

> El throttling no daña el hardware; es una medida de seguridad. Pero indica que el sistema no está operando a su potencial.

## Conducción

La conducción es la transferencia de calor a través de un material sólido, de zonas calientes a frías. Es el primer paso en la refrigeración de un chip:

1. El calor generado en el die de la CPU se conduce a través del IHS (Integrated Heat Spreader, la tapa metálica).
2. Desde el IHS, pasa a la pasta térmica, luego al disipador (de cobre o aluminio).

- Materiales: el cobre tiene mejor conductividad térmica (~400 W/m·K) que el aluminio (~200 W/m·K), pero es más pesado y caro.
- Pasta térmica: elimina microburbujas de aire entre el chip y el disipador, mejorando la conducción.

## Convección

La convección es la transferencia de calor entre una superficie sólida y un fluido (aire o líquido en movimiento). Es el mecanismo dominante en la mayoría de los sistemas de refrigeración:

- Convección forzada: un ventilador impulsa aire a través de las aletas del disipador, llevándose el calor. Cuanto más aire (CFM) y mayor presión estática, mejor la refrigeración.
- Convección natural: sin ventiladores; el aire caliente asciende y es reemplazado por aire frío. Usado en sistemas pasivos (routers, PCs silenciosos), pero ineficaz para CPUs modernas.

En refrigeración líquida, el líquido (agua o fluido especial) absorbe calor del bloque de agua (conducción) y lo transporta al radiador, donde los ventiladores lo disipan al aire (convección).

## Radiación

La radiación es la emisión de energía en forma de ondas infrarrojas. Todos los objetos emiten radiación en proporción a la cuarta potencia de su temperatura absoluta (ley de Stefan-Boltzmann).

- En PCs, la radiación es mínima en comparación con la conducción y convección (<5% del calor disipado).
- Se vuelve relevante solo en sistemas pasivos o en entornos de vacío (como satélites).
- Superficies negras emiten más radiación que las brillantes, pero en la práctica, el color del disipador tiene poco impacto en PCs convencionales.

## El concepto de TDP (Thermal Design Power)

El TDP (Thermal Design Power) es una métrica diseñada para ayudar a los fabricantes de sistemas a dimensionar la refrigeración necesaria. Se expresa en vatios (W) y representa la cantidad máxima de calor que el sistema de refrigeración debe ser capaz de disipar bajo una carga térmica sostenida típica.

- No es el consumo eléctrico real: una CPU con TDP de 65 W puede consumir 90 W o más en picos (especialmente con Turbo Boost).
- No es un límite fijo: Intel y AMD tienen definiciones ligeramente distintas. AMD suele usar TDP como una medida de rendimiento/eficiencia; Intel, como un límite térmico de referencia.
- Uso práctico: si tu CPU tiene un TDP de 95 W, elige un disipador o refrigeración líquida certificada para al menos esa potencia.

Ejemplo: Un Ryzen 9 7950X tiene un TDP de 170 W, pero puede consumir más de 230 W bajo carga. Un disipador de 150 W de capacidad será insuficiente, causando throttling.

## Quédate con...

- La refrigeración es esencial para estabilidad, rendimiento y longevidad del hardware.
- El thermal throttling reduce la frecuencia para evitar daños por calor; indica que la refrigeración es insuficiente.
- Conducción: calor a través de sólidos (chip → pasta → disipador).
- Convección: calor transferido al aire/fluido en movimiento (ventiladores, líquido).
- Radiación: mínima en PCs; relevante solo en sistemas pasivos o espaciales.
- El TDP es una guía para el diseño térmico, no el consumo real; siempre dimensiona la refrigeración con margen.
- Como desarrollador, si tu flujo de trabajo implica cargas sostenidas (IA, compilación, simulación), invierte en refrigeración adecuada: evitar el throttling es tan importante como tener más núcleos.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/refrigeracion/aire" class="next">Siguiente</a>
</div>
