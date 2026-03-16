---
title: "Cálculo de potencia"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Cálculo de potencia](#cálculo-de-potencia)
  - [Cómo estimar la potencia requerida por el sistema](#cómo-estimar-la-potencia-requerida-por-el-sistema)
  - [Margen de seguridad](#margen-de-seguridad)
  - [Ruido eléctrico](#ruido-eléctrico)
  - [Errores comunes](#errores-comunes)
  - [Quédate con...](#quédate-con)

</div>

# Cálculo de potencia

Elegir una fuente de alimentación (PSU) con la potencia adecuada es un paso crítico en la construcción o actualización de un sistema. Una PSU subdimensionada puede causar reinicios aleatorios, daño por sobrecarga o incluso fallos catastróficos; una excesivamente grande, aunque segura, representa un gasto innecesario y puede operar con menor eficiencia en cargas bajas. El cálculo de potencia no se trata solo de sumar números, sino de anticipar picos de consumo, márgenes de seguridad y el perfil real de uso del sistema. Para un desarrollador que trabaja con cargas intensivas —como compilación paralela, entrenamiento de modelos de IA o simulaciones—, una estimación precisa es esencial para garantizar estabilidad 24/7.

## Cómo estimar la potencia requerida por el sistema

El consumo total de un sistema depende principalmente de tres componentes: CPU, GPU y, en menor medida, discos, RAM y periféricos. La forma más confiable de estimar la potencia es:

1. Consultar las especificaciones TDP (Thermal Design Power) de CPU y GPU. Aunque el TDP no es el consumo real, es un buen punto de partida:

   - CPU de escritorio: 65–125 W (hasta 250 W en HEDT).
   - GPU de gama media: 150–200 W; gama alta: 300–450 W (RTX 4090: 450 W TDP, pero picos reales superan los 600 W).

2. Añadir el consumo del resto del sistema:

   - Placa base, RAM, SSDs, ventiladores: ~30–50 W.
   - HDDs adicionales: +10 W por unidad.

3. Considerar picos de consumo:

   - Las GPUs modernas (especialmente NVIDIA) pueden tener picos transitorios (micro-bursts) que superan su TDP en un 30–50% durante milisegundos. Por ejemplo, una RTX 4080 (320 W TDP) puede picar a 450 W.
   - Las CPUs con Turbo Boost también superan su TDP bajo carga de un solo hilo.

Una fórmula práctica:

> Potencia estimada=(TDP CPU+TDP GPU)×1.3+50 W

Ejemplo:

```
Ryzen 9 7950X (170 W) + RTX 4070 (200 W):

(170+200)×1.3+50=531 W → recomienda una PSU de 650 W.
```

Herramientas como la calculadora de PSU de OuterVision o la de Cooler Master ayudan a refinar esta estimación con modelos reales.

## Margen de seguridad

Nunca elijas una PSU que opere al 100% de su capacidad nominal. Se recomienda un margen de seguridad del 20–30% por varias razones:

- Eficiencia: las PSU son más eficientes (y silenciosas) entre el 40% y 70% de carga. Una fuente de 750 W usada a 500 W opera en su punto óptimo; una de 550 W al límite será menos eficiente y más ruidosa.
- Picos futuros: si planeas actualizar la GPU o añadir discos, el margen te da espacio sin cambiar la PSU.
- Envejecimiento: con el tiempo, los condensadores de la PSU pierden capacidad; un margen compensa esta degradación.
- Estabilidad: bajo picos transitorios, una PSU al límite puede activar OPP (Over-Power Protection) y apagarse.

Así, si tu sistema consume ~500 W, elige una PSU de 650–750 W.

## Ruido eléctrico

Aunque no afecta directamente el cálculo de potencia, el ruido eléctrico está relacionado con la calidad de la PSU y su capacidad para mantener voltajes estables bajo carga variable. Una fuente de baja calidad puede generar ruido en las líneas de +12 V o +5 V, lo que provoca:

- Errores de CRC en discos SATA.
- Reinicios aleatorios sin motivo aparente.
- Corrupción de datos en RAM (especialmente sin ECC).

Este ruido no se mide en vatios, pero sí influye en la fiabilidad a largo plazo. Una PSU con buen filtrado EMI y regulación independiente por riel minimiza este riesgo, incluso si la potencia nominal es suficiente.

## Errores comunes

Al calcular la potencia, es fácil caer en trampas que comprometen la estabilidad:

1. Confundir TDP con consumo real: el TDP es una medida térmica, no eléctrica. Algunas CPUs (como las de Intel) consumen significativamente más que su TDP bajo turbo.
1. Ignorar los picos de la GPU: las GPUs modernas tienen perfiles de energía dinámicos; el consumo no es constante.
1. Sumar potencias de PSU antiguas: si reutilizas una fuente de 500 W de hace 10 años, su capacidad real hoy puede ser menor por envejecimiento de componentes.
1. Usar adaptadores inseguros: cables Molex → PCIe o SATA → PCIe no están diseñados para altas corrientes y pueden sobrecalentarse.
1. No considerar la eficiencia a baja carga: una PSU de 1000 W en un sistema de 200 W opera por debajo del 20% de carga, donde la eficiencia cae y el ruido del ventilador puede ser irregular.

> En servidores o sistemas 24/7, prioriza PSUs con certificación 80 PLUS Gold o superior y riel +12 V único. En estaciones de desarrollo con GPUs potentes, verifica que la PSU tenga suficientes conectores PCIe nativos (no compartidos) y una buena respuesta a picos transitorios.

## Quédate con...

- Estima la potencia con TDP de CPU y GPU, añadiendo un 30% para picos y 50 W para el resto del sistema.
- Siempre incluye un margen de seguridad del 20–30% para eficiencia, estabilidad y futuras actualizaciones.
- El ruido eléctrico no se mide en vatios, pero una PSU de baja calidad puede causar fallos incluso si la potencia parece suficiente.
- Evita errores comunes: no confundas TDP con consumo real, ignora picos de GPU y no reutilices PSU antiguas sin verificar su estado.
- Usa calculadoras de PSU confiables y elige fuentes de marcas reconocidas con buen historial de regulación y protecciones.
- La potencia correcta no es la mínima que funciona, sino la que garantiza estabilidad, eficiencia y longevidad.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/psu/conectores" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
