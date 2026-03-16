---
title: "Pasta térmica y almohadillas"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Pasta térmica y almohadillas](#pasta-térmica-y-almohadillas)
  - [Pasta térmica](#pasta-térmica)
    - [Tipos de pasta térmica](#tipos-de-pasta-térmica)
  - [Almohadillas](#almohadillas)
  - [La importancia de la interfaz térmica (TIM)](#la-importancia-de-la-interfaz-térmica-tim)
  - [Tipos y técnicas de aplicación](#tipos-y-técnicas-de-aplicación)
    - [Técnicas para pasta térmica](#técnicas-para-pasta-térmica)
    - [Técnicas para almohadillas](#técnicas-para-almohadillas)
  - [Quédate con...](#quédate-con)

</div>

# Pasta térmica y almohadillas

La interfaz térmica entre un chip (como una CPU o GPU) y su sistema de refrigeración —ya sea un disipador o un bloque de agua— es crítica para la eficiencia de la transferencia de calor. Aunque las superficies metálicas parecen lisas, a nivel microscópico están llenas de microimperfecciones y huecos de aire que actúan como aislantes térmicos. La pasta térmica y las almohadillas térmicas son materiales diseñados para rellenar estos vacíos, mejorando drásticamente la conducción del calor.

## Pasta térmica

La pasta térmica (thermal paste o TIM, Thermal Interface Material) es un compuesto viscoso aplicado entre el IHS (Integrated Heat Spreader) de la CPU/GPU y la base del disipador. Su función es desplazar el aire atrapado en las microcavidades, creando un puente térmico continuo.

### Tipos de pasta térmica

1. A base de silicio (estándar):
   - Conductividad térmica: 3–8 W/m·K.
   - Económica, fácil de aplicar, no conductiva eléctricamente.
   - Ideal para uso doméstico y oficina.
1. Cerámica:
   - Conductividad: 5–10 W/m·K.
   - No conductiva, más estable a altas temperaturas.
   - Común en servidores y entornos industriales.
1. Metal (galio, aleaciones líquidas):
   - Conductividad: 30–80 W/m·K.
   - Altamente conductiva eléctricamente: riesgo de cortocircuito si se derrama.
   - Usada en overclocking extremo o en sistemas con IHS expuesto (delidded CPUs).
1. Compuestos de carbono/nanotubos:
   - Conductividad: 10–15 W/m·K.
   - No conductiva, duradera, pero cara.
   - Ideal para estaciones de trabajo profesionales.

> La pasta térmica se degrada con el tiempo (reseca, se separa). En sistemas 24/7, se recomienda reemplazarla cada 2–3 años.

## Almohadillas

Las almohadillas térmicas (thermal pads) son láminas preformadas de material elastómero relleno con partículas conductoras (cerámica, grafito, metal). Se usan principalmente en GPUs, VRMs, chips de memoria y controladores de placa base.

- Ventajas: no requieren aplicación manual, no se secan, mantienen contacto constante incluso con superficies irregulares.
- Desventajas: conductividad más baja que la pasta (1–12 W/m·K, dependiendo del grosor y material).
- Grosor: debe coincidir con la distancia entre el chip y el disipador; demasiado grueso reduce la presión de contacto; demasiado delgado deja huecos.

En GPUs modernas, las almohadillas de alta calidad son esenciales para refrigerar la memoria GDDR6/X y los VRMs, que pueden alcanzar temperaturas superiores a 100 °C bajo carga.

## La importancia de la interfaz térmica (TIM)

El material de interfaz térmica (TIM) es el eslabón más débil en la cadena de disipación de calor. Incluso el mejor disipador será ineficaz si el TIM es de baja calidad o está mal aplicado. Un TIM deficiente puede causar:

- Diferencias de temperatura de 10–20 °C respecto a una aplicación óptima.
- Thermal throttling prematuro, reduciendo el rendimiento en cargas sostenidas.
- Degración acelerada del chip por operación crónica a altas temperaturas.

En CPUs modernas de alto rendimiento (Ryzen 9, Core i9), el TIM de fábrica suele ser de calidad media; reemplazarlo por una pasta de gama alta puede reducir las temperaturas en 5–10 °C.

## Tipos y técnicas de aplicación

### Técnicas para pasta térmica

1. Método del punto (recomendado para la mayoría):
   - Aplica una gota del tamaño de un guisante en el centro del IHS.
   - Al instalar el disipador, la presión lo extiende uniformemente.
   - Ideal para CPUs con IHS plano y disipadores con presión de montaje uniforme.
2. Método de la X:
   - Dibuja una "X" con pasta sobre el IHS.
   - Útil para CPUs sin IHS (como algunos modelos de AMD antiguos) o para chips cuadrados grandes.
3. Método de extensión (con espátula):
   - Extiende una capa fina y uniforme con una tarjeta o espátula.
   - Evita burbujas, pero requiere experiencia; demasiada pasta puede actuar como aislante.

> Regla de oro: menos es más. Una capa demasiado gruesa aísla; una demasiado fina deja huecos. El objetivo es una película transparente y uniforme tras instalar el disipador.

### Técnicas para almohadillas

- Medición precisa: usa un calibre para determinar la distancia entre el componente y el disipador.
- Corte limpio: usa tijeras afiladas para ajustar el tamaño sin comprimir el material.
- Presión adecuada: asegúrate de que el disipador ejerza presión uniforme sin deformar la almohadilla.

Nunca uses pasta térmica en lugar de almohadillas en memoria VRAM o VRMs. La pasta no mantiene el contacto en superficies desiguales y puede fluir hacia componentes vecinos, causando cortocircuitos.

## Quédate con...

- La pasta térmica rellena microhuecos entre CPU/GPU y disipador; las almohadillas hacen lo mismo en componentes planos o irregulares como VRAM.
- Elige pasta no conductiva (silicona o cerámica) para uso general; metal líquido solo si sabes lo que haces.
- Las almohadillas deben tener el grosor adecuado; ni demasiado gruesas ni demasiado delgadas.
- La técnica de aplicación es tan importante como el material: un punto centrado suele ser suficiente para CPUs.
- Un buen TIM reduce temperaturas en 5–20 °C, evitando thermal throttling y prolongando la vida del hardware.
- En sistemas de desarrollo con cargas sostenidas, invertir en un TIM de calidad y aplicarlo correctamente es una de las mejoras más rentables y silenciosas que puedes hacer.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/refrigeracion/aire" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/refrigeracion/liquida" class="next">Siguiente</a>
</div>
