---
title: "Componentes internos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Componentes internos](#componentes-internos)
  - [Núcleos](#núcleos)
  - [Hilos](#hilos)
  - [Threads (Hilos)](#threads-hilos)
  - [CU (Unidad de Control)](#cu-unidad-de-control)
  - [ALU (Unidad Aritmético-Lógica)](#alu-unidad-aritmético-lógica)
  - [Unidades de control y ejecución](#unidades-de-control-y-ejecución)
  - [Reloj](#reloj)
  - [IPC (Instrucciones Por Ciclo)](#ipc-instrucciones-por-ciclo)
  - [Factores que mejoran el IPC:](#factores-que-mejoran-el-ipc)
  - [Quédate con...](#quédate-con)

</div>

# Componentes internos

Dentro de la carcasa de una CPU moderna —a menudo más pequeña que una moneda— reside un ecosistema de componentes altamente especializados que trabajan en conjunto para ejecutar millones de instrucciones por segundo. Estos elementos no son abstractos: cada núcleo, unidad funcional o señal de reloj tiene un papel concreto en cómo se traduce tu código fuente en resultados reales. Para un desarrollador, comprender estos componentes internos permite no solo apreciar la ingeniería detrás del hardware, sino también escribir software que aproveche mejor la arquitectura subyacente: desde la paralelización eficaz hasta la optimización de la localidad de datos. Esta sección desglosa las piezas fundamentales que constituyen una CPU moderna.

## Núcleos

Un núcleo (core) es una unidad de procesamiento independiente dentro de una CPU. Cada núcleo puede ejecutar su propio flujo de instrucciones, tiene sus propios registros, su propia ALU y, en muchos casos, su propia caché L1 y L2. Las CPUs modernas son multinúcleo: desde 2 núcleos en dispositivos básicos hasta 128 en servidores de última generación. Esto permite la verdadera ejecución paralela de múltiples hilos o procesos, algo que el sistema operativo gestiona mediante la planificación de tareas.

La presencia de múltiples núcleos no garantiza automáticamente un mejor rendimiento: el software debe estar diseñado para usarlos (mediante hilos, procesos o tareas asíncronas). Un programa secuencial solo usará un núcleo, sin importar cuántos tenga la CPU.

## Hilos

Un hilo (thread) es la unidad más pequeña de ejecución que puede gestionar el sistema operativo. Cada proceso puede contener uno o más hilos, que comparten el espacio de memoria del proceso pero tienen sus propios registros y puntero de instrucción. Los hilos permiten que una aplicación realice múltiples tareas aparentemente al mismo tiempo (por ejemplo, descargar un archivo mientras se renderiza una interfaz).

## Threads (Hilos)

En el contexto del hardware, el término thread también se refiere a la capacidad de un núcleo para mantener el estado de múltiples flujos de ejecución simultáneamente. Esto se conoce como hyper-threading (Intel) o SMT (Simultaneous Multithreading, en AMD y otros). Por ejemplo, un núcleo con SMT puede ejecutar dos hilos al mismo tiempo, alternando entre ellos en cada ciclo si uno está esperando datos de memoria. Aunque no duplica el rendimiento, mejora la utilización de las unidades de ejecución, especialmente en cargas con alta latencia (como E/S o acceso a memoria).

Así, una CPU de 8 núcleos con SMT puede presentar 16 hilos lógicos al sistema operativo, permitiendo una mejor concurrencia.

## CU (Unidad de Control)

La Unidad de Control (CU, por sus siglas en inglés) es el componente que dirige el funcionamiento de la CPU. Su misión es:

- Leer la siguiente instrucción del programa desde la memoria (fase fetch).
- Decodificarla para determinar qué operación realizar y qué operandos usar (fase decode).
- Generar las señales de control necesarias para coordinar la ALU, los registros, la caché y los buses (fase execute).
- La CU no realiza cálculos; actúa como el “director de orquesta” que asegura que cada parte del núcleo haga su trabajo en el momento correcto.

## ALU (Unidad Aritmético-Lógica)

La Unidad Aritmético-Lógica (ALU) es el componente que realiza las operaciones reales: sumas, restas, comparaciones, operaciones lógicas (AND, OR, XOR), desplazamientos de bits, etc. Una CPU moderna puede tener múltiples ALUs dentro de un mismo núcleo para permitir la ejecución de varias operaciones simples en paralelo. Además, muchas CPUs incluyen unidades especializadas:

- FPU (Floating-Point Unit): para operaciones en coma flotante (aunque hoy suelen estar integradas en la ALU).
- Unidades SIMD (Single Instruction, Multiple Data): para operaciones vectoriales (como SSE, AVX en x86 o NEON en ARM), usadas en procesamiento de multimedia, IA y simulaciones científicas.

## Unidades de control y ejecución

Más allá de la CU y la ALU, los núcleos modernos contienen un conjunto de unidades de ejecución especializadas, gestionadas por un despachador (scheduler) dentro de la unidad de control:

- Unidades de carga/almacenamiento: manejan el acceso a memoria (lectura y escritura).
- Unidades de salto: predicen y gestionan saltos condicionales (crucial para mantener el pipeline lleno).
- Unidades enteras y de punto flotante: optimizadas para distintos tipos de operaciones.

Estas unidades trabajan en paralelo gracias a técnicas como la ejecución fuera de orden (out-of-order execution): si una instrucción está lista para ejecutarse (sus operandos están disponibles), se ejecuta incluso si no es la siguiente en el programa original, siempre que no altere el resultado final.

## Reloj

El reloj de la CPU es una señal eléctrica oscilante que sincroniza todas las operaciones internas. Se mide en hercios (Hz): una CPU de 3.5 GHz tiene 3.500 millones de ciclos por segundo. En cada ciclo, las unidades de la CPU pueden realizar una parte de una operación (por ejemplo, leer un registro o enviar una señal).

Sin embargo, no todas las instrucciones tardan un ciclo. Algunas (como una suma entera) pueden completarse en un ciclo, mientras que otras (como una división o un acceso a memoria no caché) pueden tardar decenas o cientos. Por eso, la frecuencia de reloj no es el único indicador de rendimiento.

Además, las CPUs modernas usan frecuencias dinámicas: aumentan el reloj bajo carga (turbo boost) y lo reducen en reposo para ahorrar energía.

## IPC (Instrucciones Por Ciclo)

IPC (Instructions Per Cycle) es una métrica clave que mide cuántas instrucciones completa la CPU, en promedio, por cada ciclo de reloj. Un IPC alto indica que la CPU está utilizando eficientemente sus recursos (pipelines llenos, poca espera por memoria, buen aprovechamiento del paralelismo).

## Factores que mejoran el IPC:

- Pipelining profundo: permite superponer muchas instrucciones.
- Ejecución fuera de orden: mantiene las unidades ocupadas incluso con dependencias.
- Predicción de saltos precisa: evita vaciar el pipeline innecesariamente.
- Alta localidad de datos: mantiene los operandos en caché, evitando esperas.

Dos CPUs con la misma frecuencia pueden tener rendimientos muy distintos si una tiene mayor IPC. De hecho, muchas mejoras en arquitectura moderna (como las de Intel Core o AMD Zen) se centran en aumentar el IPC, no solo en subir la frecuencia.

> Aunque tú, como programador, no controlas directamente el IPC, tu código sí lo influye. Evitar saltos impredecibles (como if con patrones aleatorios), usar estructuras de datos contiguas (para caché) y minimizar dependencias de datos ayuda a que la CPU mantenga un IPC alto.

## Quédate con...

- Un núcleo es una unidad de procesamiento independiente; una CPU puede tener varios.
- Un hilo lógico es un flujo de ejecución gestionado por el SO; el hardware puede ejecutar varios por núcleo mediante SMT/hyper-threading.
- La Unidad de Control (CU) dirige la ejecución; la ALU realiza operaciones aritméticas y lógicas.
- Las unidades de ejecución especializadas (carga, salto, SIMD) permiten paralelismo a nivel de instrucción.
- El reloj sincroniza las operaciones, pero el rendimiento real depende del IPC (instrucciones por ciclo).
- Escribir código con buena localidad y patrones de control predecibles mejora el IPC y, por tanto, el rendimiento, incluso sin cambiar el algoritmo.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/cpu/cpu" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/cpu/ciclo" class="next">Siguiente</a>
</div>
