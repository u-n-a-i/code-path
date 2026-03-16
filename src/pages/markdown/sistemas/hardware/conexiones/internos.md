---
title: "Buses internos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Buses internos](#buses-internos)
  - [PCI Express](#pci-express)
  - [Bus de memoria](#bus-de-memoria)
  - [Bus del sistema](#bus-del-sistema)
  - [Quédate con...](#quédate-con)

</div>

# Buses internos

Los buses internos son las autopistas de alta velocidad que conectan los componentes críticos dentro de una computadora: CPU, memoria, chipset y tarjetas de expansión. A diferencia de los buses externos (que conectan periféricos), los buses internos están optimizados para bajo latencia y alto ancho de banda, ya que manejan el flujo esencial de instrucciones y datos que determina el rendimiento global del sistema. Comprender los principales buses internos —PCI Express, bus de memoria y bus del sistema— permite entender cómo los componentes colaboran y dónde pueden surgir cuellos de botella en configuraciones exigentes, como servidores de desarrollo, estaciones de IA o sistemas de renderizado.

## PCI Express

PCI Express (PCIe) es el estándar dominante para conectar dispositivos de alta velocidad a la CPU o al chipset. A diferencia de los buses antiguos (como PCI o AGP), PCIe usa una arquitectura punto a punto serial en lugar de un bus paralelo compartido, lo que elimina colisiones y permite escalabilidad.

- Estructura: se organiza en carriles (lanes), cada uno compuesto por dos pares de señales diferenciales (uno para enviar, otro para recibir).
  - x1, x4, x8, x16: indican el número de carriles. Una GPU suele usar x16; una SSD NVMe, x4.
- Generaciones: cada nueva versión duplica aproximadamente el ancho de banda por carril:
  - PCIe 3.0: ~1 GB/s por dirección (x16 → ~32 GB/s total).
  - PCIe 4.0: ~2 GB/s (x16 → ~64 GB/s).
  - PCIe 5.0: ~4 GB/s (x16 → ~128 GB/s).
- Roles:
  - Conexión directa a CPU: GPU, SSD NVMe primario, tarjetas de red 10/100 GbE.
  - Conexión al chipset: SSDs secundarios, USB 3.2, SATA, Wi-Fi.

> El número de carriles PCIe disponibles depende de la CPU y el chipset. Una CPU de escritorio típica ofrece 16–24 carriles; los servidores (EPYC, Xeon) pueden ofrecer 128+.

## Bus de memoria

El bus de memoria (o memory bus) es la conexión directa entre la CPU y los módulos de RAM. Es uno de los buses más críticos del sistema, ya que determina la velocidad a la que la CPU puede acceder a sus datos de trabajo.

- Ancho: en sistemas de escritorio, es de 64 bits (8 bytes) por canal.
- Canales:
  - Single channel: 64 bits.
  - Dual channel: 128 bits (dos módulos).
  - Quad channel: 256 bits (plataformas HEDT/servidor).
- Velocidad: dictada por la frecuencia de la memoria (DDR4-3200, DDR5-6000, etc.).
- Ancho de banda:
  - DDR4-3200 en dual channel: ~51 GB/s.
  - DDR5-6000 en dual channel: ~90 GB/s.

Desde 2008, el controlador de memoria está integrado en la CPU, lo que reduce la latencia y elimina la dependencia del chipset para el acceso a RAM. Esto convierte al bus de memoria en una extensión directa de la CPU.

## Bus del sistema

El bus del sistema (o system bus) es un término histórico que originalmente refería a la conexión entre la CPU y el Northbridge (en arquitecturas antiguas). Hoy, este concepto ha evolucionado hacia enlaces de alta velocidad punto a punto:

- Intel: usa DMI (Direct Media Interface) para conectar la CPU con el chipset (PCH).
  - DMI 4.0 ≈ PCIe 4.0 x8 → ~32 GB/s.
- AMD: usa Infinity Fabric en CPUs Ryzen/EPYC, que no solo conecta CPU-chipset, sino también los chiplets dentro de la CPU.
  - Ancho de banda variable, pero puede superar los 50 GB/s en EPYC.

Este bus gestiona el tráfico entre la CPU y los dispositivos gestionados por el chipset: almacenamiento secundario, USB, audio, red, etc. Si muchos dispositivos compiten por ancho de banda aquí (por ejemplo, múltiples SSDs NVMe), puede convertirse en un cuello de botella.

En sistemas modernos, ya no existe un "bus del sistema" único. En su lugar, hay una red de interconexiones jerárquicas:

- CPU ↔ RAM: bus de memoria (el más rápido).
- CPU ↔ GPU/SSD primario: PCIe directo.
- CPU ↔ chipset: DMI/Infinity Fabric.
- Chipset ↔ periféricos: PCIe, USB, SATA.

Esta arquitectura reduce la contención y permite que múltiples transferencias ocurran simultáneamente.

## Quédate con...

- PCI Express es el bus interno para dispositivos de expansión de alto rendimiento; su ancho (x16, x4) y generación (3.0, 4.0, 5.0) definen el rendimiento de GPU y SSDs.
- El bus de memoria conecta directamente la CPU con la RAM; su ancho (dual/quad channel) y frecuencia determinan el ancho de banda disponible para el cómputo.
- El bus del sistema moderno (DMI, Infinity Fabric) conecta la CPU con el chipset, gestionando E/S secundaria; su capacidad puede limitar el rendimiento si hay muchos dispositivos activos.
- Los buses internos están jerarquizados por prioridad y ancho de banda: lo más crítico (RAM, GPU) va directo a la CPU; lo menos crítico, pasa por el chipset.
- Como desarrollador, si tu aplicación mueve grandes volúmenes de datos entre CPU, GPU y almacenamiento, verifica que no estés saturando los carriles PCIe o el enlace CPU-chipset.
- El rendimiento del sistema depende no solo de los componentes, sino de cómo se comunican entre sí a través de estos buses internos.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/conexiones/bus" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/conexiones/externos" class="next">Siguiente</a>
</div>
