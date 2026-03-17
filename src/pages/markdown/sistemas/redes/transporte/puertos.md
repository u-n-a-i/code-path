---
title: "Puertos y sockets"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Puertos y sockets](#puertos-y-sockets)
  - [Rango de puertos](#rango-de-puertos)
  - [Socket = IP + puerto + protocolo](#socket--ip--puerto--protocolo)
  - [Quédate con...](#quédate-con)

</div>

# Puertos y sockets

La comunicación entre aplicaciones distribuidas requiere un mecanismo para distinguir qué proceso específico debe recibir los datos que llegan a una máquina. Una dirección IP identifica un host en la red, pero no indica si un paquete entrante pertenece a una sesión de navegador, una transferencia de archivos o una consulta de base de datos. Los puertos resuelven esta ambigüedad actuando como identificadores numéricos que demultiplexan el tráfico hacia el proceso correcto, mientras que los sockets combinan dirección, puerto y protocolo para formar identificadores únicos de cada extremo de comunicación.

## Rango de puertos

Los puertos son números de 16 bits, lo que permite un espacio teórico de 65,536 valores (0–65535). Este espacio se organiza en tres rangos con propósitos y convenciones distintas, definidos por la IANA (*Internet Assigned Numbers Authority*) para garantizar interoperabilidad entre sistemas.

Los **puertos bien conocidos** (0–1023) están asignados a servicios estándar de infraestructura. El puerto 80 corresponde a HTTP, 443 a HTTPS, 22 a SSH, 53 a DNS, 25 a SMTP. Estos puertos requieren privilegios de administrador para vincularse en sistemas Unix-like, una medida de seguridad que previene que aplicaciones de usuario suplanten servicios críticos. Un servidor web típico escucha en el puerto 443; cualquier cliente que desee establecer una conexión HTTPS debe dirigir sus paquetes a ese puerto específico en la dirección IP del servidor.

Los **puertos registrados** (1024–49151) pueden ser solicitados por desarrolladores para aplicaciones específicas, aunque en la práctica muchas aplicaciones de usuario los utilizan dinámicamente sin registro formal. Bases de datos como PostgreSQL (5432) o MySQL (3306) operan en este rango, al igual que servicios de aplicación como Tomcat (8080) o APIs personalizadas. La convención ayuda a la documentación y configuración, pero no implica reserva exclusiva: cualquier aplicación puede vincularse a un puerto registrado si está disponible.

Los **puertos dinámicos o efímeros** (49152–65535) son asignados temporalmente por el sistema operativo al iniciar una conexión saliente. Cuando un navegador establece una sesión hacia un servidor web, el sistema asigna automáticamente un puerto efímero como origen; esta combinación `(IP_cliente, puerto_efímero, IP_servidor, 443)` identifica de forma única esa sesión específica. El uso de puertos efímeros permite que un mismo cliente mantenga múltiples conexiones simultáneas hacia el mismo servidor sin ambigüedad en la demultiplexación de respuestas.

> El rango de puertos efímeros varía históricamente entre sistemas operativos. Linux utiliza típicamente 32768–60999 por defecto, mientras que Windows y macOS adoptan el rango IANA recomendado (49152–65535). Esta diferencia rara vez afecta la interoperabilidad, pero puede influir en configuraciones de firewall o auditoría de red.

## Socket = IP + puerto + protocolo

Un socket es la tupla `(dirección IP, puerto, protocolo)` que identifica de forma inequívoca un extremo de comunicación en una red IP. Esta combinación permite distinguir entre miles de sesiones concurrentes que comparten los mismos recursos físicos: dos conexiones hacia el mismo servidor web se diferencian porque cada cliente utiliza un puerto efímero distinto, generando sockets únicos aunque compartan IP de destino y puerto de servicio.

La naturaleza quíntupla de una conexión TCP —`(IP_origen, puerto_origen, IP_destino, puerto_destino, protocolo)`— ilustra cómo el sistema operativo demultiplexa el tráfico entrante. Cuando llega un segmento TCP, el kernel examina estos cinco valores para identificar el socket de destino y entregar los datos al proceso correspondiente. Esta lógica permite que un único servidor HTTPS (escuchando en `0.0.0.0:443`) atienda simultáneamente a miles de clientes: cada flujo se aísla por la tupla completa, no solo por el puerto de servicio.

Los sockets no son meras abstracciones de software: representan recursos del kernel con estado, buffers de recepción y transmisión, y contadores de referencia. Cuando una aplicación crea un socket mediante llamadas al sistema como `socket()`, `bind()`, `listen()` o `connect()`, el sistema operativo asigna estructuras de datos internas que gestionan el ciclo de vida de la conexión. El cierre explícito con `close()` libera estos recursos; su omisión provoca fugas que degradan el rendimiento del sistema bajo carga sostenida.

>  Los sockets de tipo `SOCK_STREAM` (TCP) establecen conexiones orientadas a flujo con garantías de entrega, mientras que `SOCK_DGRAM` (UDP) operan sin conexión, entregando datagramas individuales sin garantías de orden ni retransmisión. La elección del tipo de socket determina el comportamiento de la comunicación a nivel de transporte.

## Quédate con...

*   Los puertos (0–65535) demultiplexan el tráfico de red hacia procesos específicos; su organización en rangos (bien conocidos, registrados, efímeros) establece convenciones para servicios y clientes.
*   Los puertos bien conocidos (0–1023) requieren privilegios de administrador y alojan servicios estándar como HTTP (80), HTTPS (443) o SSH (22).
*   Los puertos efímeros (49152–65535) son asignados dinámicamente por el sistema operativo para conexiones salientes, permitiendo múltiples sesiones simultáneas desde un mismo cliente.
*   Un socket se define como la tupla `(IP, puerto, protocolo)`; una conexión completa requiere la quíntupla que incluye ambos extremos, habilitando la demultiplexación precisa del tráfico.
*   Los sockets son recursos del kernel con estado y ciclo de vida gestionado; su creación y cierre explícito es esencial para evitar fugas de recursos en aplicaciones de larga ejecución.



<div class="pagination">
  <a href="/markdown/sistemas/redes/transporte/funciones" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/transporte/tcp" class="next">Siguiente</a>
</div>
