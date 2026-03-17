---
title: "Protocolos auxiliares"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Protocolos auxiliares](#protocolos-auxiliares)
  - [ARP: Address Resolution Protocol](#arp-address-resolution-protocol)
    - [Funcionamiento](#funcionamiento)
    - [Variantes y consideraciones](#variantes-y-consideraciones)
    - [Seguridad](#seguridad)
  - [ICMP: Internet Control Message Protocol](#icmp-internet-control-message-protocol)
    - [Mensajes principales](#mensajes-principales)
    - [ICMPv6 y NDP](#icmpv6-y-ndp)
  - [DHCP: Dynamic Host Configuration Protocol](#dhcp-dynamic-host-configuration-protocol)
    - [Proceso de asignación (DORA)](#proceso-de-asignación-dora)
    - [Gestión de concesiones](#gestión-de-concesiones)
    - [DHCPv6](#dhcpv6)
    - [Seguridad y consideraciones](#seguridad-y-consideraciones)
  - [Quédate con...](#quédate-con)

</div>

# Protocolos auxiliares

La operación de una red IP requiere mecanismos de soporte que no transportan datos de aplicación pero habilitan la funcionalidad de la capa de red misma. Estos protocolos auxiliares —ARP, ICMP, DHCP— resuelven problemas fundamentales: cómo traducir entre espacios de direcciones diferentes, cómo reportar errores y diagnosticar conectividad, cómo asignar configuración sin intervención manual. Sin ellos, la capa de red sería inoperable en práctica, aunque teóricamente definida.

## ARP: Address Resolution Protocol

ARP resuelve la pregunta: dada una dirección IP de destino en el mismo segmento local, ¿cuál es la dirección MAC a la que se debe dirigir la trama? Esta traducción es necesaria porque la capa de red conoce direcciones lógicas IP, pero la capa de enlace requiere direcciones físicas MAC para entrega local.

### Funcionamiento

Cuando un host necesita enviar un datagrama IP a un destino en la misma subred, consulta su caché ARP. Si la dirección IP objetivo no está mapeada, construye un paquete ARP request: dirección MAC destino broadcast (`ff:ff:ff:ff:ff:ff`), dirección IP origen (la propia), dirección IP objetivo (la que se busca). Todos los dispositivos en el segmento reciben el broadcast; el que posee la IP objetivo responde con ARP reply unicast, proporcionando su MAC.

El emisor original actualiza su caché ARP (típicamente con tiempo de vida de minutos) y procede a encapsular el datagrama IP en trama dirigida a la MAC recién descubierta. Las entradas ARP no utilizadas expiran, requiriendo nueva resolución para tráfico subsiguiente.

### Variantes y consideraciones

**Proxy ARP:** Un router responde ARP en nombre de hosts en otras redes, permitiendo comunicación entre subredes sin conocimiento de enrutamiento por parte de los hosts. Técnica legacy, generalmente deshabilitada por riesgos de seguridad.

**RARP (Reverse ARP):** Resolución inversa, MAC a IP, para dispositivos sin almacenamiento (diskless workstations) que conocen su MAC pero necesitan descubrir su IP. Obsoleto, reemplazado por BOOTP y DHCP.

**Gratuitous ARP:** Un host envía ARP request con su propia IP como origen y destino, sin esperar solicitud. Utilizado para: anunciar presencia tras arranque, detectar conflictos de dirección IP (si alguien responde, hay duplicado), y forzar actualización de cachés ARP en otros dispositivos tras cambio de MAC (failover).

### Seguridad

ARP es protocolo sin estado ni autenticación, vulnerable a spoofing: un atacante responde ARP con MAC falsa, redirigiendo tráfico destinado a otra IP hacia sí mismo. Técnicas de mitigación incluyen ARP inspection dinámica en switches (verificar consistencia de ARP con DHCP snooping), entradas ARP estáticas en hosts críticos, y segmentación de red que limita el alcance de ataques.

## ICMP: Internet Control Message Protocol

ICMP es el mecanismo de reporte de errores y diagnóstico de la capa de red. No transporta datos de aplicación sino información sobre el estado de la red misma, encapsulado en datagramas IP (protocolo 1 en IPv4, 58 en IPv6).

### Mensajes principales

**Echo Request / Echo Reply (tipos 8/0):** La base de `ping`. Un host envía echo request; el destino responde con echo reply. La medida de tiempo de ida y vuelta, y la tasa de respuesta, diagnostican conectividad, latencia, y pérdida de paquetes. El campo de identificador y secuencia permite correlacionar requests con replies.

**Destination Unreachable (tipo 3):** Reporta imposibilidad de entrega. Códigos específicos: 0 (red inalcanzable), 1 (host inalcanzable), 2 (protocolo no disponible), 3 (puerto no disponible), 4 (fragmentación necesaria pero DF bit activo), etc. Los routers generan estos mensajes cuando no pueden reenviar; el host emisor original puede reportar error a la aplicación.

**Time Exceeded (tipo 11):** El TTL de un datagrama llegó a cero antes de alcanzar destino. Código 0: en tránsito (router descarta). Código 1: en reensamblaje de fragmentos. Utilizado por `traceroute`: envía datagramas con TTL incrementando (1, 2, 3...), cada router en la ruta responde Time Exceeded, revelando la secuencia de saltos.

**Redirect (tipo 5):** Un router informa a un host que existe ruta mejor hacia cierto destino. Raramente utilizado hoy, potencialmente inseguro, frecuentemente filtrado.

**Timestamp Request/Reply (tipos 13/14):** Sincronización de relojes entre dispositivos de red, precisión limitada, raramente utilizado en favor de NTP.

### ICMPv6 y NDP

IPv6 reemplaza ARP por funciones integradas en ICMPv6. El Neighbor Discovery Protocol (NDP) utiliza mensajes:

- **Router Solicitation/Advertisement:** Descubrimiento de routers y prefijos para autoconfiguración.
- **Neighbor Solicitation/Advertisement:** Equivalente a ARP request/reply, resolviendo IPv6 a MAC.
- **Redirect:** Similar a IPv4, sugerir ruta mejor.

NDP incluye opciones de seguridad (SEND) que criptográficamente autentican mensajes, previniendo spoofing de vecinos que afecta ARP en IPv4.

## DHCP: Dynamic Host Configuration Protocol

DHCP automatiza la asignación de configuración de red: dirección IP, máscara de subred, gateway por defecto, servidores DNS, y múltiples opciones adicionales. Elimina la configuración manual, fuente de errores y conflicto de direcciones, habilitando movilidad de dispositivos entre redes.

### Proceso de asignación (DORA)

El cliente que inicia sin configuración IP utiliza broadcast para descubrir servidores:

1. **Discover:** El cliente envía DHCPDISCOVER a `255.255.255.255` (o `ff02::1:2` en IPv6), puerto UDP 67, desde `0.0.0.0` puerto 68. Incluye MAC del cliente, identificador de transacción, y parámetros deseados.

2. **Offer:** Servidores DHCP disponibles responden DHCPOFFER unicast (o broadcast si el cliente aún no tiene IP) con dirección IP ofrecida, tiempo de concesión (lease time), y parámetros de configuración.

3. **Request:** El cliente selecciona una oferta (típicamente la primera recibida) y envía DHCPREQUEST broadcast, informando a todos los servidores cuál fue aceptada. Los servidores no seleccionados liberan sus ofertas.

4. **Acknowledge:** El servidor seleccionado confirma con DHCPACK, incluyendo la configuración completa. El cliente verifica que la dirección no esté ya en uso (típicamente mediante ARP gratuito), y configura su interfaz.

### Gestión de concesiones

Las direcciones se asignan por tiempo limitado (lease time, típicamente horas a días). El cliente debe renovar (renew) antes de expiración, generalmente a la mitad del tiempo de concesión, mediante mensajes unicast directos al servidor. Si no puede contactar al servidor original, intenta rebind (broadcast) cuando el lease expira parcialmente.

El servidor mantiene estado de concesiones asignadas, permitiendo reasignación consistente (el mismo cliente típicamente recibe la misma dirección en renovaciones sucesivas) y rastreo de uso. DHCP relay agents permiten que servidores centralizados atiendan clientes en subredes remotas, reenviando mensajes broadcast como unicast hacia el servidor.

### DHCPv6

DHCPv6 (RFC 3315) opera sobre UDP puertos 546/547, utilizando direcciones link-local. Soporta dos modos:

- **Stateful:** Similar a DHCPv4, el servidor asigna direcciones completas y mantiene estado de concesiones.
- **Stateless:** El cliente obtiene dirección por SLAAC; el servidor proporciona solo información adicional (DNS, dominio) sin asignar dirección ni mantener estado.

Las opciones de DHCPv6 son más extensas y flexibles que en DHCPv4, reflejando la mayor complejidad de configuración IPv6 y la separación entre asignación de dirección y provisión de información complementaria.

### Seguridad y consideraciones

DHCP es vulnerable a ataques de servidores rogue (no autorizados que ofrecen configuración maliciosa) y agotamiento de pool (clientes falsos que solicitan múltiples direcciones). Mitigaciones:

- **DHCP snooping:** Switches confiables filtran mensajes DHCP, permitiendo solo en puertos de servidores autorizados, y construyen tabla de bindings IP-MAC-puerto para validación.
- **IP source guard:** Filtra tráfico basándose en bindings DHCP snooping, previniendo spoofing de IP.
- **Dynamic ARP inspection:** Valida ARP contra bindings DHCP, previniendo ARP spoofing.

La dependencia de DHCP para configuración crítica hace que la disponibilidad de servidores DHCP sea esencial; despliegues redundantes con failover son práctica estándar en infraestructura empresarial.


## Quédate con...

- ARP resuelve dirección IP a MAC en el segmento local mediante broadcast request y unicast reply, manteniendo caché temporal; es vulnerable a spoofing sin autenticación, requiriendo mitigaciones como ARP inspection.
- ICMP reporta errores de capa de red (Destination Unreachable, Time Exceeded) y proporciona diagnóstico (Echo Request/Reply para ping, Time Exceeded para traceroute); en IPv6, ICMPv6 incorpora NDP reemplazando funciones de ARP.
- DHCP automatiza asignación de configuración mediante proceso DORA (Discover, Offer, Request, Acknowledge), con gestión de lease time, renovación, y opciones extensibles; DHCPv6 soporta modos stateful y stateless para IPv6.
- La seguridad de estos protocolos auxiliares requiere atención: DHCP snooping, IP source guard, y dynamic ARP inspection en switches previenen servidores rogue, spoofing de IP, y spoofing de ARP respectivamente.
- Sin estos protocolos auxiliares, la operación práctica de IP sería imposible: ARP habilita la entrega local, ICMP el diagnóstico y reporte de errores, DHCP la escalabilidad de configuración en redes dinámicas.



<div class="pagination">
  <a href="/markdown/sistemas/redes/red/ipv6" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/red/enrutamiento" class="next">Siguiente</a>
</div>
