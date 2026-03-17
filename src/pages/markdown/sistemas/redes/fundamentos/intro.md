---
title: "Concepto de red y tipos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Concepto de red y tipos](#concepto-de-red-y-tipos)
  - [Qué es una red de computadoras](#qué-es-una-red-de-computadoras)
  - [Qué es un nodo](#qué-es-un-nodo)
  - [Qué es un protocolo](#qué-es-un-protocolo)
  - [Evolución de las redes](#evolución-de-las-redes)
  - [Objetivos de las redes](#objetivos-de-las-redes)
  - [Tipos de redes](#tipos-de-redes)
  - [Redes de área personal (PAN)](#redes-de-área-personal-pan)
  - [Redes de área local (LAN)](#redes-de-área-local-lan)
  - [Una WLAN (Wireless LAN) cumple las mismas funciones que una LAN pero utiliza ondas de radio en lugar de cables. El estándar IEEE](#una-wlan-wireless-lan-cumple-las-mismas-funciones-que-una-lan-pero-utiliza-ondas-de-radio-en-lugar-de-cables-el-estándar-ieee)
  - [Redes de área metropolitana (MAN)](#redes-de-área-metropolitana-man)
  - [Redes de área amplia (WAN)](#redes-de-área-amplia-wan)
  - [Quédate con...](#quédate-con)

</div>

# Concepto de red y tipos

Una red de computadoras surge cuando dispositivos independientes se interconectan para intercambiar información bajo reglas compartidas. Esta capacidad de comunicación transforma equipos aislados en sistemas colaborativos, permitiendo que recursos, datos y servicios circulen entre nodos distribuidos geográficamente. La arquitectura que hace posible este intercambio define cómo se organiza, protege y escala la infraestructura digital moderna.

## Qué es una red de computadoras

Una red de computadoras es un conjunto de dispositivos interconectados mediante medios físicos o inalámbricos que permiten el intercambio de datos bajo un conjunto de reglas acordadas. La conexión no es meramente física: requiere que los participantes compartan protocolos que definan cómo se formatean, transmiten, enrutan e interpretan los mensajes. Sin este acuerdo lógico, los cables o las ondas de radio serían canales mudos.

El propósito fundamental de una red no es la conexión en sí, sino la habilitación de servicios: compartir archivos, acceder a aplicaciones remotas, distribuir carga de trabajo o mantener comunicación en tiempo real. Esta abstracción permite que un usuario en un extremo del mundo interactúe con recursos en otro sin conocer los detalles del trayecto que siguen sus datos.

## Qué es un nodo

Un nodo es cualquier dispositivo capaz de enviar, recibir o retransmitir información dentro de una red. Puede tratarse de una computadora, un servidor, una impresora, un teléfono móvil, un sensor IoT o incluso un equipo de red como un router o un switch. Lo que define a un nodo no es su función específica, sino su capacidad para participar en el protocolo de comunicación: poseer una dirección identificable y procesar mensajes según las reglas establecidas.

En redes complejas, los nodos adoptan roles diferenciados. Algunos actúan como puntos finales (end devices), donde se originan o destinan los datos; otros funcionan como intermediarios (intermediate devices), encargados de dirigir el tráfico hacia su destino. Esta distinción es clave para entender cómo se estructura el flujo de información y dónde se aplican políticas de seguridad o priorización.

## Qué es un protocolo

Un protocolo es un conjunto de reglas que gobiernan la comunicación entre dispositivos. Define el formato de los mensajes, la secuencia de intercambio, los mecanismos de detección de errores y los procedimientos para establecer o cerrar una conexión. Sin protocolos estandarizados, cada fabricante implementaría su propio lenguaje, haciendo imposible la interoperabilidad entre sistemas heterogéneos.

Los protocolos operan en capas, donde cada nivel resuelve un aspecto específico de la comunicación. Por ejemplo, un protocolo de capa física especifica voltajes y tiempos de señal, mientras que uno de capa de aplicación define cómo se solicita una página web o se envía un correo. Esta estratificación permite que innovaciones en un nivel no requieran rediseñar todo el sistema.

> Direccionamiento y enrutamiento, mientras que TCP garantiza la entrega ordenada y confiable. UDP, en cambio, ofrece un servicio más ligero sin garantías de entrega, útil para aplicaciones que priorizan la velocidad sobre la fiabilidad.

## Evolución de las redes

Las primeras redes de datos surgieron en la década de 1960 con proyectos como ARPANET, diseñados para conectar centros de investigación y garantizar comunicaciones resilientes ante fallos parciales. Estas redes experimentales establecieron los principios del enrutamiento distribuido y la conmutación de paquetes, donde la información se fragmenta en unidades independientes que pueden tomar rutas distintas hacia su destino.

Durante los años 80 y 90, la estandarización de Ethernet para redes locales y la adopción masiva de TCP/IP como protocolo universal permitieron la interconexión global que dio origen a Internet. La transición de redes académicas y gubernamentales a infraestructuras comerciales transformó la red en un servicio público, impulsando la innovación en aplicaciones, servicios y modelos de negocio.

En el siglo XXI, la convergencia de redes fijas y móviles, junto con la proliferación de dispositivos inteligentes, ha llevado a escenarios de hiperconectividad. Las redes ya no solo conectan personas: coordinan sensores industriales, vehículos autónomos y sistemas críticos, exigiendo nuevos enfoques en latencia, seguridad y escalabilidad.

## Objetivos de las redes

Las redes se diseñan para cumplir propósitos específicos que justifican su complejidad y costo. El más evidente es la compartición de recursos: permitir que múltiples usuarios accedan a impresoras, almacenamiento o potencia de cómputo sin duplicar infraestructura. Este principio reduce costos y facilita la administración centralizada.

La comunicación constituye otro objetivo fundamental. Correo electrónico, mensajería instantánea, videoconferencias y colaboración en tiempo real dependen de redes que transporten datos con la velocidad y confiabilidad adecuadas. En entornos empresariales, esta capacidad habilita flujos de trabajo distribuidos y toma de decisiones ágil.

La redundancia y tolerancia a fallos representan un objetivo menos visible pero crítico. Las redes bien diseñadas incorporan rutas alternativas y mecanismos de recuperación automática para mantener la operatividad ante fallos de hardware, cortes de energía o congestión. Esta resiliencia es esencial en servicios que no pueden permitirse interrupciones, como sistemas financieros o de salud.

## Tipos de redes

La clasificación de redes considera principalmente el alcance geográfico y el medio de transmisión. Esta categorización ayuda a seleccionar tecnologías apropiadas según los requisitos de cobertura, ancho de banda y costo.

## Redes de área personal (PAN)

Una PAN (Personal Area Network) conecta dispositivos en el entorno inmediato de una persona, típicamente dentro de un radio de pocos metros. Ejemplos incluyen la sincronización entre un teléfono y un reloj inteligente mediante Bluetooth, o la conexión de un teclado inalámbrico a una computadora. Su diseño prioriza el bajo consumo energético y la facilidad de emparejamiento sobre el ancho de banda.

## Redes de área local (LAN)

Una LAN (Local Area Network) interconecta dispositivos dentro de un espacio delimitado como una oficina, un edificio o un campus. Emplea tecnologías como Ethernet por cable o Wi-Fi para ofrecer altas velocidades de transmisión con baja latencia. Las LAN permiten compartir recursos locales e Internet, y suelen estar bajo administración única, lo que facilita la aplicación de políticas de seguridad coherentes.
Redes de área local inalámbrica (WLAN)

## Una WLAN (Wireless LAN) cumple las mismas funciones que una LAN pero utiliza ondas de radio en lugar de cables. El estándar IEEE 

802.11 (Wi-Fi) define las especificaciones técnicas que garantizan interoperabilidad entre dispositivos de distintos fabricantes. Aunque ofrece mayor flexibilidad de movilidad, introduce consideraciones adicionales en seguridad y gestión de interferencias.

## Redes de área metropolitana (MAN)

Una MAN (Metropolitan Area Network) cubre una extensión geográfica mayor, típicamente una ciudad o área metropolitana. Se emplea para interconectar múltiples LANs de organizaciones distintas o para proporcionar acceso de banda ancha a residentes y empresas. Tecnologías como fibra óptica, WiMAX o Ethernet de operador sustentan estas infraestructuras, que suelen ser gestionadas por proveedores de servicios.

## Redes de área amplia (WAN)

Una WAN (Wide Area Network) abarca distancias extensas, pudiendo conectar países o continentes. Internet es la WAN más grande existente, pero organizaciones multinacionales también operan WANs privadas para enlazar sus sedes. Estas redes dependen de enlaces de larga distancia proporcionados por operadores de telecomunicaciones y requieren protocolos de enrutamiento avanzados para gestionar la complejidad del tráfico global.

> Las categorías PAN, LAN, MAN y WAN describen alcances geográficos, pero no definen la tecnología subyacente. Una misma aplicación puede implementarse sobre distintas topologías según los requisitos de costo, rendimiento y disponibilidad.

## Quédate con...

- Una red de computadoras permite el intercambio de datos entre dispositivos mediante reglas compartidas llamadas protocolos.
- Un nodo es cualquier dispositivo con capacidad de participar en la comunicación: desde un teléfono hasta un router de núcleo.
- Los protocolos estandarizados (como TCP/IP) garantizan que sistemas heterogéneos puedan interoperar sin depender de implementaciones propietarias.
- Los objetivos principales de las redes son compartir recursos, habilitar comunicación y proporcionar redundancia ante fallos.
- La clasificación por alcance (PAN, LAN, MAN, WAN) ayuda a seleccionar tecnologías apropiadas según la cobertura geográfica requerida.
- Las redes inalámbricas (WLAN) ofrecen movilidad pero introducen consideraciones adicionales en seguridad y gestión de interferencias.



<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/fundamentos/topologias" class="next">Siguiente</a>
</div>
