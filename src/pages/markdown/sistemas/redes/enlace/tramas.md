---
title: "Tramas y control de acceso al medio"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Tramas y control de acceso al medio](#tramas-y-control-de-acceso-al-medio)
  - [Qué es una trama y sus campos típicos](#qué-es-una-trama-y-sus-campos-típicos)
  - [Diferencias entre frame, packet, segment](#diferencias-entre-frame-packet-segment)
  - [Métodos de acceso al medio](#métodos-de-acceso-al-medio)
    - [CSMA/CD: Carrier Sense Multiple Access with Collision Detection](#csmacd-carrier-sense-multiple-access-with-collision-detection)
    - [CSMA/CA: Carrier Sense Multiple Access with Collision Avoidance](#csmaca-carrier-sense-multiple-access-with-collision-avoidance)
    - [Token Passing: control determinístico](#token-passing-control-determinístico)
  - [Flujo y control básico en capa 2](#flujo-y-control-básico-en-capa-2)
  - [Quédate con...](#quédate-con)

</div>

# Tramas y control de acceso al medio

La capa física entrega un flujo de bits que, sin estructura, carece de significado para el receptor. La capa de enlace de datos organiza estos bits en unidades discretas —tramas— con delimitadores claros, identificadores de origen y destino, mecanismos de verificación de integridad, y campos de control que regulan el acceso al medio compartido. Esta organización transforma el ruido de fondo de la transmisión en información direccionable, verificable y gestionable. Sin la trama, no hay comunicación confiable; sin el control de acceso al medio, no hay comunicación ordenada cuando múltiples dispositivos comparten el mismo canal.

## Qué es una trama y sus campos típicos

Una **trama** (frame) es la unidad de datos de la capa de enlace, la PDU que viaja entre dispositivos directamente conectados en el mismo segmento de red. Su estructura encapsula el datagrama de capa de red en una envoltura que permite entrega local, verificación de errores de transmisión, y control de flujo elemental.

Los campos típicos de una trama ethernet ilustran la estructura general:

**Preámbulo y delimitador de inicio de trama (SFD):** 7 bytes de preámbulo (alternancia 10101010) que permiten al receptor sincronizar su reloj con el flujo entrante, seguidos de 1 byte de SFD (10101011) que marca explícitamente el inicio de la trama propiamente dicha. Estos campos son señalización física más que información lógica; no se cuentan en la longitud de trama ni se verifican en el checksum.

**Dirección MAC destino:** 6 bytes que identifican la interfaz de red destino en el segmento local. La estructura del primer byte distingue direcciones individuales (bit 0 a 0) de grupales o broadcast (bit 0 a 1), permitiendo filtrado en hardware.

**Dirección MAC origen:** 6 bytes que identifican el emisor, utilizado por switches para aprender ubicaciones y por el receptor para responder.

**Tipo o Longitud:** 2 bytes que, si el valor es mayor o igual a 1536 (0x0600), indica el protocolo de capa superior encapsulado (0x0800 para IPv4, 0x86DD para IPv6); si es menor o igual a 1500, indica la longitud del payload en bytes (formato IEEE 802.3 original). Esta dualidad histórica reflece la evolución de ethernet desde DEC-Intel-Xerox hacia estandarización IEEE.

**Datos útiles (payload):** El datagrama de capa de red, con longitud variable entre 46 y 1500 bytes (1500 para ethernet estándar, 9000 para jumbo frames en configuraciones específicas). El mínimo de 46 bytes garantiza que la trama total (incluyendo direcciones, tipo y FCS) alcance los 64 bytes mínimos requeridos para detección de colisiones en half-duplex; si el payload es menor, se rellena (padding).

**Secuencia de Verificación de Trama (FCS):** 4 bytes de CRC-32 calculados sobre toda la trama desde destino hasta final de datos. El receptor recalcula y compara; discrepancia indica corrupción en tránsito, provocando descarte silencioso. El CRC detecta errores de ráfaga (burst errors) hasta 32 bits, y con probabilidad >99% errores más extensos.

Esta estructura —delimitación, direccionamiento, identificación de protocolo, datos, verificación— es patrón general, aunque los detalles varían: Wi-Fi añade campos de control de duración, direccionamiento de hasta 4 direcciones para modo infraestructura, y campos de secuencia; PPP utiliza delimitadores de byte (0x7E) y escape en lugar de preámbulo; tramas HDLC son delimitadas por flags (01111110) con bit-stuffing para transparencia.

## Diferencias entre frame, packet, segment

La terminología de unidades de datos en redes es precisa contextualmente aunque frecuentemente confundida coloquialmente:

**Segmento (Segment):** PDU de la capa de transporte, específicamente de TCP. Contiene cabecera TCP (puertos, números de secuencia, flags, ventana, checksum) y payload de aplicación. Es el mensaje que TCP entrega a IP para transmisión, y que TCP reconstruye en el destino para entrega ordenada a la aplicación.

**Paquete/Datagrama (Packet/Datagram):** PDU de la capa de red, específicamente de IP. Contiene cabecera IP (direcciones origen y destino, TTL, identificación, flags de fragmentación, protocolo superior) y payload que es típicamente un segmento TCP, un datagrama UDP, o un mensaje ICMP. El término "datagrama" enfatiza el servicio no orientado a conexión; "paquete" es uso más general.

**Trama (Frame):** PDU de la capa de enlace. Contiene cabecera MAC, payload que es típicamente un datagrama IP, y trailer de verificación (FCS). Es la unidad que viaja físicamente entre tarjetas de red en el mismo segmento de broadcast.

La relación es de encapsulamiento jerárquico: el segmento TCP se encapsula en datagrama IP, que se encapsula en trama ethernet. En el receptor, la trama se desencapsula para extraer el datagrama, que se desencapsula para extraer el segmento, que se entrega a la aplicación. Cada capa añade y posteriormente verifica su propia información de control, preservando la abstracción de que se comunica directamente con su par en el destino final.

## Métodos de acceso al medio

Cuando múltiples dispositivos comparten un medio de transmisión —eléctrico, óptico o radioeléctrico— debe existir mecanismo que determine quién transmite y cuándo, evitando o resolviendo colisiones que corromperían la información.

### CSMA/CD: Carrier Sense Multiple Access with Collision Detection

El método histórico de ethernet clásico, operando en topologías de bus (coaxial) o en hubs que simulaban bus. El principio es escuchar antes de hablar: el dispositivo sensa el medio (carrier sense); si detecta actividad, espera. Si el medio está libre, transmite mientras continúa sensando (collision detection). Si detecta señal ajuna mientras transmite —indicando que otro dispositivo inició simultáneamente— aborta inmediatamente, envía una secuencia de interferencia (jam) para asegurar que todos detecten la colisión, y espera un tiempo aleatorio antes de reintentar (backoff exponencial binario).

La detección de colisiones es factible en medios cableados donde la señal propia puede compararse con la del medio. El tiempo de propagación limita la eficiencia: si un dispositivo en un extremo del cable transmite, y otro en el extremo opuesto inicia justo antes de que la primera señal llegue, ambos transmitirán durante el tiempo de ida y vuelta de la señal. Ethernet especifica longitud máxima de segmento (500 m para 10BASE5, 185 m para 10BASE2) y slot time de 512 bit-times (51.2 μs a 10 Mbps) que garantiza que cualquier colisión sea detectada antes de que la transmisión termine. Tramas menores a 64 bytes se rellenan para cumplir este requisito.

CSMA/CD es eficiente a baja carga: acceso inmediato cuando el medio está libre. A alta carga, las colisiones se multiplican, el backoff aleatorio introduce ineficiencia, y el rendimiento decae. La transición a switches full-duplex eliminó CSMA/CD de las redes modernas: cada dispositivo tiene medio dedicado, sin contención. CSMA/CD permanece en especificación para compatibilidad con hubs legacy, pero es irrelevante en práctica contemporánea.

### CSMA/CA: Carrier Sense Multiple Access with Collision Avoidance

El método de redes inalámbricas (Wi-Fi), donde la detección de colisiones es impracticable: un dispositivo no puede transmitir y recibir simultáneamente en la misma frecuencia, y la potencia recibida de otros transmisores puede ser millones de veces menor que la propia, haciendo imposible distinguir colisión mientras se transmite.

El principio es evitar colisiones mediante reserva del medio. El dispositivo sensa el medio; si está libre, no transmite inmediatamente sino que espera un intervalo aleatorio (backoff) adicional, reduciendo probabilidad de colisión con otros que también detectaron libre. Si el medio permanece libre durante el backoff, transmite. Adicionalmente, Wi-Fi implementa RTS/CTS (Request to Send / Clear to Send): el emisor solicita permiso al punto de acceso, que responde concediendo el medio, y otros dispositivos que escuchan el CTS abstienen de transmitir. Este handshake de cuatro vías (RTS, CTS, datos, ACK) reduce colisiones ocultas —donde dos dispositivos no se escuchan mutuamente pero ambos alcanzan el punto de acceso— a costa de overhead de tiempo.

CSMA/CA incluye mecanismos de control de congestión: NAV (Network Allocation Vector) que indica duración esperada de ocupación, fragmentación de tramas grandes para reducir probabilidad de error, y tasas de transmisión adaptativas según calidad de enlace. La eficiencia es menor que en ethernet conmutado debido al overhead de backoff, RTS/CTS, y ACKs, pero es el compromiso necesario para operar en medio compartido no cableado.

### Token Passing: control determinístico

En topologías de anillo (Token Ring, IEEE 802.5, obsoleto) o bus (Token Bus, 802.4), el acceso al medio se regula mediante un testigo (token) —trama especial de control— que circula entre estaciones. Solo la estación que posee el token puede transmitir; tras enviar, pasa el token al siguiente en la secuencia lógica.

El token passing elimina colisiones por diseño, proporcionando acceso determinístico con cota superior de tiempo de espera conocida. Esto es valioso para aplicaciones de tiempo real donde la variabilidad de CSMA es inaceptable. Sin embargo, la complejidad de gestión del token —pérdida de token, duplicación de token, inserción y eliminación de estaciones del anillo— y la latencia de circulación del token en anillos grandes, limitaron su adopción. Token Ring operaba típicamente a 4 o 16 Mbps; ethernet, más simple y económico, alcanzó 100 Mbps y superiores, marginalizando la tecnología de token.

Variantes modernas de control determinístico persisten en nichos: FDDI (Fiber Distributed Data Interface) para backbone de fibra, y sus descendientes en redes industriales (Profibus, Foundation Fieldbus) donde la garantía de tiempo de acceso justifica la complejidad. En redes de área amplia, MPLS y técnicas de ingeniería de tráfico proporcionan determinismo mediante reserva de recursos, no mediante token físico.

## Flujo y control básico en capa 2

El control de flujo en capa de enlace regula la velocidad de transmisión entre dos dispositivos directamente conectados para evitar saturación del receptor. Es distinto del control de congestión de capa de transporte (TCP), que regula flujo extremo-a-extremo a través de múltiples saltos.

Ethernet original (half-duplex) carecía de control de flujo explícito: la velocidad era fija por el estándar (10 Mbps), y el receptor debía procesar o descartar. Ethernet full-duplex con switches introdujo el mecanismo de pausa (802.3x): una trama de control especial (MAC control frame) solicita al emisor detenerse por período especificado. El receptor envía pausa cuando sus buffers se llenan; el emisor respeta la solicitud, reanudando cuando expira el tiempo o recibe pausa de duridad cero. Este mecanismo es punto-a-punto entre switch y dispositivo, no end-to-end.

Wi-Fi implementa control de flujo mediante el campo de duración en cabeceras: cada trama anuncia cuánto tiempo ocupará el medio, incluyendo ACK esperado. Las estaciones que escuchan ajustan su NAV, absteniéndose de transmitir durante ese período. Adicionalmente, el protocolo incluye mecanismos de reconocimiento (ACK) para cada trama unicast, con retransmisión si no se recibe confirmación.

El control de errores en capa 2 es elemental: detección mediante FCS, sin corrección ni retransmisión garantizada. Si el FCS falla, la trama se descarta silenciosamente; la recuperación, si se requiere, es responsabilidad de capas superiores (TCP retransmite, aplicaciones UDP pueden ignorar o gestionar). Esta diseño minimalista refleja la filosofía de separación de responsabilidades: la capa de enlace garantiza integridad de trama local, no fiabilidad end-to-end.

> La evolución de ethernet de CSMA/CD half-duplex a conmutación full-duplex representa una revolución silenciosa en arquitectura de red. El "ether" compartido, origen del nombre, desapareció; cada dispositivo obtuvo medio dedicado bidireccional. Esto eliminó colisiones, duplicó la capacidad efectiva, y simplificó drásticamente el análisis de rendimiento. Sin embargo, la estructura de trama se preservó por compatibilidad, creando la apariencia de continuidad donde la realidad técnica cambió radicalmente. El profesional debe comprender que la trama ethernet moderna viaja en un medio y contexto arquitectónicos completamente diferentes a los de su diseño original, aunque el formato sea reconocible.


## Quédate con...

- La trama es la PDU de capa de enlace, estructurada con delimitadores de sincronización, direcciones MAC origen y destino, identificación de protocolo superior, payload de capa de red, y verificación de integridad (FCS) que permite detección de corrupción en tránsito.
- Segmento (transporte/TCP), paquete/datagrama (red/IP), y trama (enlace/MAC) son unidades distintas en capas diferentes, relacionadas por encapsulamiento jerárquico: segmento dentro de datagrama dentro de trama en el emisor, desencapsulamiento inverso en el receptor.
- CSMA/CD (ethernet clásico) detectaba colisiones mediante sensado continuo durante transmisión, con backoff aleatorio para resolución; obsoleto en práctica moderna por la transición a switches full-duplex con medio dedicado.
- CSMA/CA (Wi-Fi) evita colisiones mediante backoff aleatorio antes de transmisión, opcionalmente con handshake RTS/CTS para reservar medio, adaptándose a las limitaciones de radiofrecuencia donde la detección de colisiones es impracticable.
- Token passing proporcionaba acceso determinístico sin colisiones mediante posesión de testigo circulante, pero su complejidad de gestión y menor escalabilidad de velocidad lo marginalizaron frente a ethernet.
- El control de flujo en capa 2 (pausa en ethernet, duridad/NAV en Wi-Fi) regula transmisión punto-a-punto para evitar saturación de buffers locales, distinto del control de congestión end-to-end de capa de transporte.



<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/enlace/mac_llc" class="next">Siguiente</a>
</div>
