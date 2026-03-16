---
title: "Jerarquía y flujo de datos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Jerarquía y flujo de datos](#jerarquía-y-flujo-de-datos)
  - [Jerarquía del sistema](#jerarquía-del-sistema)
  - [Procesamiento](#procesamiento)
  - [Memoria](#memoria)
  - [Almacenamiento](#almacenamiento)
  - [Entrada y salida (E/S)](#entrada-y-salida-es)
  - [La interconexión de los principales componentes: CPU, memoria, E/S…](#la-interconexión-de-los-principales-componentes-cpu-memoria-es)
  - [Ciclo de instrucción](#ciclo-de-instrucción)
  - [Papel de la CPU, memoria y buses](#papel-de-la-cpu-memoria-y-buses)
  - [Pipelining y sus beneficios](#pipelining-y-sus-beneficios)
  - [Ejemplo práctico simplificado](#ejemplo-práctico-simplificado)
  - [Principios de localidad](#principios-de-localidad)
    - [Localidad temporal](#localidad-temporal)
    - [Localidad espacial](#localidad-espacial)
  - [Quédate con...](#quédate-con)

</div>

# Jerarquía y flujo de datos

En una computadora, no todos los componentes son iguales: algunos son extremadamente rápidos pero pequeños y costosos, mientras que otros son lentos pero capaces de almacenar grandes cantidades de información a bajo costo. Para equilibrar estas tensiones entre velocidad, capacidad y precio, los sistemas modernos organizan sus recursos en una jerarquía claramente definida. Paralelamente, los datos no permanecen estáticos; fluyen constantemente entre la CPU, la memoria, los dispositivos de almacenamiento y los periféricos, siguiendo un ciclo coordinado por la unidad de control. Comprender esta jerarquía y este flujo es esencial para cualquier desarrollador, ya que permite escribir código que aproveche eficazmente los recursos del sistema, minimizando tiempos de espera y maximizando el rendimiento.

## Jerarquía del sistema

La arquitectura de una computadora se organiza en cuatro grandes subsistemas interdependientes, cada uno con su propia jerarquía interna: procesamiento, memoria, almacenamiento y entrada/salida (E/S). Esta organización refleja compromisos entre velocidad, capacidad, persistencia y costo.

## Procesamiento

El procesamiento está centralizado en la CPU, que actúa como el núcleo ejecutor de instrucciones. Dentro de la CPU, existe su propia jerarquía: los registros (los más rápidos, con acceso en un ciclo de reloj) almacenan datos e instrucciones inmediatos; seguidos por la caché (L1, L2, L3), que actúa como una extensión de los registros con mayor capacidad pero menor velocidad. Cuanto más cerca esté un dato de los núcleos de ejecución, más rápido podrá procesarse.

## Memoria

La memoria principal (RAM) es volátil, rápida y de capacidad intermedia. Sirve como área de trabajo activa para los programas en ejecución. Aunque mucho más lenta que la caché, es órdenes de magnitud más rápida que el almacenamiento secundario. La RAM se organiza en direcciones lineales, y el sistema operativo la gestiona mediante técnicas como la memoria virtual para dar la ilusión de un espacio continuo y aislado a cada proceso.

## Almacenamiento

Los dispositivos de almacenamiento secundario —como discos duros (HDD) y unidades de estado sólido (SSD)— son persistentes, tienen gran capacidad y son mucho más lentos que la RAM. Se utilizan para guardar datos a largo plazo: el sistema operativo, los programas instalados y los archivos del usuario. La diferencia de velocidad entre RAM y almacenamiento es tan grande que los sistemas modernos emplean cachés de disco y prefetching para mitigar los tiempos de acceso.

## Entrada y salida (E/S)

Los dispositivos de E/S (teclado, pantalla, red, etc.) son los más lentos del sistema, con tiempos de respuesta que pueden variar desde microsegundos (en redes de alta velocidad) hasta segundos (en discos mecánicos antiguos). Para evitar que la CPU quede inactiva esperando, se utilizan técnicas como interrupciones, E/S directa a memoria (DMA) y controladores especializados que descargan parte del trabajo de la CPU.

## La interconexión de los principales componentes: CPU, memoria, E/S…

Todos los componentes anteriores se comunican a través de buses, que son conjuntos de líneas eléctricas que transportan datos, direcciones y señales de control. En arquitecturas modernas, ya no existe un único bus como en el modelo original de Von Neumann, sino una interconexión jerárquica:

- El bus frontal (o más recientemente, enlaces punto a punto como Intel DMI o AMD Infinity Fabric) conecta la CPU con el chipset, que actúa como árbitro del flujo de datos.
- El chipset, a su vez, gestiona el acceso a la RAM (a través del controlador de memoria, ahora integrado en la CPU en la mayoría de los diseños modernos) y a los controladores de E/S (USB, SATA, PCIe, etc.).
- Los dispositivos de E/S de alta velocidad (como GPUs o SSD NVMe) se conectan directamente al CPU mediante PCI Express, evitando cuellos de botella en el chipset.

Esta red de interconexiones permite que múltiples transferencias ocurran de forma concurrente, mejorando significativamente el rendimiento frente al modelo de bus único.

## Ciclo de instrucción

El corazón del flujo de datos es el ciclo de instrucción, el proceso mediante el cual la CPU ejecuta las órdenes de un programa. Aunque los detalles varían según la arquitectura, el ciclo clásico se divide en tres fases:

Fetch, decode, execute

1. Fetch (obtención): La unidad de control recupera la siguiente instrucción de la memoria, usando el valor del contador de programa (PC) como dirección. La instrucción se carga en el registro de instrucción (IR).
1. Decode (decodificación): La unidad de control interpreta la instrucción: qué operación realizar, qué registros o direcciones de memoria usar, etc.
1. Execute (ejecución): La ALU realiza la operación solicitada (suma, comparación, salto, etc.), y los resultados se escriben en registros o en memoria.

Tras la ejecución, el contador de programa se actualiza (normalmente incrementado, salvo en saltos) y el ciclo se repite.

## Papel de la CPU, memoria y buses

La CPU coordina todo el ciclo, pero depende de la memoria para obtener instrucciones y datos, y de los buses para transferir esa información. Cada acceso a memoria consume ciclos de reloj, y si los datos no están en caché, la CPU puede quedar inactiva durante decenas o cientos de ciclos —una situación que se busca evitar mediante técnicas de optimización.

## Pipelining y sus beneficios

Para acelerar el ciclo de instrucción, las CPUs modernas usan pipelining (segmentación). En lugar de esperar a que una instrucción complete las tres fases antes de comenzar la siguiente, se superponen las etapas: mientras una instrucción se está ejecutando, la siguiente se decodifica y la tercera se obtiene. Esto permite que, en condiciones ideales, se complete una instrucción por ciclo de reloj, aunque cada una tarde varios ciclos en procesarse. El beneficio es un aumento significativo del rendimiento, aunque el pipeline puede vaciarse en caso de saltos condicionales mal predichos, lo que introduce penalizaciones de rendimiento.

## Ejemplo práctico simplificado

Imaginemos el código en ensamblador ADD R1, R2, R3 (sumar los contenidos de R2 y R3, guardar en R1):

- Fetch: La CPU lee la instrucción ADD desde la dirección apuntada por el PC.
- Decode: La unidad de control identifica que es una operación de suma entre tres registros.
- Execute: La ALU lee R2 y R3, suma sus valores y escribe el resultado en R1.

Si el sistema usa pipeline, mientras se ejecuta esta instrucción, ya se está obteniendo la siguiente del programa.

## Principios de localidad

El diseño de la jerarquía de memoria se basa en una observación empírica fundamental: los programas no acceden a la memoria de forma aleatoria, sino que exhiben localidad. Hay dos tipos clave:

### Localidad temporal

Si un dato o instrucción se ha accedido recientemente, es probable que se vuelva a acceder pronto. Por ejemplo, las variables dentro de un bucle se usan una y otra vez. Esta propiedad justifica el uso de caché: mantener los datos recientes cerca de la CPU para reutilizarlos sin volver a acceder a RAM.

### Localidad espacial

Si se accede a una dirección de memoria, es probable que se accedan direcciones cercanas en el futuro. Esto ocurre al recorrer arrays o estructuras de datos contiguas. Los sistemas aprovechan esta propiedad mediante la lectura en bloques: al cargar una dirección desde RAM a caché, se traen también sus vecinas (una “línea de caché”), anticipando futuros accesos.

Estos principios son la base de la eficacia de la caché. Un programa que respeta la localidad (por ejemplo, recorriendo matrices por filas en lugar de columnas en C) se ejecutará mucho más rápido que uno que provoca accesos dispersos, incluso si realizan el mismo número de operaciones.

> Aunque el programador no gestiona directamente la caché, el diseño de algoritmos y estructuras de datos puede tener un impacto dramático en la localidad. En lenguajes de bajo nivel como C o Rust, comprender estos principios permite optimizar el rendimiento sin cambiar la lógica del programa.

## Quédate con...

- La computadora se organiza en una jerarquía de subsistemas: procesamiento (CPU y caché), memoria (RAM), almacenamiento (SSD/HDD) y E/S (periféricos), cada uno con distintos equilibrios entre velocidad, capacidad y costo.
- Los componentes se interconectan mediante buses y enlaces punto a punto, evolucionando más allá del bus único del modelo de Von Neumann.
- El ciclo de instrucción (fetch, decode, execute) es el núcleo del flujo de datos, y el pipelining permite que múltiples instrucciones se procesen simultáneamente en distintas fases.
- La localidad temporal (reutilización de datos recientes) y espacial (accesos a direcciones cercanas) son principios fundamentales que hacen eficaz la jerarquía de memoria.
- Como desarrollador, escribir código que favorezca la localidad —usando estructuras contiguas y patrones de acceso predecibles— mejora drásticamente el rendimiento gracias a la caché.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/arquitectura/von_neumann" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/arquitectura/paralelismo" class="next">Siguiente</a>
</div>
