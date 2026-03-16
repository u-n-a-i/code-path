---
title: "Estructura del sistema de archivos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Estructura del sistema de archivos](#estructura-del-sistema-de-archivos)
  - [La jerarquía FHS: directorios clave y su propósito](#la-jerarquía-fhs-directorios-clave-y-su-propósito)
  - [Tipos de archivos en Linux](#tipos-de-archivos-en-linux)
  - [Seguridad basada en permisos: una ventaja fundamental](#seguridad-basada-en-permisos-una-ventaja-fundamental)
  - [Quédate con...](#quédate-con)

</div>

# Estructura del sistema de archivos

A diferencia de sistemas como Windows, donde cada disco tiene su propia raíz (C:, D:, etc.), Linux organiza todo el sistema bajo una única jerarquía de directorios que arranca desde la raíz /. Esta estructura unificada, estandarizada internacionalmente mediante el Filesystem Hierarchy Standard (FHS), no solo simplifica la navegación y administración, sino que refleja una filosofía clara: separar lo esencial del sistema, los datos de usuario, los archivos variables y las aplicaciones instaladas. Además, en Linux todo es un archivo: dispositivos, procesos e incluso sockets de red se representan como entradas en el sistema de archivos, lo que permite gestionarlos con las mismas herramientas. Esta uniformidad, combinada con un modelo de permisos robusto y granular, constituye uno de los pilares de la seguridad y flexibilidad de Unix y Linux.

## La jerarquía FHS: directorios clave y su propósito

El estándar FHS define la ubicación y función de los principales directorios. Aquí los más relevantes:

- / (raíz): el directorio superior de todo el sistema. Todos los demás son subdirectorios suyos.
- /bin: contiene binarios esenciales para todos los usuarios, necesarios incluso en modo de rescate o sin red (por ejemplo, ls, cp, mv, bash). Estos comandos deben estar disponibles desde el inicio del sistema.
- /sbin: binarios esenciales para la administración del sistema, usados principalmente por el superusuario (root). Ejemplos: fdisk, iptables, reboot.
- /etc: almacena archivos de configuración del sistema y de las aplicaciones (como passwd, fstab, nginx.conf). No contiene binarios; solo texto plano o scripts de configuración.
- /home: directorio personal de cada usuario normal (ej. /home/ana). Aquí se guardan documentos, configuraciones personales (archivos ocultos como .bashrc) y proyectos.
- /root: el home del usuario root. No está dentro de /home por razones de seguridad y disponibilidad temprana en el arranque.
- /var: contiene datos variables cuyo contenido cambia durante la ejecución del sistema: logs (/var/log), colas de correo (/var/mail), bases de datos temporales, cachés (/var/cache).
- /usr: originalmente “user”, hoy significa “unix system resources”. Es un árbol secundario que contiene software no esencial para el arranque, pero necesario en operación normal. Incluye:
  - /usr/bin: binarios de aplicaciones de usuario (como git, python3, firefox).
  - /usr/sbin: herramientas administrativas no críticas para el arranque.
  - /usr/lib: bibliotecas compartidas para los programas en /usr/bin.
  - /usr/share: archivos independientes de la arquitectura (documentación, iconos, archivos de localización).
- /opt: destinado a software de terceros o paquetes autocontenidos (como IDEs comerciales, suites empresariales). Cada aplicación suele tener su propio subdirectorio (/opt/google/chrome).
- /tmp: archivos temporales, accesibles por todos los usuarios. Su contenido puede borrarse al reiniciar.
- /dev: contiene archivos especiales que representan dispositivos físicos o virtuales (como /dev/sda para un disco, /dev/tty para terminales, /dev/null como “sumidero”).
- /proc y /sys: sistemas de archivos virtuales que exponen información del kernel y del hardware en tiempo real (procesos, memoria, CPU, parámetros del sistema).

> La distinción entre /bin y /usr/bin tiene raíces históricas. En sistemas antiguos, /usr podía estar en un disco separado que no estaba montado al inicio, por lo que los comandos esenciales debían estar en /bin. Hoy, aunque muchos sistemas fusionan ambos (con enlaces simbólicos), la separación lógica persiste por compatibilidad y claridad conceptual.

## Tipos de archivos en Linux

En Linux, todo es un archivo, pero existen distintos tipos, visibles al listar con ls -l (la primera letra indica el tipo):

- \- Archivo regular: texto, binario, imagen, script, etc. El tipo más común.
- d Directorio: contenedor de otros archivos y directorios.
- l Enlace simbólico (symlink): un “atajo” que apunta a otro archivo o directorio. Se crea con ln -s destino enlace.
- c Dispositivo de caracteres: interfaz para dispositivos que transmiten byte a byte (como teclados o puertos serie).
- b Dispositivo de bloques: para dispositivos que leen/escriben en bloques (discos duros, memorias USB).
- p Tubería con nombre (named pipe): permite comunicación entre procesos.
- s Socket: punto de comunicación para procesos locales o de red.

Esta abstracción permite tratar dispositivos y recursos del sistema con los mismos comandos que usas para archivos normales (por ejemplo, cat /dev/sda leería el disco directamente —¡aunque no deberías hacerlo sin motivo!).

## Seguridad basada en permisos: una ventaja fundamental

Linux hereda de Unix un modelo de permisos granular y coherente, basado en tres entidades y tres tipos de acceso:

- Entidades:
  - Usuario (user): el propietario del archivo.
  - Grupo (group): conjunto de usuarios con acceso compartido.
  - Otros (others): todos los demás usuarios del sistema.
- Permisos:
  - Lectura (r): ver el contenido (archivo) o listar el directorio.
  - Escritura (w): modificar el contenido (archivo) o crear/eliminar archivos dentro (directorio).
  - Ejecución (x): ejecutar como programa (archivo) o acceder al interior (directorio).

Estos permisos se gestionan con comandos como chmod (cambiar permisos), chown (cambiar propietario) y chgrp (cambiar grupo). Por ejemplo:

```bash
chmod 755 script.sh   # dueño: rwx, grupo/otros: rx
chown ana:desarrollo proyecto/  # cambia propietario y grupo
```

## Quédate con...

- Linux usa una única jerarquía de archivos con raíz en /, estandarizada por el FHS.
- /bin contiene comandos esenciales para el arranque; /usr/bin, aplicaciones de usuario no críticas.
- Los directorios tienen propósitos específicos: /etc (configuración), /var (datos variables), /home (usuarios), /opt (software externo).
- Todo es un archivo, incluidos dispositivos (/dev) y procesos (/proc).
- Existen distintos tipos de archivos: regulares, directorios, enlaces, dispositivos, etc.
- El modelo de permisos basado en usuario/grupo/otros y lectura/escritura/ejecución es central para la seguridad y el aislamiento en Linux.
- Esta estructura coherente y segura es una de las razones por las que Linux domina en servidores, nube y sistemas embebidos.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/permisos/montaje" class="next">Siguiente</a>
</div>
