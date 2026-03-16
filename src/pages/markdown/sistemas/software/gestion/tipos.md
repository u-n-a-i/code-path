---
title: "Tipos de sistemas de archivos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Tipos de sistemas de archivos](#tipos-de-sistemas-de-archivos)
  - [NTFS (New Technology File System)](#ntfs-new-technology-file-system)
  - [ext4 (Fourth Extended Filesystem)](#ext4-fourth-extended-filesystem)
  - [APFS (Apple File System)](#apfs-apple-file-system)
  - [FAT32 (File Allocation Table 32)](#fat32-file-allocation-table-32)
  - [Quédate con...](#quédate-con)

</div>

# Tipos de sistemas de archivos

No todos los sistemas de archivos son iguales. Cada uno ha sido diseñado con objetivos distintos: algunos priorizan la compatibilidad, otros el rendimiento, la seguridad o la resistencia a fallos. Elegir el sistema de archivos adecuado para un dispositivo o sistema operativo influye directamente en la fiabilidad, velocidad y funcionalidad del almacenamiento. A continuación se presentan cuatro de los sistemas de archivos más relevantes en entornos modernos —NTFS, ext4, APFS y FAT32— comparando sus orígenes, capacidades técnicas y casos de uso típicos.

## NTFS (New Technology File System)

Desarrollado por Microsoft, NTFS es el sistema de archivos predeterminado en Windows desde Windows NT (1993). Fue diseñado para superar las limitaciones de FAT32 y ofrecer características avanzadas necesarias en entornos profesionales y servidores.

- Límites de tamaño:
  - Tamaño máximo de archivo: 16 exabytes (teóricamente; en la práctica, limitado por la implementación del SO).
  - Tamaño máximo de volumen: 256 terabytes (con clústeres de 64 KB).
- Seguridad: Soporta listas de control de acceso (ACLs), cifrado de archivos (EFS), compresión y cuotas de disco.
- Tolerancia a fallos: Incluye journaling (registro de transacciones) que permite recuperar la coherencia del sistema tras un corte de energía o fallo del sistema.
- Otros: Soporta enlaces duros, enlaces simbólicos, puntos de unión (junction points) y metadatos extendidos.
- Uso típico: Discos internos en Windows, servidores Windows, unidades externas cuando se necesita compatibilidad con características avanzadas de Windows.

> Aunque macOS y Linux pueden leer (y en algunos casos escribir) en NTFS, el soporte nativo no siempre incluye todas sus funciones avanzadas, como permisos o journaling.

## ext4 (Fourth Extended Filesystem)

ext4 es el sistema de archivos estándar en la mayoría de las distribuciones Linux modernas. Es la evolución de ext2/ext3, optimizado para grandes volúmenes y alto rendimiento, manteniendo compatibilidad hacia atrás.

- Límites de tamaño:
  - Tamaño máximo de archivo: 16 tebibytes (TiB).
  - Tamaño máximo de volumen: 1 exbibyte (EiB).
- Seguridad: Usa permisos Unix tradicionales (usuario/grupo/otros) y soporta atributos extendidos y listas de control de acceso (ACLs) si están habilitadas.
- Tolerancia a fallos: Incluye journaling opcional (aunque activado por defecto), lo que reduce drásticamente el riesgo de corrupción tras fallos. También soporta checksums en metadatos (en versiones recientes) para detectar errores.
- Otros: Soporta asignación retardada (delayed allocation), fragmentación reducida, enlaces duros y simbólicos, y fechas con precisión de nanosegundos.
- Uso típico: Discos raíz en servidores y estaciones de trabajo Linux, particiones de datos en entornos Unix-like.

## APFS (Apple File System)

Introducido por Apple en 2017, APFS reemplazó a HFS+ como sistema de archivos predeterminado en macOS, iOS, watchOS y tvOS. Está optimizado para dispositivos de estado sólido (SSD) y ofrece características modernas orientadas a rendimiento, seguridad y eficiencia de espacio.

- Límites de tamaño:
  - Tamaño máximo de archivo: 8 exbibytes.
  - Número máximo de archivos: más de 9 quintillones (prácticamente ilimitado).
- Seguridad: Cifrado integrado a nivel de archivo (opcional: sin cifrar, cifrado único, cifrado multi-clave para datos y metadatos). Los permisos siguen el modelo POSIX de Unix.
- Tolerancia a fallos: Usa una estructura de copia-en-escritura (copy-on-write), lo que garantiza que las actualizaciones sean atómicas: nunca se sobrescribe un bloque existente hasta que el nuevo esté completamente escrito. Esto elimina la necesidad de journaling tradicional y mejora la integridad.
- Otros: Soporta instantáneas (copias inmutables del estado del sistema), clones eficientes de archivos (sin duplicar datos), y espacio compartido entre volúmenes en el mismo contenedor.
- Uso típico: Macs con SSD, iPhones, iPads y cualquier dispositivo Apple moderno.

## FAT32 (File Allocation Table 32)

FAT32 es un sistema de archivos antiguo pero ampliamente compatible, desarrollado por Microsoft en los años 90. Aunque obsoleto para discos internos, sigue siendo común en dispositivos portátiles debido a su soporte universal.

- Límites de tamaño:
  - Tamaño máximo de archivo: 4 gigabytes (límite crítico).
  - Tamaño máximo de volumen: 2 terabytes (aunque algunas implementaciones lo limitan a 32 GB).
- Seguridad: No soporta permisos, cifrado ni metadatos avanzados. Cualquier usuario puede modificar o borrar cualquier archivo.
- Tolerancia a fallos: No tiene journaling. Tras un fallo, requiere herramientas como chkdsk para reparar inconsistencias, lo que puede llevar a pérdida de datos.
- Otros: Estructura simple, muy ligera en recursos, ideal para dispositivos con poca memoria (como cámaras o reproductores antiguos).
- Uso típico: Unidades USB, tarjetas SD, dispositivos embebidos y cualquier escenario donde la compatibilidad con múltiples sistemas (Windows, macOS, Linux, consolas, TVs) es prioritaria sobre funcionalidad avanzada.

Comparación resumida

| Sistema | Máx. archivo | Journaling   | Cifrado   | Permisos   | Compatibilidad                                        |
| ------- | ------------ | ------------ | --------- | ---------- | ----------------------------------------------------- |
| NTFS    | 16 EB        | Sí           | Sí (EFS)  | ACLs       | Excelente en Windows; limitada en otros               |
| ext4    | 16 TiB       | Sí           | No nativo | POSIX/ACLs | Nativo en Linux; lectura en macOS/Windows con drivers |
| APFS    | 8 EB         | No (usa CoW) | Sí        | POSIX      | Solo en ecosistema Apple                              |
| FAT32   | 4 GB         | No           | No        | No         | Amplia compatibilidad, pero muy limitado              |

## Quédate con...

- NTFS es robusto, seguro y potente, ideal para entornos Windows profesionales.
- ext4 es el estándar en Linux: equilibrado, fiable y con buen rendimiento en discos grandes.
- APFS está optimizado para SSD y dispositivos Apple, con enfoque en integridad, cifrado y eficiencia de espacio.
- FAT32 sacrifica funcionalidad por compatibilidad universal, pero sus límites (especialmente los 4 GB por archivo) lo hacen inadecuado para usos modernos intensivos.
- La elección del sistema de archivos debe basarse en el sistema operativo, el tipo de dispositivo, los requisitos de seguridad y la necesidad de interoperabilidad.

<div class="pagination">
  <a href="/markdown/sistemas/software/gestion/archivos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/software/gestion/directorios" class="next">Siguiente</a>
</div>
