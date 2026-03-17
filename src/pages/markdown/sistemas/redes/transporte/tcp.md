---
title: "TCP (Transmission Control Protocol)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [TCP (Transmission Control Protocol)](#tcp-transmission-control-protocol)
  - [Orientación a conexión y fiabilidad](#orientación-a-conexión-y-fiabilidad)
  - [Handshake de 3 vías](#handshake-de-3-vías)
  - [Acuse de recibo y retransmisiones](#acuse-de-recibo-y-retransmisiones)
  - [Ventana deslizante y control de flujo](#ventana-deslizante-y-control-de-flujo)
  - [Quédate con...](#quédate-con)

</div>

# TCP (Transmission Control Protocol)

TCP convierte el servicio de datagramas no fiable de IP en un flujo de bytes ordenado y garantizado. Esta transformación no ocurre mágicamente: requiere mantener estado de conexión en los extremos, negociar parámetros iniciales y monitorear constantemente la salud del enlace mediante confirmaciones y temporizadores. La complejidad que IP evita en la red se desplaza aquí, a los bordes, donde los hosts asumen la responsabilidad de recuperar pérdidas, reordenar segmentos y adaptar la velocidad de envío a la capacidad del receptor y de la ruta.

## Orientación a conexión y fiabilidad

A diferencia de UDP, TCP establece un estado compartido entre emisor y receptor antes de intercambiar datos útiles. Esta orientación a conexión implica que ambos extremos mantienen variables de control (números de secuencia, ventanas, temporizadores) que sincronizan la comunicación. La fiabilidad se logra mediante confirmaciones positivas con retransmisión: cada byte enviado se numera secuencialmente, y el receptor debe confirmar la recepción correcta. Si el emisor no recibe confirmación en un tiempo determinado, asume pérdida y reenvía los datos.

Este mecanismo garantiza que los datos lleguen íntegros, sin duplicados y en el orden original, incluso si los paquetes IP subyacentes llegan desordenados o se pierden en la ruta. El costo es una mayor latencia inicial por el establecimiento de conexión y una sobrecarga de cabecera más elevada (20 bytes mínimos por segmento). Además, TCP implementa control de congestión para evitar colapsar la red cuando hay demasiados emisores compitiendo por ancho de banda, reduciendo dinámicamente la tasa de envío ante señales de pérdida.

## Handshake de 3 vías

El establecimiento de una conexión TCP requiere un handshake de tres pasos para sincronizar los números de secuencia iniciales (ISN) de ambos extremos y asegurar que ambas partes están dispuestas a comunicarse. El proceso inicia cuando el cliente envía un segmento con la bandera SYN activada y un número de secuencia inicial aleatorio `seq = x`. El servidor responde con un segmento SYN-ACK, confirmando el SYN del cliente (`ack = x + 1`) y enviando su propio ISN `seq = y`. Finalmente, el cliente envía un ACK (`ack = y + 1`) para confirmar la recepción del SYN del servidor.

Esta sincronización bidireccional es crítica porque los números de secuencia no comienzan en cero; se eligen aleatoriamente para evitar que segmentos de conexiones anteriores se solapen con la nueva sesión (protección contra segmentos duplicados retardados). Un handshake de solo dos vías no permitiría al servidor confirmar que el cliente recibió su ISN, dejando la conexión en un estado ambiguo. Una vez completado el tercer paso, la conexión pasa a estado ESTABLISHED y el intercambio de datos puede comenzar.

## Acuse de recibo y retransmisiones

La fiabilidad de TCP depende del mecanismo de acuse de recibo (ACK). El receptor no confirma cada segmento individualmente, sino que envía ACKs acumulativos: un número de confirmación `ack = N` indica que todos los bytes hasta `N - 1` han sido recibidos correctamente y que el receptor espera el byte `N` a continuación. Esto permite confirmar múltiples segmentos con un solo paquete, reduciendo la sobrecarga de tráfico de control. Si los segmentos llegan desordenados, el receptor sigue enviando ACKs duplicados por el último byte recibido en orden, señalando al emisor que hay un hueco en la secuencia.

Las retransmisiones se activan por dos eventos principales. El primero es el timeout de retransmisión (RTO): un temporizador asociado a cada segmento enviado; si expira sin ACK, el segmento se reenvía y el RTO se duplica (backoff exponencial) para evitar congestión. El segundo es la retransmisión rápida: si el emisor recibe tres ACKs duplicados (indicando que el receptor sigue esperando el mismo byte mientras llegan segmentos posteriores), reenvía el segmento perdido inmediatamente sin esperar al timeout. Este mecanismo recupera pérdidas aisladas mucho más rápido que la espera por temporizador.

## Ventana deslizante y control de flujo

La ventana deslizante permite el envío continuo de datos sin esperar un ACK por cada segmento, optimizando el uso del ancho de banda. El receptor anuncia en cada ACK el tamaño de su ventana de recepción (*receive window*), indicando cuántos bytes adicionales puede almacenar en su buffer antes de saturarse. El emisor mantiene una ventana de envío que se desliza hacia la derecha a medida que recibe confirmaciones, permitiendo enviar nuevos datos dentro del límite anunciado.

Este mecanismo implementa el control de flujo de extremo a extremo, evitando que un emisor rápido sature a un receptor lento. Sin embargo, el tamaño efectivo de la ventana está limitado también por la ventana de congestión, calculada independientemente por el emisor según las condiciones de la red (pérdidas, RTT). El tamaño real de envío es el mínimo entre la ventana de recepción (capacidad del destino) y la ventana de congestión (capacidad de la ruta). Si la ventana llega a cero, el emisor debe detener el envío hasta que el receptor anuncie espacio disponible mediante un paquete de ventana distinta de cero.

> El cierre de una conexión TCP también utiliza un handshake, pero típicamente de 4 vías (FIN, ACK, FIN, ACK) porque cada dirección puede cerrar su flujo de datos independientemente (cierre half-close). Sin embargo, es común que el segundo y tercer paso se combinen en un solo segmento FIN-ACK, reduciéndolo a 3 pasos en la práctica. El estado TIME_WAIT posterior al cierre asegura que los segmentos retardados de la conexión expiren antes de que se reuse el mismo par de puertos.

## Quédate con...

*   TCP transforma el servicio no fiable de IP en un flujo de bytes ordenado y garantizado mediante estado de conexión en los extremos.
*   El handshake de 3 vías (SYN, SYN-ACK, ACK) sincroniza los números de secuencia iniciales y establece la conexión de forma bidireccional.
*   Los ACKs acumulativos confirman la recepción continua de bytes; las retransmisiones se activan por timeout o por 3 ACKs duplicados (retransmisión rápida).
*   La ventana deslizante permite envío continuo sin espera por ACK individual, optimizando el ancho de banda disponible.
*   El control de flujo (ventana de recepción) protege al receptor de saturación; el control de congestión protege a la red de colapso.
*   El cierre de conexión utiliza un intercambio de banderas FIN y ACK, seguido de un estado TIME_WAIT para limpiar segmentos retardados.



<div class="pagination">
  <a href="/markdown/sistemas/redes/transporte/puertos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/transporte/udp" class="next">Siguiente</a>
</div>
