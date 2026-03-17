---
title: "Comparación directa"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Comparación directa](#comparación-directa)
  - [¿Cuándo elegir TCP o UDP?](#cuándo-elegir-tcp-o-udp)
  - [Quédate con...](#quédate-con)

</div>

# Comparación directa

TCP y UDP representan dos filosofías distintas de comunicación en la capa de transporte. TCP asume que la red es inherentemente insegura y construye garantías mediante estado, confirmaciones y retransmisiones; UDP asume que la aplicación conoce mejor sus requisitos y delega cualquier control adicional al nivel de aplicación, manteniendo el protocolo minimalista. Esta diferencia fundamental no implica superioridad de uno sobre otro, sino adecuación a distintos patrones de uso.

| Criterio | TCP | UDP |
|----------|-----|-----|
| **Fiabilidad** | Garantizada: ACKs, retransmisiones, detección de pérdidas | No garantizada: entrega "mejor esfuerzo", sin recuperación automática |
| **Orden de entrega** | Secuencial: reensamblado mediante números de secuencia | No garantizado: los datagramas pueden llegar desordenados |
| **Control de flujo** | Ventana deslizante adaptativa entre extremos | Ausente: el emisor puede saturar al receptor |
| **Control de congestión** | Reduce tasa ante pérdidas para proteger la red | Ausente: puede contribuir a congestión sin retroceso automático |
| **Establecimiento de conexión** | Handshake de 3 vías (latencia inicial) | Sin conexión: envío inmediato |
| **Sobrecarga de cabecera** | 20 bytes mínimos + opciones | 8 bytes fijos |
| **Uso de recursos** | Mayor CPU y memoria por estado de conexión | Mínimo: sin estado, sin buffers de retransmisión |
| **Patrones de comunicación** | Flujo continuo de bytes (stream) | Mensajes discretos (datagramas) |

## ¿Cuándo elegir TCP o UDP?

La elección depende de los requisitos de la aplicación, no de preferencias técnicas abstractas. TCP es la opción natural cuando la integridad de los datos es prioritaria: transferencia de archivos, navegación web, correo electrónico, bases de datos distribuidas. En estos escenarios, perder un byte o recibir datos desordenados compromete la funcionalidad; la latencia adicional por confirmaciones es un costo aceptable para garantizar corrección.

UDP resulta preferible cuando la baja latencia o el throughput máximo son críticos y la aplicación puede tolerar pérdidas: streaming de audio/video en tiempo real, VoIP, juegos multijugador, telemetría de sensores, consultas DNS. En estos casos, retransmitir un paquete perdido llegaría demasiado tarde para ser útil; es más eficiente descartarlo y continuar con la información más reciente. Algunas aplicaciones implementan fiabilidad selectiva sobre UDP (como QUIC en HTTP/3), combinando control granular con la flexibilidad del datagrama.

> La decisión no es binaria ni irreversible. Protocolos modernos como QUIC demuestran que es posible implementar mecanismos de fiabilidad y control de congestión en espacio de usuario sobre UDP, evitando la rigidez del stack TCP del kernel y permitiendo innovación más ágil. La arquitectura de la aplicación —no solo el protocolo de transporte— determina el comportamiento final.

## Quédate con...

*   TCP garantiza entrega ordenada y fiable mediante ACKs, retransmisiones y control de flujo; UDP ofrece entrega mínima sin garantías, delegando control a la aplicación.
*   La sobrecarga de TCP (20+ bytes, handshake, estado) es el precio de su fiabilidad; UDP (8 bytes, sin conexión) prioriza velocidad y eficiencia.
*   Elige TCP para aplicaciones donde la integridad de datos es crítica (web, archivos, transacciones); elige UDP para aplicaciones sensibles a latencia donde pérdidas ocasionales son aceptables (streaming, VoIP, juegos).
*   La tabla de comparación resume compromisos prácticos: fiabilidad vs. velocidad, sobrecarga vs. minimalismo, estado vs. stateless.
*   Protocolos modernos como QUIC muestran que TCP y UDP no son categorías estancas: la fiabilidad puede implementarse sobre UDP cuando se requiere flexibilidad arquitectónica.



<div class="pagination">
  <a href="/markdown/sistemas/redes/transporte/udp" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/transporte/diagnostico" class="next">Siguiente</a>
</div>
