---
title: "Conectores esenciales"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Conectores esenciales](#conectores-esenciales)
  - [ATX de 24 pines](#atx-de-24-pines)
  - [EPS de 8 pines (CPU)](#eps-de-8-pines-cpu)
  - [PCIe de 6+2 pines (GPU)](#pcie-de-62-pines-gpu)
  - [SATA](#sata)
  - [Molex](#molex)
  - [Quédate con...](#quédate-con)

</div>

# Conectores esenciales

Los conectores de la fuente de alimentación (PSU) son los puentes físicos y eléctricos que entregan energía a cada componente crítico del sistema. Aunque parecen simples enchufes, cada tipo está diseñado para cumplir requisitos específicos de voltaje, corriente y seguridad. Conectar un componente al conector incorrecto —o forzar un adaptador inadecuado— puede dañar permanentemente la placa base, la CPU o la GPU.

> Siempre conecta los cables antes de encender el sistema. Un conector mal asentado puede arquear (chispear) al encender, dañando los contactos. Además, usa solo los cables proporcionados por la PSU; los universales o de terceros pueden no cumplir con las especificaciones eléctricas.

## ATX de 24 pines

El conector ATX de 24 pines es el principal enlace entre la PSU y la placa base. Suministra energía a los circuitos esenciales de la placa: chipset, VRM, ranuras RAM, puertos USB, SATA y controladores de red/audio. Aunque su predecesor tenía 20 pines, la versión de 24 pines (estándar desde ATX12V 2.0, ~2003) añadió líneas adicionales de +3.3 V, +5 V y tierra para soportar el mayor consumo de las placas modernas.

- Voltajes entregados: +3.3 V, +5 V, +12 V, y tierra (GND).
- Ubicación: se conecta a la esquina superior derecha de la placa base (mirando desde arriba).
- Importante: nunca utilices un adaptador 20→24 pines en una placa que requiere 24 pines; la placa podría arrancar, pero será inestable bajo carga.

## EPS de 8 pines (CPU)

El conector EPS de 8 pines (también llamado CPU 8-pin o 4+4 pin) alimenta exclusivamente el VRM de la CPU. A diferencia del ATX de 24 pines, este conector entrega solo +12 V, ya que los reguladores de voltaje de la placa base convierten este voltaje en los niveles precisos que requiere el procesador (típicamente entre 0.8 V y 1.4 V).

- Diseño 4+4: permite usarlo en placas que solo requieren 4 pines (gama baja).
- Ubicación: cerca del socket de la CPU, en la esquina superior izquierda de la placa.

> Algunas PSU incluyen dos conectores EPS de 8 pines para placas de alto rendimiento (HEDT o servidores). No los confundas con los PCIe; aunque físicamente similares, no son intercambiables. Usar un conector PCIe en la CPU puede dañar la placa.

## PCIe de 6+2 pines (GPU)

El conector PCIe de 6+2 pines (también llamado 6+2 pin GPU) suministra energía adicional a las tarjetas gráficas de gama media y alta. La ranura PCIe del motherboard solo entrega 75 W; las GPUs modernas necesitan más, por lo que se conectan directamente a la PSU.

- 6 pines: hasta 75 W adicionales (total 150 W con la ranura).
- 8 pines (6+2): hasta 150 W adicionales (total 225 W); algunos diseños soportan hasta 300 W con codificación especial.
- Diseño 6+2: el segmento de 2 pines es desmontable, permitiendo usarlo como 6 pines si la GPU lo requiere.
- Clave: aunque se parece al EPS de CPU, tiene una muesca en posición distinta. Forzarlo puede dañar la GPU o la PSU.

## SATA

El conector SATA de alimentación es un conector plano de 15 pines que alimenta discos duros (HDD), unidades de estado sólido (SSD) y unidades ópticas.

- Voltajes: +3.3 V, +5 V y +12 V (aunque la mayoría de SSDs solo usan +5 V).
- Diseño: sin clavijas expuestas, con bloqueo a presión, reduciendo el riesgo de cortocircuitos.
- Notas:
  - Algunos SSDs antiguos usan el +3.3 V para Power Disable (desconexión remota); si tu PSU no entrega +3.3 V en SATA (raro, pero posible en fuentes antiguas), el disco no arrancará.
  - Nunca conectes un conector Molex a un SSD SATA sin un adaptador activo; el voltaje podría dañarlo.

## Molex

El conector Molex (también llamado Molex 4-pin peripheral) es un estándar heredado de la era ATX temprana, con un diseño robusto de 4 pines:

- Voltajes: +5 V y +12 V (dos pines de tierra).
- Uso original: discos duros IDE, unidades ópticas, ventiladores adicionales.
- Uso actual: raro en componentes nuevos, pero aún presente en:
  - Ventiladores de gabinete antiguos.
  - Cables de alimentación para adapters PCIe (no recomendados para GPUs modernas).
  - Sistemas de iluminación LED.

> Los adaptadores Molex → SATA o Molex → PCIe son inseguros para cargas altas. No los uses para alimentar GPUs, SSDs o HDDs modernos; están diseñados para bajo consumo y carecen de protección adecuada.

## Quédate con...

- ATX 24-pin: alimenta la placa base; esencial para el arranque.
- EPS 8-pin (CPU): entrega +12 V al VRM de la CPU; no es intercambiable con PCIe.
- PCIe 6+2-pin: alimenta la GPU; tiene muesca distinta al EPS.
- SATA: para discos modernos; entrega +3.3 V, +5 V y +12 V.
- Molex: estándar heredado; evita usarlo para componentes críticos o de alto consumo.
- Nunca fuerces conectores: su forma está diseñada para evitar errores; si no encaja, estás usando el equivocado.
- Una instalación correcta de los conectores es tan importante como la calidad de la PSU: garantiza que la energía llegue de forma segura y estable a cada componente.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/psu/protecciones" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/psu/calculo" class="next">Siguiente</a>
</div>
