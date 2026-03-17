---
title: "APIs y protocolos modernos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [APIs y protocolos modernos](#apis-y-protocolos-modernos)
  - [REST](#rest)
  - [gRPC](#grpc)
  - [WebSockets](#websockets)
  - [JSON y XML como formatos de intercambio](#json-y-xml-como-formatos-de-intercambio)
  - [Quédate con...](#quédate-con)

</div>

# APIs y protocolos modernos

La comunicación entre aplicaciones distribuidas ha evolucionado más allá de los protocolos tradicionales de la web. Mientras HTTP definió el intercambio de documentos hipertexto, las arquitecturas modernas requieren intercambios estructurados de datos, comunicaciones bidireccionales en tiempo real y contratos de interfaz que garanticen compatibilidad entre servicios desarrollados independientemente. Las APIs (*Application Programming Interfaces*) y los protocolos que las sustentan establecen estos acuerdos: qué operaciones están disponibles, qué formato tienen los datos intercambiados y cómo se gestionan los errores. Esta capa de abstracción permite que un servicio escrito en Go se comunique con un cliente en JavaScript, que un microservicio en Kubernetes invoque a otro en una región distinta, o que una aplicación móvil sincronice datos con un servidor sin conocer su implementación interna.

## REST

REST (*Representational State Transfer*) es un estilo arquitectónico que define restricciones para diseñar servicios web escalables y mantenibles. No es un protocolo en sí, sino un conjunto de principios que aprovechan las características inherentes de HTTP: métodos semánticos (GET, POST, PUT, DELETE), statelessness (cada petición contiene toda la información necesaria), y recursos identificables mediante URIs.

Un servicio RESTful expone recursos como entidades lógicas (`/usuarios`, `/pedidos`, `/productos`) sobre las cuales se realizan operaciones mediante verbos HTTP. GET recupera representaciones del recurso, POST crea nuevos elementos, PUT actualiza reemplazando el estado completo, PATCH modifica parcialmente, y DELETE elimina. Las respuestas incluyen códigos de estado estandarizados: 200 para éxito, 201 para creación, 400 para errores del cliente, 404 para recursos no encontrados, 500 para errores del servidor.

La statelessness es fundamental: el servidor no mantiene estado de sesión entre peticiones. Cada solicitud debe incluir autenticación (típicamente mediante tokens Bearer en la cabecera `Authorization`), contexto de la operación y cualquier dato necesario para procesarla. Esta restricción simplifica la escalabilidad horizontal —cualquier instancia puede atender cualquier petición— pero traslada la gestión de estado al cliente o a almacenes externos como bases de datos o cachés distribuidas.

REST domina las APIs web públicas e internas por su simplicidad, compatibilidad con infraestructura existente (proxies, cachés, balanceadores) y legibilidad humana. Sin embargo, presenta limitaciones: el modelo de petición-respuesta es síncrono por naturaleza, no soporta streaming nativo de servidor a cliente, y la sobrecarga de HTTP (cabeceras verbosas, texto plano) puede ser significativa para comunicaciones de alta frecuencia entre servicios.

> REST no especifica formato de payload. Aunque JSON es predominante por su ligereza y mapeo directo a estructuras de lenguajes modernos, APIs REST pueden usar XML, Protocol Buffers u otros formatos según los requisitos de interoperabilidad y rendimiento.

## gRPC

gRPC (*gRPC Remote Procedure Call*) es un framework de llamada a procedimiento remoto desarrollado por Google, diseñado para comunicaciones de alta eficiencia entre servicios. A diferencia de REST, que modela interacciones como operaciones sobre recursos, gRPC expone servicios como interfaces con métodos que pueden invocarse como si fueran funciones locales, ocultando la complejidad de la comunicación de red subyacente.

La arquitectura de gRPC se fundamenta en tres pilares. Primero, **Protocol Buffers** (*Protobuf*) como lenguaje de definición de interfaces (IDL): los servicios y mensajes se definen en archivos `.proto` que especifican tipos de datos, métodos y flujos de forma independiente del lenguaje de implementación. Segundo, **HTTP/2** como transporte: multiplexación de múltiples llamadas sobre una única conexión, compresión de cabeceras, y soporte nativo para streaming bidireccional. Tercero, **código generado**: herramientas compilan definiciones `.proto` a código nativo en múltiples lenguajes (Go, Java, Python, C#, etc.), garantizando compatibilidad de tipos y reduciendo errores de serialización.

gRPC soporta cuatro patrones de comunicación. **Unary RPC**: una petición, una respuesta (similar a REST pero binario). **Server streaming**: el cliente envía una petición, el servidor responde con un flujo de mensajes. **Client streaming**: el cliente envía un flujo, el servidor responde con una única respuesta. **Bidirectional streaming**: ambos extremos envían flujos independientes simultáneamente, habilitando escenarios como chats en tiempo real o sincronización de estado continuo.

La eficiencia de gRPC lo hace preferible para comunicaciones entre microservicios en entornos controlados: payloads binarios compactos (30–50% menores que JSON equivalente), menor latencia por conexión persistente HTTP/2, y validación de tipos en tiempo de compilación. Sin embargo, su adopción en APIs públicas es limitada: requiere herramientas especializadas para depuración (no es legible en navegador sin proxies), el ecosistema de herramientas es menos maduro que REST, y la compatibilidad con infraestructura web tradicional (CDNs, cachés HTTP) es menor.

> gRPC y REST no son mutuamente excluyentes. Arquitecturas modernas suelen exponer REST/JSON para clientes externos (navegadores, móviles) mientras usan gRPC internamente entre microservicios, aprovechando las ventajas de cada uno según el contexto de comunicación.

## WebSockets

WebSockets resuelve una limitación fundamental de HTTP: la incapacidad de comunicación bidireccional persistente. En el modelo HTTP tradicional, el cliente siempre inicia la comunicación; el servidor no puede推送 datos sin una petición previa. Esta asimetría obliga a técnicas como *polling* (consultas periódicas) o *long-polling* (peticiones que esperan hasta que hay datos), que introducen latencia innecesaria y sobrecarga de conexiones.

WebSocket establece una conexión TCP persistente que permanece abierta después del handshake inicial (que usa HTTP para compatibilidad con infraestructura existente). Una vez establecida, ambos extremos pueden enviar mensajes de forma asíncrona en cualquier dirección, sin la sobrecarga de cabeceras HTTP repetidas. El protocolo maneja framing, control de congestión y keepalive, liberando a la aplicación de gestionar estos detalles.

Los casos de uso típicos incluyen aplicaciones colaborativas en tiempo real (documentos compartidos, pizarras virtuales), notificaciones push, juegos multijugador en navegador, dashboards de monitoreo con actualizaciones continuas, y sistemas de chat. La API en JavaScript es simple: `new WebSocket('wss://servidor')` establece la conexión, eventos `onmessage`, `onopen`, `onclose` gestionan el ciclo de vida, y `send()` transmite datos.

La seguridad requiere WebSocket sobre TLS (`wss://`), análogo a HTTPS. Sin cifrado, los datos viajan en texto plano y son vulnerables a interceptación. Además, los firewalls y proxies deben configurarse para permitir el upgrade de protocolo HTTP a WebSocket, lo que puede complicar despliegues en entornos corporativos restrictivos.

> WebSockets no reemplazan HTTP: son complementarios. Una aplicación típica usa HTTP para operaciones CRUD (crear, leer, actualizar recursos) y WebSockets para notificaciones en tiempo real o sincronización de estado. La elección depende del patrón de comunicación requerido, no de una jerarquía de superioridad.

## JSON y XML como formatos de intercambio

Los datos estructurados requieren formatos que preserven jerarquías, tipos y semántica al cruzar límites de proceso, lenguaje o red. JSON y XML dominan este espacio, cada uno con filosofías de diseño distintas que reflejan compromisos entre legibilidad, expressividad y eficiencia.

JSON (*JavaScript Object Notation*) representa datos como objetos (pares clave-valor) y arreglos ordenados, usando una sintaxis minimalista derivada de JavaScript. Su estructura es inherentemente tipada de forma dinámica: strings entre comillas, números sin comillas, booleanos (`true`/`false`), `null`, y anidamiento arbitrario. Esta simplicidad permite parsing eficiente en prácticamente todos los lenguajes modernos y mapeo directo a estructuras nativas (diccionarios, listas).

La adopción masiva de JSON en APIs REST refleja sus ventajas prácticas: verbosidad reducida respecto a XML (menos caracteres de marcado), parsing más rápido, y alineación natural con JavaScript/TypeScript en el frontend. Sin embargo, JSON carece de esquema nativo: la validación de estructura requiere convenciones externas como JSON Schema, y no soporta comentarios ni metadatos ricos sin extensiones ad-hoc.

XML (*eXtensible Markup Language*) define datos mediante etiquetas anidadas con atributos, soportando esquemas formales (XSD) para validación estricta, espacios de nombres para evitar colisiones de nombres, y transformaciones (XSLT) para conversión entre formatos. Esta expressividad lo hace adecuado para documentos complejos con requisitos de interoperabilidad a largo plazo: SOAP, Office OpenXML, configuraciones empresariales, o intercambio de datos regulatorios.

La verbosidad de XML es su principal desventaja: etiquetas de apertura y cierre, atributos redundantes y espacios de nombres inflan el payload significativamente respecto a JSON equivalente. El parsing es más complejo y consume más memoria. Por esta razón, XML ha perdido predominio en APIs web modernas, aunque permanece en ecosistemas enterprise donde la validación formal y la estabilidad de esquemas son prioritarias.

> Formatos emergentes como Protocol Buffers, MessagePack o Avro ofrecen alternativas binarias más eficientes que JSON/XML para comunicaciones internas entre servicios. Sin embargo, JSON mantiene su posición dominante en APIs públicas por su legibilidad humana y compatibilidad universal con herramientas de desarrollo y depuración.

## Quédate con...

*   REST es un estilo arquitectónico basado en HTTP que modela servicios como recursos sobre los cuales se operan mediante verbos semánticos (GET, POST, PUT, DELETE), priorizando simplicidad y escalabilidad.
*   gRPC usa Protocol Buffers y HTTP/2 para llamadas RPC eficientes con soporte nativo de streaming, ideal para comunicaciones entre microservicios en entornos controlados.
*   WebSockets habilitan comunicación bidireccional persistente en tiempo real, resolviendo la limitación de HTTP donde solo el cliente puede iniciar comunicación.
*   JSON prioriza simplicidad y eficiencia para intercambio de datos estructurados; XML ofrece expressividad y validación formal para documentos complejos con requisitos de largo plazo.
*   La elección de protocolo y formato depende del contexto: REST/JSON para APIs públicas, gRPC para servicios internos, WebSockets para tiempo real, XML para ecosistemas enterprise con validación estricta.
*   Ninguna opción es universalmente superior: arquitecturas modernas combinan múltiples protocolos según los requisitos específicos de cada canal de comunicación.

<div class="pagination">
  <a href="/markdown/sistemas/redes/aplicacion/seguridad" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/aplicacion/herramientas" class="next">Siguiente</a>
</div>
