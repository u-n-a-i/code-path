---
title: "Propiedad de archivos y directorios"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Propiedad de archivos y directorios](#propiedad-de-archivos-y-directorios)
  - [Cambio de propietario con chown](#cambio-de-propietario-con-chown)
  - [Cambiar usuario y grupo simultáneamente](#cambiar-usuario-y-grupo-simultáneamente)
  - [Cambio de grupo con chgrp](#cambio-de-grupo-con-chgrp)
  - [Consideraciones importantes](#consideraciones-importantes)
  - [Quédate con...](#quédate-con)

</div>

# Propiedad de archivos y directorios

En Linux, cada archivo y directorio tiene un propietario (un usuario) y un grupo asociado. Estos atributos, junto con los permisos rwx, determinan quién puede acceder o modificar el recurso. Mientras que los permisos definen qué se puede hacer, la propiedad define a quién se le aplican esas reglas. Cambiar la propiedad es una operación administrativa fundamental, especialmente en entornos multiusuario, servidores web o cuando se comparten recursos entre equipos. Los comandos chown (change owner) y chgrp (change group) permiten reasignar estos atributos de forma precisa y segura.

## Cambio de propietario con chown

El comando chown modifica el usuario propietario de un archivo o directorio. Solo el superusuario (root) o el propietario actual (en casos muy limitados) pueden cambiar el propietario; por lo general, requiere privilegios elevados.

Sintaxis básica:

```bash
sudo chown nuevo_usuario archivo
```

Ejemplo:

```bash
sudo chown ana proyecto.py
```

Ahora, ana es la dueña del archivo y puede aplicarle sus propios permisos de usuario.

## Cambiar usuario y grupo simultáneamente

chown también permite cambiar usuario y grupo en una sola operación, usando la sintaxis usuario:grupo:

```bash
sudo chown ana:desarrollo /var/www/app/
```

Esto asigna a ana como propietaria y al grupo desarrollo como grupo del directorio /var/www/app/.

> En algunos sistemas, también se acepta usuario.grupo (con punto), pero la forma con dos puntos (:) es la estándar POSIX y la más portable.

## Cambio de grupo con chgrp

El comando chgrp está diseñado exclusivamente para cambiar el grupo propietario. A diferencia de chown, un usuario normal puede usar chgrp en sus propios archivos, siempre que sea miembro del grupo destino.

Sintaxis:

```bash
chgrp nuevo_grupo archivo
```

Ejemplo:

```bash
chgrp equipo informe.txt
```

Esto funciona si el usuario actual es propietario de informe.txt y pertenece al grupo equipo.

> Hoy en día, chown usuario:grupo es más común que chgrp, ya que permite hacer ambos cambios en un solo comando. Sin embargo, chgrp sigue siendo útil en scripts legados o cuando solo se desea modificar el grupo sin tocar el propietario.

## Consideraciones importantes

- Solo root puede cambiar el propietario de un archivo. Esto evita que un usuario transfiera archivos sensibles a otro y luego alegue que “ya no son suyos”.
- Para cambiar el grupo, el usuario debe ser propietario del archivo y miembro del grupo destino.

Al aplicar cambios recursivos en directorios, usa la opción -R:

```bash
sudo chown -R www-data:www-data /var/www/html/
```

Esto es habitual al configurar servidores web, donde todos los archivos deben pertenecer al usuario del servicio (como www-data en Apache/Nginx).

> Cambiar la propiedad de archivos del sistema (como en /etc, /bin, /usr) puede romper el funcionamiento del sistema o crear vulnerabilidades. Hazlo solo si sabes exactamente qué estás haciendo.

## Quédate con...

- Cada archivo tiene un usuario propietario y un grupo propietario.
- Usa chown usuario archivo para cambiar el propietario (requiere sudo).
- Usa chgrp grupo archivo para cambiar solo el grupo (puedes hacerlo sin sudo si eres dueño y miembro del grupo).
- Puedes cambiar ambos a la vez con chown usuario:grupo archivo.
- La opción -R aplica los cambios recursivamente a directorios y su contenido.
- La gestión correcta de la propiedad es clave para la seguridad, colaboración y correcto funcionamiento de servicios como servidores web o bases de datos.

<div class="pagination">
  <a href="/markdown/sistemas/linux/permisos/cambio" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
