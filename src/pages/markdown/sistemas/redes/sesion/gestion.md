---
title: "Establecimiento, mantenimiento y cierre de sesión"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Establecimiento, mantenimiento y cierre de sesión](#establecimiento-mantenimiento-y-cierre-de-sesión)
  - [Qué es una sesión en redes](#qué-es-una-sesión-en-redes)
  - [Cómo se establece una sesión lógica entre dos aplicaciones](#cómo-se-establece-una-sesión-lógica-entre-dos-aplicaciones)
  - [Control de diálogo (half-duplex, full-duplex)](#control-de-diálogo-half-duplex-full-duplex)
  - [Mecanismos de cierre ordenado](#mecanismos-de-cierre-ordenado)
  - [Quédate con...](#quédate-con)

</div>

# Establecimiento, mantenimiento y cierre de sesión

Una sesión en redes representa un contexto lógico persistente que permite a dos aplicaciones intercambiar información de forma coordinada a lo largo del tiempo. No es una conexión física ni un canal de transporte: es un acuerdo de estado compartido que define cómo se organiza el diálogo, cuándo se sincronizan los participantes y qué ocurre si la comunicación se interrumpe. Esta capa de abstracción transforma el flujo de paquetes en conversaciones estructuradas, habilitando escenarios como transferencias de archivos reanudables, transacciones distribuidas con rollback o videollamadas que toleran fluctuaciones de red sin perder el hilo de la interacción.

## Qué es una sesión en redes

Una sesión es un contexto de comunicación establecido entre dos entidades de aplicación que comparten estado y coordinan su interacción durante un intervalo de tiempo definido. A diferencia de una conexión de transporte —que garantiza entrega de datos entre hosts—, una sesión gestiona la semántica del intercambio: quién habla cuándo, cómo se recuperan los puntos de sincronización tras un fallo, y bajo qué condiciones se considera completada la interacción.

Este concepto es independiente del protocolo subyacente. HTTP, por ejemplo, es inherentemente stateless a nivel de protocolo, pero las aplicaciones web construyen sesiones mediante cookies o tokens que mantienen identidad entre solicitudes discretas. En cambio, protocolos como SIP (para VoIP) o RTSP (para streaming) gestionan sesiones explícitas con negociación de parámetros, control de estado y cierre ordenado. La sesión no reside en la red: es un acuerdo lógico entre aplicaciones que usan la red como medio.

>  La confusión entre conexión y sesión es común. Una conexión TCP es un canal fiable entre dos sockets; una sesión es un contexto de aplicación que puede usar una o varias conexiones, persistir más allá de fallos de transporte, o incluso migrar entre endpoints sin perder estado.

## Cómo se establece una sesión lógica entre dos aplicaciones

El establecimiento de una sesión requiere que ambas partes negocien parámetros que definirán el comportamiento del diálogo. Este proceso típicamente sigue tres fases: identificación, negociación y confirmación.

En la fase de **identificación**, las aplicaciones se autentican mutuamente o presentan credenciales que validan su derecho a establecer la sesión. Esto puede ser tan simple como un token de acceso o tan complejo como un intercambio de certificados TLS con verificación de identidad.

La fase de **negociación** define las reglas del intercambio: formato de datos, codificación, límites de tamaño de mensaje, mecanismos de sincronización y políticas de recuperación ante fallos. Protocolos como SIP utilizan mensajes `INVITE` con cuerpos SDP (*Session Description Protocol*) para proponer capacidades; el receptor responde con `200 OK` aceptando o modificando la propuesta.

Finalmente, la **confirmación** sella el acuerdo: ambas partes registran el estado de sesión activo, inicializan contadores de secuencia o marcas de tiempo, y comienzan el intercambio de datos útiles. A partir de este punto, cualquier mensaje intercambiado se interpreta dentro del contexto de la sesión establecida.

>  Algunas sesiones son implícitas: una aplicación puede comenzar a enviar datos sin negociación explícita, asumiendo parámetros por defecto. Esta aproximación reduce latencia inicial pero limita la flexibilidad y la capacidad de recuperación ante condiciones inesperadas.

## Control de diálogo (half-duplex, full-duplex)

El control de diálogo gestiona el turno de palabra entre participantes, evitando colisiones semánticas incluso cuando el transporte subyacente permite transmisión bidireccional simultánea. Esta gestión opera en tres modos fundamentales.

El modo **half-duplex** permite comunicación bidireccional, pero solo en una dirección a la vez. Un ejemplo clásico es el protocolo walkie-talkie: mientras una parte transmite, la otra debe escuchar. En redes, este modelo se implementa mediante tokens o señales de permiso: solo el poseedor del token puede enviar datos. Aunque limita el throughput máximo, simplifica la coordinación y evita conflictos en aplicaciones donde el orden estricto de intervención es crítico.

El modo **full-duplex** permite transmisión simultánea en ambas direcciones. La mayoría de las sesiones modernas operan así: una videollamada envía y recibe audio/video al mismo tiempo, una transferencia FTP puede enviar comandos mientras recibe datos. El control de diálogo en este contexto no gestiona quién habla, sino cómo se correlacionan los flujos entrantes y salientes: qué respuesta corresponde a qué solicitud, cómo se manejan mensajes asíncronos, y cómo se mantiene la coherencia cuando las direcciones operan independientemente.

Algunas sesiones implementan **full-duplex con control de turno**: aunque el transporte permite simultaneidad, la lógica de aplicación impone reglas de intervención. Un sistema de chat grupal puede permitir escritura libre, pero un protocolo de conferencia puede requerir solicitud de palabra antes de transmitir audio. Esta capa de control es definida por la aplicación, no por el protocolo de sesión subyacente.

## Mecanismos de cierre ordenado

El cierre de una sesión no es simplemente dejar de enviar datos: requiere coordinar que ambas partes han completado sus intercambios pendientes, liberado recursos asociados y registrado el estado final para posibles auditorías o reanudaciones.

El cierre ordenado típico sigue un handshake de confirmación bidireccional. Una parte envía una señal de intención de cierre (por ejemplo, `BYE` en SIP o `FIN` en una sesión application-level sobre TCP); la otra confirma recepción y libera sus recursos locales; finalmente, la iniciadora confirma la confirmación y completa el cierre. Este intercambio garantiza que ninguna parte asuma erróneamente que la sesión continúa activa.

Las sesiones que soportan **puntos de sincronización** (checkpoints) pueden cerrar de forma parcial: guardar el estado actual, liberar recursos de transporte, y permitir reanudación futura desde el último checkpoint. Esta capacidad es esencial en transferencias de archivos grandes o procesamiento distribuido de larga duración, donde fallos de red no deben implicar reinicio completo del trabajo.

El cierre forzado o abrupto ocurre cuando una parte detecta una condición irreversible: timeout de inactividad, fallo de autenticación, o error de protocolo. En estos casos, la sesión se termina sin handshake completo, y las partes pueden quedar en estado inconsistente. Los protocolos robustos incluyen mecanismos de recuperación: reintentos con identificación de sesión, reconciliación de estado mediante logs, o notificaciones asíncronas de terminación.

>  El cierre ordenado no garantiza que los datos hayan sido procesados por la aplicación receptora, solo que fueron entregados al socket. La confirmación de procesamiento (acknowledgment a nivel de aplicación) es responsabilidad del protocolo de sesión o de la lógica de negocio, no del transporte subyacente.

## Quédate con...

*   Una sesión es un contexto lógico de aplicación que gestiona el estado, la coordinación y la semántica del intercambio, independiente de la conexión de transporte subyacente.
*   El establecimiento de sesión requiere identificación mutua, negociación de parámetros y confirmación del acuerdo antes de iniciar el intercambio de datos útiles.
*   El control de diálogo define los turnos de comunicación: half-duplex (una dirección a la vez), full-duplex (simultáneo), o full-duplex con reglas de turno aplicativas.
*   El cierre ordenado coordina la liberación de recursos y la confirmación bidireccional de finalización, evitando estados inconsistentes entre participantes.
*   Las sesiones con checkpoints permiten reanudación tras fallos, transformando interrupciones de transporte en pausas recuperables a nivel de aplicación.
*   La gestión de sesiones es responsabilidad de la capa de aplicación o de protocolos específicos (SIP, RTSP, etc.), no de la pila de transporte genérica.



<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/sesion/sincronizacion" class="next">Siguiente</a>
</div>
