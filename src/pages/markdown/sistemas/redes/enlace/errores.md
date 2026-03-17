---
title: "Detección y corrección de errores"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Detección y corrección de errores](#detección-y-corrección-de-errores)
  - [Técnicas de detección](#técnicas-de-detección)
    - [Paridad](#paridad)
    - [Checksum](#checksum)
    - [CRC (Cyclic Redundancy Check)](#crc-cyclic-redundancy-check)
  - [Técnicas de corrección](#técnicas-de-corrección)
    - [Códigos de Hamming](#códigos-de-hamming)
    - [ARQ: Automatic Repeat reQuest](#arq-automatic-repeat-request)
  - [Diferencia entre detección y corrección](#diferencia-entre-detección-y-corrección)
  - [Quédate con...](#quédate-con)

</div>

# Detección y corrección de errores

La transmisión de datos por cualquier medio físico está sujeta a imperfecciones inevitables: ruido térmico, interferencias electromagnéticas, atenuación, distorsión de fase. Estas perturbaciones pueden alterar bits individuales, transformando ceros en unos o viceversa, con probabilidad que aumenta con la distancia, la velocidad, y la degradación del canal. Sin mecanismos para enfrentar esta incertidumbre, la comunicación digital sería imposible más allá de distancias cortas y velocidades bajas. Las técnicas de detección y corrección de errores son la respuesta ingenieril: agregar información redundante calculada a partir de los datos originales, de modo que el receptor pueda identificar cuando ocurrió corrupción y, en algunos casos, recuperar los bits originales sin necesidad de retransmisión.

La distinción entre detección y corrección es fundamental. La **detección** añade suficiente redundancia para reconocer que algo falló, pero no para determinar qué; ante error detectado, se solicita retransmisión o se descarta la unidad corrupta. La **corrección** añade mayor redundancia, suficiente para identificar qué bits específicos están erróneos y corregirlos. El trade-off es claro: corrección requiere más bits de overhead, reduciendo la eficiencia del ancho de banda, pero evita la latencia de retransmisión. La elección depende de las características del canal: si los errores son frecuentes y la latencia de ida y vuelta es alta (comunicaciones espaciales, por ejemplo), la corrección es preferible; si los errores son raros y la retransmisión es rápida (redes locales cableadas), la detección con retransmisión es más eficiente.

## Técnicas de detección

### Paridad

El mecanismo más simple de detección. Se añade un bit adicional a cada unidad de datos (típicamente byte o palabra), configurado para que el número total de bits en 1 sea par (paridad par) o impar (paridad impar). Si durante la transmisión cambia un bit impar de la unidad, la paridad resultante será incorrecta, detectando el error.

La paridad detecta errores en número impar de bits: un error simple, tres errores, etc. Pasa inadvertida errores en número par: dos bits cambiados simultáneamente en la misma unidad preservan la paridad aparente. En canales donde los errores ocurren en ráfagas —múltiples bits consecutivos afectados por un mismo evento de ruido— la probabilidad de error doble no es despreciable, limitando la utilidad de la paridad simple.

Históricamente utilizada en comunicaciones seriales (UART), memoria RAM de sistemas antiguos, y algunos protocolos de enlace simples. En redes modernas ha sido completamente reemplazada por técnicas más robustas, pero permanece como introducción pedagógica a los conceptos de redundancia y distancia de Hamming.

### Checksum

La suma de verificación extiende el concepto de redundancia de paridad a unidades mayores. Los datos se dividen en palabras de longitud fija (típicamente 16 o 32 bits), se suman aritméticamente, y se transmite el complemento a uno (o a veces la suma misma) como campo de checksum. El receptor repite el cálculo; si la suma incluyendo el checksum no resulta en valor esperado (todos unos para complemento a uno), se detecta error.

El checksum de internet (TCP, UDP, IP) es ejemplo clásico: 16-bit one's complement sum de todos los words de 16 bits del pseudo-cabecera, cabecera, y datos. Es más robusto que paridad simple porque los errores en múltiples bits pueden afectar la suma de manera detectable. Sin embargo, errores que compensan —un bit incrementado y otro decrementado en posiciones que afectan la misma posición de suma— pasan inadvertidos.

El checksum es computacionalmente ligero, requiriendo solo sumas y complementos, lo que lo hace atractivo para implementación en software. Pero su capacidad de detección es limitada: aproximadamente 1 - 2^(-16) = 99.998% para checksum de 16 bits, asumiendo errores aleatorios. En aplicaciones críticas, esto es insuficiente.

### CRC (Cyclic Redundancy Check)

El CRC es la técnica de detección dominante en redes modernas, proporcionando robustez cercana a la óptima teórica con implementación eficiente en hardware. Trata la secuencia de bits como coeficientes de un polinomio sobre el campo de Galois GF(2), donde la aritmética es módulo 2 (XOR para suma y resta, sin acarreo).

El procedimiento: los datos de n bits se representan como polinomio M(x). Se elige un polinomio generador G(x) de grado k, estandarizado para cada aplicación (CRC-8, CRC-16, CRC-32). Se calcula el resto de la división de M(x)·x^k por G(x); este resto de k bits es el CRC, que se transmite adjunto. El receptor divide la secuencia completa (datos + CRC) por G(x); resto cero indica ausencia de error detectable.

La potencia del CRC reside en sus propiedades matemáticas: detecta todos los errores de ráfaga de longitud ≤ k, todos los errores de bit impar si G(x) contiene factor (x+1), y con probabilidad 1-2^(-k) errores de ráfaga mayores. CRC-32 de ethernet detecta errores de ráfaga hasta 32 bits con certeza, y errores aleatorios con probabilidad de escape de 1 en 4 mil millones.

La implementación en hardware utiliza registros de desplazamiento con retroalimentación lineal (LFSR), procesando bits a velocidad de línea sin intervención de procesador. Por esto, el CRC se ubica típicamente en la trama de enlace (FCS de ethernet), calculado por la NIC en transmisión y verificado en recepción, descartando tramas corruptas sin notificación a software.

## Técnicas de corrección

### Códigos de Hamming

Richard Hamming desarrolló en los años 1950 códigos que permiten no solo detectar sino corregir errores de bit único, mediante inserción estratégica de bits de paridad en posiciones de potencia de dos (1, 2, 4, 8...) dentro de la palabra codificada. Cada bit de paridad cubre posiciones cuyo índice tiene ese bit de potencia en su representación binaria.

Para datos de m bits, se requieren r bits de redundancia donde 2^r ≥ m + r + 1. La distancia de Hamming del código —mínimo número de bits en que difieren dos palabras válidas— es 3, permitiendo detección de 2 errores o corrección de 1 error. El receptor calcula síndromes (patrones de paridad incorrecta) que identifican la posición del error; si el síndrome es cero, no hay error; si no, el síndrome apunta al bit a corregir.

Los códigos de Hamming extendidos (SECDED, Single Error Correction, Double Error Detection) añaden un bit de paridad global, aumentando la distancia a 4, permitiendo corrección de 1 error y detección de 2 simultáneamente. Esto es crítico en memorias de sistemas críticos: se corrige el error simple sin interrupción, pero si se detectan dos errores se señala fallo irrecuperable.

En redes de comunicación, los códigos de Hamming son menos comunes que en almacenamiento, porque la latencia de retransmisión típicamente es aceptable comparada con el overhead de corrección. Sin embargo, en canales de alta latencia (satelital, interplanetario) o en aplicaciones de tiempo real donde la retransmisión es imposible, la corrección de error directo es esencial.

### ARQ: Automatic Repeat reQuest

Los protocolos ARQ combinan detección de errores con retransmisión solicitada, adaptando la confiabilidad a las condiciones del canal sin el overhead constante de la corrección directa. Tres variantes clásicas ilustran el trade-off entre eficiencia y complejidad.

**Stop-and-Wait:** El emisor transmite una unidad de datos, detiene, y espera reconocimiento (ACK) del receptor. Si recibe ACK, continúa con siguiente unidad; si recibe NAK (negative acknowledgment) o expira temporizador, retransmite. Simple pero ineficiente: el canal permanece inactivo durante el tiempo de propagación de ida y vuelta (RTT). Para canales de alta latencia o alta velocidad, la utilización del canal tiende a cero.

**Go-Back-N:** El emisor mantiene ventana de transmisión de N unidades sin reconocimiento. Transmite continuamente hasta llenar la ventana; si recibe ACK para la unidad más antigua, desliza la ventana. Si detecta error (NAK o timeout) en unidad k, retransmite desde k en adelante, descartando unidades posteriores aunque fueran recibidas correctamente. Más eficiente que Stop-and-Wait al mantener el canal ocupado, pero desperdicia ancho de banda retransmitiendo unidades correctas recibidas después del error.

**Selective Repeat:** Similar a Go-Back-N en ventana de transmisión, pero el receptor almacena unidades correctas recibidas fuera de orden, solicitando retransmisión solo de las específicas perdidas. El emisor retransmite solo lo necesario, maximizando eficiencia de ancho de banda. El costo es complejidad de buffer en receptor (debe almacenar hasta N unidades desordenadas) y lógica de reensamblaje, además de que los ACKs deben ser individuales por unidad o selectivos.

TCP implementa una variante de Selective Repeat con acuses de recibo acumulativos (SACK, Selective Acknowledgment, opcional) que permiten informar rangos específicos de bytes recibidos, optimizando retransmisión en presencia de múltiples pérdidas.

## Diferencia entre detección y corrección

| Aspecto | Detección | Corrección |
|---------|-----------|------------|
| **Redundancia requerida** | Menor (ej. 32 bits de CRC para paquete de 1500 bytes ≈ 0.3%) | Mayor (ej. código Hamming para 64 bits de datos requiere 7 bits de paridad ≈ 11%) |
| **Acción ante error** | Descarte y retransmisión, o notificación de fallo | Corrección automática sin retransmisión |
| **Latencia** | Variable, incluye RTT de retransmisión | Determinista, procesamiento local |
| **Complejidad** | Menor en receptor | Mayor, requiere decodificación de síndrome |
| **Aplicación típica** | Redes cableadas con baja tasa de error, alta velocidad, baja latencia de RTT | Canales satelitales, almacenamiento de datos, comunicaciones de alta latencia, memoria de sistemas críticos |

La elección no es binaria: los sistemas frecuentemente combinan ambas aproximaciones. La memoria ECC (Error-Correcting Code) utiliza códigos que corrigen errores simples y detectan dobles. Los sistemas de almacenamiento distribuido (RAID, erasure coding) utilizan códigos de corrección de borrado (variante de corrección donde la posición del error es conocida) para reconstruir datos de nodos fallidos sin retransmisión. Las comunicaciones inalámbricas modernas (5G, Wi-Fi 6) utilizan códigos de corrección de error avanzados (LDPC, Low-Density Parity-Check; turbo codes, polar codes) que se acercan al límite de Shannon, corrigiendo errores en el receptor para reducir la necesidad de retransmisión que degradaría la experiencia de aplicaciones en tiempo real.

>La aparente superioridad de la corrección sobre la detección es engañosa si no se considera el contexto del canal. En un canal con tasa de error de bit de 10^-6, un paquete de 1500 bytes tiene probabilidad de error de aproximadamente 1.2%. Con detección y retransmisión, el overhead es 0.3% (CRC) más 1.2% de retransmisiones ≈ 1.5%. Con corrección capaz de manejar errores múltiples, el overhead podría ser 10-20%. La corrección solo es eficiente cuando la tasa de error es suficientemente alta para hacer frecuentes las retransmisiones, o cuando la latencia de retransmisión es inaceptable. El diseñador de sistemas debe modelar el canal y calcular, no asumir.


## Quédate con...

- La detección de errores añade redundancia mínima para identificar corrupción; la corrección añade mayor redundancia para recuperar datos originales sin retransmisión, con trade-off de overhead versus latencia.
- La paridad simple detecta errores de bit impar pero falla ante errores pares; el checksum es más robusto pero vulnerable a errores compensatorios; el CRC proporciona detección casi óptima con implementación eficiente en hardware, dominando en redes modernas.
- Los códigos de Hamming permiten corrección de error simple mediante bits de paridad estratégicamente ubicados, utilizados en memorias y sistemas donde la latencia de retransmisión es crítica.
- Los protocolos ARQ (Stop-and-Wait, Go-Back-N, Selective Repeat) combinan detección con retransmisión adaptativa, optimizando eficiencia del canal según latencia y tasa de error; TCP implementa variantes sofisticadas de Selective Repeat.
- La selección entre detección y corrección depende de características del canal: corrección es preferible en alta latencia o alta tasa de error; detección con retransmisión es más eficiente en canales cableados de baja latencia y baja tasa de error.



<div class="pagination">
  <a href="/markdown/sistemas/redes/enlace/mac_llc" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/enlace/protocolos" class="next">Siguiente</a>
</div>
