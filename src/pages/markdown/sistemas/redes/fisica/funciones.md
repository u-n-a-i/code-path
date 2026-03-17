---
title: "Función de la capa física"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Función de la capa física](#función-de-la-capa-física)
  - [Qué es la capa física](#qué-es-la-capa-física)
  - [Qué significa "transmitir bits"](#qué-significa-transmitir-bits)
  - [Conversión de datos digitales en señales físicas](#conversión-de-datos-digitales-en-señales-físicas)
  - [Elementos controlados por la capa física](#elementos-controlados-por-la-capa-física)
  - [Bitrate versus baud rate](#bitrate-versus-baud-rate)
  - [Qué NO hace la capa física](#qué-no-hace-la-capa-física)
  - [Quédate con...](#quédate-con)

</div>

# Función de la capa física

La capa física es el punto donde la abstracción digital encuentra su materialización en el mundo físico real. Es el límite inferior de la arquitectura de redes, la frontera donde los bits —entidades matemáticas puras, valores de verdad en un sistema binario— se convierten en energía que atraviesa espacio, tiempo y materia. Sin esta conversión, no hay comunicación posible; con ella, surge toda la complejidad de hacer que la información sobreviva a la imperfección inherente de los medios físicos.

Comprender la capa física requiere abandonar temporalmente la comodidad de las abstracciones lógicas. Aquí no hay direcciones IP, no hay números de secuencia, no hay cabeceras que estructuren el significado. Solo hay la tarea elemental: hacer que un receptor distinga, con suficiente fiabilidad, cuándo el emisor ha enviado un uno y cuándo un cero. Todo lo demás —toda la arquitectura de capas superiores— se construye sobre esta capacidad fundamental de discriminación binaria.

## Qué es la capa física

La capa física especifica las características mecánicas, eléctricas, funcionales y procedimentales para activar, mantener y desactivar conexiones físicas que transportan bits. Sus especificaciones definen cómo se representan los bits en el medio, cómo se sincroniza emisor y receptor, qué velocidades son alcanzables, y qué topologías de cableado son soportadas.

Esta capa no es un software ni un protocolo en el sentido convencional; es un conjunto de estándares que permiten la interoperabilidad de hardware. Cuando conectas un cable ethernet RJ-45 a una tarjeta de red, estás utilizando especificaciones de la capa física: el tamaño y forma del conector (mecánica), los niveles de voltaje en cada pin (eléctrica), qué señales significan datos versus control (funcional), y el procedimiento para establecer enlace (procedimental). Sin acuerdo explícito o implícito sobre estas características, la conexión física simplemente no funciona.

La implementación típica incluye el medio físico propiamente dicho (cables, fibra, aire), conectores, transceptores que convierten entre señales eléctricas/lógicas y el medio, y circuitos de codificación/decodificación que transforman bits en señales apropiadas para transmisión.

## Qué significa "transmitir bits"

Transmitir bits significa establecer una convención física que permita al receptor distinguir sistemáticamente entre dos estados, interpretados como 0 y 1. Esta convención puede basarse en cualquier propiedad física mensurable: presencia versus ausencia de voltaje, polaridad positiva versus negativa, fase de onda, frecuencia de portadora, intensidad lumínica, polarización de luz.

La simplicidad del bit —solo dos valores— oculta complejidad física. En un cable ethernet, el cero y el uno no son simplemente "sin voltaje" y "con voltaje", porque el ruido eléctrico ambiente, las reflexiones de señal, y la atenuación con la distancia harían imposible distinguir niveles absolutos. En su lugar, se utilizan codificaciones de línea como Manchester, NRZ (Non-Return-to-Zero), o PAM (Pulse Amplitude Modulation), donde la información reside en transiciones, niveles diferenciales, o patrones temporales que son más robustos contra degradación.

El bit es una abstracción lógica; la señal física es continua, analógica, sujeta a ruido, distorsión e interferencia. La capa física debe diseñarse para que, a pesar de estas imperfecciones, el receptor pueda recuperar la secuencia de bits con tasa de error suficientemente baja para que capas superiores corrijan o toleren los errores residuales.

## Conversión de datos digitales en señales físicas

La transformación de bits en señales sigue procesos de codificación en múltiples niveles. Primero, la codificación de fuente comprime o estructura los datos originales (aunque esto frecuentemente ocurre en capas superiores). Luego, la codificación de canal añade redundancia para protección contra errores. Finalmente, la codificación de línea convierte la secuencia binaria en forma de onda apropiada para el medio específico.

En ethernet 100BASE-TX, los bits se codifican mediante esquema 4B/5B: cada grupo de 4 bits de datos se mapea a 5 bits de código, eliminando secuencias con demasiados ceros consecutivos que dificultarían sincronización. Luego, se aplica codificación MLT-3 (Multi-Level Transmit), que utiliza tres niveles de voltaje (-1, 0, +1) con transiciones específicas para representar los bits codificados. Esta señal eléctrica viaja por dos pares trenzados, uno para cada dirección en operación full-duplex.

En fibra óptica, la codificación convierte bits en pulsos de luz infrarroja. El estándar 1000BASE-SX utiliza codificación 8B/10B: 8 bits de datos se expanden a 10, proporcionando suficiente transiciones para sincronización de reloj y balance DC. Los láseres de 850 nm se modulan para emitir pulsos de duración controlada; fotodetectores en el receptor convierten luz de vuelta a señales eléctricas.

En comunicaciones inalámbricas, la codificación es más compleja. Los bits modulan una portadora de radiofrecuencia mediante técnicas como QPSK (Quadrature Phase Shift Keying), donde cada símbolo transporta 2 bits codificados en cuatro fases posibles de la onda, o QAM-256 (Quadrature Amplitude Modulation), donde combinaciones de amplitud y fase permiten 8 bits por símbolo. La antena irradia esta señal modulada; otra antena receptora captura la energía electromagnética atenuada y la demodula.

## Elementos controlados por la capa física

**Voltaje y niveles de señal:** La especificación define qué rangos de voltaje (o intensidad óptica, o potencia de RF) representan cada estado lógico, con márgenes de tolerancia que permiten variación por ruido y atenuación. Ethernet 10BASE-T especifica +2.05V a +2.8V para uno, -2.05V a -2.8V para cero, medidos diferencialmente entre pares. Estos niveles deben mantenerse dentro de ventanas temporales precisas para ser válidos.

**Modulación y codificación:** Determina cómo se mapean bits a propiedades de la señal. La elección implica trade-offs entre eficiencia espectral (bits por Hz de ancho de banda), robustez al ruido, complejidad de implementación, y potencia requerida. Modulaciones más complejas transportan más bits por símbolo pero requieren mejor relación señal-ruido para discriminación confiable.

**Sincronización:** Emisor y receptor deben acordar cuándo comienza y termina cada bit. La sincronización de bit (a nivel de símbolo individual) se logra mediante transiciones regulares en la señal, extraídas por circuitos de recuperación de reloj en el receptor. La sincronización de trama (a nivel de grupos de bits) utiliza preámbulos específicos que anuncian el inicio de una unidad de datos. Sin sincronización, el receptor no sabría si está muestreando el momento correcto de cada bit, produciendo errores sistemáticos.

**Velocidad de transmisión:** La especificación define la tasa a la que se suceden los símbolos, determinada por el reloj del sistema. Esta velocidad está limitada por el ancho de banda del medio: según el teorema de Nyquist, un canal de ancho de banda B puede transportar como máximo 2B símbolos por segundo sin errores de interferencia intersimbólica. La velocidad real es siempre menor que este límite teórico debido a imperfecciones prácticas.

## Bitrate versus baud rate

Esta distinción es frecuentemente confundida pero conceptualmente clara. El **bitrate** (tasa de bits) mide la cantidad de bits de información transmitidos por segundo. El **baud rate** (tasa de símbolos) mide la cantidad de símbolos de señalización transmitidos por segundo. Un símbolo puede representar múltiples bits.

En codificaciones simples como NRZ, cada símbolo representa un bit: bitrate igual baud rate. En codificaciones más eficientes, la relación difiere. QPSK transmite 2 bits por símbolo; si el baud rate es 10 Mbaud, el bitrate es 20 Mbps. QAM-256 transmite 8 bits por símbolo; 10 Mbaud producen 80 Mbps. Ethernet 1000BASE-T utiliza PAM-5 con codificación 4D-PAM5 que, combinada con otros mecanismos, logra 1000 Mbps utilizando símbolos a 125 Mbaud sobre cuatro pares simultáneamente.

La confusión surge porque en conversación coloquial "baud" se usa incorrectamente como sinónimo de "bit por segundo". En realidad, baud honra a Émile Baudot, inventor de un código telegráfico, y mide símbolos, no bits. La eficiencia de un sistema de comunicación se mide precisamente por su capacidad de transportar múltiples bits por baud, maximizando el uso del ancho de banda espectral disponible.

## Qué NO hace la capa física

La delimitación de responsabilidades es tan importante como la asignación. La capa física tiene un propósito específico y limitado; funciones que intuitivamente podrían parecer físicas son responsabilidad de capas superiores.

**No direcciona:** La capa física no conoce direcciones de red, ni MAC ni IP. Solo conoce "el medio conectado a esta interfaz". Cuando una trama ethernet llega, la capa física entrega los bits a la capa de enlace sin saber si la dirección MAC destino corresponde a esta máquina, a otra, o si es broadcast. La discriminación de direcciones ocurre en capa de enlace.

**No detecta errores de contenido:** La capa física puede detectar señalización inválida (voltajes fuera de rango, violaciones de codificación), pero no errores en la secuencia de bits una vez recuperada. El bit de paridad, el CRC de trama, el checksum de capas superiores —todo esto opera sobre bits ya recibidos, verificando integridad lógica, no física. La capa física garantiza que los bits entregados son los que físicamente llegaron, no que sean los correctos.

**No interpreta datos:** La capa física no sabe qué significan los bits que transporta. No distingue entre cabecera y payload, entre control y datos de aplicación, entre bits de sincronización y bits de información. Solo transporta una secuencia binaria opaca. La interpretación de estructura —dónde comienza una trama, qué campo es qué— es responsabilidad de la capa de enlace y superiores.

**No gestiona flujo ni congestión:** La velocidad de transmisión es fija por especificación de la capa física. Si el receptor no puede procesar a esa velocidad, la capa física no ralentiza ni bufferiza; simplemente entrega bits tan rápido como especificado. El control de flujo (entre emisor y receptor) y de congestión (en la red) son funciones de capa de enlace y transporte.

**No establece ni termina sesiones:** La conexión física puede estar presente o ausente, pero la capa física no negocia su establecimiento ni su término. La detección de portadora en ethernet ("hay señal en el medio") es función física, pero la negociación de parámetros de conexión, el handshake de establecimiento, y la terminación ordenada son funciones de capas superiores.

Esta delimitación no es debilidad sino diseño. Al limitar la capa física a su función esencial —transportar bits de manera que puedan ser distinguibles— se permite que evolucione independientemente. La transición de coaxial a par trenzado, de cobre a fibra, de cables a inalámbrico, no requiere modificar capas superiores porque la interfaz permanece: bits entregados, bits recibidos. La abstracción se preserva, la complejidad se encapsula, la arquitectura se mantiene coherente a través de revoluciones tecnológicas.


## Quédate con...

- La capa física materializa bits como energía electromagnética mediante especificaciones mecánicas, eléctricas, funcionales y procedimentales que permiten interoperabilidad de hardware.
- "Transmitir bits" significa establecer convenciones físicas robustas que permitan distinguir sistemáticamente dos estados a pesar del ruido, atenuación e imperfección inherentes a cualquier medio.
- La conversión de datos digitales en señales físicas involucra múltiples niveles de codificación (fuente, canal, línea) que optimizan para el medio específico: voltajes diferenciales en cobre, pulsos lumínicos en fibra, modulación de portadoras en radiofrecuencia.
- La capa física controla voltajes/niveles de señal, esquemas de modulación y codificación, sincronización de bit y trama, y velocidad de transmisión —pero nada de interpretación semántica o lógica.
- Bitrate (bits de información por segundo) difiere de baud rate (símbolos de señalización por segundo); sistemas eficientes transportan múltiples bits por símbolo mediante modulaciones complejas (QPSK, QAM).
- La capa física no direcciona, no detecta errores de contenido, no interpreta estructura de datos, no gestiona flujo ni congestión, y no establece sesiones —estas funciones pertenecen a capas superiores, lo que permite evolución tecnológica independiente.



<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/fisica/senales" class="next">Siguiente</a>
</div>
