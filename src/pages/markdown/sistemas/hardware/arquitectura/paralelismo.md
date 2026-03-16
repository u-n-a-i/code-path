---
title: "Paralelismo y rendimiento"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Paralelismo y rendimiento](#paralelismo-y-rendimiento)
  - [Paralelismo a nivel de instrucción](#paralelismo-a-nivel-de-instrucción)
  - [Multitarea y multiprocesamiento](#multitarea-y-multiprocesamiento)
    - [Multitarea (time-sharing)](#multitarea-time-sharing)
    - [Multiprocesamiento](#multiprocesamiento)
  - [Conceptos básicos de rendimiento](#conceptos-básicos-de-rendimiento)
  - [Quédate con...](#quédate-con)

</div>

# Paralelismo y rendimiento

En la era actual, donde los usuarios esperan respuestas instantáneas y los sistemas manejan cantidades masivas de datos, el rendimiento de una computadora ya no depende únicamente de la velocidad de un solo núcleo de procesamiento. Desde mediados de la década de 2000, el aumento de la frecuencia de reloj de las CPUs se estancó debido a límites físicos como el consumo de energía y la disipación térmica. Como respuesta, la industria del hardware giró hacia el paralelismo: ejecutar múltiples operaciones al mismo tiempo, ya sea dentro de una misma CPU, entre varios núcleos, o incluso entre distintos dispositivos. Para un desarrollador de software, comprender cómo funciona el paralelismo y cómo medir el rendimiento no es un lujo, sino una necesidad. Te permite escribir aplicaciones que aprovechen plenamente los recursos modernos, eviten cuellos de botella y ofrezcan una experiencia fluida al usuario.

## Paralelismo a nivel de instrucción

El paralelismo a nivel de instrucción (ILP, por sus siglas en inglés) busca ejecutar múltiples instrucciones de un mismo hilo de programa de forma simultánea, sin que el programador tenga que hacer nada explícito. Las CPUs modernas logran esto mediante técnicas avanzadas integradas en su microarquitectura:

- Pipelining: como se vio anteriormente, permite superponer las fases de fetch, decode y execute de distintas instrucciones, acercando el ideal de una instrucción completada por ciclo de reloj.
- Ejecución fuera de orden (out-of-order execution): la CPU analiza las instrucciones pendientes y, si no tienen dependencias entre sí, las ejecuta en un orden distinto al del programa original para mantener ocupadas sus unidades funcionales.
- Predicción de saltos (branch prediction): anticipa si un salto condicional (como un if) se tomará o no, permitiendo que el pipeline siga llenándose incluso antes de conocer el resultado real. Si la predicción falla, se descartan las instrucciones incorrectas (una penalización costosa, pero menos que esperar).
- Unidades de ejecución múltiples: una CPU puede tener varias ALUs, unidades de carga/almacenamiento y unidades de punto flotante, permitiendo que varias instrucciones se procesen en paralelo si no compiten por los mismos recursos.

Este tipo de paralelismo es completamente transparente al programador: tu código en C++, Python o Java se beneficia de él sin cambios. Sin embargo, estructurar tu código para minimizar dependencias de datos (por ejemplo, evitando que cada instrucción dependa de la anterior) permite que el hardware aproveche mejor estas técnicas.

## Multitarea y multiprocesamiento

Más allá del paralelismo interno de una CPU, los sistemas operativos y las arquitecturas modernas permiten ejecutar múltiples flujos de trabajo simultáneamente, lo que se conoce como concurrencia. Esta se implementa de varias formas:

### Multitarea (time-sharing)

En un sistema con un solo núcleo, el sistema operativo crea la ilusión de ejecución simultánea mediante la multitarea. Alterna rápidamente entre procesos o hilos, asignando a cada uno un pequeño intervalo de tiempo (un quantum). Aunque solo uno se ejecuta en cada instante, el cambio es tan rápido que al usuario le parece paralelo. Esta técnica es fundamental para la interactividad en sistemas como servidores web o entornos de escritorio.

### Multiprocesamiento

Con la llegada de CPUs multinúcleo, ya no se trata solo de una ilusión: varios núcleos físicos pueden ejecutar hilos realmente en paralelo. Esto se conoce como multiprocesamiento simétrico (SMP). Un programa diseñado con múltiples hilos (por ejemplo, usando std::thread en C++ o ThreadPoolExecutor en Python) puede distribuir su carga entre los núcleos disponibles, logrando un verdadero aumento de rendimiento.

Además, existen arquitecturas con múltiples CPUs (común en servidores) o sistemas heterogéneos que combinan CPU + GPU + aceleradores (como en smartphones o estaciones de IA). En estos casos, el paralelismo se extiende más allá de la CPU: por ejemplo, una GPU puede procesar millones de píxeles o tensores en paralelo, mientras la CPU gestiona la lógica de la aplicación.

> Para aprovechar el multiprocesamiento, el software debe estar diseñado explícitamente para la concurrencia. Esto introduce desafíos como la sincronización, las condiciones de carrera y la coherencia de caché, que requieren herramientas como mutexes, semáforos o modelos de memoria atómica.

## Conceptos básicos de rendimiento

El rendimiento de un sistema no es una métrica única, sino un equilibrio entre varios factores. Los más relevantes para un desarrollador son:

- Tiempo de ejecución (elapsed time): el tiempo real que tarda un programa en completarse desde el punto de vista del usuario. Es la métrica más intuitiva y la que más le importa al usuario final.
- Throughput (rendimiento): la cantidad de trabajo completado por unidad de tiempo (por ejemplo, solicitudes HTTP por segundo en un servidor). Es clave en sistemas de alta demanda.
- Latencia: el tiempo entre una solicitud y su respuesta. En aplicaciones interactivas (videojuegos, interfaces gráficas), una latencia baja es más importante que un alto throughput.
- Uso de recursos: incluye consumo de CPU, memoria, ancho de banda de E/S y energía. Un programa eficiente no solo es rápido, sino que usa los recursos de forma equilibrada.

Una regla fundamental en optimización es la ley de Amdahl: el speedup total que se puede lograr al paralelizar una parte de un programa está limitado por la fracción que no se puede paralelizar. Por ejemplo, si el 20% del código es inherentemente secuencial, el máximo speedup teórico, incluso con infinitos núcleos, es 5×. Esto subraya que la optimización debe comenzar identificando los cuellos de botella reales (con perfiles o profiling) en lugar de asumir qué parte del código es lenta.

> No todo se beneficia del paralelismo. Algoritmos con alta dependencia secuencial (como muchos recorridos de árboles o algoritmos criptográficos) no escalan bien con más núcleos. En esos casos, la optimización debe enfocarse en mejorar la localidad, reducir accesos a memoria o vectorizar operaciones.

## Quédate con...

- El paralelismo a nivel de instrucción (ILP) permite que una CPU ejecute múltiples instrucciones en paralelo dentro de un mismo hilo, mediante técnicas como pipelining, ejecución fuera de orden y predicción de saltos.
- La multitarea simula concurrencia en un solo núcleo, mientras que el multiprocesamiento permite ejecución verdaderamente paralela en múltiples núcleos o CPUs.
- Para aprovechar el multiprocesamiento, el software debe estar diseñado con concurrencia explícita (hilos, tareas), lo que introduce desafíos de sincronización.
- Las métricas clave de rendimiento son tiempo de ejecución, throughput, latencia y uso de recursos.
- La ley de Amdahl recuerda que la parte secuencial de un programa limita el beneficio del paralelismo; por eso, el profiling es esencial antes de optimizar.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/arquitectura/jerarquia" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/arquitectura/tipos" class="next">Siguiente</a>
</div>
