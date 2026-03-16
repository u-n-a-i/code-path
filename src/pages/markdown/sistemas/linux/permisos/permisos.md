---
title: "Permisos de archivo"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Permisos de archivo](#permisos-de-archivo)
  - [Los tres tipos de permisos: r, w, x](#los-tres-tipos-de-permisos-r-w-x)
  - [Las tres categorías: usuario, grupo, otros](#las-tres-categorías-usuario-grupo-otros)
  - [Visualización con ls -l](#visualización-con-ls--l)
  - [Notación simbólica y octal](#notación-simbólica-y-octal)
  - [Permisos especiales: SUID, SGID y sticky bit](#permisos-especiales-suid-sgid-y-sticky-bit)
    - [SUID (Set User ID) — s en el bit de usuario](#suid-set-user-id--s-en-el-bit-de-usuario)
    - [SGID (Set Group ID) — s en el bit de grupo](#sgid-set-group-id--s-en-el-bit-de-grupo)
    - [Sticky bit — t en el bit de "otros"](#sticky-bit--t-en-el-bit-de-otros)
  - [Quédate con...](#quédate-con)

</div>

# Permisos de archivo

En Linux, la seguridad y el control de acceso se gestionan a través de un sistema de permisos de archivo elegante, granular y coherente. Cada archivo y directorio tiene asociados permisos que definen quién puede leerlo, modificarlo o ejecutarlo. Este modelo, heredado de Unix, se basa en tres categorías de usuarios y tres tipos de operaciones, representados visualmente como una cadena de nueve bits (agrupados en tres tríos). Además, existen permisos especiales —SUID, SGID y sticky bit— que modifican el comportamiento estándar para casos avanzados, como programas que necesitan privilegios temporales o directorios compartidos seguros. Dominar estos conceptos es esencial no solo para proteger tus datos, sino también para colaborar eficazmente en entornos multiusuario.

## Los tres tipos de permisos: r, w, x

Cada archivo o directorio tiene tres permisos básicos:

- r (read / lectura):
  - En archivos: permite ver su contenido.
  - En directorios: permite listar su contenido (ls).
- w (write / escritura):
  - En archivos: permite modificar o borrar su contenido.
  - En directorios: permite crear, renombrar o eliminar archivos dentro del directorio (¡no confundir con borrar el directorio mismo!).
- x (execute / ejecución):
  - En archivos: permite ejecutarlo como programa o script.
  - En directorios: permite acceder a su interior (cd) y acceder a los metadatos de sus archivos (necesario incluso para leer un archivo dentro si no tienes x en el directorio).

> Para un directorio, x es tan importante como r. Sin x, no puedes entrar ni acceder a sus archivos, aunque tengas r. Sin r, puedes acceder a archivos si conoces su nombre exacto, pero no listarlos.

## Las tres categorías: usuario, grupo, otros

Los permisos se aplican a tres grupos distintos:

1. Usuario (u / owner): el propietario del archivo (normalmente quien lo creó).
2. Grupo (g / group): el grupo al que pertenece el archivo; todos los miembros de ese grupo comparten estos permisos.
3. Otros (o / others): cualquier otro usuario del sistema que no sea el propietario ni esté en el grupo.

Esto da lugar a 9 bits de permiso, agrupados como rwxrwxrwx.

## Visualización con ls -l

El comando ls -l muestra los permisos en la primera columna:

```bash
$ ls -l script.sh
-rwxr-xr-- 1 ana desarrolladores 0 ene 10 10:00 script.sh
```

Desglose:

- El primer carácter indica el tipo de archivo: - (regular), d (directorio), l (enlace), etc.
- Los siguientes 9 caracteres se dividen en tres bloques de tres:
  - rwx → permisos del usuario (ana puede leer, escribir y ejecutar).
  - r-x → permisos del grupo (desarrolladores pueden leer y ejecutar, pero no modificar).
  - r-- → permisos de otros (solo lectura).

## Notación simbólica y octal

Puedes modificar permisos con chmod usando dos notaciones:

Simbólica:

```bash
chmod u+x script.sh    # añade ejecución al usuario
chmod g-w,o-r archivo  # quita escritura al grupo y lectura a otros
```

Octal (numérica): cada trío se convierte a un dígito:

r=4, w=2, x=1; sumas los valores.

Ejemplo: rwx = 4+2+1 = 7; r-x = 4+0+1 = 5; r-- = 4.

Así, chmod 754 script.sh equivale a rwxr-xr--.

## Permisos especiales: SUID, SGID y sticky bit

Además de los 9 bits estándar, existen tres bits especiales que aparecen en posiciones adicionales (antes de los tríos) y modifican el comportamiento del sistema:

### SUID (Set User ID) — s en el bit de usuario

Cuando un archivo ejecutable tiene SUID, se ejecuta con los privilegios del propietario, no del usuario que lo lanza. Útil para programas que necesitan acceso temporal a recursos restringidos.

Ejemplo clásico: passwd (cambia contraseñas, que requiere escribir en /etc/shadow, accesible solo por root):

```bash
-rwsr-xr-x 1 root root ... /usr/bin/passwd
```

El s en lugar de x indica SUID activo.

> Si un binario con SUID tiene vulnerabilidades, puede ser explotado para escalar privilegios. Úsalo solo cuando sea estrictamente necesario.

### SGID (Set Group ID) — s en el bit de grupo

- En archivos ejecutables: se ejecuta con los privilegios del grupo propietario.
- En directorios: todos los archivos creados dentro heredan el grupo del directorio, no el grupo primario del usuario. Esencial para directorios compartidos.

Ejemplo:

```bash
drwxrwsr-x 2 ana equipo 4096 ene 10 10:00 /compartido
```

El s en el grupo asegura que cualquier archivo creado aquí pertenezca al grupo equipo.

### Sticky bit — t en el bit de "otros"

Aplicado a directorios, impide que los usuarios eliminen o renombren archivos que no les pertenecen, incluso si tienen permiso de escritura en el directorio. Es el mecanismo que protege /tmp.

Ejemplo:

```bash
drwxrwxrwt 10 root root 4096 ene 10 10:00 /tmp
```

El t (en lugar de x en "otros") activa el sticky bit.

- En notación octal, los bits especiales se representan como un cuarto dígito al inicio:
  - SUID = 4, SGID = 2, sticky = 1.
  - Ejemplo: chmod 1755 /tmp → sticky + rwx para usuario, rx para grupo/otros.

## Quédate con...

- Los permisos se dividen en usuario, grupo y otros, cada uno con lectura (r), escritura (w) y ejecución (x).
- Usa ls -l para ver los permisos; el primer carácter indica el tipo de archivo.
- Directorios requieren x para acceder a su contenido, incluso si tienes r.
- SUID permite ejecutar un programa con los privilegios de su propietario (útil, pero peligroso).
- SGID en directorios hace que los nuevos archivos hereden el grupo del directorio.
- Sticky bit protege directorios compartidos (como /tmp) contra eliminación de archivos ajenos.
- Comprender y gestionar correctamente los permisos es fundamental para la seguridad, colaboración y estabilidad en cualquier sistema Linux.

<div class="pagination">
  <a href="/markdown/sistemas/linux/permisos/montaje" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/permisos/cambio" class="next">Siguiente</a>
</div>
