---
title: "Seguridad y permisos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Seguridad y permisos](#seguridad-y-permisos)
  - [Modelos de permisos](#modelos-de-permisos)
  - [Propiedad](#propiedad)
  - [Herencia de permisos](#herencia-de-permisos)
  - [Integridad, respaldo y seguridad de la información](#integridad-respaldo-y-seguridad-de-la-información)
    - [Checksums](#checksums)
    - [Backups](#backups)
    - [Cifrado en reposo y en tránsito](#cifrado-en-reposo-y-en-tránsito)
  - [Quédate con...](#quédate-con)

</div>

# Seguridad y permisos

La seguridad en un sistema de archivos no se trata solo de evitar accesos no autorizados, sino de garantizar la integridad, confidencialidad y disponibilidad de la información. Esto se logra mediante mecanismos que controlan quién puede ver, modificar o ejecutar un archivo (permisos), quién es responsable de él (propiedad), cómo se propagan esas reglas (herencia) y qué medidas técnicas protegen los datos frente a fallos, intrusiones o pérdida. Tanto sistemas Unix-like como Windows ofrecen modelos robustos —aunque distintos— para gestionar estos aspectos, complementados hoy por técnicas modernas como el cifrado y las sumas de verificación.

## Modelos de permisos

Los sistemas operativos usan modelos jerárquicos para definir qué usuarios o procesos pueden realizar operaciones sobre un archivo o directorio.

En **Unix/Linux** (y sistemas POSIX), el modelo clásico se basa en tres categorías y tres permisos básicos:

- Categorías:
  - Usuario (user): el propietario del archivo.
  - Grupo (group): conjunto de usuarios al que pertenece el archivo.
  - Otros (others): cualquier usuario que no sea el propietario ni esté en el grupo.
- Permisos:
  - r (read): leer el contenido (archivo) o listar entradas (directorio).
  - w (write): modificar el contenido (archivo) o añadir/eliminar archivos (directorio).
  - x (execute): ejecutar como programa (archivo) o acceder al interior (directorio).

Estos permisos se representan, por ejemplo, como rwxr-x---, lo que significa:

- propietario: lectura, escritura, ejecución;
- grupo: lectura y ejecución;
- otros: sin acceso.

Este modelo es simple, eficiente y suficiente para muchos entornos, pero limitado cuando se necesitan políticas más finas.

En **Windows**, el modelo predominante es el de Listas de Control de Acceso (ACLs, Access Control Lists). Cada archivo o directorio tiene asociada una ACL que contiene múltiples entradas (ACEs, Access Control Entries), cada una especificando:

- Un usuario o grupo.
- Si se permite o deniega explícitamente una acción (lectura, escritura, eliminación, cambio de permisos, etc.).

Las ACLs permiten reglas mucho más granulares: por ejemplo, “el usuario Ana puede leer y escribir, pero no eliminar; el grupo Contabilidad solo puede leer”. Además, Windows distingue entre permisos explícitos y heredados, y soporta auditoría de accesos.

> Aunque Linux también soporta ACLs (mediante extensiones como setfacl), el modelo rwx sigue siendo el estándar por defecto. En cambio, en Windows las ACLs son la base del sistema de seguridad desde NT.

## Propiedad

Cada archivo tiene un propietario (usuario) y un grupo primario asociado. En Unix, solo el propietario (o el superusuario root) puede cambiar los permisos o la propiedad del archivo. La propiedad determina:

- Qué reglas de permisos se aplican primero.
- Quién puede transferir la propiedad o eliminar el archivo (en muchos sistemas, borrar un archivo requiere permiso de escritura en el directorio, no en el archivo mismo).

En entornos multiusuario, la propiedad es clave para aislar los datos de cada usuario y evitar interferencias no deseadas.

## Herencia de permisos

La herencia permite que los permisos de un directorio se apliquen automáticamente a los archivos y subdirectorios que se creen dentro de él.

- En Windows, la herencia es parte central del modelo ACL: al crear un archivo, hereda las ACEs del directorio padre, a menos que se desactive explícitamente.
- En Unix, no existe herencia directa de permisos rwx. Sin embargo, el máscara de creación (umask) define qué permisos no se asignan por defecto a nuevos archivos, y el bit setgid en un directorio hace que los archivos creados dentro hereden el grupo del directorio (útil en entornos colaborativos).

Esta diferencia refleja filosofías distintas: Windows prioriza la coherencia administrativa; Unix, la simplicidad y el control explícito.

## Integridad, respaldo y seguridad de la información

Más allá del control de acceso, la protección de la información requiere garantizar que los datos no se corrompan, se pierdan o sean interceptados.

### Checksums

Un checksum (o suma de verificación) es un valor corto derivado del contenido de un archivo mediante una función hash (como SHA-256). Se usa para:

- Detectar errores de transmisión o almacenamiento (por ejemplo, en descargas).
- Verificar la integridad de copias de seguridad.
- Prevenir modificaciones maliciosas (si el checksum cambia, el archivo fue alterado).

Muchos sistemas de archivos modernos (ZFS, Btrfs, APFS) calculan y almacenan checksums internamente para detectar corrupción silenciosa en disco.

### Backups

Los respaldos son la última línea de defensa contra la pérdida de datos por fallos hardware, errores humanos o ataques (como ransomware). Una estrategia sólida incluye:

- Copias regulares (completas e incrementales).
- Almacenamiento fuera del sitio principal (nube, discos externos).
- Verificación periódica de la integridad de las copias.
- Versionado (para recuperar estados anteriores de un archivo).

Herramientas como rsync, Borg, Time Machine (macOS) o Veeam automatizan este proceso.

### Cifrado en reposo y en tránsito

**Cifrado en reposo:** protege los datos almacenados en disco. Si un dispositivo es robado, los archivos permanecen ilegibles sin la clave. Ejemplos: BitLocker (Windows), FileVault (macOS), LUKS (Linux), cifrado nativo en APFS/NTFS.

**Cifrado en tránsito:** protege los datos mientras viajan por la red (por ejemplo, al sincronizar con la nube). Protocolos como TLS/SSL (usados en HTTPS, SFTP) garantizan confidencialidad e integridad durante la transferencia.

Ambos son esenciales en entornos donde la privacidad y la conformidad normativa (GDPR, HIPAA) son críticas.

## Quédate con...

- Los permisos en Unix/Linux usan el modelo rwx para usuario/grupo/otros; Windows emplea ACLs más flexibles y detalladas.
- La propiedad define quién controla un archivo; solo el propietario (o root) puede cambiarla.
- La herencia de permisos es automática en Windows; en Unix se gestiona mediante umask y bits especiales (como setgid).
- La integridad se verifica con checksums; los respaldos aseguran la disponibilidad ante pérdidas.
- El cifrado en reposo protege datos almacenados; el cifrado en tránsito protege durante la comunicación.
- Juntos, estos mecanismos forman una estrategia integral de seguridad que va más allá del simple “acceso o no acceso”.

<div class="pagination">
  <a href="/markdown/sistemas/software/gestion/directorios" class="prev">Anterior</a>
  <a href="/markdown/sistemas/software/gestion/operaciones" class="next">Siguiente</a>
</div>
