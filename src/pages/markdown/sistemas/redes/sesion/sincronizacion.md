---
title: "Sincronización"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Sincronización](#sincronización)
  - [Puntos de sincronización en una sesión](#puntos-de-sincronización-en-una-sesión)
  - [Checkpoints para recuperación](#checkpoints-para-recuperación)
  - [Reanudación de sesiones tras fallos](#reanudación-de-sesiones-tras-fallos)
  - [Quédate con...](#quédate-con)

</div>

# Sincronización

Una sesión de red no es un flujo ciego de datos: es un diálogo estructurado donde los participantes deben coordinar su estado compartido a lo largo del tiempo. Cuando una transferencia se interrumpe, una videollamada sufre congestión o una transacción distribuida encuentra un fallo parcial, la capacidad de recuperar el hilo de la interacción sin reiniciar desde cero marca la diferencia entre un sistema robusto y uno frágil. La sincronización en la capa de sesión introduce puntos de coordinación explícitos que permiten a las aplicaciones detectar desalineaciones, restaurar estados consistentes y reanudar intercambios desde el último punto válido conocido por ambas partes.

## Puntos de sincronización en una sesión

Un punto de sincronización es una marca acordada dentro del flujo de datos de una sesión que indica un estado consistente y reconocido por ambos participantes. Estos puntos no emergen automáticamente: deben ser insertados explícitamente por el protocolo de sesión o por la lógica de aplicación, y confirmados mutuamente antes de continuar.

La función principal de estos puntos es dividir una sesión larga en segmentos lógicos independientes. Si la sesión se interrumpe después del punto de sincronización N, ambas partes saben que todo hasta N está completo y válido, y solo el trabajo entre N y el punto de fallo necesita recuperación. Esto transforma una operación monolítica en una secuencia de unidades atómicas con límites claros.

En protocolos como ISO 8327 (el estándar OSI para capa de sesión), los puntos de sincronización se clasifican en dos categorías. Los puntos **mayores** marcan límites significativos que, si se confirma su recepción, permiten liberar buffers y considerar completada una unidad de trabajo. Los puntos **menores** son marcas más frecuentes dentro de una unidad mayor, útiles para recuperación fina pero que no liberan estado acumulado. Esta jerarquía permite equilibrar la sobrecarga de confirmación con la granularidad de recuperación.

> La sincronización de sesión es distinta de la confirmación de transporte. TCP confirma entrega de segmentos; la capa de sesión confirma que una unidad lógica de trabajo (un archivo, una transacción, un lote de datos) fue procesada y puede considerarse completada desde la perspectiva de la aplicación.

## Checkpoints para recuperación

Un checkpoint es un punto de sincronización donde el estado actual de la sesión se persiste explícitamente, permitiendo recuperación tras fallos catastróficos que podrían perder estado en memoria. A diferencia de un punto de sincronización simple —que solo marca posición en el flujo—, un checkpoint implica guardar información de estado suficiente para reconstruir el contexto de la sesión.

La creación de un checkpoint típicamente sigue tres pasos. Primero, ambas partes acuerdan pausar el intercambio de datos nuevos. Segundo, cada lado persiste su estado local: contadores de secuencia, buffers pendientes, parámetros de negociación, credenciales de autenticación. Tercero, intercambian confirmación de que el checkpoint fue guardado; solo entonces se reanuda el flujo normal.

La frecuencia de checkpoints es un compromiso entre sobrecarga y exposición al riesgo. Checkpoints muy frecuentes consumen ancho de banda y latencia en confirmaciones, reduciendo throughput efectivo. Checkpoints muy espaciados exponen a más pérdida de trabajo tras un fallo: si el último checkpoint fue hace diez minutos y la sesión cae, esos diez minutos de progreso se pierden. La política óptima depende del costo de retransmitir datos versus el costo de crear checkpoints.

Algunas implementaciones usan checkpoints **silenciosos**: el estado se guarda localmente sin coordinación explícita, y la recuperación se negocia tras el fallo. Esto reduce sobrecarga en operación normal pero complica la reconciliación post-fallo, ya que las partes pueden tener checkpoints en posiciones distintas que deben alinearse antes de reanudar.

> Los checkpoints no son copias de seguridad. Su propósito es recuperación rápida de sesiones activas, no preservación a largo plazo. Una sesión puede tener checkpoints frecuentes sin que eso sustituya backups del sistema o persistencia permanente de datos de aplicación.

## Reanudación de sesiones tras fallos

La reanudación es el proceso de restaurar una sesión interrumpida desde el último punto de sincronización confirmado, minimizando la pérdida de trabajo y evitando inconsistencias. Este escenario ocurre cuando la conexión de transporte se rompe (timeout de red, fallo de router, reinicio de servidor) pero la sesión lógica puede sobrevivir más allá de la conexión física subyacente.

El protocolo de reanudación típico sigue una secuencia coordinada. Tras detectar el fallo, las partes intentan restablecer la conexión de transporte. Una vez recuperada la conectividad, intercambian identificadores de sesión para verificar que ambos reconocen la misma sesión previa. Luego negocian desde qué punto de sincronización reanudar: el emisor propone el último checkpoint confirmado, el receptor valida contra su propio registro, y si hay discrepancia se reconcilian al punto más antiguo común.

La reanudación introduce riesgos de inconsistencia que deben gestionarse explícitamente. Si el fallo ocurrió durante una operación de escritura, el receptor puede haber procesado parcialmente datos que el emisor asume no entregados. Los protocolos robustos incluyen mecanismos de detección de duplicados y reconciliación de estado: el receptor informa qué unidades de trabajo fueron completadas, el emisor ajusta su punto de reenvío en consecuencia.

Algunas sesiones soportan **reanudación asíncrona**: la sesión se suspende explícitamente, el estado se persiste, y puede reanudarse minutos u horas después, posiblemente desde un endpoint distinto. Esto habilita escenarios como transferencias de archivos que sobreviven a cambios de red (Wi-Fi a celular) o migración de sesiones entre dispositivos. La implementación requiere que el estado de sesión sea portable y que los identificadores sean válidos más allá de la conexión original.

> HTTP es stateless por diseño, pero las aplicaciones web construyen sesiones reanudables mediante tokens, cookies de sesión y almacenamiento server-side del estado. Una sesión de usuario en una aplicación web puede sobrevivir a múltiples conexiones TCP distintas, siempre que el token de sesión sea válido y el estado persista en el servidor.

## Quédate con...

*   Los puntos de sincronización dividen una sesión en segmentos lógicos independientes, permitiendo recuperación parcial sin reiniciar desde el inicio.
*   Los checkpoints persisten explícitamente el estado de la sesión, habilitando recuperación tras fallos catastróficos que podrían perder estado en memoria.
*   La frecuencia de checkpoints es un compromiso: mayor frecuencia reduce pérdida de trabajo pero aumenta sobrecarga de confirmación y latencia.
*   La reanudación de sesiones requiere coordinación post-fallo para alinear puntos de sincronización y evitar inconsistencias por procesamiento parcial.
*   La sincronización de capa de sesión opera a nivel lógico de aplicación, distinto de las confirmaciones de entrega de la capa de transporte.
*   Las sesiones reanudables asíncronamente permiten migración entre conexiones o dispositivos, siempre que el estado sea portable y los identificadores permanezcan válidos.



<div class="pagination">
  <a href="/markdown/sistemas/redes/sesion/gestion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/sesion/ejemplos" class="next">Siguiente</a>
</div>
