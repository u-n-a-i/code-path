---
title: "Estándares relevantes"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Estándares relevantes](#estándares-relevantes)
  - [IEEE 802.x: la familia de redes locales](#ieee-802x-la-familia-de-redes-locales)
  - [Estándares de Ethernet](#estándares-de-ethernet)
  - [Estándares de infraestructura y cableado](#estándares-de-infraestructura-y-cableado)
  - [La arquitectura de estándares en práctica](#la-arquitectura-de-estándares-en-práctica)
  - [Quédate con...](#quédate-con)

</div>

# Estándares relevantes

La comunicación de datos a escala global requiere acuerdos explícitos sobre formatos, procedimientos y especificaciones técnicas que permitan la interoperabilidad entre equipos de fabricantes distintos, de generaciones diferentes, operando en contextos nacionales variados. Estos acuerdos —estándares— no son meras recomendaciones técnicas; son el fundamento de mercados, la habilitación de la competencia, y la garantía de que una inversión en infraestructura no quedará obsoleta por aislamiento tecnológico. La arquitectura de redes moderna es, en su esencia, una arquitectura de estándares, donde cada capa de abstracción se sustenta en especificaciones consensuadas que definen interfaces, comportamientos y límites de operación.

## IEEE 802.x: la familia de redes locales

El Instituto de Ingenieros Eléctricos y Electrónicos (IEEE) desarrolla a través de su Comité de Estándares 802 las especificaciones que dominan las redes de área local y metropolitana. La designación "802" honra el año de inicio del comité (febrero de 1980), y las letras subsiguientes identifican áreas específicas de trabajo que han evolucionado desde entonces.

**IEEE 802.3: Ethernet.** El estándar más pervasivo en redes cableadas. Define el formato de trama (preambulo, direcciones MAC, tipo/longitud, payload, FCS), el mecanismo de acceso al medio (evolucionado desde CSMA/CD hasta conmutación full-duplex punto-a-punto), y las especificaciones físicas para cada velocidad y medio. La familia 802.3 incluye docenas de enmiendas: 802.3u para Fast Ethernet, 802.3z y 802.3ab para Gigabit, 802.3ae para 10 Gigabit, extendiéndose hasta 400 Gbps en desarrollo contemporáneo. Cada enmienda especifica codificaciones de línea, niveles de señal, conectores, y distancias máximas para combinaciones específicas de medio y velocidad.

**IEEE 802.11: Wireless LAN (Wi-Fi).** Define la comunicación en medios no guiados de radiofrecuencia. Las enmiendas se identifican por letras: 802.11b (2.4 GHz, 11 Mbps), 802.11a (5 GHz, 54 Mbps), 802.11g (2.4 GHz con técnicas de a), 802.11n (MIMO, hasta 600 Mbps), 802.11ac (MU-MIMO, hasta 6.93 Gbps), 802.11ax (Wi-Fi 6, OFDMA, eficiencia espectral mejorada), 802.11be (Wi-Fi 7, 320 MHz de ancho de canal). El estándar especifica capa física (modulaciones, codificaciones, mecanismos de acceso al medio CSMA/CA) y capa de enlace (formato de trama, seguridad WPA/WPA2/WPA3, gestión de potencia). La alianza industrial Wi-Fi Alliance certifica interoperabilidad más allá de la especificación mínima del IEEE.

**IEEE 802.15: Wireless Personal Area Networks.** Incluye 802.15.1 (Bluetooth, ahora mantenido por Bluetooth SIG pero originado en IEEE), 802.15.4 (Zigbee, Thread, redes de sensores de baja velocidad y ultra-bajo consumo), 802.15.6 (redes de área corporal para aplicaciones médicas), y 802.15.7 (Li-Fi, comunicación óptica visible). Cada subestándar optimiza para casos de uso específicos: Bluetooth para conectividad de periféricos, Zigbee para automatización doméstica e industrial con años de duración de batería.

## Estándares de Ethernet

La nomenclatura de ethernet codifica velocidad, codificación, y medio en una estructura que permite identificar rápidamente capacidades y limitaciones.

**10BASE-T:** El estándar que democratizó la conectividad de área local. 10 Mbps sobre par trenzado no blindado de categoría 3 o superior. Codificación Manchester, distancia máxima 100 metros, topología estrella con hubs o switches. La "T" indica par trenzado (Twisted Pair), distinguiéndolo de 10BASE5 (coaxial grueso) y 10BASE2 (coaxial fino). Aunque obsoleto para nuevas instalaciones, persisten aplicaciones industriales donde la velocidad es adecuada y la simplicidad es virtud.

**100BASE-TX:** Fast Ethernet, 100 Mbps. Requiere Cat5 o superior. Codificación 4B/5B seguida de MLT-3 de tres niveles, operando sobre dos pares (uno para cada dirección en full-duplex). La "X" indica codificación de bloque (4B/5B). El estándar incluye autonegociación (802.3u) que permite que dispositivos acuerden velocidad y modo de operación (half/full-duplex) automáticamente.

**1000BASE-T:** Gigabit Ethernet sobre par trenzado, el estándar de acceso de escritorio predominante durante dos décadas. Requiere Cat5e o superior. Utiliza los cuatro pares simultáneamente en ambas direcciones (full-duplex), con cancelación de eco y ecualización adaptativa para compensar diafonía y atenuación. Codificación 4D-PAM5 (cinco niveles de amplitud en cuatro dimensiones, los cuatro pares). La complejidad de procesamiento de señal es sustancialmente mayor que en velocidades menores, reflejando el compromiso de mantener el medio de cobre a costa de sofisticación electrónica.

**10GBASE-T:** 10 Gigabit Ethernet sobre par trenzado, requiere Cat6a o superior. Codificación DSQ128 (Double Square 128, variante de PAM-16), operando a 800 Mbaud con cancelación de eco avanzada y FEC (Forward Error Correction) para compensar la degradación del canal. El consumo energético de los transceptores es significativamente mayor que en fibra equivalente, limitando su adopción a distancias cortas donde el costo de cambiar infraestructura a fibra no se justifica.

**1000BASE-SX y 1000BASE-LX:** Gigabit Ethernet sobre fibra óptica. SX (Short wavelength) utiliza láser de 850 nm sobre fibra multimodo, distancias hasta 550 metros según tipo de fibra. LX (Long wavelength) utiliza 1310 nm, operando sobre multimodo (hasta 550 m) o monomodo (hasta 5 km). La especificación incluye requisitos de potencia óptica, sensibilidad del receptor, y penalidades por diafonía modal en fibras multimodo de núcleo grande. Estos estándares habilitaron la migración de backbone de campus hacia fibra, estableciendo precedente para velocidades mayores.

## Estándares de infraestructura y cableado

Los estándares de cableado estructurado definen prácticas de instalación que garantizan que el medio físico soporte las aplicaciones que se ejecutarán sobre él, más allá de las especificaciones de capa física individuales.

**ANSI/TIA-568 (Telecommunications Industry Association):** El estándar norteamericano de cableado estructurado comercial. La revisión C (2009) y D (2015) especifican: topología de estrella jerárquica, distancias máximas de 90 metros para cableado horizontal más 10 metros de patch cords, categorías de cable soportadas (Cat5e, Cat6, Cat6a), especificaciones de ensayos de campo (atenuación, diafonía, retardo, balance longitudinal), y requisitos de administración y documentación. El estándar define subsistemas: entrada de edificio, cuarto de equipo, backbone vertical, y distribución horizontal. La conformidad TIA-568 es requisito contractual frecuente en construcción comercial estadounidense.

**ISO/IEC 11801:** El estándar internacional equivalente, desarrollado por ISO e IEC, con alcance global fuera de Norteamérica. Define clases de enlace (Class D para Cat5e, E para Cat6, EA para Cat6a, F para Cat7/7A) que corresponden a categorías de cable pero con especificaciones de ensayo ligeramente diferentes. Incluye requisitos para cableado de fibra óptica (OF-300, OF-500, OF-2000 según aplicación). La armonización entre ISO/IEC 11801 y TIA-568 es sustancial pero no completa; proyectos internacionales deben especificar explícitamente cuál estándar aplica.

**ITU-T (International Telecommunication Union - Telecommunication Standardization Sector):** Desarrolla estándares para telecomunicaciones globales, particularmente para redes de área amplia y servicios de operadores. La serie G define sistemas de transmisión: G.711 (codificación de voz PCM), G.652-G.657 (tipos de fibra monomodo para diferentes aplicaciones), G.709 (OTN, Optical Transport Network), G.984 (GPON, Gigabit Passive Optical Network), G.990x (PLC, comunicación por línea eléctrica). La serie H define sistemas multimedia: H.264/H.265 (codificación de video), H.323 (comunicaciones multimedia sobre redes conmutadas). La serie Y define arquitecturas y terminología de redes futuras (NGN, Next Generation Networks; IMT-2020, requisitos de 5G).

La relevancia del ITU-T para desarrolladores de software reside en que define los servicios de infraestructura sobre los que las aplicaciones se construyen. Comprender que una llamada VoIP atraviesa potencialmente redes G.711 tradicionales, que el video streaming se codifica en H.264/H.265 para eficiencia de ancho de banda, que la fibra hasta el hogar sigue especificaciones G.984 o G.987 (XG-PON), proporciona contexto sobre las capacidades y limitaciones de la red subyacente.

## La arquitectura de estándares en práctica

Una instalación contemporánea típica ilustra la interacción de estos estándares. El cableado horizontal sigue TIA-568 o ISO/IEC 11801, con Cat6a certificada para 10 Gigabit futuro. Los switches implementan IEEE 802.3ab (1000BASE-T) para acceso y 802.3ae (10GBASE-SR/LR) para uplinks de fibra. La conectividad inalámbrica sigue 802.11ax. La conexión WAN implementa ITU-T G.984 si es GPON, o serie G.709 si es transporte óptico de operador. Cada estándar en su capa, cada especificación en su dominio, interoperando mediante interfaces definidas.

La evolución de estándares es proceso continuo. Nuevas enmiendas al 802.3 exploran 100 Gbps sobre cobre de distancia corta, 400 Gbps y 800 Gbps sobre fibra. El Wi-Fi 7 (802.11be) incorpora canales de 320 MHz y multiplexación espacial avanzada. Los estándares de cableado ya especifican ensayos para categorías que aún no tienen aplicaciones definidas (Cat8.2 para 40 Gbps), future-proofing la infraestructura. Esta progresión simultánea en múltiples frentes —medio físico, codificación, protocolo de acceso, arquitectura de sistema— es posible precisamente porque la modularidad de los estándares permite que cada capa evolucione independientemente, preservando inversión en las demás.

> La diferencia entre estándar y especificación industrial es relevante. Los estándares IEEE, ISO, ITU son desarrollados mediante procesos formales de consenso, con participación abierta, y tienen estatus de referencia internacional. Las especificaciones de industria (como las de Wi-Fi Alliance para interoperabilidad extendida, o de MSA, Multi-Source Agreement, para transceptores ópticos) complementan los estándares formales, frecuentemente anticipándose a ellos o añadiendo requisitos de calidad y testing. El profesional debe conocer ambos tipos y sus interrelaciones.


## Quédate con...

- La familia IEEE 802 define los estándares dominantes en redes locales: 802.3 para ethernet cableada, 802.11 para Wi-Fi, 802.15 para redes personales inalámbricas (Bluetooth, Zigbee), cada uno con enmiendas que especifican velocidades y tecnologías sucesivas.
- La nomenclatura de ethernet (10BASE-T, 1000BASE-SX, 10GBASE-T) codifica velocidad, codificación de señal, y medio físico; la evolución desde coaxial a par trenzado a fibra refleja el compromiso entre retener infraestructura existente y habilitar velocidades crecientes.
- Los estándares de cableado estructurado (TIA-568 en Norteamérica, ISO/IEC 11801 internacionalmente) especifican prácticas de instalación, topologías, y ensayos de campo que garantizan que el medio físico soporte aplicaciones presentes y futuras.
- El ITU-T desarrolla estándares para telecomunicaciones de área amplia, incluyendo especificaciones de fibra óptica (serie G), codificación de multimedia (serie H), y arquitecturas de red futura (serie Y), que definen la infraestructura sobre la cual se construyen servicios de internet.
- La arquitectura de redes opera mediante capas de estándares interdependientes pero evolucionables independientemente, permitiendo que inversión en cableado, equipos activos, y aplicaciones se preserve a través de generaciones tecnológicas sucesivas.



<div class="pagination">
  <a href="/markdown/sistemas/redes/fisica/cables" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
