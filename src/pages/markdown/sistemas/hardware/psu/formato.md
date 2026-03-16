---
title: "El formato y tipos de PSU"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [El formato y tipos de PSU](#el-formato-y-tipos-de-psu)
  - [Formato](#formato)
    - [ATX](#atx)
    - [SFX](#sfx)
    - [TFX](#tfx)
  - [Tipos de cableado (No modular, Semi-modular, Modular…)](#tipos-de-cableado-no-modular-semi-modular-modular)
    - [No modular](#no-modular)
    - [Semi-modular](#semi-modular)
    - [Modular (totalmente modular)](#modular-totalmente-modular)
  - [Quédate con...](#quédate-con)

</div>

# El formato y tipos de PSU

La fuente de alimentación (PSU) no solo debe entregar energía estable y suficiente, sino también encajar físicamente en el gabinete y conectarse correctamente a todos los componentes del sistema. Para lograrlo, la industria ha estandarizado tanto las dimensiones externas (formatos) como la organización de los cables (tipos de cableado). Elegir el formato y el tipo de cableado adecuados es esencial para garantizar compatibilidad, facilitar la instalación y asegurar un flujo de aire óptimo dentro del gabinete.

## Formato

El formato de una PSU define sus dimensiones físicas, la disposición de los orificios de montaje y, en algunos casos, la orientación del ventilador. Debe ser compatible con el gabinete elegido; de lo contrario, no encajará o bloqueará componentes.

### ATX

El formato ATX es el estándar dominante en computadoras de escritorio desde mediados de los años 90. Sus dimensiones típicas son:

> 150 mm (ancho) × 86 mm (alto) × 140 mm (profundidad).

Este tamaño permite incluir ventiladores de 120 mm o 140 mm, lo que favorece la refrigeración silenciosa y eficiente. La mayoría de gabinetes mid-tower y full-tower están diseñados para aceptar fuentes ATX, y ofrecen espacio para cables y flujo de aire adecuado. Es la elección predeterminada para sistemas de gama media y alta, donde el rendimiento y la potencia (600–1600 W) son prioritarios.

### SFX

El formato SFX (Small Form Factor) se diseñó para sistemas compactos, como los basados en placas Mini-ITX o micro-ATX en gabinetes pequeños. Sus dimensiones estándar son:

> 125 mm × 63.5 mm × 100 mm.

Al ser más pequeño, suele usar un ventilador de 80 mm o 92 mm, lo que puede generar más ruido bajo carga. Las PSUs SFX tienen menor potencia máxima (típicamente hasta 750 W, aunque existen modelos de 1000 W de alta gama) y son más costosas por vatio. Muchos gabinetes SFX incluyen adaptadores para instalar fuentes ATX, pero no al revés.

Una variante es el SFX-L, ligeramente más profundo (125 mm × 63.5 mm × 130 mm), que permite ventiladores de 120 mm y mejor refrigeración.

### TFX

El formato TFX (Thin Form Factor) es aún más estrecho y alargado, diseñado originalmente para gabinetes slim de oficina o sistemas integrados:

> 85 mm × 65 mm × 175 mm.

Es raro en sistemas de rendimiento, ya que su potencia es limitada (generalmente < 400 W) y su refrigeración es deficiente. Hoy se usa principalmente en PCs preensamblados de bajo costo o en equipos industriales con restricciones de espacio muy específicas. No es recomendable para sistemas de desarrollo con GPU dedicada o múltiples discos.

## Tipos de cableado (No modular, Semi-modular, Modular…)

Además del formato físico, las PSU se clasifican por cómo gestionan sus cables:

### No modular

Todos los cables están soldados permanentemente a la fuente.

- Ventaja: menor costo.
- Desventaja: los cables no usados se acumulan dentro del gabinete, obstaculizando el flujo de aire y dificultando la organización.
- Uso típico: sistemas de bajo costo o preensamblados.

### Semi-modular

Los cables esenciales (24-pin ATX, 8-pin EPS para CPU) están fijos; los opcionales (PCIe, SATA, periféricos) son desmontables.

- Ventaja: equilibrio entre costo y flexibilidad.
- Uso típico: gama media; ideal para la mayoría de usuarios que no necesitan todos los conectores.

### Modular (totalmente modular)

Todos los cables son desmontables.

- Ventaja: máxima flexibilidad y limpieza; solo se instalan los cables necesarios, mejorando el flujo de aire y la estética.
- Desventaja: ligeramente más caro; requiere planificación previa.
- Uso típico: sistemas de alto rendimiento, estaciones de trabajo, servidores caseros y builds personalizados.

> Independientemente del tipo, siempre usa cables proporcionados por el fabricante de la PSU. Los cables “universales” o de terceros pueden no cumplir con las especificaciones eléctricas, generando riesgo de sobrecalentamiento o fallo.

## Quédate con...

- ATX es el formato estándar para escritorios; SFX para sistemas compactos; TFX para equipos slim de bajo rendimiento.
- Las dimensiones del gabinete deben coincidir con el formato de la PSU; muchos gabinetes Mini-ITX requieren SFX o adaptadores.
- El cableado modular mejora la organización y el flujo de aire; semi-modular ofrece un buen equilibrio; no modular es solo para presupuestos ajustados.
- En sistemas con GPU potente o múltiples discos, una PSU ATX modular de 650–1000 W es la opción más versátil y segura.
- Nunca comprometas la calidad de la PSU por ahorrar espacio o dinero: es la base de la estabilidad del sistema.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/psu/funcion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/psu/rieles" class="next">Siguiente</a>
</div>
