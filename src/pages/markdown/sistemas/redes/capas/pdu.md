---
title: "Concepto de PDU (Protocol Data Unit)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Concepto de PDU (Protocol Data Unit)](#concepto-de-pdu-protocol-data-unit)
  - [Nomenclatura de PDUs por capa](#nomenclatura-de-pdus-por-capa)
  - [Estructura interna de una PDU](#estructura-interna-de-una-pdu)
  - [Identificación práctica de PDUs](#identificación-práctica-de-pdus)
  - [Relación PDU-SDU y la interfaz entre capas](#relación-pdu-sdu-y-la-interfaz-entre-capas)
  - [PDU en contextos específicos](#pdu-en-contextos-específicos)
  - [Quédate con...](#quédate-con)

</div>

# Concepto de PDU (Protocol Data Unit)

La comunicación en redes organizada en capas requiere una unidad de medida que permita identificar qué información procesa cada nivel sin ambigüedad. El Protocol Data Unit (PDU) es esa unidad: el bloque completo de datos que una capa específica maneja como entidad indivisible para sus propósitos, compuesto por la información de control que la capa añade y la carga que recibe de la superior. Cada capa tiene su PDU característica, con nombre distintivo que refleja su función y su lugar en la jerarquía de encapsulamiento.

La distinción de PDUs no es mero formalismo terminológico. Cuando un ingeniero de red analiza tráfico con herramientas como Wireshark, tcpdump o analizadores de protocolo, identifica inmediatamente en qué capa opera observando la estructura de la PDU: si ve direcciones MAC y FCS, está en trama; si ve direcciones IP y TTL, en datagrama; si ve puertos y flags TCP, en segmento. La PDU es la interfaz concreta entre la abstracción de capas y la realidad de bytes transmitidos.

## Nomenclatura de PDUs por capa

En el modelo TCP/IP, las PDUs reciben denominaciones específicas que reflejan su naturaleza y función:

| Capa TCP/IP | PDU | Denominación alternativa | Componentes esenciales |
|-------------|-----|--------------------------|------------------------|
| Aplicación | Mensaje (Message) | Datos, Stream | Payload de aplicación + cabeceras protocolo específico (HTTP, SMTP, etc.) |
| Transporte | Segmento (TCP) / Datagrama (UDP) | Fragmento | Cabecera TCP/UDP + payload de aplicación |
| Red | Paquete / Datagrama (IP) | Paquete IP | Cabecera IP + segmento/datagrama transporte |
| Acceso a red | Trama (Frame) | Unidad de datos de enlace | Cabecera MAC + datagrama IP + trailer (FCS) |
| Física | Bits / Símbolos | Señales, Elementos de señalización | Codificación física de la trama completa |

La terminología varía según tradición y contexto. "Paquete" se usa coloquialmente para cualquier unidad de red, pero técnicamente designa la PDU de capa de red. En entornos OSI puros, se habla de TPDU (Transport PDU), NPDU (Network PDU), LPDU (Link PDU). La práctica moderna, dominada por TCP/IP, ha simplificado hacia los términos de la tabla anterior, aunque la precisión contextual sigue siendo importante.

## Estructura interna de una PDU

Toda PDU comparte estructura conceptual dual: información de control propia del protocolo (PCI, Protocol Control Information) y datos útiles que transporta para la capa superior (SDU, Service Data Unit). Esta dualidad se expresa en la fórmula:

**PDU = PCI (cabecera) + SDU (payload)**

El PCI contiene todos los campos que la capa necesita para cumplir su función: direccionamiento, control de errores, secuenciación, identificación de protocolo, flags de estado. El SDU es transparente para la capa actual: se procesa como bloque indiferenciado que simplemente se entregará a la capa superior si el procesamiento actual tiene éxito.

En el descenso por la pila del emisor, cada capa recibe el PDU completo de la capa superior como su SDU, añade su PCI, y el resultado se convierte en su propia PDU. En el ascenso del receptor, cada capa procesa su PCI, verifica integridad y semántica, y entrega el SDU (el PDU de la capa superior) hacia arriba. La recursividad de esta estructura —donde el todo de una capa es la parte de la inferior— es lo que hace posible el encapsulamiento jerárquico.

## Identificación práctica de PDUs

La identificación de qué PDU se está observando o procesando depende del punto de vista y de las herramientas disponibles:

**En captura de red (Wireshark, tcpdump):** La herramienta desencapsula progresivamente mostrando todas las capas. Un paquete capturado se presenta como: Frame (información de captura: timestamp, longitud, interfaz) → Ethernet II (trama: MACs, tipo) → Internet Protocol Version 4 (datagrama: IPs, TTL, protocolo) → Transmission Control Protocol (segmento: puertos, secuencias, flags) → Hypertext Transfer Protocol (mensaje: método, URI, headers). Cada nivel es la PDU de su capa y el payload del nivel inferior.

**En programación de sockets:** El desarrollador trabaja típicamente con el SDU de la capa de transporte. Un `send()` en TCP entrega bytes que se convertirán en payload de segmentos; el sistema operativo añade cabeceras TCP, IP y ethernet sin intervención del programador. El socket abstracto la PDU completa, presentando solo el flujo de bytes útiles.

**En implementación de protocolos:** Un programador de stack de red maneja PDUs explícitamente. Estructuras de datos en C como `struct iphdr` o `struct tcphdr` mapean directamente los campos del PCI. Funciones de `skb` (socket buffer) en kernel Linux manipulan cadenas de PDUs encadenadas mediante punteros, permitiendo que una misma región de memoria sea vista como diferentes PDUs según el offset.

**En equipos de interconexión:** Cada dispositivo procesa PDUs hasta su capa de operación. Un hub repite bits (PDU física) sin comprender tramas. Un switch examina tramas (PDU de enlace) para decidir puerto de salida basándose en MAC, sin examinar direcciones IP. Un router examina datagramas (PDU de red) para decisiones de enrutamiento, reencapsulando en nueva trama para el siguiente salto. Un firewall stateful examina segmentos (PDU de transporte) para seguimiento de conexiones. Un proxy de aplicación examina mensajes (PDU de aplicación) para filtrado semántico.

## Relación PDU-SDU y la interfaz entre capas

La interfaz entre capas adyacentes se define en términos de SDU y servicios, no de PDUs. La capa N ofrece servicios a la capa N+1 mediante primitivas (request, indication, response, confirm) que transportan SDUs. La capa N+1 no conoce ni necesita conocer cómo la capa N implementa esos servicios, qué PCI añade, cómo se denomina su PDU.

Esta opacidad es intencional y esencial para la modularidad. Cuando IPv6 reemplazó a IPv4 en la capa de red, las capas superiores (TCP, UDP, aplicaciones) no requirieron modificación porque su interfaz con la capa de red seguía siendo el mismo SDU: un flujo de bytes entregado a un destino identificado. La PDU cambió (cabecera IPv6 de 40 bytes fijos vs. IPv4 de 20-60 bytes), pero el servicio prestado —entrega de datagramas best-effort— y la interfaz de servicio permanecieron consistentes.

Sin embargo, la correspondencia no siempre es uno a uno. La segmentación (segmentation) ocurre cuando un SDU excede la capacidad de la PDU de la capa inferior: un mensaje de aplicación de 10 KB se divide en múltiples segmentos TCP. El ensamblaje inverso reconstruye el SDU original. La concatenación (concatenación) es lo opuesto: múltiples SDUs pequeños se agrupan en una sola PDU para eficiencia. La fragmentación (fragmentation) de IP es caso especial: un datagrama excede el MTU de un enlace, dividiéndose en fragmentos que son PDUs independientes pero que juntas componen el datagrama original.

## PDU en contextos específicos

**En Ethernet:** La trama (frame) tiene estructura precisa: preámbulo de 7 bytes (sincronización), delimitador de inicio de trama (1 byte), dirección MAC destino (6 bytes), dirección MAC origen (6 bytes), campo de tipo/longitud (2 bytes), payload de 46-1500 bytes, y secuencia de verificación de trama FCS (4 bytes). El payload mínimo de 46 bytes existe para garantizar detección de colisiones en ethernet clásico; si el datagrama IP es menor, se rellena (padding).

**En IP:** El datagrama tiene cabecera variable (20-60 bytes) con campos de versión, longitud de cabecera, tipo de servicio, longitud total, identificación, flags de fragmentación, offset de fragmento, TTL, protocolo superior, checksum de cabecera, y direcciones origen/destino. El campo "protocolo" identifica el contenido del payload: 6 para TCP, 17 para UDP, 1 para ICMP, permitiendo al receptor demultiplexar correctamente.

**En TCP:** El segmento tiene cabecera de 20-60 bytes con puertos origen/destino, número de secuencia, número de acuse de recibo, offset de datos, flags (URG, ACK, PSH, RST, SYN, FIN), ventana de recepción, checksum, puntero urgente, y opciones. El checksum cubre cabecera, payload y pseudo-cabecera IP (direcciones y protocolo), verificando integridad end-to-end aunque routers intermedios modifiquen ciertos campos IP.

> La confusión terminológica entre "datagrama" y "paquete" es frecuente y contextual. En sentido estricto, datagrama es PDU de capa de red en modo no conectado (IP, UDP), mientras que paquete es término genérico. Sin embargo, la práctica ha asimilado ambos, y "paquete" prevalece en uso coloquial. Más importante que la pureza terminológica es la claridad contextual: cuando un documento técnico distingue "paquetes IP" de "tramas ethernet", está identificando correctamente PDUs de capas diferentes.


## Quédate con...

- El PDU es la unidad de datos completa que una capa específica maneja como entidad indivisible, compuesta por información de control propia (PCI, cabecera) y carga útil de la capa superior (SDU, payload).
- Cada capa TCP/IP denomina su PDU característicamente: mensaje (aplicación), segmento/datagrama (transporte), paquete/datagrama (red), trama (enlace), bits (física); la precisión terminológica facilita diagnóstico y diseño.
- La relación recursiva PDU-SDU —donde el PDU de una capa es el SDU de la inferior— materializa el encapsulamiento jerárquico y habilita la independencia evolutiva entre capas.
- La identificación de PDUs en práctica depende del punto de observación: herramientas de captura desencapsulan progresivamente, programadores de sockets abstraen la PDU completa, implementadores de protocolos manipulan estructuras de PCI explícitas.
- Equipos de interconexión procesan PDUs hasta su capa de operación (hubs bits, switches tramas, routers datagramas, firewalls segmentos, proxies mensajes), lo que determina su funcionalidad y su visibilidad del tráfico.



<div class="pagination">
  <a href="/markdown/sistemas/redes/capas/encapsulamiento" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/capas/analogias" class="next">Siguiente</a>
</div>
