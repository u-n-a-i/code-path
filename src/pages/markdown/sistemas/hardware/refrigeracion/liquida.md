---
title: "Refrigeración líquida"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Refrigeración líquida](#refrigeración-líquida)
  - [Ventajas frente a la refrigeración por aire:](#ventajas-frente-a-la-refrigeración-por-aire)
  - [Sistemas AIO (All-In-One)](#sistemas-aio-all-in-one)
  - [Custom Loop](#custom-loop)
  - [Componentes (bomba, radiador, bloque de agua)](#componentes-bomba-radiador-bloque-de-agua)
  - [Refrigeración por inmersión y extremos](#refrigeración-por-inmersión-y-extremos)
    - [Aceite mineral y líquidos dieléctricos](#aceite-mineral-y-líquidos-dieléctricos)
    - [Peltier (refrigeración termoeléctrica)](#peltier-refrigeración-termoeléctrica)
  - [Quédate con...](#quédate-con)

</div>

# Refrigeración líquida

La refrigeración líquida es una solución avanzada para disipar el calor generado por componentes de alto rendimiento, como CPUs y GPUs bajo cargas intensivas y sostenidas. A diferencia de la refrigeración por aire, que depende del contacto directo con el aire, la refrigeración líquida utiliza un fluido con alta capacidad calorífica para absorber y transportar el calor lejos del chip hacia un radiador, donde se disipa al ambiente. Esta técnica es esencial en entornos donde el rendimiento sostenido es crítico —como servidores de IA, estaciones de renderizado o sistemas de desarrollo con compilación continua— y también en escenarios de overclocking extremo. Además, en los últimos años han surgido métodos aún más especializados, como la refrigeración por inmersión o los sistemas termoeléctricos (Peltier), que empujan los límites térmicos más allá de lo convencional.

El principio básico es simple: un líquido (generalmente agua o una mezcla con aditivos) circula a través de un bloque de agua instalado sobre la CPU o GPU. El calor del chip se transfiere al líquido por conducción. Luego, una bomba impulsa el fluido caliente hacia un radiador, donde ventiladores disipan el calor al aire. El líquido enfriado regresa al bloque, cerrando el ciclo.

## Ventajas frente a la refrigeración por aire:

- Mayor eficiencia térmica: el agua tiene ~4× la capacidad calorífica del aire.
- Mayor inercia térmica: absorbe picos de calor sin que la temperatura suba bruscamente.
- Menor ruido: los ventiladores del radiador pueden girar a RPM más bajas.
- Distribución del calor: el calor se disipa en el radiador (a menudo en la parte frontal o superior del gabinete), no cerca de la CPU.

## Sistemas AIO (All-In-One)

Los AIO (All-In-One) son kits de refrigeración líquida sellados de fábrica, diseñados para ser fáciles de instalar y mantener. Incluyen:

- Bloque de agua con bomba integrada.
- Radiador de aluminio (240 mm, 280 mm, 360 mm, etc.).
- Tubos preconectados y no rellenables.
- Ventiladores coordinados.

Ventajas:

- Instalación plug-and-play, sin riesgo de fugas.
- Mantenimiento casi nulo (vida útil de 5–7 años).
- Rendimiento térmico superior al aire en CPUs de alta gama.

Desventajas:

- Radiadores de aluminio limitan la compatibilidad con líquidos personalizados.
- La bomba integrada en el bloque puede fallar sin opción de reemplazo individual.
- Rendimiento térmico inferior a un custom loop bien diseñado.
- Los AIO son ideales para desarrolladores que quieren bajo ruido y altas temperaturas sostenidas sin complejidad.

## Custom Loop

Un circuito personalizado (custom loop) es un sistema de refrigeración líquida ensamblado a medida, con componentes independientes:

- Bloque de agua (CPU, GPU, VRM, RAM).
- Bomba separada (a menudo D5 o DDC).
- Radiador de cobre o aluminio (de 240 mm a 480 mm+).
- Depósito para facilitar el llenado y purgado de aire.
- Tubería (tubos de PVC, EPDM o acrílico rígido).
- Líquido refrigerante personalizado (agua destilada + biocida + colorante).

Ventajas:

- Máximo rendimiento térmico y flexibilidad estética.
- Posibilidad de refrigerar múltiples componentes (CPU + GPU + chipset).
- Radiadores de cobre permiten líquidos de alto rendimiento.

Desventajas:

- Alto costo inicial (2–4× un AIO).
- Requiere mantenimiento (reemplazo de líquido, limpieza anual).
- Riesgo de fugas si no se monta correctamente.
- Complejidad de instalación y purgado de aire.

Los custom loops son para entusiastas, servidores especializados o estaciones de trabajo donde el rendimiento térmico es prioritario sobre la simplicidad.

## Componentes (bomba, radiador, bloque de agua)

- Bomba: impulsa el líquido. Las D5 son más potentes y silenciosas; las DDC, más compactas pero ruidosas. En AIOs, la bomba está integrada en el bloque.
- Radiador: disipa el calor al aire. Más aletas por pulgada (FPI) = mejor disipación, pero requiere ventiladores de alta presión estática.
- Bloque de agua: contacto directo con el chip. Diseños con microcanales o matriz de postes optimizan el flujo y la transferencia de calor.

## Refrigeración por inmersión y extremos

Más allá de los circuitos líquidos convencionales, existen métodos extremos para entornos especializados:

### Aceite mineral y líquidos dieléctricos

- Principio: se sumerge todo el hardware en un líquido no conductor (aceite mineral, 3M Novec, etc.).
- Ventajas:
  - Refrigeración total y silenciosa (sin ventiladores).
  - Ideal para centros de datos densos o entornos con alto polvo/humedad.
- Desventajas:
  - Imposible mantenimiento en caliente.
  - Riesgo de degradación de plásticos/elastómeros con el tiempo.
  - Alto costo y complejidad logística.
- Uso: minería a gran escala, supercomputación, servidores edge.

### Peltier (refrigeración termoeléctrica)

- Principio: un módulo Peltier transfiere calor de un lado a otro al aplicar corriente, permitiendo temperaturas por debajo del ambiente.
- Ventajas:
  - Puede alcanzar temperaturas sub-ambiente (útil para overclocking extremo).
- Desventajas:
  - Muy alto consumo energético.
  - Condensación: el lado frío puede empañarse o gotear, destruyendo el hardware si no se sella herméticamente.
  - Genera más calor del que enfría (el lado caliente debe disiparse muy eficazmente).
- Uso: solo en escenarios de overclocking récord o laboratorios controlados.

> La refrigeración por inmersión y Peltier no son para uso general. Requieren diseño cuidadoso, sellos herméticos y monitoreo constante. Para la mayoría de los desarrolladores, un buen AIO o un disipador de aire de gama alta es más que suficiente.

## Quédate con...

- La refrigeración líquida ofrece mejor rendimiento térmico y menor ruido que el aire, ideal para cargas sostenidas.
- Los AIO son la opción equilibrada: fácil, fiable y eficaz para CPUs/GPUs de alto rendimiento.
- Los custom loops ofrecen máximo rendimiento y personalización, pero con mayor costo, riesgo y mantenimiento.
- La refrigeración por inmersión y Peltier son soluciones extremas para casos muy específicos, no para estaciones de desarrollo estándar.
- Como desarrollador, si tu flujo de trabajo implica cargas al 100% durante horas (IA, simulación, compilación), la refrigeración líquida (especialmente AIO) puede evitar el thermal throttling y mantener el rendimiento estable.
- Nunca subestimes el valor de un sistema térmico adecuado: el hardware más potente es inútil si se apaga por calor.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/refrigeracion/pasta" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/refrigeracion/refrigeracion" class="next">Siguiente</a>
</div>
