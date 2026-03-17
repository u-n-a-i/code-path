---
title: "Encapsulamiento de datos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Encapsulamiento de datos](#encapsulamiento-de-datos)
  - [El flujo de encapsulamiento](#el-flujo-de-encapsulamiento)
  - [La inversa: desencapsulamiento](#la-inversa-desencapsulamiento)
  - [Cabeceras y payload: la estructura de cada nivel](#cabeceras-y-payload-la-estructura-de-cada-nivel)
  - [Quédate con...](#quédate-con)

</div>

# Encapsulamiento de datos

La comunicación entre sistemas requiere que la información atraviese múltiples capas de procesamiento, cada una añadiendo estructura y metadatos necesarios para su función específica. Este proceso de envoltura progresiva —encapsulamiento— transforma datos abstractos de aplicación en señales físicas transmisibles, y su inverso —desencapsulamiento— recupera esos datos originales en el destino. Comprender este flujo es comprender cómo la abstracción de capas se materializa en unidades concretas de información que viajan por la red.

El encapsulamiento no es mero empaquetado administrativo; es la materialización de los servicios que cada capa ofrece a la superior. Cuando la capa de transporte añade números de secuencia, está comprometiéndose a entregar datos ordenadamente. Cuando la capa de red añade direcciones IP, está asumiendo responsabilidad por el enrutamiento. Cada cabecera es un contrato: la capa inferior garantiza ciertos comportamientos, la superior delega ciertas preocupaciones. El flujo descendente en el emisor construye estos compromisos progresivamente; el flujo ascendente en el receptor los verifica y disuelve.

## El flujo de encapsulamiento

Consideremos un servidor web que responde a una solicitud con una página HTML de 10 KB. Los datos de aplicación —la estructura HTML, los encabezados HTTP, los metadatos de sesión— comienzan como un flujo de bytes en memoria del proceso servidor. Este flujo constituye el **payload** o carga útil inicial, la información que la aplicación desea comunicar, independientemente de cómo viaje.

En la **capa de aplicación**, estos datos pueden ya estructurarse según protocolos específicos: HTTP añade cabeceras de estado (200 OK), tipo de contenido (text/html), codificación. Sin embargo, desde la perspectiva del modelo de capas, esto ocurre dentro de la capa superior; el proceso de encapsulamiento formal comienza cuando estos datos descienden hacia capas inferiores.

Al llegar a la **capa de transporte** (TCP en este caso), el sistema operativo divide el flujo de aplicación en segmentos de tamaño apropiado —típicamente hasta 1460 bytes de payload para acomodar dentro de un MTU estándar de 1500 bytes— y añade la **cabecera TCP**. Esta cabecera, de 20 bytes mínimo (hasta 60 con opciones), incluye: puertos origen y destino que identifican los procesos comunicantes; números de secuencia que posicionan cada byte en el flujo completo; números de acuse de recibo que confirman datos recibidos; flags de control (SYN, ACK, FIN, etc.); ventana de recepción que anuncia capacidad de buffer; y checksum para detección de errores. El resultado es un **segmento TCP**: cabecera transporte + payload de aplicación.

El segmento desciende a la **capa de red** (IP), donde se encapsula en un **datagrama IP**. La cabecera IP, de 20 bytes mínimo (hasta 60 con opciones), añade: direcciones IP origen y destino que identifican los hosts en la red global; campo de protocolo que indica TCP como contenido superior; identificador de fragmentación si el datagrama excede el MTU del enlace siguiente; tiempo de vida (TTL) que limita saltos para prevenir bucles infinitos; y checksum de cabecera IP. El datagrama resultante —cabecera IP + segmento TCP— es la unidad de enrutamiento, independiente de los medios físicos que atravesará.

En la **capa de acceso a red** (ethernet, por ejemplo), el datagrama IP se encapsula en una **trama**. La cabecera ethernet añade: dirección MAC destino del siguiente salto (obtenida mediante ARP si es local, o del router por defecto); dirección MAC origen de la interfaz emisora; campo de tipo (0x0800 para IPv4) que identifica el protocolo encapsulado; y secuencia de verificación de trama (FCS) al final, calculada mediante CRC-32, que permite detectar corrupción en tránsito. La trama completa —preambulo de sincronización, cabecera ethernet, datagrama IP, FCS— constituye la unidad transmitida por el medio físico.

Finalmente, la **capa física** convierte la trama en **bits**, codificando cada uno como variaciones de voltaje, luz o radiofrecuencia según el medio. En ethernet 1000BASE-T, los bits se agrupan en símbolos 8b/10b, se distribuyen en cuatro pares trenzados, se modulan en amplitud con cancelación de eco. La secuencia de bits deja de ser información abstracta para convertirse en energía física que atraviesa cables, espacio o fibra.

## La inversa: desencapsulamiento

En el receptor, el proceso se invierte. La capa física detecta señales, recupera la sincronización de bit, decodifica símbolos, reconstruye la secuencia de bits original. La capa de enlace examina la trama: verifica el FCS descartando si hay corrupción, verifica la dirección MAC destino (aceptando solo si coincide con la interfaz o es broadcast/multicast relevante), extrae el campo de tipo, y entrega el datagrama IP contenido a la capa de red.

La capa de red examina la cabecera IP: verifica el checksum de cabecera, decrementa el TTL descartando si llega a cero (generando ICMP time exceeded si corresponde), verifica que la dirección destino coincida con una de sus interfaces, consulta el campo de protocolo, y entrega el segmento TCP a la capa de transporte.

La capa de transporte examina la cabecera TCP: verifica el checksum (que cubre cabecera y payload), verifica que los puertos correspondan a sockets abiertos, procesa números de secuencia para ordenar y detectar duplicados, envía acuses de recibo, gestiona la ventana de flujo, y entrega los bytes de payload a la aplicación receptora en el orden correcto del flujo.

La aplicación finalmente recibe los datos HTTP originales, sin conocimiento de las cabeceras añadidas y removidas en el trayecto, sin saber si viajaron por ethernet o Wi-Fi, si atravesaron diez routers o uno, si fueron fragmentados o no. El encapsulamiento ha cumplido su propósito: la complejidad de la comunicación se oculta, la abstracción se preserva.

## Cabeceras y payload: la estructura de cada nivel

En cada capa, la unidad de datos se denomina PDU (Protocol Data Unit), compuesta por cabecera de protocolo (PCI, Protocol Control Information) y payload (SDU, Service Data Unit). La relación es recursiva: el SDU de una capa es el PDU completo de la capa superior.

| Capa | PDU | Cabecera típica | Contenido (payload) |
|------|-----|-----------------|---------------------|
| Aplicación | Mensaje | HTTP, SMTP, DNS headers | Datos de usuario |
| Transporte | Segmento (TCP) / Datagrama (UDP) | Puerto origen/destino, secuencia, flags | Mensaje de aplicación |
| Red | Paquete/Datagrama | IP origen/destino, TTL, protocolo | Segmento/datagrama transporte |
| Enlace | Trama | MAC origen/destino, tipo, FCS | Paquete de red |
| Física | Bits | Preambulo, delimitadores | Trama completa |

El overhead de encapsulamiento es significativo. Un paquete TCP/IP típico sobre ethernet transporta 1460 bytes de payload de aplicación en un total de 1538 bytes físicos: 14 bytes de cabecera ethernet, 20 de IP, 20 de TCP, más 4 de FCS, más 8 de preámbulo y delimitador. Aproximadamente 4.5% del ancho de banda se consume en metadatos de protocolo. En paquetes pequeños —como las confirmaciones TCP (ACKs) que transportan solo cabeceras— el overhead puede exceder el 90% del tráfico total, fenómeno que protocolos como TCP delayed ACK intentan mitigar.

La fragmentación ilustra la interacción entre capas. Si un datagrama IP excede el MTU de un enlace intermedio, la capa de red lo divide en fragmentos que viajan independientemente y se reensamblan en el destino final. Cada fragmento lleva cabecera IP completa, multiplicando el overhead. IPv6 eliminó la fragmentación en routers —solo los hosts finales fragmentan— simplificando la capa de red a costa de requerir path MTU discovery.

El tunelamiento representa encapsulamiento recursivo: un datagrama IP completo se convierte en payload de otro protocolo. VPNs encapsulan IP privado dentro de IP público; GRE y VXLAN encapsulan tráfico de red dentro de UDP; incluso HTTP puede encapsular otros protocolos (WebSocket, CONNECT para proxies). Cada nivel de tunelamiento añade sus cabeceras, incrementando overhead pero habilitando funcionalidades de aislamiento, seguridad o travesía de NAT.

> La terminología de unidades de datos varía según contexto y autor. "Paquete" se usa coloquialmente para cualquier unidad de red, pero técnicamente es la PDU de la capa de red (IP). "Trama" es específico de capa de enlace. "Segmento" para TCP, "datagrama" para UDP y IP. "Mensaje" para aplicación. La precisión terminológica importa en diagnóstico: cuando un administrador dice "el paquete se pierde", la pregunta correcta es "¿en qué capa? ¿el datagrama IP no llega, o la trama se corrompe, o el segmento TCP no se acusa?".


## Quédate con...

- El encapsulamiento es el proceso de envoltura progresiva donde cada capa añade cabeceras específicas al payload recibido de la capa superior, transformando datos de aplicación en unidades transmisibles por el medio físico.
- El flujo descendente construye: segmento TCP (puertos, secuencias) → datagrama IP (direcciones, enrutamiento) → trama de enlace (MAC, verificación) → bits físicos (codificación, modulación).
- El desencapsulamiento ascendente verifica y elimina cabeceras progresivamente, entregando finalmente a la aplicación solo los datos originales, preservando la ilusión de comunicación directa.
- Cada cabecera representa un contrato de servicio: TCP garantiza entrega ordenada, IP garantiza direccionamiento global, ethernet garantiza entrega local sin corrupción detectable.
- El overhead de protocolos consume porcentaje significativo del ancho de banda, particularmente en paquetes pequeños; la fragmentación y el tunelamiento multiplican este costo pero habilitan funcionalidades esenciales de interoperabilidad y flexibilidad.



<div class="pagination">
  <a href="/markdown/sistemas/redes/capas/tcp_ip" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/capas/pdu" class="next">Siguiente</a>
</div>
