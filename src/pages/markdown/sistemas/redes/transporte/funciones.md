---
title: "Función de la capa de transporte"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Función de la capa de transporte](#función-de-la-capa-de-transporte)
  - [Función de la capa de transporte](#función-de-la-capa-de-transporte-1)
  - [Multiplexación (puertos)](#multiplexación-puertos)
  - [Control de flujo](#control-de-flujo)
  - [Fiabilidad](#fiabilidad)
  - [Quédate con...](#quédate-con)

</div>

# Función de la capa de transporte

La comunicación entre aplicaciones distribuidas en una red requiere algo más que la capacidad de entregar paquetes entre direcciones IP: necesita distinguir qué proceso en el destino debe recibir los datos, garantizar que la información llegue completa y en orden cuando sea necesario, y regular la velocidad de transmisión para no saturar al receptor. La capa de transporte resuelve estos problemas introduciendo el concepto de puerto para identificar aplicaciones, mecanismos de control de flujo para adaptar la tasa de envío a la capacidad del receptor, y protocolos que ofrecen distintos grados de fiabilidad según los requisitos de la aplicación. Esta capa transforma la entrega "mejor esfuerzo" de la red en un servicio adaptable que puede ser confiable como una llamada telefónica o ligero como un mensaje de radio.

## Función de la capa de transporte

Mientras la capa de red se ocupa de mover paquetes entre hosts usando direcciones lógicas, la capa de transporte opera entre procesos: asegura que los datos generados por una aplicación en el origen lleguen a la aplicación correspondiente en el destino. Esta distinción es fundamental: una máquina puede ejecutar decenas de servicios simultáneamente (navegador, cliente de correo, sincronización en la nube), y el sistema operativo necesita un mecanismo para dirigir cada segmento de red al proceso correcto. La capa de transporte proporciona esa demultiplexación mediante identificadores numéricos llamados puertos.

Además del direccionamiento entre aplicaciones, esta capa ofrece servicios opcionales de calidad. Algunas aplicaciones, como la transferencia de archivos o las transacciones bancarias, exigen que cada byte llegue sin errores, sin duplicados y en el orden original. Otras, como el streaming de video o la voz sobre IP, toleran cierta pérdida a cambio de baja latencia. La capa de transporte no impone un modelo único: ofrece protocolos con distintos compromisos entre fiabilidad, velocidad y sobrecarga, permitiendo que cada aplicación elija el que mejor se adapta a sus necesidades.

## Multiplexación (puertos)

La multiplexación permite que múltiples flujos de datos compartan una misma conexión de red sin interferir entre sí. En la práctica, esto se implementa mediante puertos: números de 16 bits que, combinados con la dirección IP y el protocolo de transporte, forman un socket, el identificador único de un extremo de comunicación. Un socket se define como la tupla `(IP, puerto, protocolo)`: por ejemplo, `(192.168.1.10, 443, TCP)` identifica de forma inequívoca una conexión HTTPS hacia un servidor específico.

Los puertos se dividen en tres rangos con propósitos distintos. Los puertos bien conocidos (0–1023) están asignados por IANA a servicios estándar: 80 para HTTP, 443 para HTTPS, 22 para SSH, 53 para DNS. Los puertos registrados (1024–49151) pueden ser solicitados para aplicaciones específicas, aunque en la práctica muchas aplicaciones de usuario los usan dinámicamente. Los puertos dinámicos o efímeros (49152–65535) son asignados temporalmente por el sistema operativo al iniciar una conexión saliente, permitiendo que un mismo cliente abra múltiples sesiones simultáneas hacia el mismo servidor sin ambigüedad.

>  Un servidor típico escucha en un puerto bien conocido (por ejemplo, 443 para HTTPS), mientras que cada cliente usa un puerto efímero distinto para cada conexión. Esta combinación permite que un único servidor atienda miles de clientes simultáneos: cada flujo se distingue por la tupla completa `(IP_cliente, puerto_cliente, IP_servidor, puerto_servidor, protocolo)`.

## Control de flujo

El control de flujo evita que un emisor rápido sature a un receptor lento, una situación que provocaría pérdida de paquetes y retransmisiones innecesarias. TCP implementa este mecanismo mediante una ventana deslizante: el receptor anuncia en cada acuse de recibo cuántos bytes adicionales está dispuesto a aceptar, y el emisor ajusta dinámicamente su tasa de envío para no exceder ese límite. Esta ventana se negocia durante el establecimiento de la conexión y se adapta en tiempo real según la disponibilidad de buffers en el receptor.

El control de flujo opera exclusivamente entre los extremos de la comunicación: no involucra a routers intermedios ni asume conocimiento de la topología de la red. Esta simplicidad es deliberada: delega la complejidad de la gestión de congestión a mecanismos separados (como el control de congestión de TCP), manteniendo cada responsabilidad aislada y más fácil de razonar. Cuando el receptor está sobrecargado, puede anunciar una ventana de tamaño cero, forzando al emisor a pausar temporalmente el envío hasta que se libere espacio en buffer.

## Fiabilidad

La fiabilidad en la capa de transporte garantiza que los datos entregados al proceso receptor sean idénticos a los enviados por el emisor: sin pérdidas, sin duplicados, sin reordenamientos y sin corrupción. TCP logra esto mediante tres mecanismos coordinados. Primero, cada byte transmitido recibe un número de secuencia; el receptor usa estos números para reensamblar los datos en el orden correcto y detectar huecos. Segundo, cada segmento recibido genera un acuse de recibo (ACK); si el emisor no recibe confirmación en un tiempo determinado, retransmite los datos no confirmados. Tercero, un checksum en la cabecera permite detectar corrupción de bits durante la transmisión; los segmentos corruptos se descartan silenciosamente, forzando la retransmisión por timeout.

Estas garantías tienen un costo: latencia adicional por espera de ACKs, sobrecarga de cabeceras y complejidad de implementación. Por esta razón, no todas las aplicaciones requieren fiabilidad a nivel de transporte. UDP, el protocolo alternativo en esta capa, omite secuencias, ACKs y retransmisiones: entrega datagramas "tal cual", sin garantías de orden ni entrega. Esta minimalismo es una característica, no un defecto: aplicaciones como DNS, VoIP o juegos en línea priorizan la velocidad y toleran pérdidas ocasionales, delegando cualquier control de fiabilidad a la capa de aplicación si es estrictamente necesario.

> La fiabilidad de TCP es de extremo a extremo: los routers intermedios no participan en la detección de pérdidas ni en las retransmisiones. Esta arquitectura, conocida como principio del extremo a extremo, mantiene la red simple y escalable, concentrando la inteligencia en los hosts finales donde reside el contexto completo de la aplicación.

## Quédate con...

*   La capa de transporte conecta procesos, no solo hosts: usa puertos para demultiplexar tráfico entre aplicaciones concurrentes en el mismo dispositivo.
*   Los sockets `(IP, puerto, protocolo)` identifican de forma única cada extremo de comunicación, permitiendo miles de sesiones simultáneas entre los mismos hosts.
*   El control de flujo (ventana deslizante en TCP) adapta la tasa de envío a la capacidad del receptor, evitando saturación y pérdida innecesaria de datos.
*   La fiabilidad en TCP se logra mediante números de secuencia, acuses de recibo y retransmisiones por timeout, garantizando entrega ordenada y sin errores.
*   UDP ofrece un servicio minimalista sin garantías: ideal para aplicaciones que priorizan baja latencia y toleran pérdida, delegando control a la capa de aplicación.
*   La elección entre TCP y UDP no es binaria: cada protocolo resuelve distintos compromisos entre fiabilidad, velocidad y complejidad según los requisitos de la aplicación.


<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/transporte/puertos" class="next">Siguiente</a>
</div>
