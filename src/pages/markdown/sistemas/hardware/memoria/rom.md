---
title: "Memoria de solo lectura (ROM)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Memoria de solo lectura (ROM)](#memoria-de-solo-lectura-rom)
  - [Tipos de ROM (PROM, EPROM, Flash)](#tipos-de-rom-prom-eprom-flash)
  - [Su uso en el firmware (BIOS/UEFI)](#su-uso-en-el-firmware-biosuefi)
  - [Quédate con...](#quédate-con)

</div>

# Memoria de solo lectura (ROM)

La memoria de solo lectura (ROM, por sus siglas en inglés) es un tipo de almacenamiento no volátil diseñado para conservar datos de forma permanente, incluso sin energía eléctrica. A diferencia de la RAM, cuyo contenido es temporal y modificable, la ROM almacena información crítica que el sistema debe tener disponible desde el primer instante de encendido. Aunque el nombre sugiere que su contenido es inmutable, las tecnologías modernas de ROM permiten, en distintos grados, su reprogramación. Hoy, la ROM es esencial para el firmware de una computadora —especialmente el BIOS/UEFI— y su evolución ha permitido que el software de bajo nivel sea actualizable, seguro y flexible.

## Tipos de ROM (PROM, EPROM, Flash)

A lo largo del tiempo, la ROM ha evolucionado desde chips programados de forma irreversible hasta memorias reescribibles millones de veces:

- ROM clásica: programada durante la fabricación; su contenido es permanente e inalterable. Usada en sistemas embebidos simples o consolas antiguas (como el NES).
- PROM (Programmable ROM): puede programarse una sola vez por el usuario mediante un dispositivo externo (grabador de PROM). Útil para prototipos o producción en pequeña escala, pero inflexible.
- EPROM (Erasable PROM): se programa como la PROM, pero puede borrarse con luz ultravioleta (a través de una ventana de cuarzo en el encapsulado) y reprogramarse. Aunque revolucionaria en los años 70–80, su proceso de borrado es lento e incómodo.
- EEPROM (Electrically Erasable PROM): permite borrar y reescribir su contenido eléctricamente, byte por byte, sin retirar el chip del sistema. Mucho más práctico, pero lento para grandes volúmenes de datos.
- Flash: una evolución de la EEPROM que borra y escribe en bloques, no byte por byte. Es más rápida, densa y económica. Existen dos tipos principales:
  - NOR Flash: permite acceso aleatorio rápido; ideal para ejecutar código directamente (como el firmware UEFI).
  - NAND Flash: mayor densidad y menor costo; usada en SSDs y memorias USB, pero no para ejecución directa.

Hoy, la Flash NOR es el estándar para el firmware en placas base modernas, reemplazando por completo a EPROM y EEPROM en este rol.

## Su uso en el firmware (BIOS/UEFI)

El chip de ROM en la placa base almacena el firmware de arranque: inicialmente el BIOS (Basic Input/Output System), y hoy el UEFI (Unified Extensible Firmware Interface). Este software se ejecuta antes de que cargue cualquier sistema operativo y es responsable de:

- Inicializar y probar el hardware (POST).
- Detectar dispositivos de arranque.
- Cargar el bootloader del sistema operativo.
- Proporcionar una interfaz de configuración (UEFI Setup).

Gracias a que el firmware reside en memoria Flash, puede actualizarse sin reemplazar el chip físico. Las placas modernas incluyen:

- BIOS/UEFI dual: dos copias del firmware para recuperación ante fallos.
- Funciones de actualización sin SO: como ASUS USB BIOS Flashback o Gigabyte Q-Flash Plus, que permiten actualizar el firmware incluso sin CPU o RAM instalada.
- Protección contra malware: tecnologías como Intel Boot Guard o AMD Hardware Validated Boot verifican la integridad del firmware antes de ejecutarlo.

Además, el chip de Flash suele incluir espacio para:

- Claves de Secure Boot.
- Registros de eventos de seguridad (TPM de firmware).
- Microcontroladores embebidos (como el Intel Management Engine o AMD PSP).

> Aunque llamamos coloquialmente a este chip “ROM”, técnicamente es Flash NOR, una forma de ROM reescribible. El término “ROM” persiste por tradición, ya que, desde la perspectiva del sistema en ejecución normal, el contenido es de solo lectura.

## Quédate con...

- La ROM almacena datos no volátiles, esenciales para el arranque y la inicialización del sistema.
- Ha evolucionado de ROM fija → PROM → EPROM → EEPROM → Flash (hoy estándar).
- El firmware (BIOS/UEFI) reside en un chip de Flash NOR, que permite actualizaciones seguras y recuperación ante fallos.
- Las tecnologías modernas (Secure Boot, TPM, Boot Guard) dependen de la ROM para establecer una raíz de confianza desde el encendido.
- Aunque el chip es reescribible, durante la operación normal del sistema se comporta como solo lectura, protegiendo el firmware de modificaciones accidentales o maliciosas.
- Como desarrollador, entender que el firmware vive en ROM/Flash te ayuda a apreciar por qué las actualizaciones de UEFI son críticas para la compatibilidad y la seguridad del hardware.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/memoria/modulos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/memoria/virtual" class="next">Siguiente</a>
</div>
