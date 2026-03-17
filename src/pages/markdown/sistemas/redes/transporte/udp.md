---
title: "UDP (User Datagram Protocol)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [UDP (User Datagram Protocol)](#udp-user-datagram-protocol)
  - [Sin conexión, mínimo overhead, no confiable](#sin-conexión-mínimo-overhead-no-confiable)
  - [Casos de uso: streaming, VoIP, DNS, juegos en línea](#casos-de-uso-streaming-voip-dns-juegos-en-línea)
  - [Quédate con...](#quédate-con)

</div>

# UDP (User Datagram Protocol)

UDP entrega datagramas sin establecer conexión previa, sin confirmar recepción y sin reordenar paquetes llegados fuera de secuencia. Esta ausencia de garantías no es un defecto, sino una elección de diseño: sacrificar fiabilidad para minimizar latencia y sobrecarga, permitiendo que aplicaciones sensibles al tiempo transmitan datos tan rápido como la red lo permita. Cuando cada milisegundo cuenta —en una llamada de voz, un frame de videojuego o una consulta DNS— esperar confirmaciones o retransmitir paquetes perdidos introduce retrasos inaceptables; UDP evita ese costo delegando cualquier control adicional a la aplicación o aceptando pérdidas ocasionales como parte del intercambio.

## Sin conexión, mínimo overhead, no confiable

UDP opera sin estado de conexión: cada datagrama es independiente, enviado sin negociación previa ni mantenimiento de secuencia entre emisor y receptor. La cabecera del protocolo ocupa solo 8 bytes —puerto origen, puerto destino, longitud y checksum— frente a los 20 bytes mínimos de TCP. Esta minimalismo reduce la sobrecarga de procesamiento en ambos extremos y el volumen de tráfico de control en la red, liberando ancho de banda para datos útiles.

La ausencia de acuses de recibo implica que UDP no detecta pérdidas ni retransmite automáticamente. Si un datagrama se corrompe (checksum fallido) o se pierde en la ruta, simplemente desaparece; el receptor nunca lo verá. Tampoco hay control de flujo ni de congestión: un emisor puede saturar a un receptor lento o contribuir a congestión de red sin mecanismos automáticos de retroceso. El orden de llegada tampoco está garantizado: datagramas pueden tomar rutas distintas y llegar desordenados, y UDP no los reensambla.

Esta falta de garantías requiere que la aplicación asuma responsabilidades adicionales si necesita fiabilidad. Algunas implementan sus propios ACKs y retransmisiones selectivas; otras toleran pérdidas como parte del diseño. La flexibilidad es intencional: UDP no impone un modelo, sino que proporciona un transporte ligero sobre el cual cada aplicación construye el comportamiento que requiere.

> El checksum en UDP es opcional en IPv4 (aunque altamente recomendado) y obligatorio en IPv6. Su propósito es detectar corrupción de cabecera y datos durante la transmisión; si falla, el datagrama se descarta silenciosamente sin notificar al emisor.

## Casos de uso: streaming, VoIP, DNS, juegos en línea

Las aplicaciones que priorizan baja latencia sobre entrega perfecta encuentran en UDP su protocolo natural. En **streaming de audio y video**, perder un frame ocasional produce una imperfección visual o auditiva momentánea, pero esperar retransmisiones introduciría buffering y interrupciones perceptibles. Los protocolos como RTP (Real-time Transport Protocol), construidos sobre UDP, añaden marcas de tiempo y secuencias para que el receptor pueda sincronizar y descartar paquetes tardíos sin bloquear la reproducción.

En **VoIP** (Voz sobre IP), la voz humana tolera pérdidas menores al 1–2% sin degradación notable, pero requiere latencias inferiores a 150 ms para conversaciones naturales. UDP permite enviar paquetes de voz cada 20 ms sin esperar confirmaciones; si uno se pierde, el códec interpola o simplemente omite ese fragmento, manteniendo la fluidez de la llamada.

**DNS** (Domain Name System) utiliza UDP para consultas típicas porque la mayoría de respuestas caben en un solo datagrama y la operación es transaccional: si una consulta se pierde, el cliente simplemente reintenta tras un timeout breve. La simplicidad de UDP acelera la resolución de nombres, crítica para el rendimiento percibido de navegación web. Solo cuando la respuesta excede el MTU o se requiere mayor fiabilidad (transferencias de zona) DNS cambia a TCP.

Los **juegos en línea** multijugador envían actualizaciones de estado decenas de veces por segundo: posición de jugadores, acciones, eventos. Perder una actualización no rompe la experiencia; el cliente puede interpolar movimientos o simplemente aplicar el estado más reciente. La prioridad es que la información llegue rápido, no que cada paquete llegue. UDP permite este flujo constante sin la sobrecarga de mantener estado de conexión ni gestionar retransmisiones que llegarían demasiado tarde para ser útiles.

> La elección entre TCP y UDP no es excluyente. Aplicaciones modernas como HTTP/3 (sobre QUIC) implementan fiabilidad y control de congestión en espacio de usuario sobre UDP, combinando baja latencia con garantías de entrega sin depender del stack TCP del kernel. Esta arquitectura permite innovación más ágil en protocolos de transporte.

## Quédate con...

*   UDP es un protocolo sin conexión que entrega datagramas sin garantías de entrega, orden o duplicación, minimizando latencia y sobrecarga de cabecera.
*   Su cabecera de solo 8 bytes (puertos, longitud, checksum) reduce procesamiento y tráfico de control frente a los 20+ bytes de TCP.
*   La ausencia de ACKs, retransmisiones y control de flujo delega la gestión de fiabilidad a la aplicación o acepta pérdidas como parte del diseño.
*   Casos de uso típicos incluyen streaming, VoIP, DNS y juegos en línea, donde la baja latencia es más crítica que la entrega perfecta de cada paquete.
*   UDP no es "inferior" a TCP: resuelve distintos compromisos entre velocidad, fiabilidad y complejidad según los requisitos de la aplicación.
*   Protocolos modernos como QUIC demuestran que la fiabilidad puede implementarse sobre UDP, combinando ventajas de ambos enfoques.



<div class="pagination">
  <a href="/markdown/sistemas/redes/transporte/tcp" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/transporte/comparacion" class="next">Siguiente</a>
</div>
