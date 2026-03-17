---
title: "Segmentación y reensamblado"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Segmentación y reensamblado](#segmentación-y-reensamblado)
  - [Segmentación](#segmentación)
  - [Reensamblado](#reensamblado)
  - [Cómo se dividen los mensajes grandes para su envío](#cómo-se-dividen-los-mensajes-grandes-para-su-envío)
  - [Quédate con...](#quédate-con)

</div>

# Segmentación y reensamblado

Las aplicaciones generan datos de tamaño arbitrario: un archivo de cien megabytes, un mensaje de correo, un flujo de video en tiempo real. La red no puede transportar estas unidades como bloques monolíticos; los enlaces físicos tienen límites de transmisión, los buffers de los routers tienen capacidad finita, y la compartición del medio requiere que ningún emisor monopolice el canal indefinidamente. La capa de transporte resuelve esta incompatibilidad dividiendo los mensajes grandes en unidades manejables llamadas segmentos, que viajan independientemente por la red y se reensamblan en el destino para reconstruir el mensaje original. Esta división no es opcional: es el mecanismo que permite que aplicaciones con requisitos de datos ilimitados operen sobre una infraestructura con restricciones físicas inherentes.

## Segmentación

La segmentación ocurre en el emisor, cuando la capa de transporte recibe un flujo de datos de la aplicación y lo divide en unidades que pueden ser encapsuladas en paquetes de red. Cada segmento incluye una cabecera con información de control: números de secuencia que identifican la posición del segmento en el flujo original, puertos que identifican la aplicación de destino, y flags que indican el estado de la conexión. El tamaño máximo de cada segmento está determinado por el MSS (*Maximum Segment Size*), que típicamente se negocia durante el establecimiento de la conexión TCP y se calcula restando las cabeceras de IP y TCP del MTU (*Maximum Transmission Unit*) del enlace.

Este proceso no es una simple partición mecánica. La segmentación interactúa con el control de flujo y congestión: incluso si el MSS permite segmentos de 1460 bytes, la ventana de congestión puede limitar el emisor a enviar menos datos antes de recibir confirmación. Además, la segmentación permite multiplexación temporal: segmentos de diferentes aplicaciones pueden intercalarse en el mismo enlace, evitando que una transferencia grande bloquee tráfico sensible a la latencia como una consulta DNS o un paquete de voz.

> La segmentación de transporte difiere de la fragmentación de red. La segmentación ocurre en los extremos (capa 4), es consciente de la aplicación y se gestiona mediante números de secuencia TCP. La fragmentación ocurre en routers intermedios (capa 3), es transparente para los extremos y se gestiona mediante campos de offset e identificación IP. IPv6 eliminó la fragmentación en routers, delegando la adaptación al MTU exclusivamente a los hosts mediante Path MTU Discovery.

## Reensamblado

El reensamblado ocurre en el receptor, donde los segmentos llegados —potencialmente desordenados, duplicados o con huecos— se reconstruyen en el flujo original que la aplicación espera. Cada segmento incluye un número de secuencia que indica su posición relativa en el flujo de bytes. El receptor mantiene un buffer de reensamblado donde almacena segmentos llegados hasta que puede entregar un bloque contiguo a la aplicación. Si los segmentos 1, 2 y 4 llegan pero el 3 se retrasa, el receptor bufferiza el 4 y espera el 3 antes de entregar nada, garantizando que la aplicación reciba datos en orden.

Este mecanismo introduce complejidad operativa. El receptor debe gestionar memoria para buffers, detectar duplicados (segmentos retransmitidos que llegan después del original), identificar huecos y solicitar retransmisiones cuando sea necesario. En TCP, el reensamblado es transparente para la aplicación: esta lee un flujo continuo de bytes sin conocer los límites de segmento subyacentes. En UDP, no hay reensamblado garantizado: cada datagrama es independiente, y si la aplicación necesita reconstruir mensajes grandes, debe implementar su propia lógica de secuenciación y recuperación.

> El reensamblado tiene límites prácticos. Si un receptor no puede completar un mensaje porque segmentos críticos se pierden permanentemente, la conexión puede timeout y abortarse. Las aplicaciones que transfieren archivos grandes deben estar preparadas para reintentos a nivel de aplicación, incluso cuando TCP garantiza entrega a nivel de segmento.

## Cómo se dividen los mensajes grandes para su envío

El proceso de división sigue una secuencia coordinada entre aplicación, capa de transporte y capa de red. Cuando una aplicación envía un bloque de datos, la capa de transporte lo divide en segmentos que no excedan el MSS negociado. Cada segmento recibe un número de secuencia incremental: si el primer segmento contiene bytes 0–1459, el segundo contendrá 1460–2919, y así sucesivamente. Estos números permiten al receptor detectar orden, duplicación y pérdidas.

La división no es estática: se adapta dinámicamente a las condiciones de la red. Si el control de congestión reduce la ventana de envío, el emisor puede enviar menos segmentos antes de esperar confirmación. Si la ruta cambia y el MTU disminuye, el Path MTU Discovery puede reducir el MSS, forzando segmentos más pequeños en envíos futuros. Esta adaptabilidad es esencial para mantener eficiencia sin causar congestión o fragmentación en la red.

El último segmento de un mensaje puede ser menor que el MSS, y la cabecera TCP incluye un flag FIN que indica el final del flujo de datos. Durante la transmisión, segmentos de diferentes mensajes pueden intercalarse si la aplicación mantiene múltiples flujos sobre la misma conexión (como HTTP/2 sobre TCP). El receptor usa los números de secuencia para reconstruir cada flujo independientemente, incluso cuando los segmentos llegan físicamente mezclados en el enlace.

> La segmentación introduce overhead: cada segmento lleva una cabecera de 20 bytes (TCP) o 8 bytes (UDP). Mensajes muy pequeños segmentados excesivamente desperdician ancho de banda en cabeceras. La optimización *Nagle's algorithm* agrupa pequeños segmentos antes de enviarlos, reduciendo overhead a costa de latencia ligeramente mayor. Esta compensación entre eficiencia y velocidad es configurable según los requisitos de la aplicación.

## Quédate con...

*   La segmentación divide datos de aplicación en unidades manejables (segmentos) que pueden transmitirse eficientemente sobre la red, limitadas por el MSS y el control de congestión.
*   El reensamblado reconstruye el flujo original en el receptor usando números de secuencia, bufferizando segmentos llegados desordenados hasta entregar bloques contiguos a la aplicación.
*   TCP gestiona segmentación y reensamblado transparentemente para la aplicación; UDP no garantiza orden ni entrega, delegando cualquier reconstrucción a la capa de aplicación.
*   La segmentación difiere de la fragmentación IP: ocurre en los extremos (capa 4), es consciente de la aplicación y usa números de secuencia en lugar de offsets de fragmento.
*   El tamaño de segmento se adapta dinámicamente según condiciones de red (MSS, ventana de congestión, Path MTU), equilibrando eficiencia de ancho de banda con latencia de transmisión.
*   Cada segmento introduce overhead de cabecera; algoritmos como Nagle optimizan este compromiso agrupando datos pequeños antes del envío.



<div class="pagination">
  <a href="/markdown/sistemas/redes/transporte/diagnostico" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
