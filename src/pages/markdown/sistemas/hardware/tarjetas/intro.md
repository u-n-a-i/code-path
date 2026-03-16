---
title: "Tarjetas de expansión"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Tarjetas de expansión](#tarjetas-de-expansión)
  - [Historia y evolución](#historia-y-evolución)
  - [Propósito y necesidad](#propósito-y-necesidad)
  - [Modularidad del PC](#modularidad-del-pc)
  - [Uso de los slots PCIe (x1, x4)](#uso-de-los-slots-pcie-x1-x4)
  - [Quédate con...](#quédate-con)

</div>

# Tarjetas de expansión

Las tarjetas de expansión son componentes modulares que se insertan en ranuras de la placa base para añadir funcionalidad al sistema. Desde las primeras tarjetas de video y controladoras de disco en los años 80 hasta las aceleradoras de IA y redes de 100 GbE de hoy, estas tarjetas han sido la clave de la modularidad del PC, permitiendo que un mismo sistema evolucione con el tiempo sin necesidad de reemplazar toda la plataforma.

## Historia y evolución

La necesidad de expansión surgió con los primeros PCs, que tenían capacidades limitadas integradas. IBM definió el estándar con el bus ISA (Industry Standard Architecture) en 1981, con ranuras de 8 y luego 16 bits para tarjetas de sonido, red o gráficos. Con el tiempo, surgieron buses más rápidos para satisfacer nuevas demandas:

- PCI (Peripheral Component Interconnect, 1992): reemplazó al ISA como estándar para tarjetas de propósito general (red, sonido, almacenamiento). Era paralelo, compartido y más rápido.
- AGP (Accelerated Graphics Port, 1997): bus dedicado para GPUs, eliminando la contención con otros dispositivos.
- PCI Express (PCIe, 2004): arquitectura serial punto a punto que reemplazó tanto a PCI como a AGP. Escalable, de bajo latencia y con múltiples tamaños (x1, x4, x8, x16).

Hoy, PCIe es el único estándar relevante para tarjetas de expansión en sistemas modernos. ISA y PCI han desaparecido, y AGP fue absorbido por PCIe x16.

## Propósito y necesidad

Las tarjetas de expansión existen para extender o mejorar las capacidades del sistema más allá de lo integrado en la placa base. Aunque muchas funciones (audio, red, gráficos) ahora están integradas, hay casos donde se requiere mayor rendimiento, características específicas o compatibilidad con estándares profesionales:

- Rendimiento: una GPU dedicada supera con creces los gráficos integrados.
- Especialización: tarjetas de captura de video, aceleradoras de cómputo (FPGA, ASIC), controladoras RAID hardware.
- Compatibilidad: puertos legacy (serie, paralelo) en sistemas industriales.
- Capacidad: más puertos USB, SATA, o redes 10 GbE de las que ofrece la placa.

Incluso en la era de los SoC, la modularidad sigue siendo valiosa: no todos los usuarios necesitan la misma configuración, y la posibilidad de actualizar evita el desperdicio electrónico.

## Modularidad del PC

La arquitectura del PC se basa en el principio de modularidad abierta:

- La placa base define las ranuras disponibles.
- El usuario elige qué tarjetas instalar según sus necesidades.
- El sistema operativo y los controladores gestionan la integración.

Esta filosofía ha permitido que el PC se adapte a roles tan diversos como estaciones de desarrollo, servidores, estaciones de trabajo para diseño o sistemas de entretenimiento. A diferencia de dispositivos cerrados (como consolas o laptops integradas), el PC sigue siendo personalizable y actualizable, en gran parte gracias a las tarjetas de expansión.

> Aunque los laptops y mini-PCs han reducido el uso de tarjetas de expansión, en entornos profesionales (desarrollo, ciencia, ingeniería), la modularidad sigue siendo crítica.

## Uso de los slots PCIe (x1, x4)

Los slots PCIe se diferencian por el número de carriles (lanes), que definen su ancho de banda:

- PCIe x1:
  - Ancho de banda (PCIe 4.0): ~2 GB/s.
  - Uso típico: tarjetas de red 1–10 GbE, Wi-Fi 6E/7, controladoras SATA, tarjetas de sonido profesionales, USB 3.2 adicionales.
  - Físicamente, puede haber slots x1 en ranuras x16 mecánicas (eléctricamente x1); siempre verifica la documentación de la placa.
- PCIe x4:
  - Ancho de banda (PCIe 4.0): ~8 GB/s.
  - Uso típico:
    - SSDs NVMe en tarjetas de expansión (aunque la mayoría usan M.2 directo en placa).
    - Tarjetas de red 25/40 GbE.
    - Captura de video 4K/8K en tiempo real.
    - Algunas GPUs de gama baja (aunque raro; casi todas usan x8/x16).
- PCIe x8/x16:
  - x16 es el estándar para GPUs (aunque muchas funcionan bien en x8 con mínima pérdida de rendimiento).
  - x8 se usa en servidores para múltiples GPUs o aceleradoras.

Advertencia crítica:

- Un slot x16 mecánico no garantiza x16 eléctricos. Algunas placas ofrecen x16/x0 o x8/x8 cuando se usan dos ranuras.
- No fuerces una tarjeta x16 en un slot x1: aunque encaje físicamente, solo funcionará si el slot es eléctricamente compatible (x1, x4, etc., hacia abajo).
- El número de carriles disponibles depende de la CPU y el chipset. Una CPU de escritorio típica ofrece 16–24 carriles; los servidores, 128+.

Ejemplo práctico:

Si instalas una tarjeta de red 10 GbE (que usa PCIe x4) en un slot x16 eléctricamente x4, funcionará a pleno rendimiento. Pero si la instalas en un slot x1, se limitará a ~1 GB/s, insuficiente para 10 GbE.

## Quédate con...

- Las tarjetas de expansión permiten personalizar y actualizar el sistema sin reemplazar la placa base.
- PCIe es el único estándar relevante hoy; reemplazó a ISA, PCI y AGP.
- PCIe x1 es para periféricos de bajo ancho de banda (red, USB, audio); x4 para SSDs NVMe, captura de video o redes de alta velocidad.
- Verifica los carriles eléctricos, no solo el tamaño físico del slot: un slot x16 puede ser solo x4 eléctricos.
- La modularidad del PC sigue siendo una ventaja clave en entornos profesionales, donde las necesidades de hardware varían según el proyecto.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/tarjetas/sonido" class="next">Siguiente</a>
</div>
