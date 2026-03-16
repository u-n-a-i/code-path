---
title: "Buses externos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Buses externos](#buses-externos)
  - [Interfaz USB](#interfaz-usb)
  - [Tipos de conectores (A, B, C)](#tipos-de-conectores-a-b-c)
  - [Estándares (USB 2.0, 3.x, 4)](#estándares-usb-20-3x-4)
  - [Transferencia de datos](#transferencia-de-datos)
  - [Thunderbolt](#thunderbolt)
  - [SATA](#sata)
  - [Quédate con...](#quédate-con)

</div>

# Buses externos

Los buses externos son las interfaces que conectan la computadora con dispositivos periféricos: discos externos, monitores, teclados, cámaras, docks y más. A diferencia de los buses internos —optimizados para máximo ancho de banda y baja latencia—, los buses externos priorizan versatilidad, compatibilidad y facilidad de uso. Sin embargo, su rendimiento varía drásticamente según el estándar: desde los modestos 480 Mbps del USB 2.0 hasta los impresionantes 40 Gbps de Thunderbolt 3/4.

## Interfaz USB

El USB (Universal Serial Bus) es el estándar de conectividad externa más extendido del mundo. Su éxito radica en su simplicidad, compatibilidad hacia atrás y capacidad para entregar energía junto con datos.

## Tipos de conectores (A, B, C)

- USB-A: el conector rectangular tradicional, presente en casi todos los PCs durante décadas. Solo encaja en una dirección.
- USB-B: cuadrado con esquinas biseladas, usado en impresoras, escáneres y algunos discos duros externos.
- USB-C: conector reversible, compacto y simétrico. Diseñado para reemplazar a todos los anteriores. Soporta USB 2.0, USB 3.x, USB4, Thunderbolt 3/4, DisplayPort y hasta 240 W de alimentación (con USB PD 3.1).

> No todos los puertos USB-C son iguales. Un puerto puede soportar solo USB 2.0 (¡a pesar del conector moderno!) o hasta USB4 + Thunderbolt. Siempre verifica las especificaciones del sistema.

## Estándares (USB 2.0, 3.x, 4)

| Estándar                | Velocidad máxima    | Color típico (interior) | Características clave                                          |
| ----------------------- | ------------------- | ----------------------- | -------------------------------------------------------------- |
| USB 2.0                 | 480 Mbps (60 MB/s)  | Negro o blanco          | Suficiente para teclados, ratones, audio.                      |
| USB 3.2 Gen 1 (USB 3.0) | 5 Gbps (625 MB/s)   | Azul                    | Ideal para SSDs SATA externos.                                 |
| USB 3.2 Gen 2           | 10 Gbps (1.25 GB/s) | Rojo o azul oscuro      | Soporta SSDs NVMe en cajas compatibles.                        |
| USB 3.2 Gen 2x2         | 20 Gbps (2.5 GB/s)  | —                       | Usa dos carriles; raro en hardware de consumo.                 |
| USB4                    | 20 o 40 Gbps        | —                       | Basado en Thunderbolt 3; soporta DisplayPort y PCIe tunneling. |

USB4 (y USB 3.2 Gen 2x2) requieren cables certificados para alcanzar su máxima velocidad; los cables baratos suelen limitarse a 10 Gbps.

## Transferencia de datos

USB usa un modelo maestro-esclavo: la computadora (host) controla toda la comunicación. Los datos se transfieren en paquetes, con protocolos que varían según la versión:

- USB 2.0: half-duplex (no puede enviar y recibir a la vez a máxima velocidad).
- USB 3.x y USB4: full-duplex (envío y recepción simultáneos).

El ancho de banda real es ~70–80% del teórico por sobrecarga de protocolo. Por ejemplo, un SSD externo en USB 3.2 Gen 2 rara vez supera 1.000 MB/s, aunque el estándar prometa 1.250 MB/s.

## Thunderbolt

Thunderbolt, desarrollado originalmente por Intel en colaboración con Apple, es un estándar de alto rendimiento que combina PCIe y DisplayPort en un solo cable, usando el conector USB-C.

- Thunderbolt 3 y 4:
  - 40 Gbps de ancho de banda full-duplex.
  - Soporta hasta dos monitores 4K o uno 8K.
  - Puede alimentar dispositivos con hasta 100 W.
  - Permite daisy-chaining (hasta 6 dispositivos en cadena).
  - Tunneling de PCIe: permite usar discos NVMe externos a velocidades cercanas a las internas (~2.800–3.000 MB/s).
- Thunderbolt 4: añade requisitos mínimos (como soporte para 2 monitores y PCIe a 32 Gbps), pero mantiene la misma velocidad que TB3.

> USB4 y Thunderbolt 4 son compatibles, pero no idénticos. Todos los puertos Thunderbolt 4 son USB4, pero no todos los USB4 son Thunderbolt. Busca el símbolo del rayo (⚡) para confirmar soporte Thunderbolt.

Thunderbolt es ideal para:

- Estaciones de acoplamiento profesionales.
- Discos NVMe externos de alto rendimiento.
- Captura de video 4K/8K en tiempo real.
- GPUs externas (eGPU), aunque con penalización de rendimiento frente a PCIe interno.

## SATA

Aunque SATA es principalmente un bus interno para HDDs y SSDs, también se usa en almacenamiento externo mediante adaptadores o cajas de disco.

- SATA III: 6 Gbps (≈600 MB/s teóricos, ~550 MB/s reales).
- Conector externo: generalmente USB-A o USB-C en la caja, pero el cuello de botella es SATA, no USB.
- Uso típico: discos duros externos y SSDs SATA externos.

> Un SSD NVMe colocado en una caja SATA externa estará limitado a 550 MB/s, desperdiciando su potencial. Para aprovechar un NVMe externo, se necesita una caja USB 3.2 Gen 2 (10 Gbps) o Thunderbolt.

SATA externo es económico y suficiente para respaldos o almacenamiento secuencial, pero inadecuado para cargas intensivas (edición de video, bases de datos externas).

## Quédate con...

- USB-C no implica alta velocidad: puede ser solo USB 2.0. Verifica el estándar (USB 3.2, USB4) y la presencia del símbolo de rayo (Thunderbolt).
- USB 3.2 Gen 2 (10 Gbps) es suficiente para SSDs SATA externos; USB4/Thunderbolt es necesario para NVMe externos a máxima velocidad.
- Thunderbolt 3/4 ofrece el más alto rendimiento externo (40 Gbps), con soporte para video, PCIe y alimentación.
- SATA externo está limitado a ~550 MB/s, independientemente del conector USB usado.
- Como desarrollador, si usas discos externos para compilación, bases de datos o datasets, elige Thunderbolt o USB 3.2 Gen 2+, y evita cuellos de botella por interfaces lentas.
- La versatilidad de USB-C es una bendición, pero exige atención a las especificaciones reales, no solo al conector físico.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/conexiones/internos" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
