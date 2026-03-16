---
title: "Grupos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Grupos](#grupos)
  - [Grupos primarios vs. secundarios](#grupos-primarios-vs-secundarios)
  - [Creación y gestión de grupos](#creación-y-gestión-de-grupos)
  - [Añadir usuarios a un grupo: gpasswd o usermod](#añadir-usuarios-a-un-grupo-gpasswd-o-usermod)
  - [Establecer un grupo primario temporal: newgrp](#establecer-un-grupo-primario-temporal-newgrp)
  - [Archivos clave: /etc/group y /etc/gshadow](#archivos-clave-etcgroup-y-etcgshadow)
  - [Caso práctico: directorio compartido seguro](#caso-práctico-directorio-compartido-seguro)
  - [Quédate con...](#quédate-con)

</div>

# Grupos

En Linux, los grupos son una herramienta esencial para gestionar permisos de forma colectiva. En lugar de asignar accesos individualmente a cada usuario, se agrupan cuentas con necesidades similares (como desarrolladores, administradores o miembros de un proyecto) y se otorgan permisos al grupo como unidad. Esto simplifica enormemente la administración en entornos multiusuario y es fundamental para compartir archivos, directorios o recursos de sistema de forma segura y organizada. Cada usuario pertenece al menos a un grupo primario, pero puede formar parte de múltiples grupos secundarios, lo que le permite heredar distintos conjuntos de permisos según el contexto.

## Grupos primarios vs. secundarios

Grupo primario:

Cada usuario tiene exactamente un grupo primario, definido en el archivo /etc/passwd. Cuando el usuario crea un archivo o directorio, este hereda automáticamente el grupo primario del usuario. Por ejemplo, si ana tiene como grupo primario ana, todos sus archivos nuevos pertenecerán a ese grupo a menos que se indique lo contrario.

Grupos secundarios:

Un usuario puede pertenecer a múltiples grupos secundarios, listados en /etc/group. Estos grupos amplían sus capacidades: si un directorio está configurado con permisos para el grupo desarrollo, cualquier usuario en ese grupo (aunque no sea su primario) podrá acceder según los permisos asignados.

Puedes ver tus grupos con:

```bash
groups          # muestra todos los grupos del usuario actual
id              # muestra UID, GID y todos los grupos
```

> Los cambios en la membresía de grupos no surten efecto en sesiones ya abiertas. El usuario debe iniciar una nueva sesión (o usar newgrp) para que los nuevos grupos sean reconocidos.

## Creación y gestión de grupos

```bash
# Crear un grupo: groupadd
sudo groupadd desarrollo

# Esto añade una nueva entrada en /etc/group. Puedes especificar un GID (Group ID) con -g si es necesario:
sudo groupadd -g 1005 testers
```

## Añadir usuarios a un grupo: gpasswd o usermod

La forma más común y segura de gestionar la membresía es con gpasswd:

```bash
# Añadir un usuario:
sudo gpasswd -a ana desarrollo

# Eliminar un usuario:
sudo gpasswd -d ana desarrollo
```

Alternativamente, puedes usar usermod -aG, pero ten cuidado: sin la opción -a (append), reemplazarías todos los grupos secundarios del usuario, lo que es un error común:

```bash
sudo usermod -aG desarrollo ana   # correcto: añade sin eliminar otros
# ¡NO hagas esto!
sudo usermod -G desarrollo ana    # elimina todos los demás grupos secundarios
```

## Establecer un grupo primario temporal: newgrp

Si necesitas crear archivos que pertenezcan a un grupo secundario, puedes cambiar temporalmente tu grupo primario:

```bash
newgrp desarrollo
# Ahora, los nuevos archivos tendrán como grupo "desarrollo"
```

Esta sesión dura hasta que salgas (exit) o termines la shell.

## Archivos clave: /etc/group y /etc/gshadow

- /etc/group: almacena la lista de grupos y sus miembros secundarios. Cada línea tiene el formato:
  - nombre_grupo:x:GID:usuario1,usuario2,...
  - (El campo x indica que la contraseña del grupo —rara vez usada— está en /etc/gshadow).
- /etc/gshadow: contiene información sensible sobre grupos (como contraseñas de grupo o administradores), accesible solo por root.

> A diferencia de las cuentas de usuario, los grupos rara vez tienen contraseñas. La membresía se gestiona directamente por el administrador.

## Caso práctico: directorio compartido seguro

Imagina un equipo que necesita colaborar en /proyectos/web:

```bash
sudo groupadd webteam
sudo usermod -aG webteam ana
sudo usermod -aG webteam luis

sudo mkdir -p /proyectos/web
sudo chown root:webteam /proyectos/web
sudo chmod 2775 /proyectos/web   # SGID + rwx para dueño/grupo, rx para otros
```

El bit SGID (2 en notación octal) asegura que todos los archivos creados dentro hereden el grupo webteam, independientemente del grupo primario del creador. Así, cualquier miembro del equipo puede modificar los archivos de los demás.

## Quédate con...

- Cada usuario tiene un grupo primario (define el grupo de nuevos archivos) y puede pertenecer a múltiples grupos secundarios.
- Usa gpasswd -a y gpasswd -d para añadir o eliminar usuarios de un grupo de forma segura.
- Nunca uses usermod -G sin -a, o perderás los grupos secundarios existentes.
- El comando groups muestra los grupos actuales; los cambios requieren una nueva sesión.
- El bit SGID en directorios es clave para entornos de trabajo colaborativo.
- Los grupos son la forma más eficaz de gestionar permisos colectivos en Linux, evitando configuraciones individuales tediosas y propensas a errores.

<div class="pagination">
  <a href="/markdown/sistemas/linux/usuarios/pass" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/usuarios/root" class="next">Siguiente</a>
</div>
