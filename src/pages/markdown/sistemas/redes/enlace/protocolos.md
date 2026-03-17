---
title: "Protocolos de capa de enlace"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Protocolos de capa de enlace: Ethernet, PPP, HDLC](#protocolos-de-capa-de-enlace-ethernet-ppp-hdlc)
  - [Ethernet](#ethernet)
    - [Formato de trama](#formato-de-trama)
    - [Velocidades y estándares](#velocidades-y-estándares)
    - [Funcionamiento básico](#funcionamiento-básico)
  - [PPP (Point-to-Point Protocol)](#ppp-point-to-point-protocol)
    - [Encapsulación](#encapsulación)
    - [Autenticación: PAP y CHAP](#autenticación-pap-y-chap)
  - [HDLC (High-Level Data Link Control)](#hdlc-high-level-data-link-control)
    - [Tramas](#tramas)
    - [Uso en enlaces seriales](#uso-en-enlaces-seriales)
  - [Cuándo se usa cada uno](#cuándo-se-usa-cada-uno)
  - [Quédate con...](#quédate-con)

</div>

# Protocolos de capa de enlace: Ethernet, PPP, HDLC

La capa de enlace de datos no es un protocolo único sino una familia de protocolos, cada uno optimizado para contextos de comunicación específicos: medios compartidos versus enlaces dedicados, topologías de broadcast versus conexiones punto-a-punto, entornos de alta velocidad local versus enlaces de larga distancia con alta latencia. Ethernet, PPP y HDLC representan tres puntos en este espacio de diseño, desde la dominancia absoluta en redes locales hasta la persistencia en nichos de conectividad remota y comunicaciones seriales. Comprender sus diferencias es comprender cómo la ingeniería de redes adapta soluciones a restricciones.

## Ethernet

### Formato de trama

La trama ethernet ha evolucionado manteniendo compatibilidad estructural, permitiendo que equipos de generaciones diferentes interoperen. La versión II (DIX, de DEC-Intel-Xerox) y la versión IEEE 802.3 coexisten, distinguibles por el campo de tipo/longitud:

| Campo | Longitud | Contenido |
|-------|----------|-----------|
| Preámbulo | 7 bytes | 10101010 × 7, sincronización de reloj |
| SFD (Start Frame Delimiter) | 1 byte | 10101011, marca inicio de trama |
| Dirección MAC destino | 6 bytes | Identificador de interfaz destino |
| Dirección MAC origen | 6 bytes | Identificador de interfaz origen |
| Tipo (Ethernet II) o Longitud (802.3) | 2 bytes | ≥1536: protocolo superior (0x0800=IPv4); ≤1500: longitud de payload |
| Payload y relleno | 46-1500 bytes | Datos de capa superior; mínimo 46 para garantizar 64 bytes de trama total |
| FCS (Frame Check Sequence) | 4 bytes | CRC-32 para detección de errores |

El preámbulo y SFD no se consideran formalmente parte de la trama en algunas especificaciones, sino señalización física. La trama mínima de 64 bytes (desde destino hasta FCS) garantiza la detección de colisiones en half-duplex; tramas menores son runts, descartadas como errores. La trama máxima de 1518 bytes (sin contar preámbulo) es el estándar; jumbo frames de hasta 9000 bytes se utilizan en redes de alta velocidad para reducir overhead de procesamiento, aunque requieren configuración explícita y soporte en toda la ruta.

### Velocidades y estándares

La evolución de ethernet es cronología de la industria de redes:

| Designación | Velocidad | Medio | Año | Características clave |
|-------------|-----------|-------|-----|----------------------|
| 10BASE5 | 10 Mbps | Coaxial grueso (500m) | 1980 | Primera ethernet estándar, topología bus |
| 10BASE2 | 10 Mbps | Coaxial fino (185m) | 1985 | Bus más económico, conectores BNC |
| 10BASE-T | 10 Mbps | Par trenzado Cat3 (100m) | 1990 | Topología estrella, conmutación posible |
| 100BASE-TX | 100 Mbps | Par trenzado Cat5 (100m) | 1995 | Fast Ethernet, full-duplex disponible |
| 1000BASE-T | 1 Gbps | Par trenzado Cat5e (100m) | 1999 | Gigabit, 4 pares, cancelación de eco |
| 10GBASE-T | 10 Gbps | Par trenzado Cat6a (100m) | 2006 | Complejidad de señalización elevada |
| 10GBASE-SR/LR | 10 Gbps | Fibra óptica (300m/10km) | 2002 | Dominante en backbone y centros de datos |
| 40GBASE-SR10/CR4 | 40 Gbps | Fibra/Cobre paralelo (100m/7m) | 2010 | Múltiples fibras o cables en paralelo |
| 100GBASE-SR10/CR4 | 100 Gbps | Fibra/Cobre paralelo | 2010+ | 10×10 Gbps o 4×25 Gbps |
| 400GBASE-SR16/DR4 | 400 Gbps | Fibra paralelo | 2017+ | 16×25 Gbps o 4×100 Gbps |

La nomenclatura codifica: velocidad en Mbps o Gbps, BASE para señalización banda base (versus BROAD para banda ancha, obsoleto), y medio (T para par trenzado, SX/LX/ZX para fibra de diferentes longitudes de onda y alcance, CX para cable de cobre en paralelo, CR para cable directo attach).

### Funcionamiento básico

Ethernet original operaba en half-duplex con CSMA/CD: escuchar, transmitir si libre, detectar colisiones, retroceder con backoff exponencial. Esta operación compartida limitaba la escalabilidad y era sensible a la carga.

La transición a switches full-duplex transformó ethernet radicalmente. Cada dispositivo conecta a un puerto de switch mediante enlace dedicado, eliminando la contención. El switch aprende direcciones MAC examinando tramas entrantes, construyendo una tabla que asocia direcciones a puertos. Para tramas unicast desconocidas, inunda (floods) a todos los puertos excepto origen; una vez aprendida, reenvía solo al puerto destino. Las tramas broadcast y multicast se inundan a todos los puertos en la VLAN.

La operación full-duplex permite transmisión simultánea en ambas direcciones, duplicando la capacidad efectiva. El control de flujo mediante tramas de pausa (802.3x) permite que un receptor saturado solicite temporalmente al emisor que detenga la transmisión, evitando pérdida de tramas por overflow de buffer.

## PPP (Point-to-Point Protocol)

PPP diseñó el protocolo para conexiones dedicadas entre dos dispositivos, típicamente a través de líneas telefónicas conmutadas o dedicadas, eliminando la complejidad de acceso a medio compartido. Su simplicidad y flexibilidad lo hicieron dominante para acceso dial-up, DSL, y conectividad WAN serial.

### Encapsulación

PPP utiliza delimitadores de byte para marcar inicio y fin de trama: el flag 0x7E (01111110). Para garantizar transparencia de datos —que el flag no aparezca accidentalmente en el payload— se implementa byte stuffing: después de cada byte 0x7E en los datos, se inserta escape 0x7D seguido de 0x5E (0x7E XOR 0x20); similarmente para el propio escape 0x7D. Esto aumenta ligeramente el tamaño de tramas con muchos bytes especiales, pero mantiene la delimitación inequívoca.

La trama PPP tiene estructura minimalista:

| Campo | Longitud | Descripción |
|-------|----------|-------------|
| Flag | 1 byte | 0x7E, delimitador de inicio |
| Dirección | 1 byte | 0xFF (broadcast, ignorado) |
| Control | 1 byte | 0x03 (sin numeración, ignorado) |
| Protocolo | 2 bytes | Identifica payload: 0x0021=IP, 0xC021=LCP, 0x8021=NCP... |
| Payload | variable | Datos de protocolo identificado |
| FCS | 2 o 4 bytes | CRC-16 o CRC-32 |
| Flag | 1 byte | 0x7E, delimitador de fin |

Los campos de dirección y control mantienen compatibilidad con HDLC pero son esencialmente fijos e ignorados en PPP estándar. El campo de protocolo habilita la multiplexación: sobre el mismo enlace PPP pueden transportarse IP, IPX, AppleTalk, o tráfico de control de PPP mismo.

### Autenticación: PAP y CHAP

PPP incluye mecanismos de autenticación para verificar identidad antes de conceder acceso a la red.

**PAP (Password Authentication Protocol):** El cliente envía nombre de usuario y contraseña en texto plano. Simple pero inseguro: las credenciales son interceptables en el enlace y almacenables en el servidor para comparación. Obsoleto excepto en contextos donde el enlace mismo está protegido (túneles) o donde no hay alternativa con legacy equipment.

**CHAP (Challenge-Handshake Authentication Protocol):** Mecanismo de desafío-respuesta que evita transmisión de contraseña. El servidor envía desafío aleatorio; el cliente calcula hash (típicamente MD5) del desafío, su contraseña, y un identificador; envía el hash. El servidor repite el cálculo y verifica coincidencia. La contraseña nunca viaja por el enlace, y el desafío aleatorio previene ataques de replay. MS-CHAP y variantes añaden cifrado y mejores algoritmos de hash.

La negociación de autenticación ocurre durante la fase de establecimiento de enlace, controlada por LCP (Link Control Protocol), uno de los protocolos de control de PPP. Una vez autenticado, NCP (Network Control Protocol) configura el protocolo de capa de red (típicamente IPCP, IP Control Protocol, para asignar dirección IP dinámica).

## HDLC (High-Level Data Link Control)

HDLC es el ancestro de muchos protocolos de enlace, desarrollado por ISO a partir de SDLC de IBM. Proporciona servicios confiables orientados a conexión sobre enlaces seriales punto-a-punto o multipunto, con control de flujo y errores integrado.

### Tramas

HDLC define tres tipos de trama, distinguibles por el primer byte del campo de control:

**Tramas de información (I-frames):** Transportan datos de capa superior con numeración de secuencia para control de flujo y errores. El campo de control incluye: número de secuencia de envío N(S), número de secuencia de recepción esperada N(R) que reconoce tramas recibidas, y bits de polling/final para operación multipunto.

**Tramas de supervisión (S-frames):** Control de flujo y errores sin datos de usuario. Tipos: RR (Receive Ready, listo para recibir), RNR (Receive Not Ready, buffer lleno), REJ (Reject, retransmisión desde N(R) solicitada), SREJ (Selective Reject, retransmisión específica solicitada).

**Tramas no numeradas (U-frames):** Establecimiento, liberación y modo de operación del enlace. Incluyen: SABM (Set Asynchronous Balanced Mode, establecimiento), DISC (Disconnect), UA (Unnumbered Acknowledgment), FRMR (Frame Reject, error de protocolo), DM (Disconnected Mode).

El formato general de trama HDLC:

| Campo | Longitud | Descripción |
|-------|----------|-------------|
| Flag | 1 byte | 0x7E, delimitador |
| Dirección | 1 byte | Identifica estación en multipunto |
| Control | 1 o 2 bytes | Tipo de trama y parámetros de control |
| Información | variable | Payload (solo I-frames) |
| FCS | 2 bytes | CRC-16 |
| Flag | 1 byte | 0x7E, delimitador |

HDLC utiliza bit stuffing en lugar de byte stuffing: después de cinco unos consecutivos en los datos, se inserta un cero forzado, garantizando que el flag 01111110 nunca aparezca en el payload.

### Uso en enlaces seriales

HDLC fue diseñado para líneas seriales síncronas de telecomunicaciones: líneas T1/E1, conexiones X.25, enlaces de frame relay. Su operación balanceada (cualquier estación puede iniciar transmisión) contrasta con operación no balanceada (maestro-esclavo) de SDLC original.

En redes modernas, HDLC puro es raro, pero sus derivados son ubicuos: PPP se deriva directamente de HDLC, simplificando para conexiones punto-a-punto. LAPB (Link Access Procedure, Balanced) de X.25 es variante HDLC. Frame relay utiliza LAPF. Incluso el formato de trama de SDH/SONET tiene estructura inspirada en HDLC para overhead de gestión.

La persistencia de HDLC en equipamiento legacy —routers seriales, conexiones a bancos, sistemas industriales— requiere que el profesional de redes reconozca sus formatos y mecanismos, aunque raramente los implemente directamente.

## Cuándo se usa cada uno

| Contexto | Protocolo | Razón |
|----------|-----------|-------|
| Redes locales cableadas (LAN) | Ethernet | Costo, velocidad, interoperabilidad universal, topología de estrella flexible |
| Acceso a internet residencial (DSL, cable) | Ethernet sobre IP, o PPPoE | PPPoE encapsula sesiones de usuario sobre infraestructura ethernet de ISP |
| Conexiones seriales dedicadas (WAN) | PPP | Simplicidad, autenticación integrada, negociación de protocolos múltiples |
| Equipamiento legacy serial, X.25, frame relay | HDLC o derivados | Compatibilidad con infraestructura instalada, control de flujo integrado |
| Conexiones dial-up (obsoleto) | PPP | Estándar de facto para acceso telefónico a internet |
| VPNs punto-a-punto | PPP sobre tunel (PPTP, L2TP) | Reutilización de mecanismos de autenticación y configuración IP |

La elección no es siempre técnica sino histórica y económica. Las redes locales adoptaron ethernet y nunca miraron atrás. Las telecomunicaciones WAN, desarrolladas en contexto de operadores con equipamiento de diferentes proveedientes, estandarizaron en HDLC y sus descendientes. PPP emergió como solución de transición para llevar IP sobre infraestructura telefónica y serial, y persistió donde su simplicidad y autenticación eran valoradas.

La tendencia moderna es convergencia hacia ethernet en todos los contextos: ethernet en el acceso (FTTH, PON), ethernet en el centro de datos (incluso para storage, reemplazando Fibre Channel), ethernet en la WAN (Carrier Ethernet, MPLS pseudowires). Sin embargo, PPP permanece en nichos de autenticación de suscriptores, y HDLC en sistemas legacy que resisten la obsolescencia por inversión protegida.

> La superposición de protocolos es común en la práctica. PPPoE (PPP over Ethernet) encapsula sesiones PPP dentro de tramas ethernet, utilizado por muchos ISPs de DSL y fibra para autenticación de suscriptores y asignación de IP sobre infraestructura ethernet. Esto ilustra cómo protocolos de diferentes eras y contextos se combinan: la autenticación y negociación de PPP sobre el medio moderno de ethernet, obteniendo lo mejor de ambos mundos para un caso de uso específico.


## Quédate con...

- Ethernet domina redes locales por velocidad, costo e interoperabilidad; su trama mantiene compatibilidad estructural desde 1980 mientras evoluciona de 10 Mbps a 400 Gbps y de bus compartido a switches full-duplex dedicados.
- PPP proporciona conectividad punto-a-punto simple con autenticación integrada (CHAP superior a PAP), negociación de protocolos múltiples, y encapsulación con delimitadores de byte; persisten en acceso ISP y conexiones seriales.
- HDLC es ancestro de protocolos de enlace confiables orientados a conexión, con tramas de información, supervisión y no numeradas para control integral del enlace; raramente usado puro pero ubicuos en derivados y legacy.
- La selección de protocolo responde a contexto: ethernet para broadcast local, PPP para punto-a-punto con autenticación, HDLC para seriales legacy; la tendencia moderna converge hacia ethernet pero nichos protegen alternativas por inversión histórica o requisitos específicos.
- La superposición de protocolos (PPPoE) demuestra la flexibilidad de la arquitectura de capas, permitiendo combinar mecanismos de diferentes eras para casos de uso específicos.



<div class="pagination">
  <a href="/markdown/sistemas/redes/enlace/errores" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/enlace/conmutadores" class="next">Siguiente</a>
</div>
