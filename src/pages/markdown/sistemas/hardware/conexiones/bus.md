---
title: "Bus de datos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Buses](#buses)
  - [Bus de datos](#bus-de-datos)
  - [Bus de direcciones](#bus-de-direcciones)
  - [Bus de control](#bus-de-control)
  - [Ancho del bus y velocidad](#ancho-del-bus-y-velocidad)
  - [Cuellos de botella](#cuellos-de-botella)
  - [Quédate con...](#quédate-con)

</div>

# Buses

En arquitectura de computadoras, un bus es un sistema de comunicación que transfiere datos, direcciones y señales de control entre los componentes de un sistema informático. Actúa como la red vial interna del hardware: por ella circulan las instrucciones de la CPU, los datos de la memoria, las órdenes a los periféricos y las respuestas de los dispositivos de entrada/salida. Comprender los tipos de buses, su ancho, velocidad y limitaciones es fundamental para diagnosticar cuellos de botella, diseñar sistemas eficientes y apreciar por qué ciertas configuraciones de hardware rinden mejor que otras, incluso con componentes similares.

## Bus de datos

El bus de datos es la autopista principal por la que viajan los datos reales entre la CPU, la memoria y los dispositivos de E/S. Su ancho (número de líneas paralelas) determina cuántos bits se pueden transferir en un solo ciclo.

Por ejemplo:

- Un bus de datos de 64 bits (8 bytes) es estándar en sistemas modernos de 64 bits.
- En arquitecturas antiguas (como el Intel 8086), era de 16 bits.

Un bus de datos más ancho permite mover más información por ciclo, aumentando el ancho de banda (medido en bytes/segundo).

## Bus de direcciones

El bus de direcciones transporta las direcciones de memoria generadas por la CPU para indicar dónde debe leerse o escribirse un dato. A diferencia del bus de datos, es unidireccional (solo va de la CPU al resto del sistema).

- El ancho del bus de direcciones define el espacio de memoria direccional máximo.
  - Un bus de 32 bits puede direccionar 2³²bytes = 4GB.
  - Un bus de 48 bits (como en x86-64 con espacio de direcciones de 48 bits) permite 256 TB de memoria virtual.

Aunque la CPU moderna puede tener registros de 64 bits, el bus de direcciones real suele ser menor por razones de costo y eficiencia.

## Bus de control

El bus de control transporta señales de coordinación que regulan el flujo de operaciones en el sistema. Estas señales incluyen:

- Read/Write: indica si la operación es de lectura o escritura.
- Clock: sincroniza las operaciones con el reloj del sistema.
- Reset: reinicia la CPU.
- Interrupt Request (IRQ): señales de periféricos solicitando atención de la CPU.
- Ready/Wait: indica si un dispositivo está listo para transferir datos.

El bus de control garantiza que todos los componentes actúen de forma coordinada, evitando conflictos como dos dispositivos escribiendo al mismo tiempo en el bus de datos.

## Ancho del bus y velocidad

El rendimiento de un bus depende de dos factores clave:

- Ancho del bus: número de bits transferidos por ciclo (64 bits, 128 bits, etc.).
- Velocidad del bus: frecuencia a la que opera, medida en MHz o GT/s (GigaTransfers per second).

El ancho de banda teórico se calcula como: **Ancho de banda = Ancho del bus (bytes)×Frecuencia (transferencias/segundo)**

> Las transferencias efectivas son menores por sobrecarga de protocolo, pero esta fórmula da una buena estimación del límite superior.

## Cuellos de botella

Un cuello de botella ocurre cuando un bus no puede transferir datos tan rápido como los generan o consumen los componentes conectados. Algunos ejemplos históricos y actuales:

- Cuello de botella de Von Neumann: en arquitecturas clásicas, el uso compartido del mismo bus para datos e instrucciones limita el rendimiento. Solución: cachés divididas (Harvard en la práctica) y buses separados.
- PCIe insuficiente: una GPU RTX 4090 en un slot PCIe 3.0 x8 puede perder hasta un 10% de rendimiento frente a x16, especialmente en juegos con texturas dinámicas.
- RAM en single channel: limita el ancho de banda a la mitad que el dual channel, penalizando aplicaciones sensibles a memoria (IA, simulación).
- Almacenamiento SATA en sistema moderno: un SSD NVMe puede ser 6–10× más rápido que uno SATA, pero si la placa solo tiene SATA, ese potencial se pierde.

> Aumentar la velocidad de un componente (como la CPU o GPU) sin asegurar que los buses que lo conectan tengan suficiente ancho de banda es una forma común de desperdiciar inversión. Siempre evalúa el sistema como un todo.

## Quédate con...

- El bus de datos transporta información; el bus de direcciones, ubicaciones de memoria; el bus de control, señales de coordinación.
- El ancho del bus (bits) y su velocidad (frecuencia) determinan el ancho de banda máximo.
- Los cuellos de botella ocurren cuando un bus no puede seguir el ritmo de los componentes, limitando el rendimiento global.
- La evolución del hardware ha implicado multiplicar y especializar los buses: ya no hay un único bus, sino una red de interconexiones (PCIe, DMI, Infinity Fabric, etc.).
- Como desarrollador, entender los límites de los buses te ayuda a anticipar dónde se saturará tu sistema: ¿es la CPU, la memoria, el almacenamiento o el ancho de banda de PCIe?
- Nunca optimices un solo componente sin considerar cómo se comunica con el resto del sistema: el rendimiento es tan fuerte como su eslabón más débil.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/conexiones/internos" class="next">Siguiente</a>
</div>
