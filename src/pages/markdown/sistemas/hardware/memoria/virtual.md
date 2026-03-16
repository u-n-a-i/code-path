---
title: "Memoria virtual y paging"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Memoria virtual y paging](#memoria-virtual-y-paging)
  - [Memoria virtual](#memoria-virtual)
  - [Paging](#paging)
  - [Cómo el sistema operativo gestiona el espacio de memoria usando el almacenamiento (archivo de paginación)](#cómo-el-sistema-operativo-gestiona-el-espacio-de-memoria-usando-el-almacenamiento-archivo-de-paginación)
  - [Funcionamiento](#funcionamiento)
  - [Tamaño y rendimiento](#tamaño-y-rendimiento)
  - [Gestión avanzada](#gestión-avanzada)
  - [Quédate con...](#quédate-con)

</div>

# Memoria virtual y paging

La memoria virtual es una abstracción fundamental proporcionada por el sistema operativo que permite a cada proceso creer que tiene acceso a un bloque continuo, privado y potencialmente enorme de memoria, incluso cuando la RAM física disponible es limitada. Esta ilusión no solo simplifica la programación —al eliminar la necesidad de gestionar direcciones físicas—, sino que también mejora la seguridad (aislamiento entre procesos) y la eficiencia (compartición de librerías). El mecanismo clave detrás de la memoria virtual es el paging (paginación), una técnica que divide la memoria en bloques fijos y los intercambia entre RAM y almacenamiento secundario según sea necesario. Para un desarrollador, comprender este sistema es esencial para diagnosticar problemas de rendimiento, optimizar el uso de memoria y entender los límites reales de las aplicaciones.

## Memoria virtual

La memoria virtual separa las direcciones virtuales usadas por los programas de las direcciones físicas en la RAM. Cada proceso opera en su propio espacio de direcciones virtuales, que el sistema operativo y la MMU (Memory Management Unit, integrada en la CPU) traducen a direcciones físicas en tiempo real.

Ventajas clave:

- Aislamiento: un proceso no puede acceder a la memoria de otro, mejorando la seguridad y estabilidad.
- Simplificación: los programadores no necesitan saber dónde está físicamente su código o datos.
- Memoria ilimitada (en teoría): un proceso puede usar más memoria de la que hay físicamente, gracias al respaldo en disco.
- Compartición eficiente: librerías comunes (como libc) se cargan una vez en RAM y se mapean en múltiples procesos.

Sin memoria virtual, los sistemas modernos de multitarea serían impracticables.

## Paging

El paging es el mecanismo que implementa la memoria virtual. Divide tanto el espacio de direcciones virtuales como la memoria física en páginas de tamaño fijo (típicamente 4 KB en x86/x86-64, aunque existen páginas grandes de 2 MB o 1 GB para cargas específicas).

Cuando un proceso accede a una dirección virtual:

1. La CPU consulta la tabla de páginas (gestionada por el SO) para ver si esa página está en RAM.
1. Si está (page hit), la MMU traduce la dirección virtual a física y continúa.
1. Si no está (page fault), el sistema operativo:
   - Encuentra una página libre en RAM (o libera una existente escribiéndola en disco).
   - Carga la página desde el almacenamiento secundario (archivo de paginación).
   - Actualiza la tabla de páginas.
   - Reanuda la ejecución.

Este proceso es transparente para la aplicación, pero tiene un costo de rendimiento significativo: un page fault que requiere acceso a disco puede tardar millones de ciclos frente a un acceso directo a RAM.

## Cómo el sistema operativo gestiona el espacio de memoria usando el almacenamiento (archivo de paginación)

Cuando la RAM se llena, el sistema operativo utiliza el almacenamiento secundario (SSD o HDD) como una extensión lenta de la memoria principal. Este espacio se conoce como:

- Archivo de paginación (pagefile.sys en Windows).
- Espacio de intercambio (swap space en Linux/macOS).

## Funcionamiento

- El SO reserva un área en el disco (archivo o partición dedicada).
- Las páginas menos utilizadas ("least recently used") se intercambian (swapped out) a este espacio cuando la RAM está bajo presión.
- Si un proceso accede a una página que fue intercambiada, se trae de vuelta a RAM (swapped in).

## Tamaño y rendimiento

- Tamaño recomendado: en sistemas con poca RAM (<16 GB), el espacio de intercambio suele ser 1–2× la RAM; en sistemas con mucha RAM, puede ser menor o incluso omitido (para cargas puramente en RAM, como bases de datos).
- Impacto en rendimiento: acceder a una página en disco es 100.000–1.000.000 veces más lento que en RAM. Un sistema que swapea constantemente sufre de "thrashing": pasa más tiempo moviendo datos que ejecutando código.
- SSD vs. HDD: un SSD reduce drásticamente la penalización de swapping, pero aún así es mucho más lento que la RAM. Además, el swapping frecuente acelera el desgaste del SSD.

## Gestión avanzada

- Overcommit (Linux): permite asignar más memoria virtual de la que hay físicamente + swap, asumiendo que no toda se usará (comportamiento común en servidores).
- Memory compression (macOS, Windows 10+, Linux con zswap): comprime páginas en RAM antes de enviarlas a disco, reduciendo el swapping.
- Huge pages: usan páginas de 2 MB o 1 GB para cargas con grandes bloques de memoria (bases de datos, VMs), reduciendo la sobrecarga de la MMU.

> Aunque la memoria virtual permite usar más memoria de la disponible físicamente, no es un sustituto de la RAM. Aplicaciones que requieren bajo retardo (juegos, sistemas en tiempo real, IA en producción) deben diseñarse para caber completamente en RAM. El swapping debe verse como un mecanismo de respaldo para cargas ocasionales, no como parte del flujo normal.

## Quédate con...

- La memoria virtual da a cada proceso su propio espacio de direcciones, aislado y aparentemente ilimitado.
- El paging divide la memoria en páginas fijas (4 KB) y las intercambia entre RAM y disco según la demanda.
- El archivo de paginación (o swap) en el almacenamiento actúa como extensión lenta de la RAM cuando esta se llena.
- Un page fault que requiere disco es extremadamente costoso; evitar el thrashing es clave para el rendimiento.
- Los SSD mitigan, pero no eliminan, el costo del swapping; la mejor estrategia es tener suficiente RAM para la carga de trabajo.
- Como desarrollador, diseña tus aplicaciones para usar memoria de forma eficiente: evita fugas, reutiliza buffers y considera el tamaño de trabajo real frente a la RAM disponible.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/memoria/rom" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/memoria/ecc" class="next">Siguiente</a>
</div>
