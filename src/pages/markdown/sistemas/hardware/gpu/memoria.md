---
title: "Memoria gráfica"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Memoria gráfica](#memoria-gráfica)
  - [VRAM](#vram)
  - [Ancho de banda](#ancho-de-banda)
  - [Tipos de memoria gráfica](#tipos-de-memoria-gráfica)
  - [Buses de memoria](#buses-de-memoria)
  - [Velocidad y ancho de banda](#velocidad-y-ancho-de-banda)
  - [Interfaz de conexión](#interfaz-de-conexión)
    - [La importancia del slot PCIe x16](#la-importancia-del-slot-pcie-x16)
    - [Ancho de banda y carriles (lanes)](#ancho-de-banda-y-carriles-lanes)
  - [Quédate con...](#quédate-con)

</div>

# Memoria gráfica

La memoria gráfica, comúnmente conocida como VRAM (Video Random Access Memory), es un componente crítico que actúa como el área de trabajo de la GPU. A diferencia de la RAM del sistema, la VRAM está optimizada para transferir grandes volúmenes de datos —como texturas, geometría y buffers de imagen— a velocidades extremadamente altas. Sin una memoria gráfica adecuada, incluso la GPU más potente se vería estrangulada por la falta de ancho de banda, convirtiéndose en un cuello de botella invisible pero severo.

## VRAM

La VRAM es una memoria de alta velocidad ubicada directamente en la tarjeta gráfica, conectada al núcleo de la GPU mediante un bus interno de muy alto ancho. Almacena todos los datos que la GPU necesita acceder rápidamente durante la ejecución:

- Texturas y mapas de normales.
- Buffers de vértices y geometría.
- El framebuffer (imagen final antes de mostrarse en pantalla).
- En cómputo general: tensores, matrices y buffers intermedios.

La cantidad de VRAM determina cuántos datos pueden residir cerca de la GPU. Por ejemplo, un modelo de lenguaje grande (LLM) o una escena 3D compleja puede requerir decenas de gigabytes; si no caben en VRAM, el sistema debe usar memoria del sistema (RAM) o incluso disco, lo que degrada drásticamente el rendimiento.

> La VRAM es rápida, pero no sustituye a la RAM del sistema. Los datos deben transferirse entre ambos dominios, y esa transferencia ocurre a través de PCIe. Minimizar estas transferencias (manteniendo los datos en VRAM el mayor tiempo posible) es clave para el rendimiento en GPGPU.

## Ancho de banda

El ancho de banda de memoria es la cantidad máxima de datos que pueden transferirse entre la GPU y su VRAM por segundo, medido en gigabytes por segundo (GB/s). Es, con frecuencia, el factor limitante en el rendimiento de la GPU, más que el número de núcleos.

Un ancho de banda insuficiente hace que los núcleos de la GPU pasen tiempo esperando datos, reduciendo la utilización y el rendimiento.

## Tipos de memoria gráfica

A lo largo del tiempo, se han desarrollado distintos tipos de VRAM, cada uno con mejoras en velocidad, eficiencia y densidad:

- GDDR5: fue estándar durante años; frecuencias de 5–8 Gbps, voltaje ~1.5 V.
- GDDR5X: evolución de GDDR5 con mayor ancho de banda (hasta 11 Gbps).
- GDDR6: estándar actual en la mayoría de GPUs; frecuencias de 12–24 Gbps, voltaje ~1.35 V, mejor eficiencia.
- GDDR6X: tecnología de NVIDIA y Micron; usa señales PAM4 (cuatro niveles) para alcanzar hasta 28 Gbps, usada en RTX 3080/3090 y 4090.
- HBM (High Bandwidth Memory): apila chips de memoria verticalmente y los conecta a la GPU mediante interposers de silicio. Ofrece ancho de banda extremo (hasta 1.2 TB/s en HBM3) y bajo consumo, pero es costosa. Usada en GPUs profesionales (AMD Instinct, NVIDIA A100) y en consolas (PlayStation 5 con HBM2E personalizada).

La elección del tipo de memoria refleja un equilibrio entre costo, rendimiento y consumo energético.

## Buses de memoria

El bus de memoria es el conjunto de líneas eléctricas que conectan la GPU con los chips de VRAM. Su ancho (128, 192, 256, 384 bits, etc.) determina cuántos bytes se pueden transferir por ciclo.

- Un bus de 128 bits es común en GPUs de entrada.
- Las de gama media usan 192 o 256 bits.
- Las de gama alta (RTX 4090, RX 7900 XTX) emplean 384 bits o más.

Un bus más ancho permite mayor ancho de banda, pero también requiere más espacio físico en la placa de circuito y más chips de memoria, lo que aumenta el costo y el consumo.

## Velocidad y ancho de banda

Velocidad (medida en Gbps por pin) y ancho de banda (GB/s total) están íntimamente relacionados, pero no son lo mismo:

Dos GPUs pueden usar la misma memoria GDDR6 a 16 Gbps, pero si una tiene bus de 192 bits y otra de 256 bits, la segunda tendrá ~33% más ancho de banda.

La velocidad afecta el consumo y la generación de calor; el ancho del bus afecta el diseño físico y el costo.

En aplicaciones con alta demanda de memoria (IA, renderizado 8K, simulaciones), el ancho de banda suele ser más crítico que la cantidad absoluta de VRAM.

## Interfaz de conexión

### La importancia del slot PCIe x16

Aunque la VRAM está directamente conectada a la GPU, la tarjeta gráfica misma se conecta a la placa base mediante un slot PCIe x16. Esta interfaz es crucial porque permite que la CPU y la GPU compartan datos (por ejemplo, cuando la CPU envía geometría a la GPU o cuando una aplicación de IA carga un modelo desde RAM a VRAM).

- PCIe x16 significa que el slot tiene 16 carriles (lanes), la configuración estándar para GPUs de rendimiento.
- Si se instala una GPU en un slot x8 o x4 (por limitaciones de chipset o diseño), el ancho de banda entre CPU y GPU se reduce, lo que puede afectar el rendimiento en cargas que requieren frecuentes transferencias de datos (como juegos con texturas dinámicas o entrenamiento de IA con datasets grandes).

### Ancho de banda y carriles (lanes)

El ancho de banda de PCIe depende de la generación y el número de carriles:

| PCIe versión | Ancho de banda por dirección (x16) |
| ------------ | ---------------------------------- |
| PCIe 3.0     | ~16 GB/s                           |
| PCIe 4.0     | ~32 GB/s                           |
| PCIe 5.0     | ~64 GB/s                           |

Aunque la mayoría de los juegos y aplicaciones actuales no saturan PCIe 3.0 x16, las GPUs de próxima generación (especialmente en IA y cómputo científico) sí se benefician de PCIe 4.0/5.0. Además, tecnologías como Resizable BAR (NVIDIA) o Smart Access Memory (AMD) permiten que la CPU acceda a toda la VRAM de una vez, en lugar de en bloques de 256 MB, lo que mejora el rendimiento en ciertos escenarios —pero solo si la placa, CPU y GPU soportan PCIe y estas funciones.

## Quédate con...

- La VRAM es la memoria dedicada de la GPU; su ancho de banda suele limitar más el rendimiento que la cantidad de núcleos.
- El ancho de banda depende de la velocidad de la memoria (Gbps), el ancho del bus (128–384 bits) y el tipo (GDDR6, GDDR6X, HBM).
- HBM ofrece el mayor ancho de banda y eficiencia, pero es costosa; GDDR6/X es el estándar en GPUs de consumo.
- La GPU se conecta a la placa mediante PCIe x16; usar menos carriles (x8, x4) puede limitar el intercambio de datos con la CPU.
- PCIe 4.0/5.0 y tecnologías como Resizable BAR mejoran la comunicación CPU-GPU, especialmente en IA y gráficos avanzados.
- Como desarrollador, diseña tus aplicaciones para minimizar las transferencias entre RAM y VRAM y maximizar el tiempo que los datos permanecen en la memoria gráfica.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/gpu/arquitectura" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/gpu/tipos" class="next">Siguiente</a>
</div>
