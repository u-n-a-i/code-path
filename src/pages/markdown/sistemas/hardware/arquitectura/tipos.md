---
title: "Tipos de arquitecturas"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Tipos de arquitecturas](#tipos-de-arquitecturas)
  - [Qué son las arquitecturas](#qué-son-las-arquitecturas)
  - [Arquitectura x86 vs ARM](#arquitectura-x86-vs-arm)
  - [Sistemas de 32 y 64 bits](#sistemas-de-32-y-64-bits)
  - [CISC vs. RISC](#cisc-vs-risc)
  - [Arquitecturas paralelas](#arquitecturas-paralelas)
  - [Arquitecturas híbridas](#arquitecturas-híbridas)
  - [Multinúcleo](#multinúcleo)
  - [Quédate con...](#quédate-con)

</div>

# Tipos de arquitecturas

En informática, la arquitectura de un sistema se refiere al diseño estructural y funcional que define cómo se organizan y comunican sus componentes, especialmente en lo que respecta al procesador y su interfaz con el software. No todas las computadoras están construidas de la misma manera: distintas arquitecturas surgen para satisfacer necesidades específicas, ya sea rendimiento bruto, eficiencia energética, bajo costo o especialización en ciertos tipos de cómputo. Para un desarrollador, conocer las diferencias entre arquitecturas no solo es útil al depurar o optimizar código, sino también al decidir en qué plataformas desplegar una aplicación o cómo escribir código portable. Esta sección explora las principales categorías de arquitecturas modernas, desde los paradigmas de diseño CISC y RISC hasta los sistemas multinúcleo y híbridos que dominan hoy el mercado.

## Qué son las arquitecturas

La arquitectura de una computadora —más precisamente, la arquitectura de conjunto de instrucciones (ISA, por sus siglas en inglés)— define el lenguaje que entiende el procesador: qué instrucciones puede ejecutar, cómo se representan en memoria, cuántos registros tiene, cómo se accede a la memoria y qué modos de direccionamiento soporta. Es la interfaz contractual entre el hardware y el software de bajo nivel (compiladores, sistema operativo, firmware). Dos procesadores con la misma ISA pueden tener microarquitecturas muy distintas (por ejemplo, un Intel Core i7 y un AMD Ryzen comparten x86-64), pero ejecutan el mismo código binario. En cambio, procesadores con ISA distintas no son compatibles a nivel binario, aunque puedan ejecutar el mismo programa fuente tras recompilarlo.

## Arquitectura x86 vs ARM

Dos de las arquitecturas más influyentes en la actualidad son x86 (y su extensión de 64 bits, x86-64 o AMD64) y ARM.

x86 fue desarrollada originalmente por Intel en 1978 y domina en computadoras de escritorio, portátiles y servidores desde hace décadas. Es una arquitectura de tipo CISC (véase más adelante), con un conjunto de instrucciones amplio, complejo y altamente compatible hacia atrás (hasta el 8086 de 1978). Su fuerza está en el rendimiento bruto y la compatibilidad con software legado, aunque a costa de mayor consumo energético y complejidad del hardware.

ARM, por su parte, nació en los años 80 con un enfoque en simplicidad y eficiencia. Es una arquitectura RISC, diseñada para consumir poca energía, lo que la convirtió en el estándar de facto en dispositivos móviles (smartphones, tablets), embebidos y, cada vez más, en laptops (como los Mac con Apple Silicon) y servidores. ARM no vende chips, sino licencias de su ISA, lo que permite a empresas como Apple, Qualcomm o Samsung diseñar sus propios procesadores altamente optimizados.

Aunque históricamente x86 y ARM ocupaban nichos separados, la línea se ha difuminado: los chips M1/M2/M3 de Apple demuestran que ARM puede competir en rendimiento con x86 en escritorio, mientras que Intel y AMD han mejorado la eficiencia de sus diseños. Aun así, la elección de ISA sigue influyendo en el consumo, el rendimiento y la portabilidad del software.

## Sistemas de 32 y 64 bits

La distinción entre sistemas de 32 y 64 bits se refiere al ancho de las direcciones de memoria y de los registros generales del procesador.

En un sistema de 32 bits, la CPU puede direccionar hasta 4 GB de memoria (2³² bytes). Esto fue suficiente durante décadas, pero se volvió limitante con aplicaciones que manejan grandes conjuntos de datos (video, simulaciones, bases de datos). Además, los registros de 32 bits limitan el rango de valores enteros que se pueden procesar en una sola operación.

En un sistema de 64 bits, el espacio de direccionamiento teórico es inmenso (2⁶⁴ bytes, unos 16 exabytes), aunque en la práctica los sistemas operativos modernos usan solo 48 o 57 bits por razones de eficiencia. Esto permite usar cantidades prácticamente ilimitadas de RAM y mejora el rendimiento en aplicaciones que manipulan grandes estructuras de datos o usan cálculos numéricos intensivos.

La mayoría de los sistemas modernos son de 64 bits, y los compiladores generan código nativo para esa arquitectura. Sin embargo, algunos sistemas embebidos o de bajo costo aún usan 32 bits por simplicidad y menor consumo.

## CISC vs. RISC

Estos son dos paradigmas fundamentales en el diseño de ISAs:

CISC (Complex Instruction Set Computer) busca reducir el número de instrucciones por programa, ofreciendo instrucciones complejas que realizan múltiples operaciones en una sola. Por ejemplo, en x86, una sola instrucción puede cargar un valor de memoria, operarlo y almacenarlo de nuevo. Esto simplifica el trabajo del compilador, pero complica el hardware, que debe implementar decodificadores y unidades de control más sofisticados.

RISC (Reduced Instruction Set Computer) parte del principio opuesto: un conjunto pequeño de instrucciones simples y de duración uniforme, cada una ejecutable en un solo ciclo (o pocos). Las operaciones complejas se construyen combinando instrucciones simples. Esto simplifica el hardware, permite mayor paralelismo (por ejemplo, más unidades de ejecución) y mejora la eficiencia energética. ARM, RISC-V y las primeras versiones de SPARC y MIPS son ejemplos clásicos de RISC.

Curiosamente, las CPUs x86 modernas traducen internamente las instrucciones CISC complejas en microoperaciones simples (μops), actuando en la práctica como una capa RISC interna. Esto muestra que, en la práctica, la distinción se ha vuelto más difusa, aunque los principios de diseño siguen influyendo en la eficiencia y compatibilidad.

## Arquitecturas paralelas

Las arquitecturas paralelas están diseñadas explícitamente para ejecutar múltiples operaciones simultáneamente. Van más allá del simple multiprocesamiento y se clasifican según cómo organizan memoria y procesamiento:

- SMP (Symmetric Multiprocessing): múltiples CPUs o núcleos comparten la misma memoria principal y tienen acceso igual a todos los recursos. Es el modelo estándar en computadoras de escritorio y servidores modernos.

- MPP (Massively Parallel Processing): cientos o miles de nodos, cada uno con su propia CPU, memoria y almacenamiento, conectados por una red de alta velocidad. Usado en supercomputadoras y grandes clusters de datos.

- GPU computing: las GPUs están organizadas en miles de núcleos simples que ejecutan la misma instrucción sobre múltiples datos (SIMD, Single Instruction, Multiple Data). Ideal para cómputo gráfico, IA y simulaciones científicas.

## Arquitecturas híbridas

Una tendencia creciente es la integración de múltiples tipos de procesadores en un mismo sistema, dando lugar a arquitecturas híbridas. Por ejemplo:

- Los últimos procesadores Intel (serie 12ª generación en adelante) combinan núcleos de alto rendimiento (Performance-cores) y núcleos de alta eficiencia (Efficient-cores), inspirados en el diseño "big.LITTLE" de ARM. El sistema operativo asigna tareas según su naturaleza: tareas interactivas a los núcleos rápidos, tareas en segundo plano a los eficientes.
- Los SoCs (System on a Chip) de smartphones integran CPU, GPU, NPU (unidad de procesamiento neuronal para IA), DSP (procesador de señal) y otros aceleradores en un solo chip, cada uno especializado en un tipo de cómputo.
- Las placas de desarrollo como NVIDIA Jetson o Raspberry Pi combinan CPU generalista con GPU o FPGA para aplicaciones de robótica o visión por computadora.

Estas arquitecturas exigen que el software esté diseñado para delegar tareas al componente adecuado, lo que impulsa el uso de APIs como OpenCL, CUDA o SYCL.

## Multinúcleo

El multinúcleo es la forma más común de paralelismo en sistemas de propósito general. Consiste en integrar dos o más núcleos de CPU en un solo chip (o die), compartiendo recursos como la caché L3 o el controlador de memoria. A diferencia de sistemas multiprocesador tradicionales (con chips separados), el multinúcleo reduce la latencia de comunicación entre núcleos y mejora la eficiencia energética.

Hoy es raro encontrar un procesador de consumo con un solo núcleo: desde smartphones hasta servidores, todos incluyen múltiples núcleos (4, 8, 16 o más). Sin embargo, para aprovecharlos, el software debe ser multihilo. Un programa secuencial solo usará un núcleo, desperdiciando el resto. Por eso, lenguajes y bibliotecas modernas (como Go, Rust, Java con Fork/Join, o C++ con std::thread) facilitan la escritura de código concurrente.

> El rendimiento no escala linealmente con el número de núcleos. La sobrecarga de sincronización, la contención por recursos compartidos (memoria, caché) y la fracción secuencial del código (ley de Amdahl) imponen límites prácticos al paralelismo.

## Quédate con...

- La arquitectura de conjunto de instrucciones (ISA) define la interfaz entre hardware y software de bajo nivel.
- x86 domina en escritorio/servidores (alto rendimiento, CISC), mientras que ARM lidera en móviles y embebidos (alta eficiencia, RISC), aunque las fronteras se difuminan.
- Los sistemas de 64 bits superan las limitaciones de memoria de los de 32 bits y son el estándar actual.
- CISC usa instrucciones complejas; RISC, instrucciones simples y uniformes. Las CPUs modernas combinan ambos enfoques internamente.
- Las arquitecturas paralelas (SMP, MPP, GPU) ejecutan múltiples operaciones simultáneamente, cada una para distintos escenarios.
- Las arquitecturas híbridas integran núcleos o aceleradores especializados (CPU + GPU + NPU) para optimizar distintos tipos de carga de trabajo.
- El multinúcleo es ubicuo, pero requiere software concurrente para aprovecharse; sin hilos, solo se usa una fracción del poder disponible.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/arquitectura/paralelismo" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
