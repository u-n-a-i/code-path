---
title: "Zócalos y ranuras"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Zócalos y ranuras](#zócalos-y-ranuras)
  - [Socket de CPU](#socket-de-cpu)
  - [Tipos de sockets para CPU](#tipos-de-sockets-para-cpu)
  - [Compatibilidad con generaciones de procesadores](#compatibilidad-con-generaciones-de-procesadores)
  - [Ranuras RAM, PCIe, M.2, SATA…](#ranuras-ram-pcie-m2-sata)
  - [Ranuras de expansión (visión general)](#ranuras-de-expansión-visión-general)
  - [Mecanismos de sujeción](#mecanismos-de-sujeción)
  - [Quédate con...](#quédate-con)

</div>

# Zócalos y ranuras

Los zócalos y ranuras de una placa base son los puntos físicos y eléctricos de conexión entre los componentes modulares del sistema y la placa misma. Estos elementos determinan qué tipos de CPU, memoria, tarjetas gráficas, discos y otros periféricos pueden instalarse, y cómo se comunican con el resto del hardware. Aunque pueden parecer detalles puramente mecánicos, su diseño tiene implicaciones profundas en la compatibilidad, el rendimiento y la vida útil de un sistema. Para un desarrollador que trabaja con hardware personalizado, virtualización, o incluso con optimización de bajo nivel, entender estos conectores permite anticipar limitaciones de plataforma, planificar actualizaciones futuras y diagnosticar problemas de integración.

## Socket de CPU

El socket de CPU (zócalo de procesador) es la interfaz física y eléctrica que conecta el procesador con la placa base. Proporciona alimentación, comunicación con la memoria y los buses, y una vía para disipar el calor (mediante el contacto con el disipador). Su diseño incluye cientos o miles de pines (en Intel) o contactos (en AMD), cada uno con una función específica: datos, direcciones, reloj, voltaje, señales de control, etc.

El socket no es intercambiable entre marcas ni, en muchos casos, entre generaciones. Un error común es asumir que cualquier CPU “Intel” sirve en cualquier placa Intel; en realidad, cada generación suele requerir un socket específico, lo que condiciona la capacidad de actualización.

## Tipos de sockets para CPU

Los principales fabricantes, Intel y AMD, han desarrollado múltiples tipos de socket a lo largo del tiempo:

- Intel:
  - LGA (Land Grid Array): los pines están en la placa, no en la CPU. Ejemplos recientes:
    - LGA 1700: usado en procesadores Intel de 12.ª, 13.ª y 14.ª generación (Alder Lake, Raptor Lake).
    - LGA 1200: para las generaciones 10 y 11 (Comet Lake, Rocket Lake).
    - Anteriores: LGA 1151, LGA 2066 (HEDT), etc.
- AMD:
  - PGA (Pin Grid Array): los pines están en la CPU. Ejemplos recientes:
    - AM5: para Ryzen 7000 y posteriores, con soporte para DDR5 y PCIe 5.0.
    - AM4: uno de los sockets más longevos (2016–2022), compatible con Ryzen 1000 a 5000, y con memorias DDR4.
    - Anteriores: AM3+, FM2+, TR4 (Threadripper), etc.

Cada socket define no solo la forma física, sino también las señales eléctricas, voltajes y protocolos de comunicación soportados.

## Compatibilidad con generaciones de procesadores

La compatibilidad no es automática dentro de un mismo socket, especialmente en Intel:

AMD ha sido más consistente: el socket AM4 soportó cinco generaciones de CPU (Zen a Zen 3) con actualizaciones de BIOS. El AM5 está diseñado para durar varias generaciones.

Intel, en cambio, suele cambiar de socket con cada nueva arquitectura o nodo de fabricación. Aunque LGA 1700 soporta tres generaciones (12.ª a 14.ª), esto es una excepción reciente, no la norma.

Además, incluso con el mismo socket, el chipset de la placa puede limitar la compatibilidad. Por ejemplo, una placa con chipset B660 (Intel) admite CPUs de 12.ª y 13.ª generación, pero no soporta overclocking, mientras que una Z790 sí lo hace. En AMD, una placa B550 con BIOS actualizada puede ejecutar un Ryzen 5000, pero una A520 más básica podría no admitirlo sin actualización previa.

Esto implica que, al construir o actualizar un sistema, se debe verificar tanto el socket como el chipset y la versión de BIOS.

## Ranuras RAM, PCIe, M.2, SATA…

Además del socket de CPU, la placa base incluye múltiples ranuras y conectores para otros componentes esenciales:

Ranuras DIMM (RAM):

- Suelen ser de color negro o blanco, y están dispuestas en pares para habilitar el modo dual channel.
- El tipo (DDR4, DDR5) y la velocidad máxima dependen del chipset y la CPU.
- La mayoría de placas de escritorio tienen 2 o 4 ranuras, aunque las E-ATX pueden tener más.

Ranuras PCIe (Peripheral Component Interconnect Express):

- Conectan tarjetas gráficas, de red, de sonido, captura, etc.
- Se identifican por su tamaño físico (x1, x4, x8, x16) y por su generación (3.0, 4.0, 5.0), que define el ancho de banda por línea.
- La ranura x16 más cercana a la CPU suele estar conectada directamente a ella; las demás suelen depender del chipset.

Conectores M.2:

- Ranuras pequeñas y soldadas directamente a la placa, para SSDs ultrarrápidos.
- Pueden usar interfaz SATA o NVMe (sobre PCIe), y soportar distintas generaciones (PCIe 3.0, 4.0, 5.0).
- Algunos conectores M.2 están conectados a la CPU (más rápidos), otros al chipset (más lentos si hay congestión de E/S).

Conectores SATA:

- Puertos en el borde de la placa para discos duros y SSDs SATA.
- Su número y velocidad (6 Gb/s en SATA III) dependen del chipset.
- En sistemas con múltiples SSDs NVMe, algunos puertos SATA pueden desactivarse por limitaciones de líneas PCIe.

## Ranuras de expansión (visión general)

Las ranuras de expansión permiten añadir funcionalidad al sistema más allá de lo integrado en la placa. Las más comunes son:

- PCIe x16: para tarjetas gráficas de alto rendimiento o aceleradores (como GPUs para IA).
- PCIe x1/x4: para tarjetas de red (10 GbE, Wi-Fi 6E), controladoras RAID, tarjetas de captura o de E/S industrial.
- Aunque el estándar PCI (no Express) ya está prácticamente obsoleto, aún persiste en sistemas industriales o heredados.

La cantidad y configuración de estas ranuras dependen del form factor y del chipset. Por ejemplo, una placa Mini-ITX suele tener solo una ranura PCIe x16, mientras que una E-ATX puede tener tres o más.

## Mecanismos de sujeción

Cada conector incluye mecanismos para asegurar la estabilidad física y eléctrica del componente:

- CPU: en sockets LGA, una palanca de retención presiona la CPU contra los contactos; en PGA, la CPU se encaja suavemente y luego se cierra una lengüeta metálica o plástica.
- RAM: las lengüetas laterales en las ranuras DIMM se abren al insertar el módulo y “hacen clic” al encajar, asegurándolo firmemente.
- PCIe: una pestaña de retención en el extremo de la ranura (junto al conector) se levanta al insertar la tarjeta y se bloquea al encajarla en el bracket del gabinete.
- M.2: un pequeño tornillo de fijación sujeta el SSD al puerto; algunos diseños incluyen también un soporte térmico con resorte.
- SATA: los conectores usan enganche de fricción, aunque algunos incluyen lengüetas para evitar desconexiones accidentales.

Estos mecanismos no solo evitan que los componentes se salgan por vibración o movimiento, sino que garantizan un contacto eléctrico óptimo, fundamental a altas frecuencias.

> Forzar la inserción de un componente en una ranura incorrecta (por ejemplo, una RAM DDR4 en una ranura DDR3, o un SSD M.2 SATA en un puerto que solo soporta NVMe) puede dañar permanentemente tanto el componente como la placa. Siempre verifica las especificaciones antes de instalar.

## Quédate con...

- El socket de CPU define qué procesadores son compatibles físicamente y eléctricamente con la placa.
- AMD tiende a mantener sockets más tiempo; Intel suele cambiarlos con mayor frecuencia.
- La compatibilidad real depende del socket, chipset y versión de BIOS, no solo del zócalo físico.
- Las ranuras DIMM, PCIe, M.2 y SATA conectan memoria, GPU, almacenamiento y periféricos, y su rendimiento depende de si están conectadas a la CPU o al chipset.
- Los mecanismos de sujeción (palancas, lengüetas, tornillos) garantizan conexión firme y segura; nunca deben forzarse.
- Al diseñar o actualizar un sistema, verifica siempre la compatibilidad cruzada entre CPU, placa, memoria y dispositivos de expansión.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/placa_base/chipset" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/placa_base/bios" class="next">Siguiente</a>
</div>
