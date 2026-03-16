---
title: "GPU integrada vs dedicada"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [GPU integrada vs dedicada](#gpu-integrada-vs-dedicada)
  - [Integrada](#integrada)
  - [Dedicada](#dedicada)
  - [Ventajas y desventajas](#ventajas-y-desventajas)
    - [GPU integrada](#gpu-integrada)
    - [GPU dedicada](#gpu-dedicada)
  - [Casos de uso](#casos-de-uso)
    - [GPU integrada](#gpu-integrada-1)
    - [GPU dedicada](#gpu-dedicada-1)
  - [Quédate con...](#quédate-con)

</div>

# GPU integrada vs dedicada

La elección entre una GPU integrada y una GPU dedicada define en gran medida las capacidades gráficas y de cómputo de un sistema. Aunque ambas realizan las mismas funciones fundamentales —procesar gráficos y acelerar cómputo paralelo—, difieren radicalmente en arquitectura, rendimiento, consumo y propósito. Esta distinción no es solo relevante para gamers o diseñadores, sino también para desarrolladores que trabajan con inteligencia artificial, visualización de datos o aplicaciones de escritorio con interfaces ricas. Comprender las diferencias entre ambos tipos permite seleccionar el hardware adecuado, optimizar el software para la plataforma objetivo y gestionar las expectativas de rendimiento en distintos entornos.

## Integrada

Una GPU integrada (o iGPU) está construida dentro del mismo chip que la CPU, compartiendo el espacio de silicio, la fuente de alimentación y, en muchos casos, la memoria del sistema (RAM).

Ejemplos incluyen:

- Intel: gráficos UHD, Iris Xe (en Core y Core Ultra).
- AMD: Radeon Graphics en CPUs Ryzen con sufijo “G” (como el Ryzen 5 5600G).
- Apple: GPU integrada en los SoC M1, M2, M3 (hasta 40 núcleos).

La iGPU se conecta directamente al controlador de memoria de la CPU, lo que reduce la latencia, pero depende del ancho de banda de la RAM (DDR4/DDR5 o LPDDR5 en portátiles). Su potencia es limitada, pero suficiente para tareas cotidianas.

## Dedicada

Una GPU dedicada (o dGPU) es un componente independiente, montado en una tarjeta de expansión (generalmente en un slot PCIe x16) y equipado con sus propios recursos:

- Memoria VRAM dedicada (GDDR6, GDDR6X, HBM), no comparte con la RAM del sistema.
- Cientos o miles de núcleos especializados (CUDA cores, Stream Processors).
- Sistema de refrigeración propio (disipadores, ventiladores, líquido).
- Circuito de alimentación independiente, con conectores PCIe de 6/8 pines.

Ejemplos: NVIDIA GeForce RTX 4060, AMD Radeon RX 7800 XT, o GPUs profesionales como NVIDIA RTX 5000 Ada.

La dGPU se comunica con la CPU a través del bus PCIe, lo que introduce algo de latencia, pero compensa con un ancho de banda de memoria interno muy superior y una capacidad de cómputo masiva.

## Ventajas y desventajas

### GPU integrada

Ventajas:

- Bajo consumo energético: ideal para portátiles, tablets y sistemas silenciosos.
- Menor costo: no requiere componentes adicionales; incluida en la CPU.
- Compacidad: no ocupa espacio de expansión ni requiere ventilación adicional.
- Suficiente para tareas básicas: escritorio, video en 4K, navegación, ofimática.

Desventajas:

- Rendimiento limitado: no apta para juegos modernos, renderizado 3D o IA intensiva.
- Comparte RAM: reduce la memoria disponible para el sistema y sufre por el menor ancho de banda de DDR vs. GDDR.
- Sin actualizaciones independientes: para mejorar gráficos, hay que cambiar toda la CPU.

### GPU dedicada

Ventajas:

- Alto rendimiento: maneja juegos AAA, simulaciones, entrenamiento de modelos de IA y renderizado profesional.
- VRAM dedicada: alta velocidad y ancho de banda, sin competir con la RAM del sistema.
- Escalable: se puede actualizar sin cambiar CPU ni placa base.
- Soporte para APIs avanzadas: ray tracing, DLSS, CUDA, ROCm, etc.

Desventajas:

- Alto consumo y calor: requiere fuentes de alimentación robustas y buen flujo de aire.
- Mayor costo y tamaño: incrementa significativamente el precio y el volumen del sistema.
- Ruido: los ventiladores pueden ser audibles bajo carga.

## Casos de uso

La elección depende directamente del perfil de la carga de trabajo:

### GPU integrada

- Sistemas de oficina, navegación web, streaming de video.
- Desarrollo de software backend, frontend ligero, bases de datos.
- Portátiles ultraligeros, mini PCs, terminales educativos.
- Prototipado inicial de modelos de IA (inferencia en CPU o iGPU con frameworks como ONNX).

### GPU dedicada

- Desarrollo y entrenamiento de modelos de inteligencia artificial (PyTorch, TensorFlow con CUDA).
- Creación de contenido: video 4K/8K, modelado 3D (Blender, Maya), diseño gráfico (Adobe Suite).
- Juegos y aplicaciones con gráficos avanzados (Unity, Unreal Engine).
- Simulaciones científicas, análisis de datos masivo, renderizado en tiempo real.
- Servidores de inferencia o cómputo acelerado en edge computing.

En algunos sistemas modernos, como los portátiles con CPUs Intel H o AMD HX, se combinan ambas: la iGPU maneja tareas ligeras para ahorrar batería, y la dGPU se activa solo bajo demanda (tecnologías como NVIDIA Optimus o AMD Switchable Graphics).

> En entornos de desarrollo, incluso una GPU dedicada modesta (como una RTX 3050 o RX 6600) puede acelerar drásticamente tareas de IA, compilación de shaders o pruebas de renderizado. No siempre se necesita la gama alta: basta con que el hardware soporte las APIs requeridas (CUDA, Vulkan, DirectX 12).

## Quédate con...

- La GPU integrada está dentro de la CPU, comparte RAM y es eficiente para tareas cotidianas.
- La GPU dedicada es un componente independiente con VRAM propia, ideal para cómputo intensivo y gráficos avanzados.
- La iGPU gana en eficiencia y costo; la dGPU, en rendimiento y escalabilidad.
- Elige integrada para ofimática, desarrollo ligero o portabilidad; dedicada para IA, juegos, renderizado o simulación.
- En sistemas híbridos, el SO puede cambiar dinámicamente entre ambas para equilibrar rendimiento y batería.
- Como desarrollador, verifica si tu flujo de trabajo se beneficia del paralelismo masivo: si es así, una GPU dedicada es una inversión valiosa.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/gpu/memoria" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/gpu/puertos" class="next">Siguiente</a>
</div>
