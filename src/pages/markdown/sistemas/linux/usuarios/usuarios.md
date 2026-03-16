---
title: "Usuarios"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Usuarios](#usuarios)
  - [Parámetros esenciales](#parámetros-esenciales)
  - [Modificación de usuarios con usermod](#modificación-de-usuarios-con-usermod)
  - [Eliminación de usuarios con userdel](#eliminación-de-usuarios-con-userdel)
  - [Bloqueo y desbloqueo de cuentas](#bloqueo-y-desbloqueo-de-cuentas)
  - [Quédate con...](#quédate-con)

</div>

# Usuarios

En Linux, cada persona o servicio que interactúa con el sistema lo hace a través de una cuenta de usuario. Estas cuentas no solo identifican a quién pertenece un proceso o archivo, sino que también definen los límites de acceso mediante permisos y políticas de seguridad. Gestionar usuarios —crearlos, modificarlos o eliminarlos— es una tarea fundamental para administradores de sistemas, especialmente en entornos multiusuario, servidores o contenedores. Los comandos useradd, usermod y userdel permiten controlar estas cuentas de forma precisa, desde la asignación del directorio personal hasta la elección del intérprete de comandos o el bloqueo temporal de una cuenta.

Creación de usuarios con useradd
El comando useradd crea una nueva cuenta de usuario, pero no la activa inmediatamente: por defecto, no asigna contraseña, por lo que la cuenta queda inutilizable hasta que se establezca una con passwd.

Comando básico:

```bash
sudo useradd ana
```

Sin opciones adicionales, useradd aplica configuraciones predeterminadas definidas en /etc/default/useradd y /etc/login.defs. Sin embargo, en la práctica casi siempre se usan parámetros clave:

## Parámetros esenciales

- -m (create home): crea automáticamente el directorio personal del usuario (por ejemplo, /home/ana).
- -s (shell): especifica el shell por defecto. Si no se indica, se usa el valor de /etc/default/useradd (normalmente /bin/sh o /bin/bash).
- -G (grupos secundarios): añade al usuario a grupos adicionales (además de su grupo primario, que suele tener el mismo nombre que el usuario).
- -c (comentario): agrega una descripción (como nombre completo), visible en comandos como finger o en /etc/passwd.

```bash
# -m (create home): crea automáticamente el directorio personal del usuario (por ejemplo, /home/ana).
sudo useradd -m ana

# -s (shell): especifica el shell por defecto. Si no se indica, se usa el valor de /etc/default/useradd (normalmente /bin/sh o /bin/bash).
sudo useradd -m -s /bin/bash ana

# -G (grupos secundarios): añade al usuario a grupos adicionales (además de su grupo primario, que suele tener el mismo nombre que el usuario).
sudo useradd -m -G sudo,docker ana   # en Ubuntu, "sudo" da acceso a root

# -c (comentario): agrega una descripción (como nombre completo), visible en comandos como finger o en /etc/passwd.
sudo useradd -m -c "Ana López" ana
```

Tras crear la cuenta, se debe asignar una contraseña:

```bash
sudo passwd ana
```

> Algunas distribuciones (como Ubuntu) incluyen el comando adduser, que es un script más amigable y automatizado sobre useradd. En entornos profesionales o scripts, se prefiere useradd por su predictibilidad y control fino.

## Modificación de usuarios con usermod

Una vez creada la cuenta, usermod permite ajustar sus atributos:

```bash
# Cambiar el shell:
sudo usermod -s /usr/bin/zsh ana

# Añadir a un grupo sin perder los existentes (-aG es crucial; sin -a, se reemplazan los grupos)
sudo usermod -aG developers ana

# Cambiar el directorio home (requiere mover manualmente los archivos si ya existen):
sudo usermod -d /opt/usuarios/ana -m ana   # `-m` mueve el contenido antiguo
```

## Eliminación de usuarios con userdel

El comando userdel elimina una cuenta de usuario, pero por defecto conserva su directorio home y archivos (por seguridad, para no borrar datos accidentalmente).

```bash
# Eliminar solo la cuenta:
sudo userdel ana

# Eliminar la cuenta y su directorio home:
sudo userdel -r ana
```

> Advertencia: userdel -r borra todo el contenido de /home/ana permanentemente. Asegúrate de hacer copias de seguridad si hay datos valiosos.

## Bloqueo y desbloqueo de cuentas

A veces es necesario deshabilitar temporalmente una cuenta sin eliminarla (por ejemplo, durante una baja laboral o una investigación de seguridad). Esto se logra “bloqueando” la contraseña, lo que impide cualquier inicio de sesión basado en contraseña (aunque el acceso por clave SSH podría seguir funcionando si no se configura adecuadamente).

```bash
# Bloquear:
sudo passwd -l ana    # añade un "!" al hash de la contraseña en /etc/shadow

# Desbloquear:
sudo passwd -u ana    # restaura el hash original

# Alternativamente, puedes usar usermod:
sudo usermod -L ana   # bloquea
sudo usermod -U ana   # desbloquea
```

> El bloqueo solo afecta a la autenticación por contraseña. Para desactivar completamente una cuenta, considera también revocar claves SSH, detener procesos del usuario o cambiar su shell a /usr/sbin/nologin.

## Quédate con...

- Usa useradd -m -s /bin/bash usuario para crear usuarios con directorio home y shell estándar.
- Siempre ejecuta passwd usuario tras useradd para activar la cuenta.
- usermod -aG grupo usuario añade a un grupo sin perder los actuales.
- userdel -r usuario elimina tanto la cuenta como su directorio home.
- Bloquea cuentas con passwd -l o usermod -L para deshabilitar accesos temporales.
- La gestión cuidadosa de usuarios es esencial para la seguridad, el aislamiento y la trazabilidad en cualquier sistema Linux.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/usuarios/pass" class="next">Siguiente</a>
</div>
