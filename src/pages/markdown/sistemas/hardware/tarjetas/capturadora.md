---
title: "Tarjetas de captura de video"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Tarjetas de captura de video](#tarjetas-de-captura-de-video)
  - [Capturadoras de video](#capturadoras-de-video)
  - [Uso para streaming y grabación](#uso-para-streaming-y-grabación)
  - [Internas](#internas)
  - [Externas](#externas)
  - [Quédate con...](#quédate-con)

</div>

# Tarjetas de captura de video

Las tarjetas de captura de video son dispositivos especializados que permiten recibir, digitalizar y procesar señales de video en tiempo real desde fuentes externas, como consolas, cámaras, drones o incluso otra computadora. A diferencia de la grabación de pantalla por software (como OBS con captura de escritorio), las tarjetas de captura operan de forma independiente de la CPU y GPU del sistema anfitrión, lo que garantiza baja latencia, mínima carga del sistema y compatibilidad con fuentes que usan DRM (como HDMI de consolas). Para creadores de contenido, desarrolladores de aplicaciones de visión por computadora o ingenieros que trabajan con señales de video en tiempo real, elegir entre una solución interna o externa —y entender sus capacidades— es fundamental para lograr un flujo de trabajo estable y de alta calidad.

## Capturadoras de video

Una tarjeta de captura convierte una señal de video analógica o digital (HDMI, DisplayPort, SDI, component, composite) en un flujo de datos digitales que puede ser:

- Grabado en disco como archivo de video (MP4, MOV, etc.).
- Transmitido en vivo a plataformas como Twitch o YouTube.
- Procesado en tiempo real por software de visión artificial, realidad aumentada o análisis de movimiento.

Las capturadoras modernas suelen soportar video sin compresión o con códec ligero (como H.264/H.265 en hardware), lo que preserva la calidad original y reduce la carga en la CPU.

## Uso para streaming y grabación

Las tarjetas de captura son esenciales en escenarios donde el software de captura no es suficiente:

- Streaming de consolas: las consolas aplican HDCP (protección contra copia) a su salida HDMI, lo que impide la captura por software. Las tarjetas de captura pueden ignorar HDCP (según región y modelo) o trabajar con fuentes que lo desactivan.
- Doble PC para streaming: un PC de juego y un PC de transmisión, conectados por HDMI → tarjeta de captura. Esto aísla la carga del streaming del rendimiento del juego.
- Grabación profesional: cineastas, educadores o investigadores que necesitan grabar señales de cámaras de alta resolución (1080p60, 4K30) sin pérdida de calidad.
- Visión por computadora: para alimentar flujos de video en tiempo real a algoritmos de detección, seguimiento o análisis.

> El video se procesa en la tarjeta, no en la CPU/GPU del sistema anfitrión. Esto libera recursos para otras tareas (como entrenar un modelo de IA mientras se transmite).

## Internas

Las tarjetas de captura internas se instalan en una ranura PCIe x1, x4 o x16 de la placa base.

- Ventajas:
  - Mayor ancho de banda: PCIe permite captura sin compresión o con códec eficiente.
  - Menor latencia: conexión directa al chipset/CPU.
  - Alimentación estable: sin necesidad de fuentes externas.
  - Múltiples entradas: modelos profesionales (como los de Blackmagic o Magewell) ofrecen entradas HDMI + SDI simultáneas.
- Desventajas:
  - Solo para PCs de escritorio.
  - Requiere espacio y ranura libre.
  - Mayor costo inicial.
- Ejemplos:
  - Elgato 4K60 Pro MK.2: captura 4K60 HDR, ideal para streamers y creadores.
  - Blackmagic Intensity Pro 4K: entradas HDMI y SDI, soporte para software profesional (DaVinci Resolve, OBS).
  - AverMedia Live Gamer 4K: soporte para HDR y passthrough HDMI sin recompresión.

> Las tarjetas internas suelen incluir passthrough HDMI, lo que permite enviar la señal original a un monitor sin retraso.

## Externas

Las capturadoras externas se conectan al sistema vía USB 3.0/3.2 o Thunderbolt.

- Ventajas:
  - Portabilidad: ideales para streamers móviles, YouTubers o uso en laptops.
  - Fácil instalación: plug-and-play, sin abrir el gabinete.
  - Compatibilidad multiplataforma: Windows, macOS, incluso Linux (con drivers adecuados).
- Desventajas:
  - Ancho de banda limitado: USB 3.0 (~5 Gbps) obliga a usar compresión H.264/H.265 en la tarjeta, lo que puede reducir calidad o flexibilidad en postproducción.
  - Latencia ligeramente mayor que las internas (aunque en modelos buenos es imperceptible).
  - Requieren alimentación USB-C o adaptador externo en modelos de alta resolución.
- Ejemplos:
  - Elgato Cam Link 4K: para cámaras DSLR/mirrorless, ideal para videoconferencias profesionales.
  - AverMedia Live Gamer Mini: compacta, USB 3.2, captura 1080p60.
  - Razer Ripsaw HD: diseño gamer, con passthrough y bajo retardo.

> Si usas una capturadora externa para streaming en 1080p60, asegúrate de que tu puerto USB sea 3.0 o superior y que uses un cable de calidad. Un cable USB 2.0 limitará el rendimiento drásticamente.

## Quédate con...

- Las tarjetas de captura permiten grabar o transmitir video de fuentes externas sin depender de la CPU/GPU y burlar restricciones de HDCP.
- Internas (PCIe): mayor calidad, menor latencia, ideal para estaciones fijas de streaming o producción profesional.
- Externas (USB/Thunderbolt): portabilidad y facilidad de uso, perfectas para laptops, streamers móviles o creadores de contenido en movimiento.
- Para doble PC de streaming, una capturadora interna en el PC de transmisión es la configuración óptima.
- En desarrollo de visión por computadora o análisis de video, una capturadora de baja latencia y sin compresión es esencial para la precisión temporal.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/tarjetas/controladores" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/tarjetas/instalaciones" class="next">Siguiente</a>
</div>
