---
title: "Función de la GPU"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Función de la GPU](#función-de-la-gpu)
  - [GPU](#gpu)
  - [Evolución de la GPU](#evolución-de-la-gpu)
  - [Diferencias entre CPU y GPU](#diferencias-entre-cpu-y-gpu)
  - [Procesamiento paralelo](#procesamiento-paralelo)
  - [Más allá del videojuego](#más-allá-del-videojuego)
    - [Cómputo general (GPGPU)](#cómputo-general-gpgpu)
    - [Renderizado](#renderizado)
    - [Minería](#minería)
    - [IA y Machine Learning](#ia-y-machine-learning)
  - [Quédate con...](#quédate-con)

</div>

# Función de la GPU

La Unidad de Procesamiento Gráfico (GPU, por sus siglas en inglés) nació con un propósito muy concreto: acelerar la generación de imágenes en tiempo real para videojuegos y aplicaciones gráficas. Sin embargo, su arquitectura —diseñada para ejecutar operaciones simples sobre enormes volúmenes de datos de forma simultánea— la ha convertido en una herramienta fundamental mucho más allá del entretenimiento digital. Hoy, las GPU impulsan avances en inteligencia artificial, simulaciones científicas, renderizado cinematográfico y procesamiento de señales. Para un desarrollador, comprender qué es una GPU, cómo difiere de una CPU y en qué escenarios puede acelerar el cómputo no solo amplía las posibilidades técnicas, sino que abre la puerta a nuevas formas de resolver problemas a escala.

## GPU

Una GPU es un procesador especializado compuesto por cientos o miles de núcleos pequeños y eficientes, organizados en grupos (conocidos como Streaming Multiprocessors en NVIDIA o Compute Units en AMD). A diferencia de la CPU, que está optimizada para ejecutar secuencias complejas de instrucciones con baja latencia, la GPU está diseñada para el alto rendimiento a través del paralelismo masivo. Cada núcleo es relativamente simple (sin ejecución fuera de orden ni cachés grandes), pero en conjunto pueden realizar millones de operaciones por segundo sobre datos estructurados, como píxeles, vértices o tensores.

## Evolución de la GPU

La GPU ha evolucionado desde chips fijos hasta procesadores programables de propósito general:

- Años 90: las primeras aceleradoras 3D (como la 3dfx Voodoo) tenían funciones fijas: transformación de vértices, iluminación, texturizado. No eran programables.
- 2001: NVIDIA lanzó la GeForce 3, la primera GPU con unidad de vértices programable, marcando el inicio de las shaders.
- 2006–2007: con CUDA (NVIDIA) y luego OpenCL (estándar abierto), las GPU se volvieron programables para cómputo general (GPGPU).
- 2010 en adelante: las arquitecturas modernas (Fermi, Kepler, RDNA, Ada Lovelace) integraron unidades de doble precisión, cachés jerárquicas, coherencia de memoria y soporte para lenguajes de alto nivel.
- Hoy: las GPU incluyen núcleos especializados para ray tracing (RT cores), IA (Tensor cores en NVIDIA, Matrix cores en AMD) y compresión de video.

Esta evolución ha transformado a la GPU de un componente periférico en un coprocesador esencial en supercomputadoras, estaciones de trabajo y centros de datos.

## Diferencias entre CPU y GPU

| Característica | CPU                             | GPU                                           |
| -------------- | ------------------------------- | --------------------------------------------- |
| Núcleos        | Pocos (4–128), complejos        | Miles (1.000–18.000+), simples                |
| Latencia       | Optimizada para baja latencia   | Optimizada para alto throughput               |
| Caché          | Grande y jerárquica (L1–L3)     | Pequeña por núcleo, más compartida            |
| Paralelismo    | Paralelismo a nivel de hilo     | Paralelismo a nivel de datos (SIMD/SIMT)      |
| Uso típico     | Lógica secuencial, E/S, control | Operaciones masivas sobre datos estructurados |

En resumen: la CPU es como un gerente ejecutivo que toma decisiones complejas rápidamente; la GPU es como un ejército de trabajadores que realizan la misma tarea simple en miles de elementos a la vez.

## Procesamiento paralelo

La fuerza de la GPU radica en su modelo de procesamiento paralelo masivo. Usa el paradigma SIMT (Single Instruction, Multiple Threads): una sola instrucción se aplica simultáneamente a muchos hilos de ejecución, cada uno operando sobre datos distintos.

Por ejemplo, para aplicar un filtro a una imagen de 4K (8.3 millones de píxeles), la GPU puede asignar un hilo a cada píxel y aplicar la misma operación (como brillo o contraste) a todos al mismo tiempo. Esto es imposible en una CPU con pocos núcleos, a menos que se paralelice manualmente con mucho esfuerzo.

Este modelo es ideal para problemas embarassingly parallel (fácilmente paralelizables), donde los datos no dependen unos de otros.

## Más allá del videojuego

Aunque los videojuegos siguen siendo un motor importante del desarrollo de GPU, su uso se ha expandido enormemente:

### Cómputo general (GPGPU)

Mediante APIs como CUDA (NVIDIA), ROCm (AMD) o OpenCL (multiplataforma), los desarrolladores pueden ejecutar código C/C++/Python directamente en la GPU. Se usa en:

- Simulaciones físicas (dinámica de fluidos, colisiones).
- Procesamiento de señales (radar, ultrasonido).
- Criptografía y análisis financiero.

### Renderizado

En cine y arquitectura, las GPU aceleran el renderizado fotorrealista mediante técnicas como ray tracing (simulación de la luz) y path tracing. Software como Blender, Unreal Engine o Autodesk Maya dependen fuertemente de la GPU para tiempos de render aceptables.

### Minería

Durante el auge de las criptomonedas (especialmente Bitcoin y Ethereum), las GPU fueron ampliamente usadas para resolver los complejos cálculos de hashing requeridos en la minería. Aunque muchas criptos han migrado a ASICs, algunas (como Ravencoin) siguen siendo minables con GPU.

### IA y Machine Learning

Este es hoy el campo de mayor crecimiento. Las operaciones clave en redes neuronales —multiplicaciones de matrices, convoluciones, funciones de activación— son altamente paralelas y se ajustan perfectamente al modelo SIMD de la GPU. Frameworks como TensorFlow, PyTorch y ONNX Runtime aprovechan automáticamente las GPU para:

- Entrenar modelos grandes (LLMs, visión por computadora).
- Inferencia en tiempo real (reconocimiento de voz, traducción automática).
- Procesamiento de lenguaje natural.

Las GPU modernas incluyen núcleos tensoriales (NVIDIA) o matriciales (AMD) diseñados específicamente para acelerar operaciones de punto flotante de baja precisión (FP16, INT8), cruciales en IA.

> No todo se beneficia de la GPU. Algoritmos con alta lógica de control, dependencias secuenciales o acceso irregular a memoria (como recorrer un árbol binario) se ejecutan mejor en CPU. La clave está en identificar las secciones paralelizables de tu código y delegarlas a la GPU mediante bibliotecas adecuadas.

## Quédate con...

- La GPU es un procesador masivamente paralelo, diseñado para operaciones simples sobre grandes volúmenes de datos.
- Ha evolucionado de aceleradora gráfica fija a coprocesador programable con soporte para cómputo general.
- Difiere de la CPU en número de núcleos, modelo de paralelismo y optimización (throughput vs. latencia).
- Su uso va mucho más allá de los videojuegos: renderizado, simulación, minería y, sobre todo, IA y machine learning.
- Para aprovecharla, el código debe ser altamente paralelo y estructurado; frameworks como CUDA, PyTorch o OpenCL facilitan esta tarea.
- Como desarrollador, saber cuándo y cómo usar la GPU puede acelerar tu aplicación en órdenes de magnitud, especialmente en cargas de datos o modelos predictivos.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/gpu/arquitectura" class="next">Siguiente</a>
</div>
