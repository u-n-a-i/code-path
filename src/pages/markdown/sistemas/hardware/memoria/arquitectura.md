---
title: "Arquitectura de memoria"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Arquitectura de memoria](#arquitectura-de-memoria)
  - [Niveles L1, L2, L3: ubicación y función](#niveles-l1-l2-l3-ubicación-y-función)
  - [Single Channel](#single-channel)
  - [Dual Channel](#dual-channel)
  - [Quad Channel](#quad-channel)
  - [El concepto de interleaving](#el-concepto-de-interleaving)
  - [Quédate con...](#quédate-con)

</div>

# Arquitectura de memoria

La arquitectura de memoria de un sistema moderno no se limita a los módulos de RAM instalados en la placa base; es un ecosistema integrado que va desde los registros de la CPU hasta los canales de memoria múltiples, pasando por cachés jerárquicas y controladores inteligentes. Esta arquitectura está diseñada para minimizar la brecha entre la velocidad de la CPU y la latencia de la memoria principal. Comprender cómo se organizan los niveles de caché, cómo funcionan los canales de memoria y qué papel juega el interleaving permite a un desarrollador escribir código que no solo sea lógicamente correcto, sino también eficiente desde el punto de vista del hardware. En aplicaciones de alto rendimiento —como simulaciones, procesamiento de señales o IA—, aprovechar esta arquitectura puede marcar la diferencia entre un sistema usable y uno impracticable.

## Niveles L1, L2, L3: ubicación y función

La jerarquía de caché está integrada directamente en el chip de la CPU y actúa como un tampón ultrarrápido entre los núcleos y la RAM:

- Caché L1:
  - Ubicación: dentro de cada núcleo de CPU.
  - Función: almacena instrucciones (L1i) y datos (L1d) que se usarán inmediatamente.
  - Características: 32–64 KB por núcleo, latencia de 1–4 ciclos, muy alta velocidad.
- Caché L2:
  - Ubicación: también dentro del núcleo, pero ligeramente más alejada que L1.
  - Función: actúa como un segundo nivel de almacenamiento para datos e instrucciones que no caben en L1.
  - Características: 256 KB–1 MB por núcleo, latencia de 10–20 ciclos.
- Caché L3:
  - Ubicación: compartida entre todos los núcleos del chip (last-level cache).
  - Función: almacena datos reutilizados por múltiples núcleos y actúa como punto de coherencia en sistemas multinúcleo.
  - Características: 8–128 MB, latencia de 30–50+ ciclos, más lenta pero mucho más grande.

Estos niveles funcionan de forma automática: si la CPU no encuentra un dato en L1 (miss), lo busca en L2, luego en L3 y, finalmente, en RAM. Cada fallo cuesta decenas o cientos de ciclos, por lo que maximizar los aciertos en caché es clave para el rendimiento.

## Single Channel

En modo single channel, la CPU accede a la memoria a través de un solo canal de 64 bits. Este es el modo más básico y se usa cuando:

- Solo hay un módulo de RAM instalado.
- Los módulos están instalados en ranuras no emparejadas.
- La placa base o CPU no soporta dual channel.

El ancho de banda está limitado al máximo teórico de un solo módulo (por ejemplo, ~25 GB/s para DDR4-3200). Este modo es suficiente para tareas ligeras, pero limita el rendimiento en aplicaciones con alta demanda de memoria.

## Dual Channel

El dual channel duplica el ancho del bus de memoria a 128 bits, utilizando dos módulos idénticos instalados en ranuras específicas (generalmente del mismo color). La CPU puede leer/escribir datos desde/hacia ambos módulos simultáneamente.

- Beneficio: casi duplica el ancho de banda (por ejemplo, ~51 GB/s para DDR4-3200).
- Requisito: módulos con misma capacidad, velocidad y timings (aunque no necesariamente misma marca).
- Impacto: mejora significativa en aplicaciones que usan grandes volúmenes de datos: renderizado, compilación, bases de datos, IA.

La mayoría de placas de escritorio modernas activan el dual channel automáticamente si se instalan dos módulos en las ranuras correctas.

## Quad Channel

El quad channel amplía el concepto a cuatro módulos, cuadruplicando el ancho del bus a 256 bits. Es común en:

- Plataformas HEDT (High-End Desktop), como Intel X299 o AMD TRX40.
- Servidores con CPUs como AMD EPYC o Intel Xeon Scalable.
- Ancho de banda: puede superar los 100 GB/s (por ejemplo, DDR4-3200 en quad channel: ~102 GB/s).
- Uso: crítico en centros de datos, simulación científica, entrenamiento de modelos grandes.

En escritorio estándar (plataformas AM5, LGA 1700), no está disponible: solo dual channel.

## El concepto de interleaving

El interleaving (entrelazado) es una técnica que distribuye los datos alternadamente entre múltiples módulos o bancos de memoria. Por ejemplo, en dual channel:

- Direcciones pares → módulo 1.
- Direcciones impares → módulo 2.

Esto permite que accesos secuenciales (muy comunes en código bien estructurado) se sirvan desde ambos módulos en paralelo, aumentando el ancho de banda efectivo y reduciendo la contención.

El interleaving puede ocurrir a distintos niveles:

- A nivel de canal: entre módulos (dual/quad channel).
- A nivel de banco: dentro de un mismo módulo, entre sus chips internos.

El controlador de memoria (integrado en la CPU) gestiona automáticamente el interleaving. Sin embargo, su eficacia depende de que el software acceda a la memoria de forma secuencial y alineada. Accesos aleatorios o dispersos reducen sus beneficios.

> Aunque el ancho de banda es crucial, no es lo único que importa. En cargas sensibles a latencia (juegos, sistemas de tiempo real), el interleaving y los múltiples canales tienen menos impacto que en cargas de alto throughput (IA, procesamiento de video). Por eso, el diseño del algoritmo y la estructura de datos sigue siendo fundamental.

## Quédate con...

- La caché L1/L2/L3 está integrada en la CPU y reduce drásticamente los accesos a RAM; su uso eficiente mejora el rendimiento más que subir la frecuencia de RAM.
- Single channel usa un solo módulo; dual channel (estándar en escritorio) duplica el ancho de banda; quad channel (servidores/HEDT) lo cuadruplica.
- El interleaving distribuye los datos entre módulos para aprovechar el paralelismo de los canales, pero requiere accesos secuenciales para ser eficaz.
- Para activar dual/quad channel, instala módulos idénticos en ranuras correctas; la placa base suele indicarlas con colores.
- Como desarrollador, accesos contiguos y alineados en memoria permiten que la arquitectura de memoria (caché, canales, interleaving) funcione a su máxima eficiencia.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/memoria/ram" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/memoria/modulos" class="next">Siguiente</a>
</div>
