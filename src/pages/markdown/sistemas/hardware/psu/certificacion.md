---
title: "Certificación de eficiencia"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Certificación de eficiencia](#certificación-de-eficiencia)
  - [Certificación](#certificación)
  - [Eficiencia](#eficiencia)
  - [El estándar 80 PLUS (White, Bronze, Silver, Gold, Platinum, Titanium)](#el-estándar-80-plus-white-bronze-silver-gold-platinum-titanium)
  - [Watts reales](#watts-reales)
  - [Quédate con...](#quédate-con)

</div>

# Certificación de eficiencia

La eficiencia energética de una fuente de alimentación (PSU) no solo impacta en la factura eléctrica y el medio ambiente, sino también en la estabilidad térmica y la longevidad del sistema. Una PSU ineficiente desperdicia energía en forma de calor, lo que obliga a los ventiladores a girar más rápido (aumentando el ruido) y acelera el desgaste de los componentes internos. Para ayudar a los consumidores a identificar fuentes de calidad, se creó el estándar 80 PLUS, un programa de certificación independiente que mide la eficiencia real de la PSU bajo distintas cargas. Para un desarrollador que mantiene sistemas encendidos horas o días seguidos —ya sea para compilación, entrenamiento de modelos o servidores locales—, elegir una PSU certificada no es solo una decisión ecológica, sino una inversión en fiabilidad y silencio.

## Certificación

La certificación es un proceso de validación realizado por laboratorios independientes que verifica si una PSU cumple con ciertos umbrales de eficiencia en condiciones reales de uso. La certificación más reconocida en el mercado es 80 PLUS, respaldada por la industria y adoptada globalmente. Una PSU certificada lleva una etiqueta visible (Bronce, Oro, etc.) y sus resultados están publicados en la base de datos oficial de 80 PLUS.

## Eficiencia

La eficiencia de una PSU se define como la proporción de energía que entrega a los componentes del sistema frente a la que toma de la red eléctrica. Por ejemplo, si una PSU consume 100 W de la red y entrega 85 W al hardware, su eficiencia es del 85%; los 15 W restantes se pierden como calor.

La eficiencia no es constante: varía según la carga. Las PSU suelen ser menos eficientes al 10–20% de carga (modo reposo) y al 100% (máximo esfuerzo), alcanzando su pico entre el 40% y 60% de su capacidad nominal. Por eso, el estándar 80 PLUS evalúa la eficiencia en tres puntos: 20%, 50% y 100% de carga.

## El estándar 80 PLUS (White, Bronze, Silver, Gold, Platinum, Titanium)

El programa 80 PLUS define seis niveles de certificación, cada uno con requisitos mínimos de eficiencia:

| Nivel    | Eficiencia mínima (115 V CA)                |
| -------- | ------------------------------------------- |
| 80 PLUS  | 80% @ 20%, 50%, 100% carga                  |
| Bronze   | 82% @ 20%, 85% @ 50%, 82% @ 100%            |
| Silver   | 85% @ 20%, 88% @ 50%, 85% @ 100%            |
| Gold     | 87% @ 20%, 90% @ 50%, 87% @ 100%            |
| Platinum | 90% @ 20%, 92% @ 50%, 89% @ 100%            |
| Titanium | 90% @ 10%, 94% @ 20%, 96% @ 50%, 91% @ 100% |

Notas clave:

- Titanium es el único que requiere eficiencia alta incluso al 10% de carga, ideal para servidores o sistemas que pasan mucho tiempo en reposo.
- Las certificaciones Gold, Platinum y Titanium suelen usar componentes de mayor calidad (condensadores japoneses, topologías LLC resonantes), lo que mejora no solo la eficiencia, sino también la estabilidad y la vida útil.
- En regiones con 230 V CA (Europa, Asia), las eficiencias son ligeramente más altas, pero los umbrales de certificación también se ajustan.

## Watts reales

Un concepto crucial al elegir una PSU es la diferencia entre vatios reales y vatios pico o “máximos”. Algunas fuentes de baja calidad anuncian “800 W” en la caja, pero ese número representa un pico momentáneo o la suma teórica de todos los rieles sin considerar límites térmicos o eléctricos.

Una PSU certificada 80 PLUS siempre indica su potencia continua real (en vatios) en la etiqueta, junto con los límites por riel. Por ejemplo:

- “750 W” significa que puede entregar 750 W continuos a temperatura ambiente especificada (normalmente 40–50 °C).
- Además, muestra la corriente máxima en +12 V (por ejemplo, “+12 V: 62 A → 744 W”).

Nunca confíes en el número de la caja: siempre verifica la etiqueta de especificaciones en el producto o en la web del fabricante.

> Una PSU más eficiente no solo gasta menos energía, sino que genera menos calor, lo que reduce la carga en la refrigeración del gabinete. En un sistema 24/7, una fuente Gold puede ahorrar decenas de euros al año en electricidad frente a una no certificada, además de operar más silenciosamente.

## Quédate con...

- La certificación 80 PLUS garantiza que una PSU cumple mínimos de eficiencia energética bajo cargas reales.
- Los niveles van de Bronze (accesible) a Titanium (alta eficiencia incluso en reposo, para servidores).
- Gold es el punto óptimo para la mayoría de estaciones de trabajo y sistemas de desarrollo: buen equilibrio entre precio, eficiencia y calidad.
- Watts reales = potencia continua sostenida; ignora las etiquetas de “potencia máxima” o “pico”.
- Una PSU eficiente ahorra energía, reduce el calor y mejora la estabilidad, especialmente en sistemas que operan largas jornadas.
- Invierte en una fuente certificada de marca reconocida: es más barato que reemplazar una CPU o GPU dañada por una mala alimentación.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/psu/rieles" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/psu/protecciones" class="next">Siguiente</a>
</div>
