---
title: "Formatos y estándares"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Formatos y estándares](#formatos-y-estándares)
  - [Tipos de form factor (ATX, Micro-ATX, Mini-ITX…) y sus implicaciones](#tipos-de-form-factor-atx-micro-atx-mini-itx-y-sus-implicaciones)
    - [ATX (Advanced Technology eXtended)](#atx-advanced-technology-extended)
    - [Micro-ATX (mATX)](#micro-atx-matx)
    - [Mini-ITX](#mini-itx)
    - [Extended ATX (E-ATX)](#extended-atx-e-atx)
  - [Compatibilidad física](#compatibilidad-física)
  - [Quédate con...](#quédate-con)

</div>

# Formatos y estándares

El diseño físico de una placa base no es arbitrario: sigue estándares industriales conocidos como form factors (factores de forma), que definen dimensiones, disposición de orificios de montaje, ubicación de conectores y compatibilidad con fuentes de alimentación y gabinetes. Estos estándares garantizan que componentes de distintos fabricantes puedan ensamblarse en un mismo sistema, lo que es esencial tanto para fabricantes de equipos como para usuarios que construyen o actualizan sus propias computadoras. Para un desarrollador que trabaja con sistemas embebidos, servidores o incluso hardware personalizado, comprender estos formatos permite anticipar limitaciones de espacio, consumo energético, capacidad de expansión y refrigeración, factores que pueden influir directamente en las decisiones de arquitectura de software.

## Tipos de form factor (ATX, Micro-ATX, Mini-ITX…) y sus implicaciones

Los form factors más comunes en sistemas de escritorio y servidores están liderados por el estándar ATX, introducido por Intel en 1995 y ampliamente adoptado por la industria. A partir de él se derivan variantes más compactas o especializadas:

### ATX (Advanced Technology eXtended)

Es el formato estándar para computadoras de escritorio de gama media y alta. Mide típicamente 305 × 244 mm y ofrece espacio para 4 ranuras RAM, 2–4 ranuras PCIe (incluyendo una x16 para GPU), múltiples conectores SATA y una disposición óptima para la refrigeración y el cableado. Su tamaño permite integrar más fases de alimentación, mejor distribución eléctrica y mayor capacidad de overclocking, lo que lo hace ideal para estaciones de trabajo o desarrollo con cargas pesadas (compilación, virtualización, machine learning local).

### Micro-ATX (mATX)

Una versión reducida de ATX (244 × 244 mm), que mantiene la compatibilidad con la mayoría de gabinetes ATX. Reduce el número de ranuras PCIe y, en algunos modelos, el número de ranuras RAM (a 2 o 4). Aunque más limitado en expansión, sigue siendo muy popular por su equilibrio entre rendimiento, costo y tamaño. Es adecuado para PCs de desarrollo estándar o servidores caseros.

### Mini-ITX

Diseñado por VIA Technologies en 2001 y ahora promovido por la Small Form Factor Special Interest Group (SFF-SIG), este formato mide solo 170 × 170 mm. Ofrece una sola ranura RAM (aunque muchos modelos modernos incluyen dos) y una única ranura PCIe x16, lo que limita la expansión a una GPU o una tarjeta de red. Su principal ventaja es el tamaño compacto, ideal para sistemas integrados, kioscos, HTPCs (centros de medios) o servidores edge. En entornos de desarrollo, se usa frecuentemente en prototipado IoT o en laboratorios con espacio limitado.

### Extended ATX (E-ATX)

Una variante más grande que ATX (hasta 305 × 330 mm o más, sin un estándar rígido), usada en servidores, workstations y placas para entusiastas. Soporta más ranuras RAM (hasta 8 o más), múltiples ranuras PCIe x16 para GPUs en SLI/CrossFire o aceleradores, y circuitos de alimentación robustos. Es común en servidores de desarrollo de IA o en sistemas que requieren múltiples tarjetas de red de alto ancho de banda.

Otros formatos especializados: en servidores y centros de datos se usan estándares como SSI-EEB o COM Express, mientras que en sistemas embebidos industriales aparecen formatos como Pico-ITX (100 × 72 mm) o CoreExpress.

Cada formato implica compromisos:

- Mayor tamaño → más expansión, mejor refrigeración, mayor consumo.
- Menor tamaño → menor consumo, menor ruido, menor costo, pero limitaciones en RAM, GPU y almacenamiento.

## Compatibilidad física

La compatibilidad física entre placa base, gabinete y fuente de alimentación es crítica y se rige por los estándares de form factor:

- Gabinete: debe especificar qué form factors admite. Un gabinete Mini-ITX solo acepta placas Mini-ITX; un gabinete ATX suele aceptar también mATX y Mini-ITX, pero no al revés. Además, debe contar con los orificios de montaje correctos y suficiente espacio para los componentes sobresalientes (disipadores, GPUs largas).
- Fuente de alimentación: el estándar ATX también define el tamaño y conector de la PSU (150 × 86 × 140 mm típicamente). La mayoría de gabinetes modernos usan fuentes ATX, pero formatos ultra compactos (como algunos Mini-ITX) pueden requerir fuentes SFX o incluso externas (como en laptops o mini PCs).
- CPU y refrigeración: aunque el zócalo depende del chipset, el tamaño del disipador debe caber dentro del gabinete. En Mini-ITX, la altura máxima del cooler suele estar limitada a 60–80 mm.
- Tarjetas de expansión: la longitud máxima de una GPU está limitada por el espacio interno del gabinete, y en placas mATX o Mini-ITX, puede haber interferencia con los cables o la fuente si no se diseña cuidadosamente.

Esta compatibilidad no es solo técnica, sino también práctica: un desarrollador que quiera montar un servidor de integración continua en casa debe elegir un form factor que equilibre capacidad (RAM, almacenamiento), ruido y espacio físico. Del mismo modo, un equipo de robótica móvil preferirá Mini-ITX o formatos embebidos por su bajo perfil y consumo.

> Aunque los form factors definen el tamaño y montaje, no garantizan compatibilidad eléctrica o funcional. Una placa Mini-ITX con chipset X670 (AMD) no funcionará con una CPU Intel, aunque físicamente quepa en el mismo gabinete que una placa Z790 (Intel). Siempre hay que verificar tanto el form factor como el chipset y el zócalo.

## Quédate con...

- Los form factors (ATX, Micro-ATX, Mini-ITX, E-ATX) definen el tamaño, montaje y capacidad de expansión de la placa base.
- ATX ofrece máxima expansión; Micro-ATX, equilibrio; Mini-ITX, minimalismo y bajo consumo.
- La compatibilidad física incluye gabinete (orificios de montaje), fuente de alimentación (tamaño y conector) y espacio para componentes (GPU, disipadores).
- Un form factor más pequeño implica menos ranuras RAM, menos PCIe y límites térmicos, lo que puede afectar el tipo de cargas de trabajo que puedes ejecutar.
- Siempre verifica tanto el form factor como el chipset y el zócalo al seleccionar componentes, ya que la compatibilidad física no implica compatibilidad funcional.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/placa_base/funcion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/placa_base/chipset" class="next">Siguiente</a>
</div>
