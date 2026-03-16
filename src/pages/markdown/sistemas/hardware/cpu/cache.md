---
title: "La jerarquía de caché"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [La jerarquía de caché](#la-jerarquía-de-caché)
  - [Caché L1, L2, L3](#caché-l1-l2-l3)
    - [Caché L1 (Level 1)](#caché-l1-level-1)
    - [Caché L2 (Level 2)](#caché-l2-level-2)
    - [Caché L3 (Level 3)](#caché-l3-level-3)
  - [Latencia y velocidad](#latencia-y-velocidad)
  - [Importancia para el rendimiento](#importancia-para-el-rendimiento)
  - [Quédate con...](#quédate-con)

</div>

# La jerarquía de caché

En la arquitectura moderna de computadoras, existe una brecha abismal entre la velocidad de la CPU y la de la memoria principal (RAM). Mientras una CPU puede ejecutar operaciones en menos de un nanosegundo, acceder a la RAM puede tomar decenas o incluso cientos de ciclos de reloj. Si la CPU tuviera que esperar a la RAM en cada acceso, pasaría la mayor parte del tiempo inactiva. Para paliar este problema, las CPUs incorporan una jerarquía de caché: una serie de memorias pequeñas, ultrarrápidas y costosas integradas directamente en el chip del procesador. Estas memorias actúan como un almacén temporal para los datos e instrucciones que la CPU es probable que necesite próximamente.

## Caché L1, L2, L3

La jerarquía de caché se organiza en niveles, cada uno con mayores capacidades pero mayor latencia:

### Caché L1 (Level 1)

- Tamaño: muy pequeño, típicamente 32–64 KB por núcleo (a menudo dividido en L1i para instrucciones y L1d para datos).
- Ubicación: integrada directamente en el núcleo de ejecución, en el mismo bloque lógico que la ALU y los registros.
- Latencia: extremadamente baja, de 1 a 4 ciclos de reloj.
- Características: de acceso más rápido, pero con tamaño limitado. Es la primera en ser consultada por la CPU. Si el dato está aquí (hit), se devuelve inmediatamente; si no (miss), se busca en L2.

### Caché L2 (Level 2)

- Tamaño: mayor que L1, típicamente 256 KB a 1 MB por núcleo.
- Ubicación: todavía dentro del chip de la CPU, pero ligeramente más alejada del núcleo que L1.
- Latencia: moderada, de 10 a 20 ciclos.
- Características: actúa como un tampón entre L1 y L3. En algunas arquitecturas (como AMD Zen), L2 también incluye funciones de prebúsqueda (prefetching) para anticipar accesos futuros.

### Caché L3 (Level 3)

- Tamaño: mucho más grande, de 8 MB a 128 MB o más, y compartida entre todos los núcleos del chip.
- Ubicación: en el mismo die que los núcleos, pero en una región común (a veces llamada last-level cache, LLC).
- Latencia: más alta, de 30 a 50 ciclos (o más, dependiendo del diseño).
- Características: al ser compartida, facilita la coherencia de caché en sistemas multinúcleo y permite que los núcleos accedan a datos generados por otros sin ir a RAM. También almacena bloques de datos prefijados por el hardware.

En CPUs de servidores o de gama alta, puede haber incluso una caché L4 (generalmente implementada con memoria eDRAM), aunque es rara en sistemas de consumo.

## Latencia y velocidad

La latencia es el tiempo que tarda la CPU en obtener un dato desde un nivel de memoria. Comparativamente:

| Nivel        | Latencia típica (ciclos) | Ancho de banda | Tamaño típico         |
| ------------ | ------------------------ | -------------- | --------------------- |
| Registros    | 0–1                      | Muy alto       | < 1 KB                |
| Caché L1     | 1–4                      | Alto           | 32–64 KB/núcleo       |
| Caché L2     | 10–20                    | Medio-alto     | 256 KB–1 MB/núcleo    |
| Caché L3     | 30–50+                   | Medio          | 8–128 MB (compartida) |
| RAM (DDR4/5) | 200–300+                 | Alto           | 8–128 GB              |
| SSD NVMe     | 10.000–100.000+          | Muy alto       | 256 GB–8 TB           |

Estas diferencias son tan grandes que un solo miss en L1 puede costar decenas de veces más que un hit. Por eso, el diseño de algoritmos y estructuras de datos debe priorizar la localidad para maximizar los aciertos en caché.

## Importancia para el rendimiento

La caché es, con diferencia, uno de los factores más influyentes en el rendimiento real de un programa. Dos algoritmos con la misma complejidad algorítmica (por ejemplo, O(n log n)) pueden tener tiempos de ejecución radicalmente distintos si uno respeta la localidad de datos y el otro no.

- Localidad temporal: si un dato se usa, probablemente se usará de nuevo pronto. La caché lo mantiene cerca para reutilizarlo.
- Localidad espacial: si se accede a una dirección de memoria, es probable que se accedan direcciones cercanas. La caché carga bloques completos (típicamente 64 bytes) para anticiparse.

Ejemplos prácticos:

- Recorrer una matriz por filas en C (lenguaje con almacenamiento fila-mayor) es mucho más rápido que por columnas, porque se respeta la localidad espacial.
- Usar std::vector en lugar de std::list para colecciones pequeñas mejora el rendimiento porque los elementos están contiguos en memoria, no dispersos en el heap.
- Evitar estructuras de datos con punteros innecesarios (como árboles con nodos separados) reduce los misses de caché.

Además, en sistemas multinúcleo, el acceso concurrente a la misma caché L3 puede generar contención, y la coherencia de caché (protocolos como MESI) introduce sobrecarga si muchos núcleos modifican los mismos datos.

> Aunque no gestionas directamente la caché, puedes influir en su eficiencia. Técnicas como el cache blocking (dividir matrices en bloques que caben en L1/L2) o el uso de estructuras cache-friendly son comunes en bibliotecas de alto rendimiento (como BLAS o NumPy).

## Quédate con...

- La jerarquía de caché (L1, L2, L3) mitiga la brecha de velocidad entre CPU y RAM mediante memorias rápidas y cercanas al núcleo.
- L1 es la más rápida y pequeña; L3 es más lenta pero grande y compartida entre núcleos.
- La latencia aumenta drásticamente al bajar en la jerarquía: un acceso a RAM puede ser 50–100 veces más lento que a L1.
- El rendimiento de tu código depende más de cómo usa la caché que de la complejidad algorítmica en muchos casos reales.
- Diseñar con localidad temporal y espacial —estructuras contiguas, accesos secuenciales, reutilización de datos— maximiza los aciertos en caché y mejora el rendimiento sin cambiar la lógica.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/cpu/ciclo" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/cpu/frecuencia" class="next">Siguiente</a>
</div>
