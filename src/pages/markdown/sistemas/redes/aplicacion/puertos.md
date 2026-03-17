---
title: "Servicios y puertos asociados"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Servicios y puertos asociados](#servicios-y-puertos-asociados)
  - [HTTP (80) y HTTPS (443)](#http-80-y-https-443)
  - [SSH (22)](#ssh-22)
  - [DNS (53)](#dns-53)
  - [SMTP (25), Submission (587) y otros puertos de correo](#smtp-25-submission-587-y-otros-puertos-de-correo)
  - [Puertos adicionales de uso común](#puertos-adicionales-de-uso-común)
  - [Quédate con...](#quédate-con)

</div>

# Servicios y puertos asociados

Los protocolos de aplicación no operan en el vacío: requieren puntos de entrada estandarizados que permitan a los sistemas identificar qué servicio debe atender una conexión entrante. Los puertos bien conocidos (0–1023) cumplen esta función actuando como direcciones lógicas dentro de un host: cuando un paquete TCP o UDP llega al puerto 80, el sistema operativo sabe que debe entregarlo al servidor web; si llega al puerto 22, lo dirige al daemon SSH. Esta convención, mantenida por la IANA (*Internet Assigned Numbers Authority*), transforma la pila de red genérica en una interfaz de servicios específica, permitiendo que múltiples aplicaciones coexistan en el mismo dispositivo sin conflictos de demultiplexación.

## HTTP (80) y HTTPS (443)

El puerto 80 está asignado a HTTP (*Hypertext Transfer Protocol*), el protocolo fundamental de la web. Cuando un navegador solicita `http://ejemplo.com`, establece una conexión TCP al puerto 80 del servidor y envía una petición textual siguiendo la sintaxis HTTP: método (`GET`), recurso (`/index.html`), versión del protocolo y cabeceras de metadatos. El servidor responde con un código de estado, cabeceras y el contenido solicitado. Esta comunicación viaja en texto plano: cualquier intermediario con acceso al tráfico puede leer o modificar el intercambio.

El puerto 443 corresponde a HTTPS, que no es un protocolo distinto sino HTTP sobre TLS (*Transport Layer Security*). Antes de intercambiar datos HTTP, cliente y servidor ejecutan un handshake TLS que negocia algoritmos de cifrado, autentica la identidad del servidor mediante certificados digitales y establece claves de sesión efímeras. Todo el tráfico posterior —peticiones, respuestas, cookies, credenciales— viaja cifrado e íntegro. Para el usuario, la diferencia es invisible salvo por el candado en el navegador; para la arquitectura, es fundamental: sin TLS, la web sería insegura por diseño.

> Los navegadores modernos redirigen automáticamente HTTP a HTTPS cuando el servidor lo soporta, y marcan como "no seguros" los sitios que solo ofrecen puerto 80. La práctica recomendada es configurar servidores para escuchar en ambos puertos y forzar redirección de 80 a 443.

## SSH (22)

El puerto 22 está reservado para SSH (*Secure Shell*), el estándar para acceso remoto seguro a sistemas. SSH reemplazó protocolos inseguros como Telnet o rsh al cifrar toda la sesión: comandos, salida, transferencia de archivos y reenvío de puertos viajan protegidos contra espionaje o manipulación. El protocolo autentica al servidor mediante huella de clave pública (evitando ataques man-in-the-middle) y al usuario mediante contraseña o, preferiblemente, par de claves asimétricas.

Una conexión SSH típica inicia con `ssh usuario@servidor`, que establece TCP al puerto 22, negocia cifrado, verifica la identidad del servidor y autentica al usuario. Una vez establecida la sesión, el usuario obtiene un shell remoto o ejecuta comandos específicos. SSH también permite túneles seguros: reenviar puertos locales a remotos o viceversa, creando canales cifrados para protocolos que no soportan cifrado nativo.

> Exponer SSH directamente a internet requiere hardening: deshabilitar login por contraseña (`PasswordAuthentication no`), usar solo claves públicas, cambiar el puerto predeterminado para reducir escaneos automatizados, y emplear herramientas como `fail2ban` para bloquear intentos de fuerza bruta.

## DNS (53)

El puerto 53 sirve tanto para DNS sobre UDP como sobre TCP. DNS (*Domain Name System*) resuelve nombres legibles (`ejemplo.com`) a direcciones IP enrutable (`93.184.216.34`). La mayoría de consultas usan UDP por su baja sobrecarga: una petición pequeña, una respuesta pequeña, sin establecimiento de conexión. Cuando la respuesta excede el MTU o se requiere fiabilidad garantizada (transferencias de zona entre servidores), DNS cambia a TCP en el mismo puerto 53.

Un resolvedor típico envía una consulta UDP al puerto 53 de un servidor DNS configurado (local, del ISP o público como 8.8.8.8). La consulta incluye el nombre a resolver y el tipo de registro (A, AAAA, MX, etc.). La respuesta contiene los registros solicitados o un error. El caching en cada nivel —resolvedor local, navegador, sistema operativo— reduce latencia y carga en servidores autoritativos.

> DNS tradicional opera sin cifrado, exponiendo consultas a espionaje o manipulación. Extensiones como DNS over TLS (DoT, puerto 853) o DNS over HTTPS (DoH, puerto 443) cifran el transporte entre cliente y resolvedor, aunque la resolución recursiva posterior puede seguir siendo visible para operadores de servidores autoritativos.

## SMTP (25), Submission (587) y otros puertos de correo

El correo electrónico emplea múltiples puertos según la fase del flujo. El puerto 25 está asignado a SMTP (*Simple Mail Transfer Protocol*) para transferencia de correo entre servidores. Un servidor remitente conecta al puerto 25 del servidor destinatario, negocia parámetros mediante comandos de texto (`HELO`, `MAIL FROM`, `RCPT TO`, `DATA`) y transmite el mensaje. Este puerto está típicamente bloqueado para clientes residenciales por ISPs para prevenir spam.

El puerto 587, denominado *submission*, es el punto de entrada para clientes que envían correo a través de un servidor de salida. Requiere autenticación (usuario/contraseña o credenciales OAuth) y típicamente exige STARTTLS para cifrar la sesión antes de transmitir credenciales o contenido. Esta separación (25 para servidor-a-servidor, 587 para cliente-a-servidor) permite políticas de seguridad diferenciadas.

Otros puertos relevantes en el ecosistema de correo incluyen 110/995 para POP3 (recuperación de correo, con/sin TLS) y 143/993 para IMAP (acceso sincronizado a buzones, con/sin TLS). IMAP sobre 993 es la opción predominante en entornos modernos donde los usuarios acceden al correo desde múltiples dispositivos.

## Puertos adicionales de uso común

Más allá de los servicios fundamentales, otros puertos bien conocidos habilitan funcionalidades específicas:

| Puerto | Protocolo | Uso típico |
|--------|-----------|------------|
| 21 | FTP | Transferencia de archivos (canal de control, inseguro por defecto) |
| 23 | Telnet | Acceso remoto en texto plano (obsoleto, reemplazado por SSH) |
| 67/68 | DHCP | Asignación dinámica de configuración de red (UDP) |
| 123 | NTP | Sincronización de tiempo entre sistemas (UDP) |
| 3306 | MySQL | Base de datos MySQL/MariaDB |
| 5432 | PostgreSQL | Base de datos PostgreSQL |
| 6379 | Redis | Almacén de clave-valor en memoria |
| 8080 | HTTP alternativo | Servidores web en desarrollo o proxies |

> La exposición de puertos de bases de datos (3306, 5432, 6379) directamente a internet es una práctica de riesgo. Estos servicios deben accederse mediante túneles SSH, VPNs o proxies con autenticación, nunca mediante exposición directa sin capas adicionales de seguridad.

## Quédate con...

*   Los puertos bien conocidos (0–1023) identifican servicios estandarizados: HTTP (80), HTTPS (443), SSH (22), DNS (53), SMTP (25), permitiendo demultiplexación precisa del tráfico entrante.
*   HTTP (80) transmite en texto plano; HTTPS (443) cifra la comunicación mediante TLS, siendo la opción obligatoria para cualquier servicio web que maneje datos sensibles.
*   SSH (22) proporciona acceso remoto cifrado y autenticado; su exposición a internet requiere hardening: claves públicas, deshabilitar contraseñas, y protección contra fuerza bruta.
*   DNS (53) usa UDP para consultas típicas y TCP para respuestas grandes o transferencias de zona; extensiones como DoT/DoH cifran el transporte para proteger privacidad.
*   El correo electrónico emplea puertos diferenciados: 25 para servidor-a-servidor (SMTP), 587 para cliente-a-servidor con autenticación, 993 para IMAP cifrado.
*   Exponer servicios de base de datos o administración directamente a internet sin capas de protección intermedias constituye un riesgo de seguridad crítico; usar túneles, VPNs o proxies con autenticación.

<div class="pagination">
  <a href="/markdown/sistemas/redes/aplicacion/protocolos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/aplicacion/seguridad" class="next">Siguiente</a>
</div>
