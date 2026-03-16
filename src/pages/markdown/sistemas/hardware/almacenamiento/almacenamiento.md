---
title: "Concepto de almacenamiento"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Concepto de almacenamiento](#concepto-de-almacenamiento)
  - [Almacenamiento y persistencia](#almacenamiento-y-persistencia)
  - [Evolución del almacenamiento](#evolución-del-almacenamiento)
  - [Velocidad](#velocidad)
  - [Capacidad](#capacidad)
  - [Velocidad vs capacidad](#velocidad-vs-capacidad)
  - [Quédate con...](#quédate-con)

</div>

# Concepto de almacenamiento

El almacenamiento en un sistema informático se refiere a los dispositivos y tecnologías que permiten guardar datos de forma persistente, es decir, que permanecen disponibles incluso después de apagar el equipo. A diferencia de la memoria volátil (RAM), cuyo contenido se pierde al cortar la energía, el almacenamiento es la base sobre la que se construyen sistemas operativos, aplicaciones, bases de datos y archivos personales. Comprender el concepto de almacenamiento —su evolución, sus compromisos entre velocidad y capacidad, y sus implicaciones para el rendimiento del software— es esencial para cualquier desarrollador, ya que influye directamente en la experiencia del usuario, la eficiencia de las operaciones de E/S y la arquitectura de las aplicaciones modernas.

## Almacenamiento y persistencia

La persistencia es la propiedad clave del almacenamiento: garantiza que los datos sobrevivan a reinicios, fallos de energía o actualizaciones del sistema. Esta característica permite que un documento, una base de datos o un sistema operativo esté disponible cada vez que se inicia la computadora. Sin almacenamiento persistente, cada ejecución de un programa comenzaría desde cero, sin acceso a estados anteriores ni a configuraciones guardadas.

Los sistemas operativos gestionan el almacenamiento mediante sistemas de archivos (NTFS, ext4, APFS, etc.), que organizan los datos en estructuras lógicas (archivos, carpetas, metadatos) y traducen las operaciones de alto nivel (leer/crear un archivo) en accesos físicos al dispositivo de almacenamiento.

## Evolución del almacenamiento

El almacenamiento ha evolucionado desde dispositivos mecánicos lentos hasta memorias de estado sólido ultrarrápidas, pasando por varias generaciones de innovación:

- Tarjetas perforadas y cintas magnéticas (1950s–1970s): bajo costo por byte, pero acceso secuencial lento; usadas principalmente para respaldos.
- Discos duros (HDD) (1956 en adelante): introdujeron el acceso aleatorio mediante cabezales móviles y platos giratorios. Dominaron durante décadas por su alta capacidad y bajo costo.
- Unidades de estado sólido (SSD) (2000s–presente): usan memoria flash NAND sin partes móviles, ofreciendo tiempos de acceso miles de veces más rápidos que los HDD.
- NVMe sobre PCIe (2010s–presente): protocolo diseñado específicamente para SSDs, que aprovecha el ancho de banda del bus PCIe (frente al antiguo SATA), alcanzando velocidades de varios GB/s.
- Storage Class Memory (SCM): tecnologías emergentes como Intel Optane (ahora discontinuado) o CXL-attached memory buscan cerrar la brecha entre RAM y almacenamiento, ofreciendo persistencia con latencias cercanas a la DRAM.

Esta evolución ha transformado no solo la velocidad de arranque de los sistemas, sino también la forma en que se diseñan las aplicaciones: hoy es factible mantener grandes bases de datos enteras en SSDs, algo impensable con HDDs.

## Velocidad

La velocidad del almacenamiento se mide en varios aspectos:

- Latencia: tiempo entre una solicitud de lectura/escritura y su cumplimiento.
  - HDD: ~10 ms (milisegundos).
  - SATA SSD: ~0.1 ms.
  - NVMe SSD: ~0.01–0.05 ms.
- Ancho de banda: cantidad de datos transferidos por segundo.
  - HDD: 100–200 MB/s.
  - SATA SSD: ~550 MB/s (límite del bus SATA III).
  - NVMe PCIe 4.0: 5.000–7.000 MB/s.
  - NVMe PCIe 5.0: hasta 14.000 MB/s.
- IOPS (Input/Output Operations Per Second): operaciones aleatorias por segundo. Crítico para bases de datos.
  - HDD: 50–200 IOPS.
  - NVMe SSD: 500.000–2.000.000+ IOPS.

La velocidad determina qué tipo de carga de trabajo puede soportar un dispositivo: los HDDs son adecuados para almacenamiento secuencial (video, respaldos); los NVMe, para cargas aleatorias intensivas (bases de datos, compilación, IA).

## Capacidad

La capacidad se refiere a la cantidad total de datos que puede almacenar un dispositivo. Ha crecido exponencialmente:

- HDDs: desde 5 MB (IBM 350, 1956) hasta 22–30 TB (2025).
- SSDs: desde 64 MB (1990s) hasta 100 TB+ en unidades empresariales (aunque en consumo típico: 500 GB–8 TB).

El costo por gigabyte sigue siendo mucho menor en HDDs (~$0.02/GB) que en SSDs (~$0.05–0.10/GB para NVMe), lo que los mantiene relevantes para almacenamiento masivo frío.

## Velocidad vs capacidad

Existe un compromiso fundamental entre velocidad, capacidad y costo:

- Alta velocidad + baja capacidad: NVMe PCIe 5.0, ideal para sistema operativo, aplicaciones críticas, cachés.
- Baja velocidad + alta capacidad: HDDs, ideales para archivos multimedia, respaldos, datos archivados.
- Equilibrio: SSDs SATA o NVMe de gama media, usados en la mayoría de PCs modernos.

Los sistemas bien diseñados estratifican el almacenamiento:

- Capa caliente: NVMe para datos accedidos frecuentemente.
- Capa fría: HDD o SSD económico para datos históricos.
- Caché: RAM o SSD rápido para acelerar accesos repetidos.

Como desarrollador, puedes aprovechar esta estratificación: coloca bases de datos activas en NVMe, archivos estáticos en HDD, y usa técnicas como prefetching o buffering para mitigar la latencia del almacenamiento más lento.

> La velocidad del almacenamiento ya no es solo un problema de hardware; afecta directamente al diseño del software. Un algoritmo que minimiza operaciones de E/S o agrupa accesos secuenciales puede ser órdenes de magnitud más rápido en un NVMe que en un HDD, incluso si la lógica es idéntica.

## Quédate con...

- El almacenamiento proporciona persistencia: los datos sobreviven al apagado del sistema.
- Ha evolucionado de cintas y HDDs mecánicos a SSDs NVMe ultrarrápidos, transformando el rendimiento del software.
- La velocidad se mide en latencia, ancho de banda e IOPS; la capacidad en terabytes, con HDDs aún dominando en costo por GB.
- Existe un triángulo de compromiso: velocidad ↔ capacidad ↔ costo; los sistemas profesionales usan múltiples capas para equilibrarlos.
- Como desarrollador, diseña tus aplicaciones para minimizar E/S aleatoria y aprovecha la estratificación del almacenamiento en tu arquitectura.
- El almacenamiento ya no es un "disco lento": en sistemas modernos, puede ser tan crítico para el rendimiento como la CPU o la RAM.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/almacenamiento/hdd" class="next">Siguiente</a>
</div>
