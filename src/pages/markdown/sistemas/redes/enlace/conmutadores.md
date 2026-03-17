---
title: "Switches y su funcionamiento"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Switches y su funcionamiento](#switches-y-su-funcionamiento)
  - [Cómo aprende un switch la tabla MAC](#cómo-aprende-un-switch-la-tabla-mac)
  - [Flooding, forwarding y filtering](#flooding-forwarding-y-filtering)
  - [Dominio de colisión versus dominio de broadcast](#dominio-de-colisión-versus-dominio-de-broadcast)
  - [STP: Spanning Tree Protocol](#stp-spanning-tree-protocol)
  - [VLANs: Virtual LANs](#vlans-virtual-lans)
  - [Quédate con...](#quédate-con)

</div>

# Switches y su funcionamiento

El switch es el dispositivo que transformó las redes de área local desde sistemas compartidos y contenciosos en infraestructuras dedicadas y deterministas. Mientras los hubs repetían indiscriminadamente cada bit recibido a todos los puertos, manteniendo la lógica de medio compartido del ethernet original, los switches examinan las tramas completas, toman decisiones basadas en direcciones, y establecen comunicaciones paralelas simultáneas. Esta inteligencia de capa de enlace —la capacidad de aprender, recordar y decidir— es lo que permite que las redes modernas escalen desde docenas hasta millones de dispositivos sin colapso por contención.

## Cómo aprende un switch la tabla MAC

La tabla de direcciones MAC —también llamada CAM (Content Addressable Memory) table, o simplemente tabla de reenvío— es el corazón del switch. Asocia direcciones MAC de dispositivos finales con los puertos físicos donde son alcanzables. A diferencia de la configuración estática de routers, esta tabla se construye dinámicamente mediante observación del tráfico.

El proceso de aprendizaje es pasivo y continuo. Cuando una trama llega a cualquier puerto, el switch examina la dirección MAC origen. Si esta dirección no está en la tabla, o si está asociada a un puerto diferente, el switch actualiza: registra la dirección, el puerto de llegada, y un timestamp. Esta asociación permanece válida durante un período de envejecimiento (aging time, típicamente 300 segundos por defecto); si no se refresca por nueva trama desde esa MAC, la entrada se elimina.

La tabla tiene capacidad finita, determinada por recursos de hardware. En switches empresariales, miles o decenas de miles de entradas. Si la tabla se llena, el switch puede dejar de aprender nuevas direcciones hasta que entradas antiguas expiren, o implementar políticas de reemplazo. Un ataque de saturación de MAC (MAC flooding), donde un atacante genera tramas con direcciones origen aleatorias, puede llenar la tabla forzando comportamiento de hub (flooding de todo tráfico unicast), lo que permite sniffing de tráfico ajeno.

El aprendizaje es local a cada VLAN en switches que implementan VLANs; la misma dirección MAC puede aparecer en diferentes VLANs en diferentes puertos sin conflicto, porque las tablas son lógicamente separadas.

## Flooding, forwarding y filtering

Estas tres operaciones constituyen el repertorio completo de decisiones de reenvío de un switch.

**Flooding (inundación):** Cuando una trama unicast llega y la dirección MAC destino no está en la tabla, el switch la transmite a todos los puertos excepto el de origen. Esta operación es necesaria para garantizar entrega cuando la ubicación del destino es desconocida, pero es ineficiente: desperdicia ancho de banda en segmentos donde el destino no reside. El flooding también se aplica obligatoriamente a tramas broadcast (destino FF:FF:FF:FF:FF:FF) y multicast (bit I/G activo), que por definición deben alcanzar múltiples destinos.

**Forwarding (reenvío):** Cuando la dirección MAC destino está en la tabla asociada a un puerto diferente del de origen, el switch transmite la trama solo por ese puerto. Esta es la operación eficiente deseada: comunicación dedicada entre origen y destino, sin afectar a otros segmentos. Si el puerto destino es el mismo que el de origen (misma dirección en ambos lados de un enlace, típicamente por topología con hub intermedio), el switch descarta la trama (filtering implícito).

**Filtering (filtrado):** El switch descarta tramas bajo ciertas condiciones: puerto destino igual a puerto origen (no hay necesidad de reenviar); tramas con errores de FCS (corruptas); tramas que violan políticas de seguridad configuradas (port security, MAC ACLs); o tramas en VLANs no permitidas en el puerto destino.

La eficiencia de un switch se mide por su capacidad de minimizar flooding y maximizar forwarding. Una red bien diseñada, donde los dispositivos son estacionarios y el tráfico es predecible, alcanza rápidamente estado estable donde la mayoría del tráfico es forwarding directo.

## Dominio de colisión versus dominio de broadcast

Estos conceptos definen los límites de dos fenómenos distintos en la red.

**Dominio de colisión:** El segmento de red donde las transmisiones de múltiples dispositivos pueden interferirse físicamente. En ethernet half-duplex con hubs, todo el segmento compartido es un dominio de colisión: si dos dispositivos transmiten simultáneamente, colisionan. Cada puerto de switch es su propio dominio de colisión en full-duplex: emisor y receptor tienen canales separados, sin posibilidad de colisión. Un switch de 24 puertos crea 24 dominios de colisión separados, más los dominios de sus enlaces uplink.

La eliminación de dominios de colisión compartidos es el beneficio fundamental del switching. La CSMA/CD, con su complejidad de backoff y sus límites de distancia, se vuelve innecesaria; la operación full-duplex permite que ambos dispositivos transmitan simultáneamente sin contención.

**Dominio de broadcast:** El segmento de red donde las tramas broadcast (y multicast no filtrado) son propagadas. Todos los puertos de un switch en la misma VLAN comparten un dominio de broadcast. Los routers no reenvían broadcasts de capa 2; por tanto, cada interfaz de router es el límite de un dominio de broadcast.

El dominio de broadcast afecta la eficiencia: cada broadcast debe ser procesado por todas las interfaces en el dominio, consumiendo ciclos de CPU y ancho de banda. En redes grandes, broadcasts excesivos —broadcast storms— pueden degradar rendimiento o causar inestabilidad. La segmentación en VLANs y el enrutamiento inter-VLAN contienen el alcance de broadcasts.

## STP: Spanning Tree Protocol

Las redes redundantes —múltiples caminos entre switches para tolerancia a fallos— crean peligro de bucles de capa 2. Si una trama broadcast se reenvía en círculo infinito, multiplicándose en cada iteración, el resultado es broadcast storm que satura todos los enlaces y colapsa la red.

STP (IEEE 802.1D, y sus sucesores Rapid STP 802.1w, Multiple STP 802.1s) resuelve este problema calculando una topología sin bucles: un árbol de expansión que conecta todos los nodos sin ciclos. El algoritmo:

1. **Elección de root bridge:** Todos los switches tienen prioridad configurable e ID único (MAC). El de menor valor (prioridad primero, luego MAC) se convierte en raíz del árbol.

2. **Cálculo de caminos óptimos:** Cada switch no raíz determina el camino de menor costo hacia la raíz, basado en costo de enlaces (inversamente proporcional a velocidad). El puerto por el que se alcanza la raíz es root port.

3. **Designación de puertos:** En cada segmento de red conectado a múltiples switches, se designa un designated port (el de mejor camino hacia raíz) que permanece activo; otros puertos en ese segmento se bloquean.

Los puertos bloqueados no reenvían tráfico de datos, pero continúan recibiendo BPDUs (Bridge Protocol Data Units) para detectar cambios de topología. Si un enlace activo falla, STP recalcula y activa un puerto previamente bloqueado, restaurando conectividad sin bucles.

El tiempo de convergencia de STP original (30-50 segundos por defecto) era inaceptable para aplicaciones modernas. RSTP (Rapid STP) reduce esto a segundos mediante mecanismos de proposal/agreement y transiciones de puerto optimizadas. MSTP permite múltiples instancias de spanning tree para diferentes VLANs, distribuyendo carga sobre enlaces redundantes que STP original dejaba inactivos.

## VLANs: Virtual LANs

Las VLANs segmentan lógicamente un switch físico (o múltiples switches conectados) en redes de broadcast separadas. Una VLAN es dominio de broadcast aislado; dispositivos en VLANs diferentes no se comunican directamente en capa 2, requiriendo router para interconexión.

La identificación de VLAN se realiza mediante etiquetado IEEE 802.1Q: un campo de 4 bytes insertado en la trama ethernet entre dirección origen y campo de tipo/longitud. Contiene: TPID (Tag Protocol Identifier, 0x8100), PCF (Priority Code Point para calidad de servicio), CFI (Canonical Format Indicator), y VID (VLAN Identifier, 12 bits permitiendo 4094 VLANs efectivas, reservados 0 y 4095).

Los puertos de switch se configuran como:
- **Access:** Conectan a dispositivos finales, sin etiquetado. La trama llega sin tag, se asocia a VLAN configurada; al salir, el tag se elimina.
- **Trunk:** Interconectan switches, transportando múltiples VLANs etiquetadas. Solo tramas de VLANs permitidas en el trunk viajan; nativa VLAN (sin tag) puede configurarse para compatibilidad.

Las VLANs habilitan segmentación por función, departamento, o seguridad sin reconfiguración física de cableado. Un switch puede alojar VLANs de producción, desarrollo, y administración, aisladas excepto donde el router explícitamente permite interconexión. La segmentación contiene broadcasts, limita el alcance de ataques de capa 2 (ARP spoofing, DHCP rogue), y facilita políticas de seguridad diferenciadas.

La interconexión de VLANs requiere enrutamiento. Esto puede realizarse mediante router externo (router-on-a-stick, con interfaz trunk), o mediante switching de capa 3 (L3 switch) que integra funcionalidad de enrutamiento IP en el mismo hardware de switch, permitiendo decisiones de reenvío entre VLANs a velocidad de switching.

> La evolución de switches hacia funcionalidad de capa 3 (L3 switches) difumina la frontera tradicional entre switch y router. Un L3 switch examina direcciones IP para reenvío entre VLANs y hacia redes externas, manteniendo simultáneamente la tabla MAC para reenvío intra-VLAN. La distinción operativa permanece: el switch se preocupa por entrega local eficiente; el router, por decisiones de camino entre redes. Cuando ambas funciones coexisten en el mismo dispositivo, la separación lógica de VLANs y la jerarquía de enrutamiento preservan la arquitectura de capas aunque la implementación se integre.


## Quédate con...

- El switch aprende asociaciones MAC-puerto examinando direcciones origen de tramas entrantes, construyendo tabla CAM dinámica con envejecimiento automático; esta tabla es vulnerable a saturación por ataque MAC flooding.
- Flooding (reenvío a todos los puertos cuando destino desconocido o broadcast/multicast), forwarding (reenvío directo al puerto conocido), y filtering (descarte de tramas inválidas o no permitidas) constituyen las operaciones de reenvío del switch.
- Cada puerto de switch en full-duplex es dominio de colisión separado, eliminando contención; todos los puertos en misma VLAN comparten dominio de broadcast, limitado por routers o VLANs mismas.
- STP calcula topología sin bucles para redes redundantes, bloqueando puertos que crearían ciclos mientras mantiene conectividad; RSTP y MSTP mejoran convergencia y utilización de enlaces.
- Las VLANs segmentan lógicamente switches físicos mediante etiquetado 802.1Q, creando dominios de broadcast aislados que requieren enrutamiento para interconexión, habilitando segmentación flexible sin recableado físico.



<div class="pagination">
  <a href="/markdown/sistemas/redes/enlace/protocolos" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
