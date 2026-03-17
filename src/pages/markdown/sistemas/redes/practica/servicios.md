---
title: "Pruebas de servicios"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Pruebas de servicios](#pruebas-de-servicios)
  - [Servidor web local con Python](#servidor-web-local-con-python)
  - [Cliente/servidor con `nc` (netcat)](#clienteservidor-con-nc-netcat)
  - [Conexión SSH a otra máquina](#conexión-ssh-a-otra-máquina)
  - [Quédate con...](#quédate-con)

</div>

# Pruebas de servicios

La teoría de redes cobra sentido cuando los protocolos se materializan en servicios observables. Un servidor web que responde, una conexión TCP que se establece, un túnel SSH que transporta tráfico: estos son los fenómenos tangibles que validan configuraciones, diagnostican fallos y demuestran comprensión operativa. Las herramientas de prueba no son accesorios opcionales: son el laboratorio donde se experimenta con la pila de red, donde se verifican hipótesis sobre conectividad y donde se desarrolla la intuición necesaria para resolver problemas en entornos productivos.

## Servidor web local con Python

Python incluye un módulo HTTP mínimo que transforma cualquier directorio en un servidor web funcional con una sola instrucción. Esta capacidad, aparentemente simple, proporciona un entorno de pruebas inmediato para validar conectividad, examinar cabeceras HTTP, verificar permisos de archivo o demostrar conceptos de cliente-servidor sin instalar software adicional.

La invocación `python3 -m http.server 8000` inicia un servidor HTTP/1.0 que escucha en el puerto 8000 de todas las interfaces disponibles, sirviendo el contenido del directorio actual con listados automáticos de archivos. El proceso ocupa el terminal mientras se ejecuta, registrando cada petición entrante con timestamp, método HTTP, ruta solicitada y código de respuesta. Esta visibilidad en tiempo real permite correlacionar acciones del cliente (navegador, curl) con el comportamiento del servidor.

```bash
$ python3 -m http.server 8000
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
192.168.1.50 - - [15/Ene/2025 10:23:45] "GET /index.html HTTP/1.1" 200 -
192.168.1.50 - - [15/Ene/2025 10:23:46] "GET /style.css HTTP/1.1" 200 -
```

El servidor es adecuado para pruebas locales y desarrollo, pero no para producción: carece de cifrado TLS, autenticación robusta, manejo de concurrencia avanzado y protección contra ataques comunes. Su valor reside en la inmediatez: crear un archivo `hola.txt` en el directorio, iniciar el servidor, y acceder desde `http://localhost:8000/hola.txt` valida toda la pila HTTP local sin configuración compleja.

Para escuchar en una interfaz específica, usar `--bind`: `python3 -m http.server 8000 --bind 192.168.1.10`. Esto restringe el acceso a esa dirección, útil en máquinas con múltiples interfaces donde se desea aislar el servicio de prueba de redes no confiables.

> El servidor de Python usa HTTP/1.0 sin keep-alive persistente por defecto. Cada petición abre y cierra una conexión TCP separada, lo que genera overhead visible en herramientas como `ss` o `tcpdump`. Para HTTP/1.1 con conexiones persistentes, usar `python3 -m http.server 8000 --protocol HTTP/1.1`.

## Cliente/servidor con `nc` (netcat)

Netcat es una herramienta de propósito general que establece conexiones TCP o UDP arbitrarias, permitiendo simular tanto clientes como servidores sin protocolo definido. Esta flexibilidad lo convierte en un instrumento fundamental para entender la naturaleza cruda de la comunicación de red: bytes que fluyen entre dos puntos, sin interpretación semántica impuesta por aplicaciones de alto nivel.

Para crear un servidor TCP que escuche en un puerto: `nc -l -p 9000`. El flag `-l` indica modo listen (escucha), `-p` especifica el puerto. El proceso queda bloqueado esperando conexiones entrantes. Desde otro terminal o máquina, el cliente se conecta con `nc <ip_servidor> 9000`. Una vez establecida la conexión, cualquier texto escrito en un extremo aparece en el otro: un canal bidireccional de texto plano sobre TCP.

```bash
# Terminal 1 (servidor)
$ nc -l -p 9000
Hola desde cliente
[Ctrl+C para cerrar]

# Terminal 2 (cliente)
$ nc 192.168.1.10 9000
Hola desde cliente
```

Esta simplicidad revela mecanismos subyacentes que protocolos complejos ocultan. El handshake TCP de tres vías ocurre transparentemente antes de que el primer byte sea writable. El cierre de conexión requiere que ambos extremos cierren sus sockets; cerrar solo un lado deja el otro en estado `CLOSE_WAIT` hasta timeout. Las opciones `-v` (verbose) muestran eventos de conexión, `-z` (zero-I/O mode) solo verifica conectividad sin enviar datos, útil para escaneo rápido de puertos.

Netcat también permite transferencia de archivos cruda: `nc -l -p 9000 > archivo_recibido.txt` en el receptor, `nc <ip> 9000 < archivo_enviar.txt` en el emisor. No hay cifrado, verificación de integridad ni recuperación de errores: los datos llegan como el sistema los entrega. Esta falta de garantías es educativa: contrasta con protocolos como HTTP o SSH donde fiabilidad y seguridad son implícitas.

> Netcat tiene múltiples implementaciones (`netcat`, `netcat-openbsd`, `ncat` de nmap) con opciones ligeramente distintas. Algunas versiones usan `-l -p <puerto>`, otras `-l <puerto>` sin flag `-p`. Verificar con `nc -h` la sintaxis específica del sistema. Para UDP, añadir flag `-u`: `nc -u -l 9000`.

## Conexión SSH a otra máquina

SSH (*Secure Shell*) es el estándar para acceso remoto seguro, proporcionando autenticación robusta, cifrado de sesión y capacidades de túnel sobre una única conexión TCP. A diferencia de las pruebas anteriores, SSH opera con un protocolo completo que gestiona negociación criptográfica, autenticación múltiple y multiplexación de canales.

La conexión básica sigue la sintaxis `ssh usuario@host`. El cliente resuelve el nombre del host, establece TCP al puerto 22, negocia algoritmos de cifrado, verifica la identidad del servidor mediante huella de clave pública, y autentica al usuario (contraseña o clave pública). Tras el handshake, se abre una sesión de shell remota donde los comandos se ejecutan en la máquina destino.

```bash
$ ssh usuario@192.168.1.50
The authenticity of host '192.168.1.50 (192.168.1.50)' can't be established.
ED25519 key fingerprint is SHA256:abcdef123456...
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
usuario@192.168.1.50's password:
Welcome to Ubuntu 22.04 LTS...
```

La primera conexión genera advertencia de autenticidad: el cliente no conoce la huella del servidor y la almacena en `~/.ssh/known_hosts` tras confirmación manual. Conexiones posteriores verifican que la huella no haya cambiado, detectando potenciales ataques man-in-the-middle. Esta verificación es crítica en redes no confiables; omitirla anula la protección de autenticación del servidor.

La autenticación por clave pública elimina contraseñas y habilita automatización. Generar un par con `ssh-keygen -t ed25519`, copiar la pública al servidor con `ssh-copy-id usuario@host`, y conexiones posteriores autentican sin intervención. El archivo `~/.ssh/authorized_keys` en el servidor almacena claves permitidas, gestionable mediante permisos restrictivos (`chmod 700 ~/.ssh`, `chmod 600 ~/.ssh/authorized_keys`).

SSH soporta túneles que redirigen tráfico de otros protocolos a través del canal cifrado. Un túnel local `ssh -L 8080:localhost:80 usuario@host` escucha en el puerto 8080 local y reenvía todo tráfico al puerto 80 del servidor remoto (desde la perspectiva del servidor). Esto permite acceder a servicios que solo escuchan en localhost remoto, como bases de datos o interfaces de administración, sin exponerlos directamente a la red.

> SSH mantiene conexiones inactivas abiertas por defecto, pero firewalls intermedios pueden cerrarlas por timeout. Las opciones `ServerAliveInterval 60` y `ServerAliveCountMax 3` en `~/.ssh/config` envían keepalives periódicos que previenen cierre prematuro. Para multiplexar múltiples sesiones sobre una conexión TCP única, usar `ControlMaster` y `ControlPath` en configuración SSH.

## Quédate con...

*   El servidor HTTP de Python (`python3 -m http.server`) proporciona un entorno de pruebas web inmediato sin instalación, ideal para validar conectividad y servir archivos locales en entornos de desarrollo.
*   Netcat establece conexiones TCP/UDP crudas entre cliente y servidor, revelando la naturaleza básica de la comunicación de red sin protocolos de alto nivel que oculten el comportamiento subyacente.
*   SSH combina autenticación robusta, cifrado de sesión y capacidades de túnel; la verificación de huellas de clave en la primera conexión es esencial para prevenir ataques man-in-the-middle.
*   La autenticación por clave pública SSH elimina contraseñas y habilita automatización; generar pares con `ssh-keygen` y distribuir claves con `ssh-copy-id` es la práctica recomendada.
*   Los túneles SSH (`-L` para local, `-R` para remoto) permiten acceder a servicios protegidos detrás de firewalls sin exposición directa, cifrando todo el tráfico de aplicación.
*   Estas herramientas no son mutuamente excluyentes: combinar servidor Python para servir contenido, netcat para debug de conectividad cruda, y SSH para acceso seguro cubre la mayoría de escenarios de prueba de servicios en redes prácticas.

<div class="pagination">
  <a href="/markdown/sistemas/redes/practica/dns" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/practica/cortafuegos" class="next">Siguiente</a>
</div>
