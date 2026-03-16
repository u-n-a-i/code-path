---
title: "Arquitectura de una GPU"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Arquitectura de una GPU](#arquitectura-de-una-gpu)
  - [Núcleos gráficos](#núcleos-gráficos)
  - [CUDA cores / Stream processors](#cuda-cores--stream-processors)
  - [SM / CU](#sm--cu)
  - [Rasterización y shaders](#rasterización-y-shaders)
  - [ROPs y TMUs](#rops-y-tmus)
  - [Quédate con...](#quédate-con)

</div>

# Arquitectura de una GPU

A diferencia de la CPU, cuya arquitectura está optimizada para la flexibilidad y la baja latencia, la GPU se construye para el rendimiento bruto mediante el paralelismo masivo. Esto se refleja en su diseño interno: en lugar de unos pocos núcleos complejos, una GPU moderna contiene miles de núcleos simples, organizados en bloques jerárquicos que trabajan en conjunto para procesar millones de elementos (píxeles, vértices, tensores) de forma simultánea.

## Núcleos gráficos

Los núcleos gráficos son las unidades básicas de cómputo en una GPU. A diferencia de los núcleos de una CPU —diseñados para ejecutar secuencias complejas de instrucciones con múltiples niveles de caché y predicción de saltos—, los núcleos gráficos son simples, eficientes y numerosos. Cada uno puede ejecutar operaciones aritméticas y lógicas, pero está optimizado para trabajar en conjunto con cientos o miles de otros núcleos sobre datos estructurados.

El número de núcleos varía ampliamente: una GPU de entrada puede tener 512 núcleos, mientras que una estación de trabajo profesional (como la NVIDIA RTX 6000 Ada) supera los 18.000.

## CUDA cores / Stream processors

El nombre de los núcleos depende del fabricante:

NVIDIA los llama CUDA cores: unidades de ejecución que procesan operaciones de punto flotante (FP32), enteras (INT32) y, en generaciones recientes, operaciones tensoriales (FP16, INT8) mediante núcleos especializados.

AMD los denomina Stream Processors: funcionan de forma similar, ejecutando instrucciones SIMD (Single Instruction, Multiple Data) sobre vectores de datos.

Aunque el nombre difiere, ambos cumplen la misma función: ejecutar operaciones aritméticas en paralelo dentro de un contexto de subprocesos. Lo que distingue a las arquitecturas modernas es cómo se agrupan y gestionan estos núcleos.

## SM / CU

Los núcleos no están dispersos al azar, sino organizados en bloques de ejecución jerárquicos:

- En NVIDIA, el bloque básico se llama SM (Streaming Multiprocessor). Cada SM contiene:
  - Decenas de CUDA cores.
  - Unidades de función especial (SFUs) para operaciones trascendentales (seno, logaritmo).
  - Núcleos Tensor (en arquitecturas desde Volta en adelante).
  - Núcleos RT para ray tracing (desde Turing).
  - Registros compartidos y memoria L1/caché compartida.
- En AMD, el equivalente es la CU (Compute Unit), que incluye:
  - 64 Stream Processors agrupados en 4 unidades SIMD.
  - Memoria local (LDS, Local Data Share).
  - Registros y planificadores de hilos.

Estas unidades (SM/CU) son la base de la programación en GPU: cuando lanzas un kernel (función en GPU), el controlador distribuye los hilos entre los SM/CU disponibles. La eficiencia depende de cómo se ocupan estos bloques: si un SM tiene pocos hilos activos, se desperdicia capacidad de cómputo.

## Rasterización y shaders

En el contexto gráfico, la GPU sigue un pipeline de renderizado que convierte geometría 3D en imágenes 2D en pantalla. Dos etapas clave son:

**Rasterización:** el proceso de convertir triángulos 3D en píxeles (o fragments) en la pantalla. Determina qué píxeles están cubiertos por cada triángulo.

**Shaders:** programas pequeños y altamente paralelos que se ejecutan en distintas etapas del pipeline:

- Vertex Shader: transforma vértices (posición, color, coordenadas de textura).
- Fragment (Pixel) Shader: calcula el color final de cada píxel, aplicando iluminación, texturas y efectos.
- Compute Shader: no está ligado al pipeline gráfico; se usa para cómputo general (GPGPU).

Los shaders se ejecutan en los mismos núcleos CUDA/Stream Processors, lo que permite que una GPU alterne entre gráficos y cómputo sin cambiar hardware.

## ROPs y TMUs

Además de los núcleos de cómputo, la GPU incluye unidades especializadas para tareas gráficas específicas:

- ROPs (Raster Operations Pipelines o Render Output Units):
  - Se encargan de las operaciones finales sobre los píxeles antes de escribirlos en la memoria de video (framebuffer). Incluyen:
  - Mezcla de colores (blending).
  - Pruebas de profundidad (Z-buffer) y plantilla (stencil).
  - Antialiasing (suavizado de bordes).
  - El número de ROPs influye en el rendimiento de renderizado final, especialmente en resoluciones altas.
- TMUs (Texture Mapping Units):
  - Se especializan en aplicar texturas a las superficies 3D. Realizan operaciones como:
  - Muestreo de texturas (leer un valor de una imagen 2D).
  - Filtrado (bilineal, trilineal, anisotrópico).
  - Gestión de mipmaps (versiones reducidas de texturas para optimización).
  - Las TMUs están estrechamente ligadas a los núcleos de cómputo: cuando un shader solicita una textura, la TMU la recupera de la memoria gráfica y la entrega al núcleo.

En arquitecturas modernas, las fronteras entre estas unidades se han difuminado: los SM/CU gestionan gran parte del trabajo, pero las ROPs y TMUs siguen siendo componentes críticos para el rendimiento gráfico.

> Aunque hoy las GPU se usan ampliamente para IA y cómputo general, su arquitectura sigue estando influenciada por las necesidades del renderizado. Por eso, incluso en cargas de IA, el rendimiento depende de factores como el ancho de banda de memoria, la coalescencia de accesos y la ocupación de SM/CU —conceptos heredados del mundo gráfico.

## Quédate con...

- La GPU está construida con miles de núcleos simples (CUDA cores en NVIDIA, Stream Processors en AMD) organizados en bloques jerárquicos (SM o CU).
- Estos bloques ejecutan shaders (gráficos) o kernels (cómputo general) en paralelo, siguiendo el modelo SIMT.
- Las ROPs gestionan operaciones finales sobre píxeles (profundidad, blending); las TMUs aplican texturas de forma eficiente.
- La arquitectura gráfica subyacente (rasterización, pipeline de shaders) sigue influyendo en el diseño incluso en GPUs orientadas a IA.
- Para programar eficientemente en GPU, es clave entender cómo se distribuyen los hilos entre SM/CU y cómo se accede a la memoria —no basta con lanzar código paralelo.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/gpu/funcion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/gpu/memoria" class="next">Siguiente</a>
</div>
