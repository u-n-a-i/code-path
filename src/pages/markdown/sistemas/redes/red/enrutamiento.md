---
title: "Enrutamiento"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Enrutamiento](#enrutamiento)
  - [Tablas de enrutamiento](#tablas-de-enrutamiento)
  - [Gateways predeterminados](#gateways-predeterminados)
  - [Enrutamiento estático versus dinámico](#enrutamiento-estático-versus-dinámico)
  - [Cómo decide un router el camino de un paquete](#cómo-decide-un-router-el-camino-de-un-paquete)
  - [Quédate con...](#quédate-con)

</div>

# Enrutamiento

Cada paquete que atraviesa una red IP lleva en su cabecera una dirección de destino que los routers interpretan como coordenadas en un mapa distribuido. Ningún dispositivo conoce la ruta completa de antemano; en su lugar, cada router toma decisiones locales basadas en tablas que resumen la topología visible desde su posición. Esta arquitectura descentralizada —donde el camino emerge de decisiones hop-by-hop independientes— es lo que permite a internet escalar a millones de nodos sin un controlador central.

## Tablas de enrutamiento

Una tabla de enrutamiento es una estructura de datos que asocia prefijos de red con interfaces de salida y siguientes saltos. Cuando un router recibe un paquete, extrae la dirección IP de destino y realiza una búsqueda del prefijo más largo (*longest prefix match*): entre todas las entradas que coinciden con la dirección, selecciona la más específica. Este mecanismo permite rutas genéricas para tráfico desconocido y rutas precisas para destinos críticos.

En Linux, la tabla se consulta y modifica con `ip route`. Una entrada típica tiene la forma:

```
192.168.1.0/24 via 10.0.0.1 dev eth0
```

Esto indica que para alcanzar cualquier dirección en `192.168.1.0/24`, el paquete debe enviarse al siguiente salto `10.0.0.1` a través de la interfaz `eth0`. La tabla puede contener múltiples rutas hacia el mismo destino con diferentes métricas; el router elige la de menor costo, reservando las demás como respaldo.

## Gateways predeterminados

Cuando ninguna entrada específica coincide con la dirección de destino, el router recurre a la ruta por defecto, representada como `0.0.0.0/0` en IPv4. Esta entrada actúa como comodín: dirige todo el tráfico no reconocido hacia un gateway predeterminado, típicamente el router del proveedor de servicios o el siguiente nivel en la jerarquía de la red.

La configuración del gateway predeterminado es crítica en hosts finales. Sin ella, un dispositivo puede comunicarse dentro de su red local pero no alcanzará destinos externos. En Linux, se establece con:

```bash
ip route add default via 192.168.1.1
```

Esta instrucción indica que todo tráfico fuera de la red local debe enviarse a `192.168.1.1`, quien asumirá la responsabilidad de enrutarlo hacia su destino final.

## Enrutamiento estático versus dinámico

Las tablas de enrutamiento se construyen mediante dos enfoques complementarios. El enrutamiento estático requiere configuración manual de cada ruta por parte de un administrador. Es predecible, seguro y consume cero ancho de banda para intercambio de información, pero no se adapta a cambios en la topología: si un enlace falla, el tráfico se pierde hasta que alguien actualiza la configuración. Se usa en redes pequeñas, enlaces punto a punto críticos o como ruta por defecto en hosts.

El enrutamiento dinámico delega la construcción de tablas a protocolos que intercambian información de topología entre routers. Dos familias dominan este espacio:

- **IGP (Interior Gateway Protocols)**: operan dentro de un sistema autónomo (una organización). OSPF calcula caminos mínimos mediante el algoritmo de Dijkstra, convergiendo en segundos ante fallos. IS-IS ofrece funcionalidad similar con diferente formato de mensajes.
- **EGP (Exterior Gateway Protocol)**: BGP es el único protocolo de esta categoría en uso masivo. Conecta sistemas autónomos a escala global, seleccionando rutas no por velocidad sino por políticas comerciales, acuerdos de peering y filtros de seguridad. Su convergencia es deliberadamente lenta para evitar oscilaciones que inestabilizarían internet.

>  OSPF y BGP no compiten: operan en dominios distintos. Un router de borde puede ejecutar OSPF internamente para aprender rutas de la red corporativa y BGP externamente para intercambiar rutas con proveedores. Ambas tablas se fusionan en una sola tabla de reenvío mediante reglas de preferencia.

## Cómo decide un router el camino de un paquete

El proceso de decisión sigue una secuencia determinista. Al recibir un paquete, el router:

1. Verifica la integridad de la cabecera (checksum) y descarta paquetes corruptos.
2. Extrae la dirección IP de destino y busca en su tabla de enrutamiento el prefijo más largo que coincida.
3. Si encuentra una entrada, consulta la interfaz de salida y la dirección del siguiente salto.
4. Decrementa el TTL (*Time To Live*); si alcanza cero, descarta el paquete y envía un mensaje ICMP "Time Exceeded".
5. Reencapsula el paquete en una nueva trama de capa de enlace, actualizando direcciones MAC según la interfaz de salida.
6. Encola el paquete para transmisión, aplicando políticas de calidad de servicio si están configuradas.

Este flujo ocurre en microsegundos, optimizado mediante hardware especializado (TCAM) en routers de núcleo. La clave arquitectónica es que cada router decide independientemente: no hay estado de ruta mantenido a lo largo del camino, ni garantía de que paquetes sucesivos sigan la misma ruta. Esta ausencia de estado en nodos intermedios es lo que permite a internet recuperarse de fallos sin coordinación global: si un enlace cae, los protocolos dinámicos recalculan rutas y el tráfico se desvía automáticamente.

>  La búsqueda del prefijo más largo es computacionalmente costosa si se implementa ingenuamente. Los routers modernos usan estructuras de datos especializadas (tries, tablas multibit) que permiten búsquedas en tiempo constante, independientemente del tamaño de la tabla global.

## Quédate con...

*   Las tablas de enrutamiento mapean prefijos de red a interfaces de salida; los routers usan *longest prefix match* para seleccionar la ruta más específica.
*   El gateway predeterminado (`0.0.0.0/0`) dirige tráfico no reconocido hacia un router de nivel superior, esencial para conectividad externa en hosts.
*   El enrutamiento estático es manual y estable; el dinámico (OSPF para intra-dominio, BGP para inter-dominio) se adapta automáticamente a cambios de topología.
*   Cada router decide el siguiente salto de forma independiente, sin mantener estado de la ruta completa; esta descentralización habilita la resiliencia de internet.
*   El proceso de reenvío incluye validación, búsqueda en tabla, decremento de TTL, reencapsulación y encolado, todo optimizado para ejecución en hardware.



<div class="pagination">
  <a href="/markdown/sistemas/redes/red/auxiliares" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
