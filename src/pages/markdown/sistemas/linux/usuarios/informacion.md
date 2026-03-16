---
title: "Información de usuarios y grupos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Información de usuarios y grupos](#información-de-usuarios-y-grupos)
  - [El archivo /etc/passwd: identidad de los usuarios](#el-archivo-etcpasswd-identidad-de-los-usuarios)
  - [El archivo /etc/group: organización en grupos](#el-archivo-etcgroup-organización-en-grupos)
  - [Comandos útiles para consultar estos archivos](#comandos-útiles-para-consultar-estos-archivos)
  - [Quédate con...](#quédate-con)

</div>

# Información de usuarios y grupos

En Linux, la información esencial sobre usuarios y grupos se almacena en archivos de texto plano ubicados en el directorio /etc. Estos archivos —/etc/passwd para usuarios y /etc/group para grupos— son legibles por todos los usuarios del sistema, lo que permite a las aplicaciones y comandos consultar rápidamente quién existe en el sistema y cómo están organizados. Aunque no contienen datos sensibles como contraseñas (estas se guardan de forma segura en /etc/shadow, accesible solo por root), su estructura es fundamental para entender cómo el sistema identifica y organiza a sus usuarios. Conocer su formato y contenido te permite depurar problemas de inicio de sesión, verificar pertenencias a grupos o incluso escribir scripts de administración eficaces.

## El archivo /etc/passwd: identidad de los usuarios

A pesar de su nombre, /etc/passwd ya no almacena contraseñas. En sistemas modernos, solo contiene información pública de cada cuenta de usuario. Cada línea representa un usuario y tiene siete campos separados por dos puntos (:):

```
nombre:x:UID:GID:descripción:directorio_home:shell
```

Ejemplo:

```
ana:x:1001:1001:Ana López:/home/ana:/bin/bash
```

Desglose de campos:

1. Nombre de usuario: identificador único para iniciar sesión.
1. Contraseña: siempre x en sistemas modernos; indica que el hash real está en /etc/shadow.
1. UID (User ID): número único que identifica al usuario internamente.
   - UID 0 → root
   - UID 1–999 → usuarios y servicios del sistema
   - UID ≥1000 → usuarios humanos (en la mayoría de distribuciones)
1. GID (Group ID): ID del grupo primario del usuario.
1. Descripción (GECOS): nombre completo, departamento, etc. Usado por comandos como finger.
1. Directorio home: ruta al directorio personal del usuario.
1. Shell de inicio: intérprete de comandos asignado (por ejemplo, /bin/bash, /usr/bin/zsh, o /usr/sbin/nologin para cuentas sin acceso interactivo).

> Aunque es legible por todos, modificar /etc/passwd directamente es peligroso. Usa comandos como useradd, usermod o vipw (que incluye verificación de sintaxis) si necesitas editarlo manualmente.

## El archivo /etc/group: organización en grupos

Este archivo define los grupos del sistema y lista a sus miembros secundarios. Cada línea tiene cuatro campos:

```
nombre:x:GID:miembros
```

Ejemplo:

```
desarrollo:x:1002:ana,luis
```

Desglose:

1. Nombre del grupo: identificador único.
2. Contraseña del grupo: casi siempre x (las contraseñas de grupo son raras; si existen, se almacenan en /etc/gshadow).
3. GID (Group ID): número único del grupo.
4. Miembros: lista de usuarios (separados por comas) que pertenecen al grupo como miembros secundarios.
   - Importante: los usuarios cuyo grupo primario es este no aparecen listados aquí. Por ejemplo, si ana tiene GID 1002, pertenece al grupo desarrollo como primario, pero no figurará en la lista de miembros de /etc/group.

> Al igual que con /etc/passwd, usa groupadd, gpasswd o vigr (versión segura de edición) para modificar este archivo.

## Comandos útiles para consultar estos archivos

```bash
# Buscar un usuario
getent passwd ana # (getent consulta bases de datos del sistema, incluyendo LDAP si está configurado, no solo el archivo local).

# Ver tu propio UID/GID y grupos:
id

# Listar todos los usuarios:
cut -d: -f1 /etc/passwd

# Ver qué grupos tiene un usuario:
groups ana
```

## Quédate con...

- /etc/passwd contiene información pública de cada usuario: nombre, UID, GID, directorio home y shell.
- /etc/group define los grupos y lista a los usuarios que pertenecen a ellos como miembros secundarios.
- Las contraseñas reales están en /etc/shadow (solo accesible por root); los archivos públicos usan x como marcador.
- El grupo primario de un usuario no aparece en la lista de miembros de /etc/group.
- Usa getent, id y groups para consultar esta información de forma segura y portable.
- Estos archivos son la base de la identidad del sistema; entenderlos es clave para la administración y depuración en entornos Linux.

<div class="pagination">
  <a href="/markdown/sistemas/linux/usuarios/root" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
