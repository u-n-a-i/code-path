---
title: "Instalación y configuración"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Instalación y configuración](#instalación-y-configuración)
  - [Consideraciones físicas](#consideraciones-físicas)
  - [Instalación de drivers](#instalación-de-drivers)
  - [Gestión en el sistema operativo](#gestión-en-el-sistema-operativo)
    - [Windows](#windows)
    - [Linux](#linux)
    - [Configuración de rendimiento](#configuración-de-rendimiento)
    - [Actualizaciones y mantenimiento](#actualizaciones-y-mantenimiento)
  - [Quédate con...](#quédate-con)

</div>

# Instalación y configuración

La instalación y configuración de componentes de hardware —ya sean internos como tarjetas PCIe, o externos como periféricos USB— va más allá de simplemente encajarlos en sus ranuras o puertos. Implica una combinación de consideraciones físicas, gestión de controladores (drivers) y configuración en el sistema operativo para garantizar que el dispositivo funcione de forma estable, segura y al máximo de su potencial. Para un desarrollador que personaliza su estación de trabajo, integra aceleradores especializados o mantiene servidores locales, dominar este proceso evita horas de depuración, conflictos de recursos y problemas de rendimiento ocultos.

## Consideraciones físicas

Antes de encender el sistema, la instalación física debe cumplir varios requisitos:

- Compatibilidad mecánica:
  - Verifica que la tarjeta quepa en el gabinete (longitud, altura) y no bloquee ranuras PCIe adyacentes o disipadores de VRM.
  - Asegúrate de que el conector (PCIe x1, x4, x16) coincida con el slot disponible eléctrica y físicamente (un slot x16 mecánico puede ser solo x4 eléctrico).
- Alimentación adecuada:
  - Algunas tarjetas (como capturadoras de gama alta o HBAs con múltiples puertos) requieren conectores PCIe de 6/8 pines.
  - Las tarjetas USB/Thunderbolt de alta densidad pueden superar el límite de potencia del slot PCIe (75 W); verifica si necesitan alimentación externa.
- Disipación térmica:
  - Evita instalar tarjetas generadoras de calor (como controladoras RAID con caché activa) justo debajo de la GPU, donde el flujo de aire es pobre.
  - En servidores densos, asegúrate de que los disipadores no obstruyan el flujo de aire a otros componentes.
- Conectividad y cableado:
  - Usa cables de calidad para conexiones internas (SAS, SATA, USB headers).
  - En tarjetas con puertos traseros, instala la placa de soporte (bracket) firmemente para evitar tensiones en los conectores.

Antes de cerrar el gabinete, enciende el sistema en modo "bench test" (fuera de la caja) para verificar que la tarjeta es detectada y no hay cortocircuitos.

## Instalación de drivers

Los drivers son el puente entre el hardware y el sistema operativo. Sin ellos, el dispositivo puede no funcionar, operar en modo básico o causar inestabilidad.

- Sistemas modernos (Windows 10/11, Linux reciente, macOS):
  - Detectan e instalan automáticamente drivers genéricos para muchos dispositivos (especialmente USB y PCIe estándar).
  - Sin embargo, estos drivers genéricos suelen faltar funciones avanzadas o tener rendimiento subóptimo.
- Drivers del fabricante:
  Siempre descárgalos desde el sitio web oficial del fabricante de la tarjeta (no de terceros).
  - En Windows, evita los drivers ofrecidos por Windows Update si el fabricante tiene una versión más reciente.
  - En Linux, verifica si el controlador está en el kernel principal (mejor soporte a largo plazo) o si requiere módulos DKMS (como NVIDIA o algunos chips Wi-Fi).
- Escenarios críticos:
  - Tarjetas RAID/HBA: requieren drivers específicos durante la instalación del SO para que los discos sean visibles.
  - Tarjetas de red profesionales: los drivers de Intel o Broadcom en Linux ofrecen mejor rendimiento y estabilidad que los genéricos.
  - Tarjetas de sonido o captura: suelen incluir software de control que depende de drivers firmemente emparejados.

> Nunca instales drivers obsoletos o diseñados para otro sistema operativo: pueden causar pantallazos azules, fallos de kernel o conflictos con otros dispositivos.

## Gestión en el sistema operativo

Una vez instalado el hardware y los drivers, el sistema operativo debe reconocer y gestionar el dispositivo correctamente:

### Windows

- Usa el Administrador de dispositivos para verificar que no haya signos de advertencia.
- En Herramientas de administración → Servicios, asegúrate de que servicios relacionados (como "Windows Audio" para tarjetas de sonido) estén activos.
- Para tarjetas de red o almacenamiento, usa Administración de discos o PowerShell para asignar unidades o configurar interfaces.

### Linux

- Usa lspci, lsusb, dmesg y journalctl para verificar la detección del hardware.
- Para almacenamiento, lsblk y fdisk -l muestran discos visibles.
- Los módulos del kernel se cargan automáticamente, pero puedes forzarlos con modprobe.
- Herramientas como ip (red), alsamixer (audio) o nvme-cli (SSDs) permiten configuración avanzada.

### Configuración de rendimiento

- En tarjetas de red, activa offload de TCP, jumbo frames o RSS (Receive Side Scaling) si el uso de CPU es alto.
- En tarjetas de sonido, ajusta la latencia del buffer en el DAW para equilibrar rendimiento y estabilidad.
- En controladoras RAID, configura el write cache policy (si tiene BBU) para maximizar el rendimiento sin riesgo.

### Actualizaciones y mantenimiento

- Mantén los drivers actualizados, especialmente en tarjetas de red, GPU y almacenamiento.
- En servidores, programa revisiones periódicas del estado de los discos (SMART) y la temperatura de los controladores.

> En entornos de desarrollo o producción, documenta la versión exacta de los drivers y del firmware. Esto permite reproducir configuraciones y acelerar la resolución de problemas.

## Quédate con...

- La instalación física debe considerar espacio, alimentación, refrigeración y compatibilidad eléctrica, no solo encajar la tarjeta.
- Los drivers del fabricante son casi siempre superiores a los genéricos del sistema operativo; instálalos siempre que estén disponibles.
- La gestión en el SO incluye verificación de detección, configuración de parámetros avanzados y monitoreo continuo.
- En Linux, las herramientas de línea de comandos (lspci, dmesg, ip) son esenciales para diagnóstico.
- Nunca asumas que "si enciende, funciona": un dispositivo mal configurado puede operar de forma ineficiente o inestable sin errores visibles.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/tarjetas/capturadora" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
