---
title: "Dispositivos de red"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Dispositivos de red](#dispositivos-de-red)
  - [Hub (capa 1)](#hub-capa-1)
  - [Switch (capa 2)](#switch-capa-2)
  - [Router (capa 3)](#router-capa-3)
  - [Diferencias entre Hub, Switch y Router](#diferencias-entre-hub-switch-y-router)
  - [Firewall: filtrado de tráfico, reglas](#firewall-filtrado-de-tráfico-reglas)
  - [Punto de acceso (AP) y modem-router combo](#punto-de-acceso-ap-y-modem-router-combo)
  - [Quédate con...](#quédate-con)

</div>

# Dispositivos de red

La infraestructura física que hace posible la comunicación digital no es un medio pasivo: está compuesta por dispositivos especializados que toman decisiones sobre cómo, cuándo y hacia dónde circulan los datos. Cada equipo opera en un nivel específico de abstracción, interpretando distintas unidades de información —bits, tramas, paquetes— para cumplir funciones que van desde la simple regeneración de señales hasta el enrutamiento inteligente entre redes heterogéneas. Comprender estas diferencias no es un ejercicio académico: determina cómo se diseña una red, cómo se diagnostican fallos y cómo se escala la infraestructura sin comprometer rendimiento ni seguridad.

## Hub (capa 1)

Un hub es un dispositivo de capa física que recibe una señal eléctrica en uno de sus puertos y la replica hacia todos los demás puertos sin interpretación ni filtrado. No examina direcciones, no mantiene tablas de estado, no toma decisiones: su función es puramente mecánica, amplificar y difundir bits para extender el alcance físico de una red.

Esta simplicidad tiene consecuencias operativas. Todos los dispositivos conectados a un hub comparten el mismo dominio de colisión: si dos equipos transmiten simultáneamente, sus señales se interfieren y ambas tramas se pierden, requiriendo retransmisión. El ancho de banda total del segmento se reparte entre todos los participantes, degradando el rendimiento a medida que crece el número de nodos. Por esta razón, los hubs han quedado obsoletos en redes Ethernet modernas, reemplazados por switches que ofrecen aislamiento de tráfico y comunicación full-duplex.

> Los hubs aún pueden encontrarse en contextos muy específicos: depuración de red (para monitorear todo el tráfico de un segmento) o entornos industriales legacy. En cualquier otro caso, su uso introduce vulnerabilidades de seguridad (cualquier nodo puede capturar tráfico ajeno) y limita severamente el rendimiento.

## Switch (capa 2)

Un switch opera en la capa de enlace de datos, tomando decisiones de reenvío basadas en direcciones MAC. A diferencia del hub, no difunde indiscriminadamente: aprende qué dirección MAC está conectada a cada puerto mediante observación pasiva del tráfico entrante, construyendo una tabla de conmutación que le permite enviar tramas únicamente al puerto de destino.

Este comportamiento transforma la arquitectura de la red local. Cada enlace entre switch y dispositivo constituye su propio dominio de colisión, eliminando interferencias y habilitando comunicación full-duplex simultánea en todos los puertos. El ancho de banda deja de ser compartido: un switch Gigabit puede manejar múltiples flujos de 1 Gbps en paralelo, siempre que el backplane interno tenga capacidad suficiente.

Los switches modernos incorporan funcionalidades avanzadas que extienden su rol más allá del reenvío básico. VLANs (*Virtual LANs*) permiten segmentar lógicamente una red física en múltiples dominios de broadcast aislados, mejorando seguridad y gestión del tráfico. STP (*Spanning Tree Protocol*) previene bucles de conmutación en topologías redundantes. QoS (*Quality of Service*) prioriza tráfico sensible a la latencia, como voz o video. Estas características convierten al switch en el núcleo de la red local, no solo un repetidor inteligente.

## Router (capa 3)

Un router opera en la capa de red, tomando decisiones de reenvío basadas en direcciones IP y tablas de enrutamiento. Su función esencial es interconectar redes distintas: una LAN corporativa con internet, una sucursal con la sede central, una red privada con una nube pública. Donde el switch conecta dispositivos dentro de una misma red lógica, el router conecta redes entre sí.

El proceso de decisión sigue un flujo determinista. Al recibir un paquete, el router extrae la dirección IP de destino, consulta su tabla de enrutamiento para identificar el siguiente salto y la interfaz de salida, decrementa el TTL (*Time To Live*) y reencapsula el paquete en una nueva trama de capa de enlace apropiada para el enlace saliente. Esta operación ocurre en microsegundos, optimizada mediante hardware especializado en routers de alto rendimiento.

Los routers implementan protocolos de enrutamiento dinámico (OSPF, BGP) que intercambian información de topología con otros routers, permitiendo que las tablas de enrutamiento se adapten automáticamente a fallos o cambios en la red. Esta capacidad de autoorganización distribuida es lo que hace posible la resiliencia de internet: si un enlace cae, el tráfico se redirige por rutas alternativas sin intervención manual.

> Un router no "conoce" la topología completa de internet: solo mantiene rutas hacia prefijos de red, no hacia hosts individuales. Esta agregación es esencial para la escalabilidad: la tabla de enrutamiento global de internet contiene aproximadamente 900,000 prefijos IPv4, no miles de millones de direcciones individuales.

## Diferencias entre Hub, Switch y Router

La distinción fundamental entre estos dispositivos radica en la capa del modelo OSI en la que operan y, por tanto, en la unidad de información que procesan y el criterio que usan para tomar decisiones.

| Dispositivo | Capa OSI | Unidad de procesamiento | Criterio de decisión | Dominio de broadcast |
|-------------|----------|------------------------|-------------------|---------------------|
| Hub | Física (1) | Bits | Ninguno: réplica a todos | Único para todos los puertos |
| Switch | Enlace (2) | Tramas | Dirección MAC destino | Por defecto, único; VLANs lo segmentan |
| Router | Red (3) | Paquetes | Dirección IP destino | Cada interfaz es un dominio distinto |

Esta jerarquía funcional implica que los dispositivos de capa superior pueden emular funciones de capas inferiores, pero no viceversa. Un router puede conmutar tramas dentro de una interfaz (función de switch), y un switch puede actuar como hub si se deshabilita el aprendizaje de MAC. Pero un hub no puede tomar decisiones basadas en direcciones, y un switch no puede enrutar entre redes IP distintas sin funcionalidad de capa 3 añadida.

> Los switches de capa 3 (*multilayer switches*) combinan conmutación de alta velocidad con capacidades básicas de enrutamiento, permitiendo enrutamiento inter-VLAN sin salir del chasis. Son comunes en núcleos de red empresarial donde el rendimiento es crítico.

## Firewall: filtrado de tráfico, reglas

Un firewall es un dispositivo o software que controla el flujo de tráfico entre redes según un conjunto de reglas definidas por políticas de seguridad. Su función no es enrutar ni conmutar, sino filtrar: permitir, denegar o registrar paquetes basándose en criterios como direcciones IP, puertos, protocolos, estado de conexión o contenido inspeccionado.

Los firewalls operan en distintos niveles de profundidad. Los firewalls de filtrado de paquetes (*packet-filtering*) examinan cabeceras de capa 3 y 4: dirección origen/destino, puerto, protocolo. Son rápidos y simples, pero vulnerables a técnicas de evasión que manipulan cabeceras. Los firewalls de estado (*stateful*) mantienen contexto de conexiones activas, permitiendo reglas como "permitir tráfico de respuesta a conexiones iniciadas desde dentro", lo que simplifica políticas y mejora seguridad. Los firewalls de aplicación (*next-generation*) inspeccionan payload hasta capa 7, identificando aplicaciones específicas (Facebook, BitTorrent) o patrones de ataque, aunque con mayor costo computacional.

Las reglas de firewall se evalúan típicamente en orden secuencial: la primera coincidencia determina la acción. Una política bien diseñada sigue el principio de "denegar por defecto, permitir explícitamente": una regla final de `DENY ALL` captura cualquier tráfico no previsto, minimizando la superficie de ataque. La auditoría regular de reglas es esencial: políticas acumuladas durante años suelen contener entradas obsoletas que amplían innecesariamente el acceso.

>  Un firewall no sustituye otras capas de seguridad. No protege contra malware que viaja sobre tráfico permitido (por ejemplo, un archivo adjunto malicioso en un correo SMTP permitido), ni contra ataques que explotan vulnerabilidades en servicios expuestos legítimamente. La defensa en profundidad requiere combinar firewall con IDS/IPS, parcheo, autenticación robusta y monitoreo.

## Punto de acceso (AP) y modem-router combo

Un punto de acceso inalámbrico (*Access Point*, AP) extiende una red cableada hacia dispositivos Wi-Fi, actuando como puente entre el medio inalámbrico (capa física de radio) y la red Ethernet subyacente (capa de enlace). No enruta ni asigna direcciones: su función es traducir tramas 802.11 a tramas 802.3 y viceversa, manteniendo la misma lógica de red a ambos lados. Los APs empresariales suelen gestionarse centralizadamente mediante controladores, permitiendo roaming fluido entre múltiples puntos de acceso sin reconexión explícita.

El modem-router combo es un dispositivo integrado común en entornos residenciales y pequeñas oficinas. Combina tres funciones en un solo chasis: módem (conversión de señal del proveedor: DSL, cable, fibra), router (enrutamiento entre la red local y internet, NAT, firewall básico) y punto de acceso Wi-Fi. Esta integración simplifica el despliegue para usuarios no técnicos, pero introduce limitaciones: el hardware de consumo suele tener menor rendimiento, menos opciones de configuración y actualizaciones de firmware menos frecuentes que equipos profesionales desacoplados.

>  En entornos donde el rendimiento o la seguridad son críticos, se recomienda desacoplar funciones: un módem en modo puente, un router dedicado con firewall avanzado, y APs empresariales gestionados. Esta arquitectura permite actualizar o reemplazar componentes individualmente y aplicar políticas de seguridad más granulares.

## Quédate con...

*   Los hubs (capa 1) replican señales a todos los puertos sin inteligencia: obsoletos por su ineficiencia y vulnerabilidades de seguridad.
*   Los switches (capa 2) conmutan tramas basándose en direcciones MAC, aislando dominios de colisión y habilitando comunicación full-duplex simultánea.
*   Los routers (capa 3) enrutan paquetes entre redes distintas usando direcciones IP y tablas de enrutamiento, habilitando la interconexión global.
*   La tabla comparativa resume diferencias clave: unidad de procesamiento, criterio de decisión y alcance del dominio de broadcast para cada dispositivo.
*   Los firewalls filtran tráfico según reglas de seguridad, operando desde filtrado básico de paquetes hasta inspección profunda de aplicación; el principio "denegar por defecto" es fundamental.
*   Los puntos de acceso extienden redes cableadas a Wi-Fi; los combos modem-router simplifican despliegues residenciales pero limitan rendimiento y control en entornos exigentes.


<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/infraestructura/soho" class="next">Siguiente</a>
</div>
