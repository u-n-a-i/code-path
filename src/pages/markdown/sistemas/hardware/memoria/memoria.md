---
title: "Concepto de memoria"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Concepto de memoria](#concepto-de-memoria)
  - [Memoria](#memoria)
  - [Memoria vs almacenamiento](#memoria-vs-almacenamiento)
  - [Volatilidad](#volatilidad)
  - [Latencia](#latencia)
  - [Frecuencia](#frecuencia)
  - [Ancho de banda](#ancho-de-banda)
  - [Jerarquía de memoria](#jerarquía-de-memoria)
  - [Quédate con...](#quédate-con)

</div>

# Concepto de memoria

En informática, el término memoria se refiere a los sistemas que almacenan datos de forma temporal o permanente para su procesamiento inmediato o futuro. Sin embargo, no toda la memoria es igual: existe una distinción fundamental entre memoria volátil de acceso rápido (usada durante la ejecución de programas) y almacenamiento persistente (para guardar datos a largo plazo). Comprender esta diferencia, junto con conceptos como latencia, frecuencia, ancho de banda y la jerarquía de memoria, es esencial para cualquier desarrollador, ya que influye directamente en el rendimiento, la eficiencia energética y la fiabilidad de las aplicaciones. Un algoritmo bien diseñado no solo es elegante en su lógica, sino que también respeta la arquitectura de memoria del sistema en el que se ejecuta.

## Memoria

En sentido estricto, la memoria en una computadora moderna suele referirse a la memoria principal o RAM (Random Access Memory), un componente volátil que almacena los datos e instrucciones que la CPU necesita acceder de forma inmediata y frecuente durante la ejecución de un programa. La RAM permite lecturas y escrituras en cualquier dirección en un tiempo constante (de ahí “acceso aleatorio”), lo que la hace ideal como área de trabajo activa para el sistema operativo, las aplicaciones y los procesos en ejecución.

## Memoria vs almacenamiento

A menudo se confunden ambos términos, pero cumplen roles distintos:

- Memoria (RAM):
  - Volátil: pierde su contenido al apagar el sistema.
  - Rápida: latencias de nanosegundos, accesible directamente por la CPU.
  - Función: espacio de trabajo temporal para programas en ejecución.
- Almacenamiento (HDD, SSD, etc.):
  - Persistente: conserva los datos sin energía.
  - Lento: accesos de microsegundos (SSD) a milisegundos (HDD).
  - Función: guardar el sistema operativo, aplicaciones, archivos y datos a largo plazo.

La CPU no ejecuta código directamente desde el almacenamiento; primero lo carga en RAM. Esta separación es fundamental para el rendimiento: si la CPU tuviera que esperar al disco en cada operación, los sistemas serían inutilizables.

## Volatilidad

La volatilidad se refiere a si un medio de memoria conserva su contenido sin energía eléctrica.

- Volátil: RAM (DRAM, SRAM). Requiere refresco constante; al apagarse, todos los datos se pierden.
- No volátil: ROM, flash, SSD, HDD. Los datos persisten tras el apagado.

Esta propiedad determina el uso de cada tipo: la volatilidad de la RAM permite velocidades extremas, mientras que la no volatilidad del almacenamiento garantiza la persistencia de la información.

## Latencia

La latencia es el tiempo que transcurre entre que la CPU solicita un dato y que este es entregado. Se mide en nanosegundos (ns) y es crítica para el rendimiento. Por ejemplo:

- RAM DDR4: latencia típica de 14–16 ns.
- SSD NVMe: ~100 µs (microsegundos) → 100.000 ns.
- HDD: ~10 ms (milisegundos) → 10.000.000 ns.

Una alta latencia obliga a la CPU a esperar, desperdiciando ciclos. Por eso, la jerarquía de memoria (con cachés ultrarrápidas) busca minimizar los accesos a RAM y, sobre todo, al almacenamiento.

## Frecuencia

La frecuencia de la memoria (medida en MHz) indica cuántas transferencias de datos puede realizar por segundo. Por ejemplo, una RAM DDR4-3200 opera a 1600 MHz, pero gracias a la tecnología DDR (Double Data Rate), realiza 3200 transferencias por segundo.

Sin embargo, la frecuencia no es el único factor de rendimiento. Una RAM de alta frecuencia pero alta latencia (por ejemplo, CL22) puede ser más lenta en ciertos escenarios que una de menor frecuencia pero menor latencia (CL14). El equilibrio entre frecuencia y timings determina el rendimiento real.

## Ancho de banda

El ancho de banda es la cantidad total de datos que puede transferirse entre la memoria y la CPU por segundo, medido en GB/s. Depende de:

- La frecuencia de la memoria.
- El ancho del bus (64 bits en sistemas de escritorio).
- El número de canales (dual channel duplica el ancho de banda respecto a single channel).

Por ejemplo, DDR4-3200 en dual channel ofrece ~51 GB/s de ancho de banda, mientras que DDR5-6000 supera los 90 GB/s. Un ancho de banda insuficiente limita el rendimiento en aplicaciones que procesan grandes volúmenes de datos (IA, video, simulaciones).

## Jerarquía de memoria

La jerarquía de memoria es una organización estratificada que equilibra velocidad, capacidad y costo. Va desde lo más rápido y caro hasta lo más lento y económico:

1. Registros (en la CPU): acceso en 0–1 ciclo, capacidad mínima (<1 KB).
1. Caché L1: 1–4 ciclos, 32–64 KB por núcleo.
1. Caché L2: 10–20 ciclos, 256 KB–1 MB por núcleo.
1. Caché L3: 30–50 ciclos, 8–128 MB compartida.
1. RAM (memoria principal): 200–300 ciclos, 8–128 GB.
1. Almacenamiento (SSD/HDD): millones de ciclos, terabytes.

Cada nivel actúa como un cache para el siguiente. La CPU intenta mantener los datos más utilizados en los niveles superiores, aprovechando los principios de localidad (temporal y espacial). Un programa que accede a datos de forma secuencial y reutiliza variables frecuentemente tendrá muchos hits en caché y será mucho más rápido que uno con accesos dispersos, incluso si ambos hacen el mismo número de operaciones.

> Como desarrollador, no controlas directamente la jerarquía, pero sí puedes influir en ella. Usar estructuras de datos contiguas (arrays en lugar de listas enlazadas), recorrer matrices en el orden correcto y minimizar saltos en la memoria mejora la localidad y, por tanto, el rendimiento real.

## Quédate con...

- La memoria (RAM) es volátil, rápida y usada como área de trabajo; el almacenamiento es persistente y lento.
- Volatilidad define si los datos se pierden al apagarse; latencia es el tiempo de acceso; frecuencia y ancho de banda determinan la velocidad de transferencia.
- La jerarquía de memoria (registros → caché → RAM → disco) equilibra velocidad y costo; la CPU depende de ella para evitar esperas.
- El rendimiento real depende más de cómo usas la memoria que de la frecuencia nominal: la localidad es clave.
- Diseñar software consciente de la memoria —evitando accesos aleatorios y maximizando la reutilización— produce mejoras de rendimiento mayores que muchas optimizaciones algorítmicas.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/memoria/ram" class="next">Siguiente</a>
</div>
