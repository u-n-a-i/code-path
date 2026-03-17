---
title: "El modelo OSI de 7 capas"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [El modelo OSI de 7 capas](#el-modelo-osi-de-7-capas)
  - [Capa 1: Física](#capa-1-física)
  - [Capa 2: Enlace de datos](#capa-2-enlace-de-datos)
  - [Capa 3: Red](#capa-3-red)
  - [Capa 4: Transporte](#capa-4-transporte)
  - [Capa 5: Sesión](#capa-5-sesión)
  - [Capa 6: Presentación](#capa-6-presentación)
  - [Capa 7: Aplicación](#capa-7-aplicación)
  - [El modelo como herramienta](#el-modelo-como-herramienta)
  - [Quédate con...](#quédate-con)

</div>

# El modelo OSI de 7 capas

A principios de la década de 1980, la proliferación de arquitecturas de red propietarias —SNA de IBM, DECnet de Digital Equipment Corporation, DSA de la ISO misma— amenazaba con fragmentar la industria en ecosistemas incompatibles. La Organización Internacional de Normalización (ISO) inició entonces el desarrollo de un modelo de referencia que proporcionara un marco conceptual unificado para la interconexión de sistemas abiertos: el modelo OSI (Open Systems Interconnection). Publicado formalmente en 1984 como estándares ISO 7498, el modelo no especifica protocolos concretos ni implementaciones tecnológicas, sino que define funciones, servicios e interfaces que cualquier arquitectura de comunicación debe considerar. Su persistencia cuatro décadas después, a pesar de que TCP/IP se impuso como arquitectura práctica dominante, testimonia su valor como herramienta analítica y pedagógica.

El modelo organiza la comunicación en siete capas jerárquicas, cada una construyendo servicios sobre las capacidades de la inferior. Esta estratificación permite que un emisor descienda progresivamente desde la intención de la aplicación hasta señales físicas, mientras el receptor asciende inversamente desde la detección de energía hasta la entrega de datos significativos. Cada capa añade valor mediante procesamiento específico e información de control, encapsulando los datos de la capa superior en una unidad de protocolo con cabecera propia.


## Capa 1: Física

La capa física es donde la abstracción digital encuentra la materialidad del mundo físico. Su responsabilidad es transmitir bits brutos —secuencias de ceros y unos— a través de un medio de comunicación, transformando valores lógicos en señales electromagnéticas, ópticas o radioeléctricas susceptibles de propagación. No interpreta el significado de los bits; solo garantiza que un uno transmitido sea reconocido como uno en el destino, y un cero como cero, con una tasa de error acorde a las capacidades de corrección de capas superiores.

Las especificaciones de esta capa definen características mecánicas, eléctricas, funcionales y procedimentales. Las mecánicas incluyen dimensiones de conectores, configuración de pines, y especificaciones de cables. Las eléctricas establecen niveles de voltaje, impedancias, velocidades de señalización y codificaciones de línea. Las funcionales describen qué señales significan qué funciones (datos, control, sincronización). Las procedimentales especifican secuencias para establecer, mantener y liberar conexiones físicas.

Ejemplos concretos ilustran esta materialidad. Ethernet 1000BASE-T especifica transmisión sobre cuatro pares trenzados de categoría 5e o superior, utilizando codificación PAM-5 (Pulse Amplitude Modulation con 5 niveles) a 125 Mbaudio, logrando 1 Gbps mediante técnicas de cancelación de eco y ecualización. La interfaz óptica 1000BASE-SX utiliza láser de 850 nm sobre fibra multimodo. USB define no solo señalización diferencial, sino protocolos de enumeración de dispositivos y negociación de potencia. En cada caso, la capa física convierte bits en energía que atraviesa espacio, tiempo y materia.


## Capa 2: Enlace de datos

Si la capa física entrega bits potencialmente erróneos en secuencia, la capa de enlace organiza esos bits en estructuras significativas —tramas— y proporciona los mecanismos para detectar, y posiblemente corregir, errores de transmisión. Es la primera capa donde emerge la noción de direccionamiento: identificadores que permiten distinguir múltiples dispositivos compartiendo un medio común.

La trama es la unidad de datos de esta capa, estructura con campos definidos: delimitadores que marcan inicio y fin, direcciones de origen y destino en el enlace local, datos útiles (payload) de la capa superior, y secuencia de verificación de trama (FCS, Frame Check Sequence) típicamente calculada mediante CRC (Cyclic Redundancy Check). El receptor utiliza el FCS para detectar corrupción: si el cálculo no coincide con el valor recibido, la trama se descarta silenciosamente o se solicita retransmisión según el protocolo.

El control de acceso al medio (MAC) es función crítica cuando múltiples dispositivos comparten el canal. Ethernet clásico utilizaba CSMA/CD; las redes inalámbricas emplean CSMA/CA con mecanismos de reserva de canal. Las tecnologías modernas de switch ethernet eliminan la contención mediante conexiones punto-a-punto dedicadas, simplificando el MAC pero manteniendo la estructura de trama para compatibilidad.

La capa de enlace se subdivide conceptualmente en LLC (Logical Link Control), que proporciona multiplexación de protocolos de capa superior y control de errores, y MAC (Media Access Control), que gestiona el acceso al medio específico. Switches operan en esta capa, aprendiendo direcciones MAC de origen y tomando decisiones de reenvío basadas en direcciones MAC de destino, creando dominios de colisión separados por puerto.


## Capa 3: Red

La capa de red resuelve el problema de la interconexión: cómo transportar datos desde un origen hasta un destino potencialmente distante, a través de múltiples redes intermedias con tecnologías de enlace heterogéneas. Mientras la capa de enlace conoce solo direcciones locales, la capa de red implementa direccionamiento lógico global y mecanismos de encaminamiento (routing) que determinan trayectorias óptimas a través de topologías arbitrarias.

El datagrama (o paquete) es la unidad de esta capa, encapsulando segmentos de transporte en una cabecera que incluye direcciones de red origen y destino, identificadores de protocolo superior, y campos para control de fragmentación y tiempo de vida. IP —tanto IPv4 como IPv6— es el protocolo arquetípico, aunque no el único: históricamente IPX, AppleTalk, y DECnet proporcionaban funciones similares en arquitecturas propietarias.

El direccionamiento jerárquico permite escalabilidad: los prefijos de red agregan múltiples hosts en rutas comunes, reduciendo tablas de encaminamiento. Los algoritmos de routing —OSPF, IS-IS, BGP— calculan caminos óptimos según métricas de costo, políticas administrativas, y restricciones de política. Los routers, dispositivos de capa 3, examinan direcciones de destino IP y reenvían paquetes hacia interfaces de salida seleccionadas mediante consultas a tablas de encaminamiento.

La capa de red proporciona servicio de mejor esfuerzo (best effort): entrega sin garantías de orden, duplicación, o incluso entrega exitosa. La fiabilidad, cuando se requiere, se construye en capas superiores. Esta diseño minimalista permite implementaciones eficientes y adaptables, aunque aplicaciones sensibles a pérdidas deben incorporar mecanismos de recuperación propios o utilizar protocolos de transporte apropiados.


## Capa 4: Transporte

Mientras la capa de red entrega paquetes entre hosts, la capa de transporte entrega datos entre procesos específicos ejecutándose en esos hosts. Esta multiplexación extremo-a-extremo, implementada mediante puertos numéricos que identifican servicios y aplicaciones, transforma la comunicación host-a-host en comunicación proceso-a-proceso.

Dos modelos de servicio coexisten. TCP (Transmission Control Protocol) proporciona conexión orientada, confiable, con control de flujo y congestión: establece conexión mediante handshake de tres vías, garantiza entrega ordenada mediante numeración de secuencia y acuses de recibo, adapta la tasa de transmisión a las capacidades del receptor y a las condiciones de la red. UDP (User Datagram Protocol) ofrece servicio mínimo: sin conexión, sin garantías, con overhead reducido, adecuado para aplicaciones que toleran pérdidas o implementan su propia recuperación.

El segmento es la unidad de transporte, encapsulado en datagramas de red. La cabecera de transporte incluye puertos origen y destino, números de secuencia y acuse de recibo (TCP), ventanas de recepción, y flags de control. La gestión de conexiones, el control de flujo mediante ventanas deslizantes, y los algoritmos de control de congestión (slow start, congestion avoidance, fast retransmit) constituyen la complejidad algorítmica principal de esta capa.

La capa de transporte es la primera que opera end-to-end, implementada solo en los hosts terminales, no en dispositivos intermedios de la red. Los routers examinan capas hasta la 3; switches hasta la 2; solo los extremos procesan la capa 4, garantizando que la semántica de la comunicación proceso-a-proceso se preserve independientemente de la trayectoria recorrida.


## Capa 5: Sesión

La capa de sesión gestiona el diálogo entre aplicaciones: establecimiento, mantenimiento y terminación ordenada de conexiones lógicas que pueden abarcar múltiples intercambios de datos. Mientras el transporte proporciona conectividad confiable entre procesos, la sesión organiza esa conectividad en estructuras de conversación significativas para las aplicaciones.

Los servicios de sesión incluyen sincronización mediante puntos de control (checkpoints) que permiten reanudar transferencias interrumpidas sin reiniciar desde el origen; control de diálogo determinando quién puede transmitir en cada momento (half-duplex disciplinado); y gestión de tokens que regulan el acceso a recursos compartidos en entornos distribuidos. En transferencias de archivos grandes, los checkpoints permiten recuperación eficiente ante fallos de comunicación; en sistemas de reservas, el control de diálogo previene condiciones de carrera.

En la práctica moderna, funciones de sesión frecuentemente se incorporan a protocolos de capa de aplicación o se implementan mediante mecanismos de capa de transporte. HTTP mantiene estado de sesión mediante cookies; TLS/SSL gestiona establecimiento de sesiones seguras incluyendo autenticación y negociación de parámetros criptográficos. La pureza del modelo OSI encuentra aquí una de sus mayores divergencias con implementaciones reales, donde la utilidad de servicios de sesión es indiscutible pero su ubicación en capa separada resulta frecuentemente artificiosa.


## Capa 6: Presentación

La capa de presentación resuelve incompatibilidades de representación: cómo estructurar datos de manera que sistemas con diferentes formatos internos —orden de bytes, codificación de caracteres, representación de números en punto flotante— puedan intercambiar información interpretable. Es la capa de la traducción y la transformación sintáctica.

Los servicios incluyen conversión de sintaxis abstracta a transferencia (ASN.1 con sus reglas de codificación BER, DER, PER), compresión de datos para eficiencia de transmisión, y cifrado para confidencialidad. La capa abstracta de la información de la aplicación de las peculiaridades de representación del sistema receptor: una cadena de caracteres enviada desde un mainframe EBCDIC se presenta correctamente en una estación de trabajo ASCII sin que la aplicación emisora conozca la conversión realizada.

Como la sesión, la presentación frecuentemente se integra en implementaciones modernas. XML, JSON, Protocol Buffers proporcionan representaciones estandarizadas que las aplicaciones manejan directamente. La compresión ocurre en múltiples niveles: algoritmos de compresión de contenido en servidores web, compresión de cabeceras en HTTP/2, compresión de enlaces en hardware de red. El cifrado se implementa típicamente en capa de transporte (TLS) o en la propia aplicación. La capa de presentación OSI permanece como recordatorio de que la interoperabilidad requiere acuerdos sobre representación, aunque los mecanismos específicos hayan migrado de capa.


## Capa 7: Aplicación

La capa de aplicación es la interfaz entre el sistema de comunicación y las aplicaciones de usuario final. No proporciona servicios a ninguna capa superior; es el destino final del descenso por la pila del emisor y el punto de origen del ascenso en el receptor. Aquí residen los protocolos que los usuarios y sus aplicaciones invocan directamente: HTTP para navegación web, SMTP para correo electrónico, FTP para transferencia de archivos, DNS para resolución de nombres, SSH para acceso remoto seguro.

Cada protocolo de aplicación define sintaxis y semántica de los mensajes intercambiados: qué comandos son válidos, qué respuestas indican éxito o fallo, cómo se estructuran los datos transferidos. HTTP define métodos (GET, POST, PUT, DELETE), códigos de estado (200 OK, 404 Not Found), y cabeceras de metadatos. SMTP especifica el diálogo de entrega de correo: HELO, MAIL FROM, RCPT TO, DATA. Estos protocolos implementan las abstracciones que hacen útil la red: recursos identificados por URLs, mensajes con remitentes y destinatarios, sesiones de terminal remotas.

La distinción entre servicio, protocolo e interfaz de aplicación es crucial. La capa de aplicación OSI especifica el marco para estos elementos; las implementaciones concretas definen protocolos específicos que operan dentro de ese marco. La proliferación de APIs REST, servicios web, y protocolos de tiempo real (WebSocket, gRPC) demuestra la vitalidad continua de esta capa superior, donde la innovación es más visible y el impacto en usuarios finales más directo.


## El modelo como herramienta

El modelo OSI raramente se implementa literalmente. TCP/IP, la arquitectura efectiva de internet, fusiona capas: la capa de aplicación TCP/IP engloba funciones de sesión, presentación y aplicación OSI; la capa de enlace TCP/IP absorbe funciones físicas y de enlace OSI. Esta fusión respondió a necesidades de implementación pragmática, no a deficiencias conceptuales del modelo.

Sin embargo, la utilidad analítica del modelo OSI persiste. Cuando un ingeniero de red diagnostica conectividad, opera conceptualmente en capas: ¿hay enlace físico? (capa 1), ¿se intercambian tramas? (capa 2), ¿hay conectividad IP? (capa 3), ¿responde el servicio en el puerto esperado? (capa 4). Cuando se diseña seguridad, se consideran amenazas en cada capa: interceptación física de cables, suplantación de MAC, spoofing de IP, secuestro de sesión TCP, inyección en aplicaciones. La estructura de siete capas proporciona vocabulario compartido y marco de referencia que trasciende implementaciones específicas.

> La rigidez del modelo OSI ha sido criticada por su origen en procesos de estandarización burocráticos, en contraste con el desarrollo pragmático de TCP/IP en entornos de investigación. Sin embargo, esta misma rigidez produjo especificaciones completas y consistentes que TCP/IP carecía inicialmente. La historia de las redes demuestra que modelos conceptuales e implementaciones prácticas se benefician mutuamente: TCP/IP ganó claridad conceptual adoptando terminología OSI, mientras que OSI ganó relevancia práctica al demostrar que sus abstracciones describían realmente sistemas operativos. El profesional de redes domina ambos marcos, utilizando cada uno donde su perspectiva resulta más iluminadora.


## Quédate con...

- El modelo OSI proporciona marco conceptual de siete capas —física, enlace, red, transporte, sesión, presentación, aplicación— que organiza funciones de comunicación desde señales electromagnéticas hasta servicios de usuario final.
- La capa física transmite bits brutos mediante codificación de energía; la de enlace organiza bits en tramas con direccionamiento local y detección de errores; la de red habilita interconexión global mediante direccionamiento lógico y encaminamiento.
- La capa de transporte multiplexa comunicación proceso-a-proceso mediante puertos, ofreciendo modelos confiable (TCP) o minimalista (UDP); las capas de sesión y presentación gestionan diálogos estructurados y representación de datos, frecuentemente integradas en implementaciones modernas.
- La capa de aplicación contiene protocolos directamente utilizados por usuarios y programas —HTTP, SMTP, DNS— definiendo sintaxis y semántica de intercambios específicos.
- TCP/IP fusiona capas OSI en su implementación práctica, pero el modelo OSI persiste como herramienta diagnóstica, pedagógica y de diseño, proporcionando vocabulario unificado para describir funciones de comunicación independientemente de tecnologías específicas.



<div class="pagination">
  <a href="/markdown/sistemas/redes/capas/necesidad" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/capas/tcp_ip" class="next">Siguiente</a>
</div>
