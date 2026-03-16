---
title: "Controladoras de almacenamiento"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Controladoras de almacenamiento](#controladoras-de-almacenamiento)
  - [Tarjetas RAID dedicadas (HBA)](#tarjetas-raid-dedicadas-hba)
    - [HBA (Host Bus Adapter)](#hba-host-bus-adapter)
    - [Tarjetas RAID dedicadas (con procesador y caché)](#tarjetas-raid-dedicadas-con-procesador-y-caché)
  - [Expansión de puertos SATA/SAS](#expansión-de-puertos-satasas)
    - [SATA vs. SAS](#sata-vs-sas)
  - [Conectores y backplanes](#conectores-y-backplanes)
  - [Qué queda con...](#qué-queda-con)

</div>

# Controladoras de almacenamiento

Las controladoras de almacenamiento son tarjetas de expansión o chips integrados que gestionan la conexión, el rendimiento y, en algunos casos, la redundancia de los dispositivos de almacenamiento (HDDs, SSDs, unidades SAS/NVMe). Aunque muchas placas base incluyen puertos SATA y soporte RAID por software, las controladoras dedicadas —especialmente las HBA (Host Bus Adapters) y las tarjetas RAID hardware— ofrecen capacidades avanzadas esenciales en entornos profesionales: servidores, NAS, estaciones de trabajo con múltiples discos o sistemas de backup a gran escala. Para un desarrollador que trabaja con grandes volúmenes de datos, bases de datos locales o infraestructura de laboratorio, entender la diferencia entre una HBA y una controladora RAID, y cuándo usar cada una, es clave para construir sistemas de almacenamiento eficientes, escalables y fiables.

## Tarjetas RAID dedicadas (HBA)

Es importante distinguir dos tipos de controladoras:

### HBA (Host Bus Adapter)

- Función: actúa como un puente transparente entre los dispositivos de almacenamiento y el sistema operativo. No aplica RAID; expone cada disco individualmente al SO.
- Ventajas:
  - Máximo rendimiento y flexibilidad: el SO gestiona el almacenamiento directamente (ideal para ZFS, Btrfs, LVM, o software RAID).
  - Bajo overhead: sin procesamiento de paridad ni caché que pueda fallar.
  - Compatibilidad universal: funciona con cualquier sistema de archivos o gestor de volúmenes.
- Uso típico:
  - Servidores ZFS (donde el RAID se gestiona en el sistema de archivos).
  - Entornos de virtualización (VMware, Proxmox) que requieren discos passthrough.
  - Recuperación forense o clonación de discos.

Ejemplos: LSI/Broadcom 9207-8i, 9300-8i, 9400-16i en modo IT (Initiator Target).

### Tarjetas RAID dedicadas (con procesador y caché)

- Función: implementan RAID por hardware, con un procesador dedicado (RAID on Chip, ROC), memoria caché (a menudo con batería o supercondensador) y firmware propio.
- Ventajas:
  - Cero carga en la CPU: ideal para servidores antiguos o con recursos limitados.
  - Caché de escritura protegida: con BBU (Battery Backup Unit) o Flash-Protected Write Cache, permite acelerar escrituras sin riesgo de pérdida de datos en cortes de energía.
  - Gestión avanzada: utilidades de monitorización, reconstrucción en caliente, alertas por S.M.A.R.T.
- Desventajas:
  - Vendor lock-in: si la tarjeta falla, puede ser difícil recuperar los datos sin una idéntica.
  - Menor flexibilidad: el array RAID es opaco al SO; no se puede usar con ZFS u otros sistemas que requieren acceso directo al disco.
- Uso típico:
  - Servidores empresariales con Windows Server o RHEL que usan RAID 5/6/10.
  - Entornos donde no se usan sistemas de archivos modernos con checksum y corrección integrada.

Ejemplos: Dell PERC H740P, HP Smart Array P440ar, Broadcom MegaRAID 9460-16i.

> Muchas “tarjetas RAID” de bajo costo en el mercado son en realidad fake RAID: usan drivers de software y delegan el trabajo a la CPU, ofreciendo los peores de ambos mundos (sin beneficios de hardware, con la complejidad del RAID). Evítalas; busca controladoras con procesador dedicado y caché con protección.

## Expansión de puertos SATA/SAS

Las controladoras también se usan para superar el límite de puertos de la placa base:

- Placas de consumo: suelen ofrecer 4–8 puertos SATA.
- Controladoras PCIe: pueden añadir 8, 16 o más puertos adicionales.

### SATA vs. SAS

- SATA: estándar para discos de consumo (HDDs, SSDs).
- SAS (Serial Attached SCSI): estándar empresarial, con:
  - Mayor fiabilidad y durabilidad.
  - Soporte para dual-port (conexión redundante).
  - Compatibilidad hacia atrás con SATA (un puerto SAS puede aceptar un disco SATA, pero no al revés).

Las controladoras profesionales (como las de Broadcom/LSI) suelen ser SAS/SATA, permitiendo mezclar discos empresariales y de consumo en el mismo sistema.

## Conectores y backplanes

- SFF-8643 / SFF-8087: conectores internos de alta densidad que conectan la tarjeta a un backplane (placa trasera de una caja NAS/servidor), permitiendo gestionar 4–8 discos con un solo cable.
- Mini-SAS HD: versión moderna con mayor densidad y velocidad (hasta 12 Gb/s por enlace).

Esto es esencial en servidores de 2U/4U con 12–24 bahías de disco.

> Una bahía de disco es un compartimento estandarizado dentro del chasis de una computadora (o servidor NAS) diseñado para alojar unidades de almacenamiento como discos duros (HDD/SSD) o unidades ópticas (CD/DVD), facilitando su instalación, reemplazo y actualización, y existen diferentes tamaños (3.5", 2.5", 5.25") y ubicaciones (internas, externas, hot-swap) para distintos tipos de dispositivos de almacenamiento y conectividad.

## Qué queda con...

- Las HBA exponen discos individualmente al SO; son ideales para software RAID moderno (ZFS, Btrfs, mdadm).
- Las tarjetas RAID por hardware son útiles en entornos legacy o con CPUs débiles, pero evita las “fake RAID”.
- La expansión de puertos SATA/SAS permite construir sistemas con decenas de discos, esenciales en servidores y NAS.
- SAS es el estándar empresarial; SATA el de consumo, pero las controladoras SAS suelen aceptar ambos.
- Broadcom (ex-LSI) es el fabricante de referencia en controladoras profesionales; sus chips están en la mayoría de servidores Dell, HP y Lenovo.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/tarjetas/red" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/tarjetas/capturadora" class="next">Siguiente</a>
</div>
