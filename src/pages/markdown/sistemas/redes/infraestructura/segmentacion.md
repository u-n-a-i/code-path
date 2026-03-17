---
title: "Segmentación de red"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Segmentación de red](#segmentación-de-red)
  - [VLANs (visión introductoria)](#vlans-visión-introductoria)
  - [Segmentación lógica de una red física en un switch](#segmentación-lógica-de-una-red-física-en-un-switch)
  - [Zonas DMZ](#zonas-dmz)
  - [Quédate con...](#quédate-con)

</div>

# Segmentación de red

Una red plana donde todos los dispositivos comparten el mismo dominio de broadcast presenta riesgos operativos y de seguridad inherentes. El tráfico destinado a un equipo es visible para todos, los fallos locales pueden propagarse como tormentas de broadcast que saturan el ancho de banda disponible, y la contención de incidentes de seguridad resulta casi imposible sin aislamiento físico. La segmentación de red resuelve estos problemas dividiendo una infraestructura física única en múltiples dominios lógicos independientes, permitiendo controlar el flujo de tráfico, reducir la superficie de ataque y organizar los recursos según funciones o requisitos de confianza. Esta capacidad de crear fronteras virtuales dentro del mismo cableado es fundamental para arquitecturas modernas que exigen agilidad sin sacrificar la estabilidad.

## VLANs (visión introductoria)

Una VLAN (*Virtual Local Area Network*) es un dominio de broadcast creado lógicamente dentro de una infraestructura de switch física. Mediante el estándar IEEE 802.1Q, los switches insertan una etiqueta (*tag*) de 4 bytes en la cabecera de las tramas Ethernet, identificando a qué VLAN pertenece cada paquete. Esta etiqueta permite que un único enlace físico transporte tráfico de múltiples redes virtuales simultáneamente, manteniendo el aislamiento entre ellas como si estuvieran cableadas por separado.

La implementación de VLANs transforma la gestión de la red local. En lugar de mover cables físicamente para cambiar un usuario de departamento, un administrador reconfigura el puerto del switch para asignarlo a otra VLAN. El tráfico de broadcast se limita exclusivamente a los puertos miembros de esa VLAN específica, reduciendo la congestión innecesaria en el resto de la infraestructura. Además, las políticas de seguridad pueden aplicarse por VLAN: el departamento de finanzas puede aislarse completamente del de invitados, aunque ambos se conecten al mismo chasis de switch en la misma sala de servidores.

> Una VLAN opera en la capa de enlace (capa 2). Para que dispositivos en VLANs diferentes se comuniquen, el tráfico debe pasar por un dispositivo de capa 3 (router o switch multicapa) que realice enrutamiento inter-VLAN. Una VLAN no es equivalente a una subred IP, aunque típicamente se mapea una subred distinta por cada VLAN para mantener la claridad administrativa.

## Segmentación lógica de una red física en un switch

La segmentación lógica desacopla la topología física de la organización funcional de la red. Un switch moderno puede comportarse como múltiples switches virtuales independientes mediante la configuración de puertos de acceso y puertos troncales (*trunk*). Los puertos de acceso pertenecen a una única VLAN y conectan dispositivos finales que no entienden etiquetas VLAN, como computadoras o impresoras. El switch añade o elimina la etiqueta al entrar o salir por estos puertos, transparentando la complejidad al dispositivo final.

Los puertos troncales, en cambio, transportan tráfico de múltiples VLANs entre switches o hacia routers. Estos enlaces mantienen las etiquetas 802.1Q intactas, permitiendo que la identificación de VLAN traverse toda la infraestructura sin perderse. Esta arquitectura posibilita que una VLAN se extienda geográficamente a través de varios switches distribuidos en diferentes edificios, mientras que otros puertos en los mismos switches pertenecen a VLANs completamente distintas. La flexibilidad resultante permite diseñar redes organizadas por función (voz, datos, seguridad) independientemente de la ubicación física de los usuarios.

## Zonas DMZ

Una zona DMZ (*Demilitarized Zone*) es un segmento de red diseñado para albergar servicios accesibles desde internet sin comprometer la seguridad de la red interna privada. Conceptualmente, actúa como una tierra de nadie entre la red local confiable y la red externa no confiable. Los servidores que requieren acceso público —web, correo electrónico, DNS— se ubican en la DMZ, donde las reglas de firewall permiten tráfico entrante específico desde internet pero restringen severamente las conexiones iniciadas desde la DMZ hacia la red interna.

Esta segmentación contiene posibles brechas de seguridad. Si un atacante compromete un servidor web en la DMZ, el aislamiento de red impide o dificulta significativamente el movimiento lateral hacia bases de datos internas o estaciones de trabajo administrativas. La implementación típica utiliza un firewall con tres interfaces (interno, externo, DMZ) o dos firewalls en serie creando un sándwich de seguridad. La DMZ no es un producto específico, sino una arquitectura de zonificación que aplica el principio de menor privilegio a la conectividad de red.

> La DMZ no sustituye el hardening de los servidores que alberga. Los servicios en la DMZ deben estar parcheados y configurados seguramente, ya que están expuestos directamente a escaneos y ataques desde internet. La segmentación de red es una capa de defensa adicional, no la única línea de protección.

## Quédate con...

*   La segmentación de red divide una infraestructura física en dominios lógicos independientes para mejorar seguridad, rendimiento y gestión del tráfico.
*   Las VLANs (IEEE 802.1Q) crean dominios de broadcast aislados mediante etiquetado de tramas, permitiendo múltiples redes lógicas sobre el mismo hardware físico.
*   Los puertos de acceso conectan dispositivos finales a una VLAN única; los puertos troncales (*trunk*) transportan múltiples VLANs entre equipos de red manteniendo las etiquetas.
*   Una VLAN opera en capa 2 y requiere enrutamiento (capa 3) para comunicarse con otras VLANs; típicamente se asocia una subred IP distinta por VLAN.
*   La zona DMZ aísla servicios públicos entre la red interna y externa, conteniendo posibles compromisos de seguridad y limitando el movimiento lateral de atacantes.
*   La segmentación lógica permite organizar la red por funciones o departamentos independientemente de la ubicación física de los dispositivos y cables.


<div class="pagination">
  <a href="/markdown/sistemas/redes/infraestructura/soho" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/infraestructura/cableado" class="next">Siguiente</a>
</div>
