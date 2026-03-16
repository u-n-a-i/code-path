---
title: "El sistema de archivos (Filesystem)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [El sistema de archivos (Filesystem)](#el-sistema-de-archivos-filesystem)
  - [Propósito y funciones del Filesystem](#propósito-y-funciones-del-filesystem)
  - [Cómo se mapea la información lógica del archivo a los bloques físicos del disco](#cómo-se-mapea-la-información-lógica-del-archivo-a-los-bloques-físicos-del-disco)
  - [Quédate con...](#quédate-con)

</div>

# El sistema de archivos (Filesystem)

El sistema de archivos —o filesystem— es uno de los componentes más fundamentales del software de sistema. Actúa como la capa de abstracción que permite al sistema operativo y a las aplicaciones almacenar, organizar y recuperar datos en dispositivos de almacenamiento persistentes (discos duros, SSDs, memorias USB, etc.) sin necesidad de conocer los detalles físicos de cómo esos dispositivos funcionan. Sin un sistema de archivos, el disco sería solo una larga secuencia de sectores numerados; con él, se convierte en un entorno estructurado donde los usuarios pueden crear carpetas, nombrar documentos y buscar archivos por su contenido o ubicación.

## Propósito y funciones del Filesystem

El propósito principal del sistema de archivos es gestionar el almacenamiento persistente de manera eficiente, segura y usable. Para lograrlo, cumple varias funciones clave:

- Organización lógica: presenta los datos como una jerarquía de directorios y archivos, en lugar de bloques crudos. Esto permite a los usuarios y programas pensar en términos de “carpetas” y “documentos”, no de direcciones físicas.
- Asignación de espacio: decide qué bloques del disco se usan para cada archivo, evitando superposiciones y optimizando el uso del espacio (por ejemplo, mediante técnicas como la asignación contigua, enlazada o indexada).
- Gestión de metadatos: almacena y actualiza información sobre cada archivo (tamaño, permisos, fechas, propietario) y sobre la estructura del propio sistema (mapas de bits de bloques libres, tablas de inodos, etc.).
- Control de acceso y seguridad: aplica permisos y políticas de seguridad para garantizar que solo los usuarios autorizados puedan leer, modificar o eliminar archivos.
- Integridad y fiabilidad: implementa mecanismos para prevenir la corrupción de datos ante fallos (como journaling en ext4 o NTFS) y permite operaciones atómicas (por ejemplo, “escribir un archivo nuevo o no escribir nada”).
- Abstracción del hardware: oculta las diferencias entre tipos de almacenamiento (HDD, SSD, red) y proporciona una interfaz uniforme (open, read, write) a través del sistema operativo.

En resumen, el sistema de archivos transforma un medio de almacenamiento físico en un espacio lógico, seguro y navegable.

> Aunque a menudo se usa “sistema de archivos” para referirse a la estructura lógica (directorios y archivos), técnicamente también incluye el software del kernel que gestiona esa estructura y los metadatos en el disco. Es tanto una estructura de datos como un conjunto de algoritmos.

## Cómo se mapea la información lógica del archivo a los bloques físicos del disco

Cuando guardas un archivo, el sistema operativo no escribe sus bytes directamente en posiciones arbitrarias del disco. En cambio, el sistema de archivos traduce la petición lógica (“guardar este contenido en /home/usuario/nota.txt”) en una serie de decisiones físicas:

1. Asignación de bloques: El disco se divide en unidades fijas llamadas bloques (típicamente de 4 KB). El sistema de archivos consulta su mapa de bloques libres y reserva uno o varios bloques contiguos o dispersos para el nuevo archivo.
1. Registro en metadatos: Crea una entrada en su estructura de metadatos (por ejemplo, un inodo en sistemas Unix como ext4) que contiene:
   - Punteros a los bloques físicos asignados
   - Tamaño del archivo
   - Permisos, fechas, propietario
   - Contador de enlaces (para soportar enlaces duros)
1. Actualización de directorios: El nombre del archivo (nota.txt) y su referencia al inodo se añaden a la lista de entradas del directorio padre (/home/usuario/), que también es un archivo especial gestionado por el sistema.
1. Escritura de datos: Finalmente, los bytes del contenido se escriben en los bloques asignados.

Si el archivo crece más allá de los bloques iniciales, el sistema puede:

Asignar bloques adicionales (a veces no contiguos, lo que causa fragmentación).
Usar estructuras de indirección (punteros a punteros) para manejar archivos muy grandes sin sobrecargar el inodo.
En sistemas modernos con journaling (como ext4, NTFS o APFS), antes de modificar los bloques reales, el sistema registra la operación en un “diario” (journal). Si ocurre un corte de energía, el sistema puede reconstruir el estado consistente al arrancar, evitando corrupción.

Este mapeo lógico-físico es completamente transparente para el usuario y las aplicaciones: tú pides “leer el archivo X”, y el sistema de archivos se encarga de localizar, ensamblar y devolver los bloques correctos, incluso si están dispersos por todo el disco.

## Quédate con...

- El sistema de archivos es la capa que organiza el almacenamiento físico en una estructura lógica de archivos y directorios.
- Sus funciones incluyen gestión de espacio, metadatos, seguridad, integridad y abstracción del hardware.
- Traduce nombres y rutas lógicas en accesos a bloques físicos del disco mediante estructuras como inodos, tablas de asignación y mapas de bloques libres.
- Usa técnicas como journaling y asignación dinámica para garantizar rendimiento y fiabilidad, incluso ante fallos.
- Comprender su funcionamiento ayuda a tomar mejores decisiones sobre almacenamiento, copias de seguridad y diagnóstico de problemas de rendimiento o corrupción.

<div class="pagination">
  <a href="/markdown/sistemas/software/gestion/intro" class="prev">Anterior</a>
  <a href="/markdown/sistemas/software/gestion/tipos" class="next">Siguiente</a>
</div>
