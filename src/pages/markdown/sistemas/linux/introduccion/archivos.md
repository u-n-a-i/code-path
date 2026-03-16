---
title: "Sistemas de archivos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Sistemas de archivos](#sistemas-de-archivos)
  - [Ext4](#ext4)
  - [XFS](#xfs)
  - [Btrfs](#btrfs)
  - [Montaje](#montaje)
    - [Mount](#mount)
    - [Fstab](#fstab)
    - [UUID y LABEL](#uuid-y-label)
  - [LVM (Logical Volume Manager)](#lvm-logical-volume-manager)
  - [RAID por software](#raid-por-software)
  - [Snapshots](#snapshots)
  - [Cuotas de disco](#cuotas-de-disco)
  - [Quédate con...](#quédate-con)

</div>

# Sistemas de archivos

El sistema de archivos traduce la secuencia lineal de bloques físicos en un disco hacia una estructura lógica que los usuarios y aplicaciones pueden navegar mediante nombres, directorios y permisos. Esta capa de abstracción no solo organiza la información, sino que garantiza su integridad, controla el acceso concurrente y optimiza el rendimiento de las operaciones de lectura y escritura. Sin un sistema de archivos robusto, el almacenamiento persistente sería un conjunto de direcciones numéricas incomprensibles para el software de aplicación.
Sistemas de archivos
Linux soporta múltiples sistemas de archivos, cada uno diseñado para equilibrar rendimiento, confiabilidad y características avanzadas según el caso de uso. La elección no es trivial: afecta la velocidad de acceso, la tolerancia a fallos y las herramientas disponibles para administración y recuperación.

## Ext4

Ext4 (Fourth Extended Filesystem) es el sistema de archivos predeterminado en la mayoría de las distribuciones Linux orientadas al usuario final y servidores de propósito general. Evolución directa de ext3, introduce mejoras significativas como extents (rangos contiguos de bloques que reducen la fragmentación), asignación retardada (delayed allocation) para optimizar el orden de escritura, y journaling con checksums para proteger la integridad de los metadatos. Soporta volúmenes de hasta 1 exabyte y archivos individuales de hasta 16 terabytes, límites más que suficientes para la gran mayoría de escenarios prácticos. Su madurez y estabilidad lo convierten en la opción segura cuando la prioridad es la compatibilidad y la recuperación predecible tras fallos.

## XFS

XFS, desarrollado originalmente por Silicon Graphics y posteriormente integrado en el kernel de Linux, está optimizado para rendimiento en entornos con archivos de gran tamaño y operaciones de E/S paralelas intensivas. Su arquitectura basada en allocation groups permite que múltiples hilos escriban en diferentes regiones del disco simultáneamente, aprovechando al máximo el ancho de banda de almacenamiento moderno. El journaling de XFS protege únicamente los metadatos, lo que acelera las operaciones pero requiere herramientas adicionales para garantizar la consistencia de los datos de usuario tras cortes de energía. Es la opción predeterminada en RHEL y CentOS para cargas de trabajo empresariales, especialmente en bases de datos y servidores de medios.

## Btrfs

Btrfs (B-tree filesystem) representa un enfoque moderno que integra características tradicionalmente gestionadas por herramientas externas: snapshots nativos, compresión transparente, checksums de datos y metadatos para detección de corrupción silenciosa, y gestión integrada de múltiples dispositivos mediante RAID por software. Su diseño copy-on-write garantiza que las operaciones de escritura nunca sobrescriban datos existentes, facilitando snapshots instantáneos y consistentes. Sin embargo, su complejidad ha ralentizado la estabilización de funciones avanzadas como el RAID 5/6, por lo que su adopción en entornos de producción críticos aún requiere evaluación cuidadosa. Es una apuesta hacia el futuro para quienes necesitan funcionalidades avanzadas sin depender de capas adicionales de software.

> La elección entre sistemas de archivos depende del equilibrio entre madurez y características. Ext4 ofrece estabilidad probada; XFS, rendimiento en cargas pesadas; Btrfs, funcionalidades modernas con un margen de riesgo mayor. Para la mayoría de usuarios, ext4 sigue siendo la recomendación por defecto.

## Montaje

En Linux, el sistema de archivos no se "abre" como en otros sistemas operativos; se monta en un punto del árbol de directorios único. Este mecanismo permite integrar múltiples dispositivos físicos o particiones en una estructura lógica coherente, donde / representa la raíz y cada dispositivo adicional se anexa en un subdirectorio específico.
### Mount

El comando mount asocia temporalmente un dispositivo (por ejemplo, /dev/sda1) con un punto de montaje en el árbol de directorios (por ejemplo, /mnt/datos). La sintaxis básica es mount /dev/sda1 /mnt/datos, aunque en la práctica se suelen especificar opciones como el tipo de sistema de archivos (-t ext4) o permisos de acceso (-o ro para solo lectura). El montaje manual es útil para tareas de administración, recuperación o pruebas, pero no persiste tras un reinicio.

### Fstab

El archivo /etc/fstab (file system table) define los montajes que deben aplicarse automáticamente durante el arranque del sistema. Cada línea especifica el dispositivo, el punto de montaje, el tipo de sistema de archivos, las opciones de montaje, el orden de verificación de integridad (fsck) y la prioridad de montaje. 

Una configuración típica para una partición de datos podría ser: `UUID=a1b2c3d4 /mnt/datos ext4 defaults,noatime 0 2`

El uso de defaults aplica un conjunto razonable de opciones (lectura/escritura, ejecución de binarios, montaje automático), mientras que noatime mejora el rendimiento al evitar actualizar la marca de tiempo de acceso en cada lectura.

### UUID y LABEL

Identificar dispositivos por su nombre (/dev/sda1) es frágil: el orden de detección puede cambiar al añadir hardware o modificar la configuración. UUID (Universally Unique Identifier) y LABEL ofrecen identificadores estables e independientes del orden físico. Un UUID es un código hexadecimal único generado al crear el sistema de archivos; un LABEL es un nombre legible asignado manualmente. Ambos se consultan con blkid y se usan en /etc/fstab para garantizar que el sistema monte siempre el dispositivo correcto, incluso si cambia su nombre de dispositivo.

## LVM (Logical Volume Manager)

LVM introduce una capa de abstracción entre las particiones físicas y los sistemas de archivos, permitiendo gestionar el almacenamiento de forma flexible y dinámica. En lugar de asignar espacio fijo a cada partición, LVM agrupa dispositivos físicos (Physical Volumes) en un pool lógico (Volume Group), del cual se extraen volúmenes lógicos (Logical Volumes) que actúan como particiones virtuales.

Esta arquitectura permite redimensionar volúmenes en caliente, migrar datos entre discos sin interrupción y crear snapshots para copias de seguridad consistentes. Por ejemplo, si /home se queda sin espacio, se puede ampliar añadiendo un nuevo disco al grupo de volúmenes y extendiendo el volumen lógico correspondiente, sin necesidad de reaparticionar o reinstalar el sistema.

> LVM no es un sistema de archivos, sino un administrador de volúmenes. El volumen lógico resultante debe formatearse con un sistema de archivos (ext4, XFS, etc.) antes de poder almacenar datos.

## RAID por software

RAID (Redundant Array of Independent Disks) combina múltiples discos físicos para mejorar el rendimiento, la redundancia o ambos. Linux implementa RAID a nivel de software mediante el módulo md (multiple devices), gestionado con la herramienta mdadm.

Los niveles más comunes son:

- RAID 0: divide los datos entre discos (striping) para aumentar el rendimiento, pero sin redundancia; la falla de un disco implica la pérdida total.
- RAID 1: espeja los datos en dos discos, proporcionando tolerancia a fallos a costa de duplicar el almacenamiento necesario.
- RAID 5: distribuye datos y paridad entre tres o más discos, permitiendo recuperar la información si falla uno solo.
- RAID 10: combina espejo y striping, ofreciendo rendimiento y redundancia, pero requiere al menos cuatro discos.

El RAID por software es flexible y portable entre hardware, pero consume ciclos de CPU para cálculos de paridad. En servidores con cargas intensivas, puede preferirse RAID por hardware dedicado.

## Snapshots

Un snapshot es una instantánea consistente del estado de un sistema de archivos en un momento dado. A diferencia de una copia completa, un snapshot ocupa inicialmente muy poco espacio, ya que solo almacena los bloques que cambian después de su creación (gracias al mecanismo copy-on-write).
En sistemas que lo soportan nativamente (Btrfs, XFS con LVM), los snapshots permiten:
Recuperar archivos eliminados accidentalmente.
Realizar copias de seguridad consistentes sin detener servicios.
Probar actualizaciones o cambios con la posibilidad de revertir rápidamente.
La creación de un snapshot en LVM, por ejemplo, se realiza con lvcreate -s -n snapshot_vol -L 1G /dev/vg0/original, generando un volumen lógico que refleja el estado original en el momento de la captura.

> Los snapshots no son copias de seguridad completas. Si el volumen original se corrompe, el snapshot también puede verse afectado. Úsalos como herramienta de recuperación rápida, no como sustituto de backups externos.

## Cuotas de disco

Las cuotas de disco permiten limitar el espacio de almacenamiento o el número de inodos que un usuario o grupo puede consumir en un sistema de archivos. Esta funcionalidad es esencial en entornos multiusuario para prevenir que un solo usuario agote los recursos compartidos.

La configuración requiere habilitar las cuotas en /etc/fstab con las opciones usrquota y/o grpquota, inicializar las bases de datos con quotacheck, y activarlas con quotaon. La asignación de límites se gestiona con edquota, mientras que quota y repquota permiten consultar el uso actual.

Los límites pueden ser blandos (avisan al usuario al alcanzarlos, pero permiten excederlos temporalmente) o duros (impiden cualquier escritura adicional). Esta distinción ofrece flexibilidad para gestionar picos de uso sin comprometer la estabilidad del sistema.

## Quédate con...

- Los sistemas de archivos (ext4, XFS, Btrfs) organizan y protegen los datos; su elección depende del equilibrio entre madurez, rendimiento y funcionalidades avanzadas.
- El montaje integra dispositivos en el árbol de directorios; usa UUID o LABEL en /etc/fstab para garantizar estabilidad ante cambios de hardware.
- LVM añade flexibilidad al almacenamiento, permitiendo redimensionar y gestionar volúmenes sin reaparticionar discos físicos.
- El RAID por software mejora rendimiento o redundancia mediante combinación de discos; elige el nivel según tus necesidades de velocidad y tolerancia a fallos.
- Los snapshots ofrecen recuperación rápida mediante instantáneas copy-on-write, pero no sustituyen las copias de seguridad externas.
- Las cuotas de disco previenen el agotamiento de recursos en entornos multiusuario mediante límites blandos y duros configurables por usuario o grupo.

<div class="pagination">
  <a href="/markdown/sistemas/linux/introduccion/kernel" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
