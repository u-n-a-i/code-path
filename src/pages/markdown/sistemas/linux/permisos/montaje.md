---
title: "Montaje de sistemas de archivos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Montaje de sistemas de archivos](#montaje-de-sistemas-de-archivos)
  - [Montaje y desmontaje con mount y umount](#montaje-y-desmontaje-con-mount-y-umount)
  - [El archivo /etc/fstab: montaje automático al arranque](#el-archivo-etcfstab-montaje-automático-al-arranque)
  - [Visualizar uso de espacio: df y du](#visualizar-uso-de-espacio-df-y-du)
  - [du — Uso de espacio por directorio o archivo](#du--uso-de-espacio-por-directorio-o-archivo)
  - [Quédate con...](#quédate-con)

</div>

# Montaje de sistemas de archivos

En Linux, todos los dispositivos de almacenamiento —discos duros, memorias USB, particiones de red o imágenes de disco— deben montarse en un punto específico del árbol de directorios para poder acceder a su contenido. Este mecanismo, central en la filosofía Unix de “todo es un archivo”, permite integrar múltiples volúmenes físicos en una única jerarquía coherente. A diferencia de otros sistemas operativos que asignan letras a unidades (C:, D:), Linux une todo bajo /, y el montaje define dónde aparece el contenido de un dispositivo dentro de esa estructura. Comprender cómo montar, desmontar y gestionar estos puntos de montaje es esencial para administrar almacenamiento local, externo o remoto.

## Montaje y desmontaje con mount y umount

El comando mount asocia un dispositivo (o sistema de archivos) a un directorio existente, llamado punto de montaje. Una vez montado, el contenido del dispositivo reemplaza temporalmente el contenido del directorio (que vuelve a estar visible al desmontar).

Ejemplo básico:

```bash
sudo mount /dev/sdb1 /mnt/usb
```

Esto monta la primera partición del segundo disco (/dev/sdb1) en el directorio /mnt/usb. Ahora, al acceder a /mnt/usb, estás viendo el contenido de esa memoria USB.

Para desmontar:

```bash
sudo umount /mnt/usb
```

> Se escribe umount (sin “n”), no “unmount”. Es una convención histórica.

Es crucial desmontar antes de extraer dispositivos físicos; de lo contrario, podrías corromper datos si hay operaciones pendientes en caché.

## El archivo /etc/fstab: montaje automático al arranque

El archivo /etc/fstab (file system table) define qué sistemas de archivos deben montarse automáticamente al iniciar el sistema. Cada línea describe un dispositivo, su punto de montaje, tipo de sistema de archivos, opciones, y comportamientos de respaldo y verificación.

Ejemplo de entrada:

```
UUID=abcd1234-5678 /home ext4 defaults 0 2
```

Campos (separados por espacios o tabuladores):

- Dispositivo: puede ser una ruta (/dev/sda1), un UUID (más fiable, ya que no cambia) o una etiqueta.
- Punto de montaje: directorio donde se montará.
- Tipo de sistema de archivos: ext4, xfs, ntfs, vfat, etc.
- Opciones: defaults, rw, ro, noexec, user, etc.
- Dump: usado por la herramienta dump (0 = no respaldar).
- Pass: orden de verificación por fsck al arrancar (0 = no verificar, 1 = raíz, 2 = otros).

Editar /etc/fstab incorrectamente puede impedir el arranque del sistema, por lo que siempre se recomienda hacer una copia de seguridad antes de modificarlo y probar los cambios con:

```bash
sudo mount -a
```

Este comando intenta montar todos los sistemas de archivos listados en /etc/fstab sin reiniciar.

> Usar UUIDs en lugar de rutas como /dev/sda1 es una buena práctica, ya que el nombre del dispositivo puede cambiar si conectas discos en distinto orden.

## Visualizar uso de espacio: df y du

Una vez montados los sistemas de archivos, necesitas herramientas para supervisar su uso:

- df — Espacio en disco por sistema de archivos
- df (disk free) muestra el espacio total, usado y disponible en cada sistema de archivos montado.

```bash
df -h   # -h = human-readable (KB, MB, GB)
```

Salida típica:

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2        50G   20G   28G  42% /
/dev/sdb1       1.8T  1.2T  600G  67% /datos
```

Ideal para detectar particiones llenas o verificar que un nuevo disco está correctamente montado.

## du — Uso de espacio por directorio o archivo

du (disk usage) muestra cuánto espacio ocupa un directorio o archivo específico, explorando recursivamente su contenido.

```bash
du -sh /var/log   # -s = resumen, -h = legible
```

Muestra:

```
1.2G    /var/log
```

Útil para identificar qué carpetas consumen más espacio, especialmente cuando df indica que una partición está llena.

> df trabaja a nivel de sistema de archivos (partición); du trabaja a nivel de contenido (archivos y directorios). Pueden mostrar valores distintos si hay archivos eliminados pero aún abiertos por procesos (ocupan espacio en disco, pero no aparecen en du).

## Quédate con...

- En Linux, los dispositivos se montan en directorios existentes mediante mount; se desmontan con umount.
- El archivo /etc/fstab configura montajes automáticos al arranque; usa UUIDs para mayor fiabilidad.
- df -h muestra el espacio libre y usado por cada sistema de archivos montado.
- du -sh muestra el tamaño de un directorio o archivo específico.
- Siempre desmonta dispositivos antes de desconectarlos físicamente para evitar corrupción de datos.
- La combinación de df y du es esencial para diagnosticar problemas de espacio en disco.

<div class="pagination">
  <a href="/markdown/sistemas/linux/permisos/estructura" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/permisos/permisos" class="next">Siguiente</a>
</div>
