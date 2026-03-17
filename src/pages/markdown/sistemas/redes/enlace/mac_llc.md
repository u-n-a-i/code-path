---
title: "MAC y LLC"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [MAC y LLC](#mac-y-llc)
  - [Subcapa MAC: control del medio](#subcapa-mac-control-del-medio)
  - [Subcapa LLC: control lógico del enlace](#subcapa-llc-control-lógico-del-enlace)
  - [Formato de una dirección MAC](#formato-de-una-dirección-mac)
  - [Diferencia entre MAC e IP](#diferencia-entre-mac-e-ip)
  - [Quédate con...](#quédate-con)

</div>

 # MAC y LLC

La capa de enlace de datos del modelo OSI se subdivide en dos subcapas funcionales que responden a preocupaciones distintas: la **subcapa MAC (Media Access Control)** gestiona la interacción con el medio físico específico —direcciones, acceso, sincronización— mientras que la **subcapa LLC (Logical Link Control)** proporciona una interfaz uniforme hacia la capa de red, abstrayendo las peculiaridades de diferentes tecnologías de enlace. Esta separación permite que la misma interfaz LLC opere sobre ethernet, Wi-Fi, Token Ring, o cualquier otro medio, mientras cada medio implementa su propio MAC optimizado para sus características físicas.

## Subcapa MAC: control del medio

La subcapa MAC es donde la capa de enlace se encuentra con lo específico del medio. Sus responsabilidades incluyen el direccionamiento físico, el control de acceso al medio compartido, y la delimitación de tramas.

El **direccionamiento físico** utiliza direcciones MAC (Media Access Control), también llamadas direcciones hardware, físicas, o de capa 2. Estas direcciones son identificadores únicos de 48 bits asignados a interfaces de red en fabricación, teóricamente globales e inmutables (aunque pueden modificarse por software en muchos sistemas). La unicidad garantiza que en un segmento de red local, cada dispositivo es direccionable sin ambigüedad.

El **control de acceso al medio** implementa los mecanismos específicos de cada tecnología: CSMA/CD para ethernet clásico, CSMA/CA para Wi-Fi, token passing para Token Ring, TDMA para algunas redes celulares. El MAC gestiona cuándo puede transmitirse, cómo se detectan o evitan colisiones, y cómo se recupera de condiciones de error de medio.

La **delimitación de tramas** —preambulo, SFD, flags de inicio y fin— es función MAC porque está íntimamente ligada a las características del medio: el preámbulo de ethernet permite sincronización de reloj en receptores; los flags de HDLC deben ser únicos en el flujo de bits, requiriendo bit-stuffing en medios seriales.

## Subcapa LLC: control lógico del enlace

La subcapa LLC proporciona servicios a la capa de red independientemente del medio subyacente, permitiendo que protocolos de red (IP, IPX, AppleTalk históricamente) operen sin modificación sobre cualquier tecnología de enlace.

La **multiplexación de protocolos de capa superior** es función esencial de LLC. Cuando una trama llega, LLC debe entregar su payload al protocolo de red apropiado. En ethernet moderno, esto se logra mediante el campo Type (0x0800 para IPv4, 0x86DD para IPv6). En implementaciones IEEE 802.2 originales, LLC utilizaba SAPs (Service Access Points) que identificaban protocolos de manera análoga a cómo los puertos identifican aplicaciones en transporte.

El **control de errores básico** en LLC incluye mecanismos de reconocimiento y retransmisión para servicios de enlace confiable, aunque en práctica moderna estos servicios raramente se utilizan: ethernet asume medio confiable con detección de errores por FCS pero sin retransmisión de enlace; la confiabilidad se delega a TCP o se asume por la aplicación. LLC tipo 1 proporciona servicio no reconocido; tipo 2, servicio orientado a conexión con control de errores y flujo; tipo 3, servicio reconocido sin conexión.

## Formato de una dirección MAC

Una dirección MAC consta de 48 bits (6 bytes), expresada típicamente en notación hexadecimal con separadores de dos puntos o guiones (00:1A:2B:3C:4D:5E). La estructura tiene significado definido:

Los **primeros 24 bits (3 bytes)** constituyen el OUI (Organizationally Unique Identifier), asignado por IEEE a fabricantes de equipos de red. El OUI identina quién fabricó la interfaz: 00:50:56 para VMware, 00:0C:29 para VMware también, 00:1B:21 para Intel, 00:0A:95 para Apple. Los tres bits más significativos del primer byte tienen significado especial: el bit 0 (I/G, Individual/Group) distingue direcciones individuales (0) de multicast (1); el bit 1 (U/L, Universal/Local) indica si la dirección es globalmente única (0) o localmente administrada (1, para virtualización o configuraciones específicas).

Los **últimos 24 bits** son asignados por el fabricante de manera única para cada interfaz producida bajo ese OUI. La combinación de OUI + identificador de interfaz garantiza unicidad global teórica, aunque la clonación, virtualización, y errores de fabricante introducen duplicaciones ocasionales.

Direcciones especiales incluyen: **broadcast** (FF:FF:FF:FF:FF:FF), dirección de grupo que todas las interfaces reconocen como destino propio; **multicast** (bit I/G a 1), donde el resto de bits identifican grupos específicos de suscripción (01:00:5E:xx:xx:xx para multicast IP sobre ethernet); y rangos reservados para protocolos específicos.

## Diferencia entre MAC e IP

La distinción entre direcciones MAC e IP es fundamental para comprender la arquitectura de redes en capas, aunque ambas identifican interfaces de red.

| Característica | Dirección MAC | Dirección IP |
|----------------|---------------|--------------|
| **Capa** | Enlace de datos (capa 2) | Red (capa 3) |
| **Espacio de direcciones** | Plano (flat), sin estructura jerárquica | Jerárquico, con prefijos de red y host |
| **Alcance** | Local al segmento de broadcast | Global en internet, local en redes privadas |
| **Asignación** | Fija en hardware (teóricamente), o configurada localmente | Asignada dinámicamente (DHCP) o estáticamente, puede cambiar |
| **Formato** | 48 bits, hexadecimal | 32 bits (IPv4) o 128 bits (IPv6), decimal punteada o hexadecimal |
| **Ruteabilidad** | No enrutable; no atraviesa routers | Enrutable; routers reenvían basándose en prefijos de red |

La dirección MAC identifica quién es en el medio físico local. Cuando tu dispositivo envía una trama, la dirección MAC destino debe ser alcanzable directamente en el mismo segmento de red. Si el destino está en otra red, la trama se dirige al router por defecto (gateway), cuya MAC es conocida localmente mediante ARP, y el router se encarga del reenvío hacia el destino final.

La dirección IP identifica dónde está en la red lógica global. Los routers examinan prefijos de red en direcciones IP para tomar decisiones de reenvío entre redes. La IP es independiente del medio: una interfaz mantiene su IP si cambia de ethernet a Wi-Fi, mientras que la MAC cambia con la interfaz física.

La resolución de direcciones —traducir IP conocida a MAC necesaria— es función del protocolo ARP (Address Resolution Protocol) en IPv4. El dispositivo emite broadcast ARP preguntando "¿quién tiene esta IP?"; el poseedor responde con su MAC. Para IPv6, Neighbor Discovery (NDP) proporciona función equivalente mediante mensajes ICMPv6. Esta resolución ocurre solo en el segmento local; más allá del primer router, solo las direcciones IP son relevantes para el enrutamiento.

> La separación de direcciones MAC e IP habilita la flexibilidad arquitectónica esencial. Puedes cambiar de proveedor de internet —cambiando tu prefijo de red IP— sin modificar hardware. Puedes reemplazar una tarjeta de red defectuosa —cambiando tu MAC— manteniendo tu configuración IP. Puedes virtualizar múltiples máquinas en un solo host, cada una con su MAC e IP, compartiendo el medio físico. Esta separación de identificadores de enlace e identificadores de red es lo que permite que la internet escale y evolucione sin requerir cambios en hardware de cada dispositivo conectado.


## Quédate con...

- La capa de enlace se subdivide en MAC (específica del medio: direcciones físicas, acceso al medio, delimitación de tramas) y LLC (independiente del medio: multiplexación de protocolos de capa superior, servicios de enlace opcionales).
- La dirección MAC es identificador único de 48 bits asignado en fabricación, estructurado en OUI (fabricante) e identificador de interfaz, con bits indicadores de individual/grupo y universal/local.
- LLC proporciona uniformidad a la capa de red ocultando diferencias entre tecnologías de enlace, mediante SAPs históricos o campos Type en ethernet moderno.
- MAC e IP operan en capas diferentes con alcances diferentes: MAC es local al segmento físico, plana, fijada en hardware; IP es global (potencialmente), jerárquica, asignada dinámicamente; los routers reenvían basándose en IP, ignorando MACs salvo en el salto local.
- La resolución ARP/NDP traduce entre estos espacios de direcciones en el segmento local, permitiendo que la arquitectura jerárquica de IP opere sobre la topología plana de MACs.



<div class="pagination">
  <a href="/markdown/sistemas/redes/enlace/tramas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/enlace/errores" class="next">Siguiente</a>
</div>
