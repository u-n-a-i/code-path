---
title: "Función de la capa de red"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Función de la capa de red](#función-de-la-capa-de-red)
  - [Enrutamiento](#enrutamiento)
  - [Direccionamiento lógico](#direccionamiento-lógico)
  - [Fragmentación](#fragmentación)
  - [Redes públicas y privadas](#redes-públicas-y-privadas)
  - [Quédate con...](#quédate-con)

</div>

# Función de la capa de red

La capa de red es donde la comunicación trasciende el ámbito local. Mientras la capa de enlace conecta dispositivos vecinos que comparten un medio físico, la capa de red conecta redes distintas, posiblemente separadas por miles de kilómetros, múltiples tecnologías de transmisión, y organizaciones administrativas diferentes. Esta capacidad de interconexión global —la internet en su sentido técnico— requiere mecanismos de direccionamiento que escalen más allá de cualquier dominio local, de enrutamiento que determine caminos eficientes a través de topologías arbitrarias, y de fragmentación que adapte unidades de datos a las capacidades de enlaces heterogéneos en la ruta.

## Enrutamiento

El enrutamiento es el proceso de determinar y mantener caminos óptimos desde origen hasta destino a través de múltiples redes intermedias. A diferencia del switching de capa 2, que examina direcciones locales y toma decisiones por tabla de asociación aprendida, el enrutamiento opera con direcciones lógicas jerárquicas y algoritmos distribuidos que calculan topologías globales.

Cada router mantiene una **tabla de enrutamiento** que asocia prefijos de red destino con interfaces de salida y siguientes saltos. Esta tabla se construye mediante:

**Enrutamiento estático:** Rutas configuradas manualmente por administradores. Simple, predecible, pero inflexible ante fallos o cambios de topología. Utilizado en redes pequeñas, rutas por defecto, o situaciones donde el control explícito es prioritario sobre adaptabilidad.

**Enrutamiento dinámico:** Protocolos que intercambian información de topología entre routers, recalculando automáticamente ante cambios. Dos familias principales:

- **IGP (Interior Gateway Protocols):** OSPF (Open Shortest Path First), IS-IS, EIGRP. Operan dentro de un sistema autónomo (AS), típicamente una organización. OSPF utiliza algoritmo de Dijkstra para calcular caminos mínimos desde cada router a todos los destinos del área, basado en costo de enlaces configurable (típicamente inversamente proporcional a velocidad). Converge en segundos ante fallos.

- **EGP (Exterior Gateway Protocol):** BGP (Border Gateway Protocol). Opera entre sistemas autónomos, la escala de internet global. BGP no optimiza por velocidad sino por política: rutas se seleccionan según atributos de preferencia de operadores, políticas comerciales de peering, y reglas de filtrado de tráfico. La convergencia es deliberadamente lenta (minutos) para evitar oscilaciones de ruta que inestabilizarían la internet.

El enrutamiento es **hop-by-hop**: cada router toma decisión independiente basada en su tabla. No hay conexión establecida ni estado de ruta mantenido; cada datagrama puede seguir camino diferente. Esta independencia de estado en nodos intermedios es la clave de la robustez de la arquitectura: routers pueden fallar y recuperarse sin afectar comunicaciones en curso, solo redireccionando tráfico futuro.

## Direccionamiento lógico

Las direcciones de capa de red —IPv4 de 32 bits, IPv6 de 128 bits— son identificadores lógicos asignados a interfaces, no fijados en hardware como las MAC. Esta separación permite flexibilidad: una máquina puede cambiar de red manteniendo su identidad operativa, o mantener múltiples direcciones en una interfaz, o moverse entre redes con dirección dinámica.

El direccionamiento es **jerárquico**, no plano como las MAC. Una dirección IPv4 se divide en prefijo de red y identificador de host. El prefijo se agrupa en bloques asignados a organizaciones por autoridades regionales (RIPE, ARIN, APNIC), permitiendo agregación de rutas: millones de direcciones individuales se anuncian como un único prefijo en tablas de enrutamiento globales.

Las **direcciones especiales** incluyen: privadas (RFC 1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) para redes internas no enrutables en internet pública; loopback (127.0.0.0/8) para comunicación local; multicast (224.0.0.0/4) para grupos de destinatarios; y broadcast limitado (255.255.255.255) para red local.

IPv6 extiende el espacio a 128 bits, eliminando la necesidad de NAT y simplificando la renumeración mediante identificadores de interfaz basados en MAC (EUI-64) o aleatorios (privacy extensions). La jerarquía es más estricta: 64 bits de prefijo de red típicamente, 64 bits de interfaz, facilitando autoconfiguración sin estado (SLAAC).

## Fragmentación

Los diferentes enlaces en una ruta pueden tener diferentes MTU (Maximum Transmission Unit): 1500 bytes para ethernet estándar, 9000 para jumbo frames, 576 mínimo para IP, valores variables para PPP, túneles, etc. Cuando un datagrama excede el MTU de un enlace saliente, el router debe **fragmentar**: dividir el datagrama en fragmentos menores que reenviar independientemente.

La fragmentación IP utiliza campos de cabecera específicos: **Identification** (identifica fragmentos del mismo datagrama original), **Flags** (MF, More Fragments, indica si hay más fragmentos; DF, Don't Fragment, prohibe fragmentación), y **Fragment Offset** (posición del fragmento en el datagrama original, en unidades de 8 bytes).

El reensamblaje ocurre en el destino final, no en routers intermedios. Esto simplifica el diseño de routers pero implica que fragmentos pueden tomar rutas diferentes, llegar desordenados, o perderse individualmente. Si cualquier fragmento se pierde, el datagrama completo es irrecuperable; IP no retransmite.

IPv6 eliminó la fragmentación en routers por eficiencia. Solo los hosts finales fragmentan, y el mecanismo es diferente: cabecera de extensión Fragment con offset y M bit, pero sin Identification (usando dirección origen como contexto). Los routers que encuentran paquetes excediendo MTU descartan y envían ICMPv6 "Packet Too Big", requiriendo que el origen reduzca tamaño (Path MTU Discovery).

## Redes públicas y privadas

La distinción entre redes públicas y privadas no es técnica sino administrativa y de alcance, aunque tiene consecuencias técnicas profundas.

**Redes públicas** son aquellas con direccionamiento globalmente enrutable, conectadas a internet. Sus direcciones IP deben ser únicas mundialmente, asignadas por autoridades de registro. El tráfico fluye sin restricción (salvo firewalls y políticas) entre cualquier par de puntos conectados. La infraestructura es operada por múltiples entidades con acuerdos de interconexión (peering, transit).

**Redes privadas** utilizan direccionamiento no enrutable globalmente (RFC 1918 en IPv4, ULA en IPv6) o están físicamente aisladas. Pueden conectarse a internet mediante NAT (Network Address Translation), que reescribe direcciones origen en tránsito, permitiendo múltiples dispositivos compartir una única dirección pública. El NAT conserva direcciones IPv4 escasas pero rompe la semántica end-to-end de internet: conexiones iniciadas desde fuera son difíciles, protocolos que incluyen direcciones en payload (FTP, SIP) requieren ayudas especiales (ALGs), y la arquitectura de pares se complica.

La transición hacia IPv6 busca restaurar la conectividad end-to-end mediante abundancia de direcciones, aunque firewalls de estado mantienen control de seguridad. Las redes privadas IPv6 utilizan ULA (Unique Local Addresses, fc00::/7) para comunicación interna no enrutable, similar en intención a RFC 1918 pero con probabilidad baja de colisión por aleatoriedad en prefijo.

La frontera entre público y privado es implementada por dispositivos de capa 3: routers con ACLs, firewalls de estado, NAT boxes. Estos examinan direcciones IP y deciden reenvío, traducción, o descarte. La seguridad perimetral (perimeter security) asume que interior es confiable y exterior no; modelos modernos (zero trust) cuestionan esta asunción, requiriendo autenticación y autorización incluso para comunicación interna.

> La capa de red IP proporciona servicio de "mejor esfuerzo" (best effort): sin garantías de entrega, orden, duplicación, o tiempo. Esta minimalismo es deliberado: permite implementaciones eficientes y adaptables, delegando fiabilidad a capas superiores (TCP) o aceptando la inestabilidad para aplicaciones que la toleran (streaming, voz). La frase "IP over everything" captura la filosofía: IP puede operar sobre cualquier tecnología de enlace, y cualquier servicio puede operar sobre IP. Esta adaptabilidad es la base de la supervivencia de la arquitectura a través de décadas de evolución tecnológica.


## Quédate con...

- El enrutamiento determina caminos óptimos mediante tablas construidas estáticamente o dinámicamente (IGP como OSPF para intra-dominio, BGP para inter-dominio), operando independientemente en cada salto sin estado de conexión mantenido en routers.
- El direccionamiento IP es jerárquico (prefijo de red, identificador de host), asignado lógicamente y configurable, permitiendo agregación de rutas y flexibilidad de topología imposible con direcciones MAC planas y fijas.
- La fragmentación adapta datagramas a MTU variables de enlaces en la ruta; IPv4 permite fragmentación en routers, IPv6 la elimina requiriendo descubrimiento de MTU de ruta por los hosts.
- Las redes privadas utilizan direccionamiento no enrutable (RFC 1918, ULA) y típicamente NAT para conectividad a internet, sacrificando semántica end-to-end por conservación de direcciones y seguridad perimetral; IPv6 busca restaurar conectividad directa mediante abundancia de direcciones.
- La capa de red IP proporciona servicio minimalista de mejor esfuerzo, sin garantías de calidad, que habilita implementaciones eficientes y evolutivas delegando fiabilidad a capas superiores según necesidades de aplicación.


<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/red/ipv4" class="next">Siguiente</a>
</div>
