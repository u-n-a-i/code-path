---
title: "Unidades de Estado Sólido (SSD)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Unidades de Estado Sólido (SSD)](#unidades-de-estado-sólido-ssd)
  - [Principios de la memoria Flash (NAND)](#principios-de-la-memoria-flash-nand)
  - [Celdas SLC, MLC, TLC, QLC](#celdas-slc-mlc-tlc-qlc)
  - [Formatos de SSD](#formatos-de-ssd)
    - [2.5 pulgadas SATA](#25-pulgadas-sata)
    - [M.2 SATA](#m2-sata)
    - [M.2 NVMe](#m2-nvme)
    - [AIC (Add-in-Card)](#aic-add-in-card)
  - [Interfaces de conexión](#interfaces-de-conexión)
    - [SATA (velocidad y limitación)](#sata-velocidad-y-limitación)
    - [NVMe (PCIe) y su gran ventaja en velocidad](#nvme-pcie-y-su-gran-ventaja-en-velocidad)
  - [Almacenamiento híbrido](#almacenamiento-híbrido)
  - [Quédate con...](#quédate-con)

</div>

# Unidades de Estado Sólido (SSD)

Las unidades de estado sólido (SSD, por sus siglas en inglés) han revolucionado el almacenamiento al reemplazar los componentes mecánicos de los discos duros (HDD) por memoria flash NAND, un tipo de memoria no volátil basada en semiconductores. Esto elimina el movimiento físico, reduce drásticamente la latencia y aumenta la resistencia a golpes, temperatura y vibraciones. Para un desarrollador, comprender los principios de la memoria flash, los tipos de celdas, los formatos físicos y las interfaces de conexión es esencial para elegir el almacenamiento adecuado a cada carga de trabajo: desde el arranque rápido del sistema operativo hasta el procesamiento intensivo de datos en aplicaciones de IA o bases de datos.

## Principios de la memoria Flash (NAND)

La memoria NAND flash almacena datos en celdas de transistor que atrapan electrones en una puerta flotante, representando bits mediante niveles de carga. A diferencia de la DRAM, no necesita refresco constante, lo que la hace no volátil. Sin embargo, tiene limitaciones:

**Escritura en bloques:** los datos se escriben en páginas (típicamente 4–16 KB), pero se borran en bloques más grandes (256 KB–4 MB). Esto obliga a usar técnicas como el garbage collection y el wear leveling para gestionar el espacio y prolongar la vida útil.

**Ciclos de escritura limitados:** cada celda soporta un número finito de programaciones/borrados (P/E cycles), que varía según el tipo de celda.

## Celdas SLC, MLC, TLC, QLC

La densidad y el costo de los SSDs dependen de cuántos bits almacena cada celda:

- SLC (Single-Level Cell): 1 bit por celda.
  - Ventajas: alta velocidad, larga vida útil (≈100.000 P/E cycles), baja latencia.
  - Desventajas: alto costo.
  - Uso: industrial, militar, servidores críticos.
- MLC (Multi-Level Cell): 2 bits por celda.
  - Equilibrio entre costo, rendimiento y durabilidad (≈3.000–10.000 P/E cycles).
  - Uso: gama alta de consumo y estaciones de trabajo.
- TLC (Triple-Level Cell): 3 bits por celda.
  - Más densa y económica, pero menor durabilidad (≈500–3.000 P/E cycles) y velocidad.
  - Uso: estándar en la mayoría de SSDs de consumo (2018–2024).
- QLC (Quad-Level Cell): 4 bits por celda.
  - Máxima densidad y menor costo, pero vida útil reducida (≈100–1.000 P/E cycles) y peor rendimiento en escrituras sostenidas.
  - Uso: almacenamiento de lectura intensiva (sistemas operativos, juegos, multimedia).

Los SSDs modernos usan cachés SLC (parte del TLC/QLC se comporta como SLC temporalmente) para acelerar escrituras cortas, pero el rendimiento cae si se supera la caché.

## Formatos de SSD

El formato físico determina dónde y cómo se instala el SSD:

### 2.5 pulgadas SATA

- Tamaño: igual que un HDD de laptop.
- Interfaz: SATA III (6 Gb/s).
- Uso: ideal para reemplazar HDDs en laptops o PCs antiguos; compatible con casi cualquier sistema.

### M.2 SATA

- Tamaño: pequeño (22×80 mm típico, abreviado como 2280).
- Interfaz: SATA, pero en formato M.2.
- Rendimiento: igual que 2.5" SATA (~550 MB/s), pero ocupa menos espacio.
- Clave: usa la llave B (notch en el borde).

### M.2 NVMe

- Interfaz: PCIe (generalmente x4 lanes).
- Rendimiento: hasta 7.000 MB/s (PCIe 4.0) o 14.000 MB/s (PCIe 5.0).
- Clave: usa la llave M (notch en posición distinta a B).
- Compatibilidad: requiere que la placa base soporte NVMe en la ranura M.2.

> Algunas ranuras M.2 aceptan solo SATA, otras solo NVMe, y otras ambos (pero no simultáneamente). Siempre verifica la documentación de la placa.

### AIC (Add-in-Card)

- Formato: tarjeta que se inserta en una ranura PCIe x4 o x16.
- Uso: en servidores o PCs sin ranuras M.2 libres; común en SSDs de alto rendimiento o capacidad (como los Intel Optane antiguos).
- Ventaja: enfriamiento superior, sin compartir líneas PCIe con otros dispositivos.

## Interfaces de conexión

### SATA (velocidad y limitación)

SATA III, la interfaz heredada de los HDDs, tiene un ancho de banda máximo de 600 MB/s (6 Gb/s teóricos, menos por sobrecarga). Aunque suficiente para HDDs, es un cuello de botella severo para la memoria NAND moderna, que puede transferir datos mucho más rápido. Por eso, los SSDs SATA no aprovechan todo su potencial.

### NVMe (PCIe) y su gran ventaja en velocidad

NVMe (Non-Volatile Memory Express) es un protocolo diseñado específicamente para SSDs sobre PCIe. A diferencia de AHCI (usado en SATA), NVMe:

- Soporta miles de colas de comandos (frente a una en AHCI), ideal para cargas paralelas.
- Tiene baja latencia y menor sobrecarga de CPU.

Aprovecha directamente el ancho de banda de PCIe:

| Interfaz           | Ancho de banda máximo (lectura) |
| ------------------ | ------------------------------- |
| SATA III           | ~550 MB/s                       |
| PCIe 3.0 x4 (NVMe) | ~3.500 MB/s                     |
| PCIe 4.0 x4 (NVMe) | ~7.000 MB/s                     |
| PCIe 5.0 x4 (NVMe) | ~14.000 MB/s                    |

Esta diferencia es crítica en aplicaciones que dependen de E/S intensiva: bases de datos, compilación, carga de niveles en juegos, o entrenamiento de modelos de IA.

## Almacenamiento híbrido

El almacenamiento híbrido combina diferentes tecnologías para equilibrar rendimiento y costo:

- SSHD (Solid State Hybrid Drive): un HDD con una pequeña caché de NAND (8–32 GB). El firmware mueve automáticamente los datos más usados a la caché. Rendimiento mejorado para arranque y aplicaciones frecuentes, pero inferior a un SSD puro.
- Caché SSD + HDD: en sistemas operativos (como ReadyBoost en Windows o bcache en Linux), un SSD pequeño actúa como caché para un HDD grande.
- Jerarquía de almacenamiento en servidores: datos calientes en NVMe, tibios en SATA SSD, fríos en HDD.

Estas soluciones son útiles en sistemas con presupuesto limitado, pero en entornos profesionales, la tendencia es hacia todo SSD, especialmente con la caída de precios de la NAND.

Al elegir un SSD, no basta con fijarse en la capacidad. Verifica:

- El tipo de celda (TLC/QLC) si harás escrituras intensivas.
- La interfaz (SATA vs NVMe) y la compatibilidad con tu placa.
- La presencia de DRAM: los SSDs con caché DRAM son más rápidos y duraderos que los "DRAM-less", que usan la RAM del sistema (Host Memory Buffer).

## Quédate con...

- Los SSDs usan memoria NAND flash, sin partes móviles, lo que los hace más rápidos, silenciosos y resistentes que los HDDs.
- SLC > MLC > TLC > QLC en durabilidad y rendimiento; QLC es económico pero menos adecuado para escrituras intensivas.
- Formatos: 2.5" SATA (universal), M.2 SATA (compacto, lento), M.2 NVMe (rápido, requiere soporte), AIC (para servidores/alto rendimiento).
- NVMe sobre PCIe supera ampliamente a SATA en ancho de banda, latencia y paralelismo, siendo esencial para cargas de E/S intensiva.
- Verifica la llave M/B y la compatibilidad de la ranura M.2 antes de comprar: un SSD NVMe no funcionará en una ranura solo SATA.
- Como desarrollador, diseña tus aplicaciones para aprovechar la baja latencia del SSD: evita accesos aleatorios innecesarios, pero aprovecha que el costo de E/S secuencial es ahora muy bajo.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/almacenamiento/hdd" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/almacenamiento/durabilidad" class="next">Siguiente</a>
</div>
