---
title: "Puertos de salida de video"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Puertos de salida de video](#puertos-de-salida-de-video)
  - [HDMI](#hdmi)
  - [DisplayPort](#displayport)
  - [DVI](#dvi)
  - [VGA](#vga)
  - [Comparación resumen: capacidades clave](#comparación-resumen-capacidades-clave)
  - [Quédate con...](#quédate-con)

</div>

# Puertos de salida de video

Los puertos de salida de video son las interfaces físicas y lógicas que permiten a una computadora transmitir señales visuales a monitores, proyectores o televisores. Aunque su función parece simple —mostrar una imagen—, cada estándar tiene características técnicas distintas en cuanto a resolución máxima, tasa de refresco, profundidad de color, soporte para audio y capacidades avanzadas como HDR o FreeSync/G-Sync.

## HDMI

HDMI (High-Definition Multimedia Interface) es el estándar más común en televisores, monitores y dispositivos de consumo. Transmite señal digital de video y audio en un solo cable.

Versiones clave y capacidades:

- HDMI 1.4 (2009): soporta hasta 4K a 30 Hz, 3D, audio multicanal. Ancho de banda: 10.2 Gbps.
- HDMI 2.0 (2013): soporta 4K a 60 Hz, HDR estático, hasta 32 canales de audio. Ancho de banda: 18 Gbps.
- HDMI 2.1 (2017): soporta 4K a 120 Hz, 8K a 60 Hz, 10K, HDR dinámico (Dolby Vision), VRR (Variable Refresh Rate), ALLM (Auto Low Latency Mode). Ancho de banda: 48 Gbps (con cable Ultra High Speed).

HDMI es ideal para entornos de entretenimiento y monitores mainstream, pero su especificación es propietaria (requiere licencia), lo que limita su adopción en hardware de código abierto.

## DisplayPort

DisplayPort es un estándar abierto desarrollado por el Video Electronics Standards Association (VESA), ampliamente adoptado en monitores de ordenador, estaciones de trabajo y laptops.

Versiones clave y capacidades:

- DisplayPort 1.2 (2010): soporta 4K a 60 Hz, daisy-chaining (conectar múltiples monitores en serie), audio. Ancho de banda: 17.28 Gbps.
- DisplayPort 1.4 (2016): soporta 4K a 120 Hz, 8K a 30 Hz, DSC (Display Stream Compression, sin pérdida perceptible), HDR. Ancho de banda: 25.92 Gbps (con DSC, mucho más efectivo).
- DisplayPort 2.0 (2019): soporta 8K a 60 Hz sin compresión, 16K a 60 Hz con DSC, hasta 4 monitores 4K a 144 Hz. Ancho de banda: 77.37 Gbps.

DisplayPort destaca por su flexibilidad: soporta múltiples monitores desde un solo puerto, tiene mejor compatibilidad con formatos de color profesionales (10-bit, 12-bit) y es el estándar preferido en entornos de diseño, ingeniería y desarrollo gráfico.

## DVI

DVI (Digital Visual Interface) fue popular en la década de 2000 como puente entre el analógico y el digital. Existen tres variantes:

- DVI-A: solo analógico (equivalente a VGA).
- DVI-D: solo digital.
- DVI-I: combina ambos.
- Capacidades:
  - Máximo 1920×1200 a 60 Hz (con enlace simple).
  - Con enlace dual (DVI-DL), hasta 2560×1600 a 60 Hz.
  - Sin soporte para audio ni HDR.
  - Ancho de banda máximo: ~9.9 Gbps (dual-link).

Aunque aún presente en algunos monitores y GPUs antiguas, DVI está en desuso. No soporta 4K ni tasas de refresco altas, y carece de funciones modernas.

## VGA

VGA (Video Graphics Array) es un estándar analógico introducido por IBM en 1987. Usa una señal de voltaje variable para representar la intensidad de color.

Capacidades:

- Resolución máxima práctica: 1920×1080 a 60 Hz (con cables de alta calidad y distancias cortas).
- Sin audio, sin HDR, sin protección contra copia.
- Sujeto a ruido, interferencias y degradación de señal con la distancia.

VGA ha sido abandonado por hardware nuevo, pero persiste en proyectores antiguos, sistemas industriales o aulas universitarias. Su uso hoy es un indicador de hardware heredado.

## Comparación resumen: capacidades clave

| Puerto          | Máxima resolución (típica) | Tasa de refresco máxima | Audio integrado | HDR | Estado actual                       |
| --------------- | -------------------------- | ----------------------- | --------------- | --- | ----------------------------------- |
| VGA             | 1080p                      | 60 Hz                   | No              | No  | Obsoleto                            |
| DVI             | 2560×1600                  | 60 Hz                   | No              | No  | En desuso                           |
| HDMI 2.1        | 8K                         | 120 Hz (4K), 60 Hz (8K) | Sí              | Sí  | Activo, dominante en consumo        |
| DisplayPort 2.0 | 16K (con DSC)              | 240 Hz (4K)             | Sí              | Sí  | Activo, preferido en PC/profesional |

> La versión real que soporta tu sistema depende tanto de la GPU como del monitor y del cable. Por ejemplo, un puerto HDMI 2.1 físico no garantiza 48 Gbps si el cable no es "Ultra High Speed" o si el monitor solo soporta HDMI 2.0. Siempre verifica las especificaciones completas de los tres elementos

## Quédate con...

- VGA y DVI son estándares heredados, sin audio ni soporte para 4K/HDR; evítalos en nuevos diseños.
- HDMI domina en televisores y dispositivos de consumo; HDMI 2.1 es esencial para 4K/120 Hz y gaming de próxima generación.
- DisplayPort es el estándar profesional en PC: superior en resolución, tasas de refresco, múltiples monitores y compresión eficiente (DSC).
- El cable y el monitor limitan tanto como la GPU: un puerto HDMI 2.1 no sirve si el cable es de versión 1.4.
- Como desarrollador, si tu aplicación requiere alta fidelidad visual, múltiples pantallas o tasas de refresco altas, prioriza sistemas con DisplayPort o HDMI 2.0+.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/gpu/tipos" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
