---
title: "Protocolos esenciales"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Protocolos esenciales](#protocolos-esenciales)
  - [HTTP/HTTPS: web, métodos (GET, POST), TLS](#httphttps-web-métodos-get-post-tls)
  - [DNS: resolución de nombres → IP, jerarquía de servidores](#dns-resolución-de-nombres--ip-jerarquía-de-servidores)
  - [SMTP/POP3/IMAP: correo electrónico](#smtppop3imap-correo-electrónico)
  - [FTP/SFTP/FTPS: transferencia de archivos](#ftpsftpftps-transferencia-de-archivos)
  - [SSH: acceso remoto seguro](#ssh-acceso-remoto-seguro)
  - [DHCP: perspectiva del cliente](#dhcp-perspectiva-del-cliente)
  - [Quédate con...](#quédate-con)

</div>

# Protocolos esenciales

La capa de aplicación no transporta bits genéricos: intercambia significado. Cada protocolo en este nivel define no solo cómo se formatean los mensajes, sino qué representan, en qué contexto se interpretan y qué acciones deben desencadenar en el receptor. HTTP transforma peticiones en páginas web, DNS convierte nombres en direcciones enrutable, SMTP entrega correo entre dominios administrativamente independientes. Estos protocolos operan sobre la infraestructura de transporte, pero su lógica es puramente semántica: establecen vocabularios compartidos que permiten a aplicaciones heterogéneas —un navegador en Android, un servidor en Linux, un cliente de correo en Windows— coordinar intercambios complejos sin compartir implementación interna ni estado.

## HTTP/HTTPS: web, métodos (GET, POST), TLS

HTTP (*Hypertext Transfer Protocol*) define el intercambio de recursos hipermedia en la web. Su modelo es simple pero poderoso: un cliente envía una petición con un método, una URI y cabeceras opcionales; el servidor responde con un código de estado, cabeceras de metadatos y un cuerpo opcional. Los métodos más comunes —GET para recuperar recursos, POST para enviar datos que provocan cambios en el servidor— establecen la semántica de la operación, permitiendo que intermediarios (proxies, cachés) optimicen el tráfico sin interpretar el contenido.

HTTPS no es un protocolo distinto, sino HTTP sobre TLS (*Transport Layer Security*). TLS cifra la conexión de transporte, autentica la identidad del servidor mediante certificados digitales y garantiza integridad de los datos intercambiados. El handshake de TLS negocia algoritmos de cifrado, verifica la cadena de confianza del certificado y establece claves de sesión efímeras. Para el usuario, la diferencia es invisible: la URL cambia de `http://` a `https://` y el navegador muestra un candado. Para la arquitectura, la diferencia es fundamental: sin TLS, cualquier intermediario en la ruta puede leer o modificar el tráfico; con TLS, la confidencialidad y autenticidad se preservan incluso sobre redes no confiables.

> HTTP es stateless por diseño: cada petición es independiente. Las aplicaciones web construyen sesiones coherentes mediante cookies, tokens o almacenamiento server-side, pero esta gestión es responsabilidad de la aplicación, no del protocolo. HTTPS protege el transporte, no la lógica de sesión: un token robado sigue siendo útil aunque viaje cifrado.

## DNS: resolución de nombres → IP, jerarquía de servidores

DNS (*Domain Name System*) traduce nombres legibles (`ejemplo.com`) a direcciones IP enrutable (`93.184.216.34`). Esta traducción no es una simple tabla local: es una base de datos distribuida y jerárquica que escala a miles de millones de nombres sin un punto central de fallo.

La jerarquía de DNS refleja la estructura de los nombres de dominio. La raíz (`.`) delega en servidores de dominio de nivel superior (TLD: `.com`, `.org`, `.es`), que a su vez delegan en servidores autoritativos para dominios específicos (`ejemplo.com`). Cuando un cliente resuelve `www.ejemplo.com`, su resolvedor consulta recursivamente: primero la raíz para encontrar los servidores `.com`, luego los servidores `.com` para encontrar los autoritativos de `ejemplo.com`, y finalmente esos servidores para obtener la dirección IP de `www`.

Esta arquitectura descentralizada permite administración distribuida: cada organización gestiona sus propios registros sin coordinar con una autoridad central. El caching en cada nivel —resolvedores locales, ISP, navegadores— reduce latencia y carga en servidores autoritativos. Los registros DNS no solo mapean nombres a IPs (tipo A/AAAA): también definen servidores de correo (MX), alias (CNAME), verificaciones de seguridad (TXT, SPF, DKIM) y descubrimiento de servicios (SRV).

> DNS tradicional opera sobre UDP puerto 53 sin cifrado, exponiendo consultas a espionaje o manipulación. Extensiones como DNS over TLS (DoT) o DNS over HTTPS (DoH) cifran el transporte entre cliente y resolvedor, aunque la resolución recursiva posterior puede seguir siendo visible para operadores de servidores autoritativos.

## SMTP/POP3/IMAP: correo electrónico

El correo electrónico opera mediante tres protocolos coordinados que separan el envío, el almacenamiento y la recuperación de mensajes.

SMTP (*Simple Mail Transfer Protocol*) gestiona el envío de correo entre servidores. Un cliente o servidor remitente establece una conexión TCP al puerto 25 (o 587 con autenticación) del servidor destinatario, negocia parámetros mediante comandos de texto (`HELO`, `MAIL FROM`, `RCPT TO`, `DATA`) y transmite el mensaje. SMTP es push: el remitente inicia la transferencia. No autentica al usuario final por defecto; la confianza se basa en la reputación de la IP emisora y mecanismos complementarios como SPF, DKIM y DMARC.

POP3 (*Post Office Protocol v3*) e IMAP (*Internet Message Access Protocol*) gestionan la recuperación de correo por parte del cliente final. POP3 es simple: descarga mensajes del servidor al dispositivo local y típicamente los elimina del servidor. IMAP es más sofisticado: mantiene los mensajes en el servidor, permitiendo acceso sincronizado desde múltiples dispositivos, carpetas remotas, búsqueda server-side y marcado de estado (leído, respondido) compartido. IMAP es la opción predominante en entornos modernos donde los usuarios acceden al correo desde teléfono, portátil y web simultáneamente.

> SMTP, POP3 e IMAP originales transmiten credenciales y contenido en texto plano. La extensión STARTTLS permite actualizar una conexión en claro a TLS, cifrando el tráfico posterior. La configuración recomendada exige STARTTLS obligatorio para proteger autenticación y privacidad.

## FTP/SFTP/FTPS: transferencia de archivos

La transferencia de archivos requiere protocolos que gestionen no solo el flujo de datos, sino también autenticación, integridad y control de sesión.

FTP (*File Transfer Protocol*) es uno de los protocolos más antiguos aún en uso. Opera con dos conexiones TCP: una de control (puerto 21) para comandos (`USER`, `PASS`, `LIST`, `RETR`, `STOR`) y una de datos (puerto 20 en modo activo, o puerto negociado en modo pasivo) para transferir contenido. Esta separación permite controlar la transferencia mientras fluyen los datos, pero introduce complejidad en firewalls y NAT, que deben inspeccionar el canal de control para abrir dinámicamente puertos de datos. FTP no cifra tráfico por defecto: credenciales y archivos viajan en claro.

FTPS (*FTP Secure*) añade cifrado TLS/SSL a FTP, ya sea cifrando solo el canal de control (modo explícito, `AUTH TLS`) o ambos canales (modo implícito, puerto 990). Mantiene la arquitectura de dos conexiones de FTP, heredando sus desafíos de traversía de firewall.

SFTP (*SSH File Transfer Protocol*) no es FTP sobre SSH: es un protocolo distinto diseñado específicamente para transferencia segura de archivos sobre una conexión SSH cifrada. Opera sobre un único canal TCP (puerto 22), multiplexando comandos y datos mediante mensajes binarios. Ofrece autenticación robusta (claves SSH, contraseñas), integridad garantizada y compatibilidad con características de SSH como reenvío de puertos. SFTP es la opción recomendada para transferencias automatizadas o que requieren seguridad.

> La confusión entre FTPS y SFTP es común. FTPS es FTP con TLS; SFTP es un protocolo independiente sobre SSH. La elección depende del entorno: SFTP es más simple de configurar en firewalls (un solo puerto), mientras que FTPS puede ser necesario para compatibilidad con clientes legacy.

## SSH: acceso remoto seguro

SSH (*Secure Shell*) proporciona acceso remoto cifrado y autenticado a sistemas, reemplazando protocolos inseguros como Telnet o rsh. Más que un simple shell remoto, SSH es un framework de túneles seguros que permite reenvío de puertos, transferencia de archivos (SFTP, SCP) y autenticación flexible.

El protocolo establece una conexión TCP al puerto 22, negocia algoritmos de cifrado y autenticación mediante un handshake que intercambia claves públicas, verifica la identidad del servidor (mediante huella de clave o certificado) y autentica al usuario (contraseña, clave pública, método GSSAPI). Una vez establecida la sesión, todo el tráfico —comandos, salida, archivos— viaja cifrado e íntegro.

La autenticación por clave pública es la práctica recomendada: el usuario genera un par de claves, registra la pública en `~/.ssh/authorized_keys` del servidor, y autentica sin transmitir secretos. SSH agent forwarding permite usar claves locales en sesiones remotas sin copiarlas, mientras que `ProxyJump` facilita el acceso a sistemas detrás de bastiones.

> SSH cifra el transporte, no el contenido de los comandos ejecutados. Un administrador del servidor remoto puede registrar toda la actividad. Para privacidad adicional contra el propio servidor, se requieren técnicas de computación confidencial o cifrado homomórfico, fuera del alcance de SSH.

## DHCP: perspectiva del cliente

DHCP (*Dynamic Host Configuration Protocol*) automatiza la configuración de red para clientes, eliminando la necesidad de asignar manualmente IP, máscara, gateway y DNS. Desde la perspectiva del cliente, el protocolo sigue un ciclo de cuatro mensajes conocido como DORA.

El cliente inicia en estado desconocido, sin dirección IP. Envía un mensaje `DHCPDISCOVER` en broadcast a la red local. Uno o más servidores DHCP responden con `DHCPOFFER`, proponiendo una dirección IP y parámetros de configuración. El cliente selecciona una oferta y solicita formalmente la dirección mediante `DHCPREQUEST`. El servidor confirma con `DHCPACK`, y el cliente configura su interfaz con los parámetros recibidos.

La concesión (*lease*) tiene duración limitada. Antes de expirar, el cliente intenta renovarla enviando `DHCPREQUEST` directamente al servidor que la otorgó. Si el servidor no responde o la red cambia, el cliente reinicia el proceso DORA. Este mecanismo permite reutilización dinámica de direcciones y adaptación a cambios de topología sin intervención manual.

> DHCP opera en capa de aplicación sobre UDP (puertos 67/68), no sobre TCP. El uso de broadcast en las fases iniciales requiere que el cliente aún no tenga IP configurada, y que los routers intermedios puedan reenviar broadcasts DHCP mediante agentes relay si el servidor está en otra subred.

## Quédate con...

*   HTTP define el intercambio de recursos web mediante métodos semánticos (GET, POST); HTTPS añade cifrado y autenticación mediante TLS para proteger confidencialidad e integridad.
*   DNS resuelve nombres a direcciones IP mediante una jerarquía distribuida de servidores delegados, con caching en cada nivel para escalabilidad y baja latencia.
*   El correo electrónico separa envío (SMTP), almacenamiento y recuperación (POP3/IMAP); IMAP es preferible para acceso multi-dispositivo sincronizado.
*   FTP usa dos conexiones (control + datos) y es inseguro por defecto; SFTP (sobre SSH) es la opción moderna para transferencias cifradas y autenticadas.
*   SSH proporciona acceso remoto cifrado, autenticación flexible por clave pública y capacidades de túnel; es el estándar para administración segura de sistemas.
*   DHCP automatiza la configuración de red mediante el ciclo DORA (Discover, Offer, Request, Acknowledge), con concesiones temporales que permiten reutilización dinámica de direcciones.



<div class="pagination">
  <a href="/markdown/sistemas/redes/aplicacion/funciones" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/aplicacion/puertos" class="next">Siguiente</a>
</div>
