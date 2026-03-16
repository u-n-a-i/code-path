---
title: "RAID: Redundancia y rendimiento"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [RAID: Redundancia y rendimiento](#raid-redundancia-y-rendimiento)
  - [RAID 0, 1, 5, 10](#raid-0-1-5-10)
    - [RAID 0 (Striping)](#raid-0-striping)
    - [RAID 1 (Mirroring)](#raid-1-mirroring)
    - [RAID 5 (Striping con paridad distribuida)](#raid-5-striping-con-paridad-distribuida)
    - [RAID 10 (1+0: Mirroring + Striping)](#raid-10-10-mirroring--striping)
  - [Implementación por hardware](#implementación-por-hardware)
  - [Implementación por software](#implementación-por-software)
  - [Quédate con...](#quédate-con)

</div>

# RAID: Redundancia y rendimiento

RAID (Redundant Array of Independent Disks) es una tecnología que combina múltiples unidades de almacenamiento en un único sistema lógico para mejorar el rendimiento, la capacidad o la fiabilidad —o una combinación de estos—. Aunque surgió en entornos empresariales, RAID hoy está al alcance de cualquier usuario avanzado o desarrollador que necesite mayor velocidad para compilación, mayor seguridad para bases de datos o mayor capacidad para almacenamiento de medios. Comprender los niveles RAID más comunes y las diferencias entre implementaciones por hardware y software permite diseñar soluciones de almacenamiento adaptadas a necesidades específicas, sin sobreinvertir ni comprometer la integridad de los datos.

## RAID 0, 1, 5, 10

Los niveles RAID definen cómo se distribuyen los datos entre los discos. Los más utilizados son:

### RAID 0 (Striping)

- Funcionamiento: los datos se dividen en bloques (stripes) y se distribuyen secuencialmente entre dos o más discos.
- Ventajas:
  - Rendimiento máximo: lectura y escritura se aceleran casi linealmente con el número de discos.
  - Capacidad total: suma de todas las unidades (2×1 TB = 2 TB).
- Desventajas:
  - Cero redundancia: si falla un disco, se pierden todos los datos.
  - Mayor riesgo: la probabilidad de fallo es la suma de los fallos individuales.
- Uso: edición de video, cachés temporales, cargas de trabajo no críticas donde la velocidad es prioritaria.

### RAID 1 (Mirroring)

- Funcionamiento: los datos se duplican (espejan) en dos o más discos idénticos.
- Ventajas:
  - Alta disponibilidad: si un disco falla, el sistema sigue funcionando con el otro.
  - Lectura rápida: se pueden leer datos desde ambos discos simultáneamente.
- Desventajas:
  - Costo de capacidad: solo se usa el 50% de la capacidad total (2×1 TB = 1 TB útil).
  - Escritura ligeramente más lenta: cada escritura se realiza en todos los discos.
- Uso: servidores críticos, estaciones de desarrollo con código fuente valioso, sistemas donde la integridad es prioritaria.

### RAID 5 (Striping con paridad distribuida)

- Funcionamiento: los datos y la información de paridad se distribuyen entre tres o más discos. La paridad permite reconstruir los datos si un disco falla.
- Ventajas:
  - Buena relación capacidad/seguridad: con 3 discos, se pierde 1/3 de la capacidad; con 4, 1/4, etc.
  - Rendimiento de lectura alto: similar a RAID 0.
- Desventajas:
  - Escritura más lenta: cada escritura requiere actualizar la paridad.
  - Riesgo durante reconstrucción: al reemplazar un disco fallido, la presión sobre los discos restantes puede causar un segundo fallo (especialmente con HDDs de gran capacidad).
  - Mínimo 3 discos.
- Uso: servidores de archivos, NAS domésticos/profesionales, entornos con presupuesto limitado pero necesidad de redundancia.

### RAID 10 (1+0: Mirroring + Striping)

- Funcionamiento: combina RAID 1 y RAID 0. Requiere mínimo 4 discos: dos pares en espejo, y los pares en striping.
- Ventajas:
  - Alto rendimiento: tanto en lectura como en escritura.
  - Alta tolerancia a fallos: puede soportar el fallo de un disco en cada par (hasta la mitad de los discos, si no son del mismo par).
  - Reconstrucción rápida: no hay cálculo de paridad; se copia del disco espejo.
- Desventajas:
  - Costo de capacidad: 50% de pérdida (4×1 TB = 2 TB útiles).
  - Mínimo 4 discos, idealmente en múltiplos pares.
- Uso: bases de datos, servidores de aplicaciones, entornos de alto rendimiento donde la fiabilidad es crítica.

> RAID no sustituye a las copias de seguridad. Protege contra fallos de disco, pero no contra errores humanos, malware, incendios o fallos simultáneos de múltiples discos. Siempre mantén copias fuera del RAID.

## Implementación por hardware

El RAID por hardware usa un controlador dedicado (en la placa base o en una tarjeta PCIe) con su propio procesador, memoria caché y batería (BBU, Battery Backup Unit) para gestionar el array.

- Ventajas:
  - Cero carga en la CPU: ideal para servidores con múltiples tareas.
  - Rendimiento consistente: caché y BBU aceleran escrituras y protegen datos en cortes de energía.
  - Transparencia total para el SO: el sistema ve el RAID como un solo disco.
- Desventajas:
  - Costo elevado: los controladores profesionales (como los de Dell PERC o HP Smart Array) son caros.
  - Riesgo de vendor lock-in: si el controlador falla, puede ser difícil recuperar los datos sin uno idéntico.
  - "Fake RAID": muchos "controladores RAID" en placas de consumo son en realidad solo drivers de firmware que delegan el trabajo al SO (más cerca del software que del hardware real).

> Solo considera RAID por hardware verdadero en servidores críticos; evita el "Fake RAID" de placas de escritorio.

## Implementación por software

El RAID por software es gestionado directamente por el sistema operativo (Linux mdadm, Windows Storage Spaces, ZFS, etc.).

- Ventajas:
  - Costo cero: no requiere hardware adicional.
  - Portabilidad: los discos pueden moverse a otra máquina con el mismo SO y recuperar el array.
  - Flexibilidad: soporte para niveles avanzados (RAID-Z en ZFS), integración con sistemas de archivos modernos.
- Desventajas:
  - Carga en la CPU: mínima en RAID 1/0, pero notable en RAID 5/6 con cifrado o compresión.
  - Dependencia del SO: no arrancará si el sistema operativo falla (a menos que uses initramfs adecuado, como en Linux).
  - Menor rendimiento en escritura sin caché dedicado.

> En sistemas modernos con CPUs potentes, el RAID por software (especialmente con SSDs) suele ser tan rápido o más que el "Fake RAID" de hardware, y mucho más flexible. Proyectos como ZFS o Btrfs integran RAID, checksums y copias de seguridad en una sola capa, superando las capacidades del RAID tradicional.

## Quédate con...

- RAID 0: máximo rendimiento, cero seguridad.
- RAID 1: espejo simple, ideal para fiabilidad.
- RAID 5: equilibrio con paridad, pero riesgoso en reconstrucción.
- RAID 10: lo mejor de ambos mundos (rendimiento + redundancia), pero con costo de capacidad.
- RAID no es copia de seguridad: protege contra fallos de disco, no contra pérdida lógica de datos.
- RAID por hardware verdadero es caro pero eficiente; "Fake RAID" debe evitarse.
- RAID por software es flexible, gratuito y suficiente para la mayoría de los casos modernos, especialmente con SSDs.
- Como desarrollador o administrador, evalúa si realmente necesitas RAID: para muchos usos, un SSD NVMe rápido + copias de seguridad es más simple y seguro que un array RAID complejo.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/almacenamiento/optico" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
