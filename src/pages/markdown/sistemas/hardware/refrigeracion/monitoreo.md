---
title: "Monitoreo térmico"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Monitoreo térmico](#monitoreo-térmico)
  - [Monitoreo térmico](#monitoreo-térmico-1)
  - [Sensores de temperatura](#sensores-de-temperatura)
  - [Software de control (HWMonitor, etc.)](#software-de-control-hwmonitor-etc)
    - [HWInfo (recomendado)](#hwinfo-recomendado)
    - [Open Hardware Monitor](#open-hardware-monitor)
    - [Core Temp / Ryzen Master / Intel XTU](#core-temp--ryzen-master--intel-xtu)
    - [GPU-Z / MSI Afterburner](#gpu-z--msi-afterburner)
    - [SpeedFan (en desuso)](#speedfan-en-desuso)
  - [Quédate con...](#quédate-con)

</div>

# Monitoreo térmico

El monitoreo térmico es la práctica de supervisar en tiempo real las temperaturas de los componentes críticos de un sistema —CPU, GPU, VRM, SSD, etc.— para garantizar que operen dentro de sus límites térmicos seguros. En un entorno de desarrollo donde las cargas pueden ser sostenidas al 100% durante horas (compilación, entrenamiento de modelos, simulaciones), el monitoreo térmico no es una herramienta opcional, sino una línea de defensa esencial contra el thermal throttling, la inestabilidad del sistema y la degradación prematura del hardware. Comprender cómo funcionan los sensores de temperatura y qué software utilizar permite detectar problemas antes de que afecten tu productividad o dañen tu equipo.

## Monitoreo térmico

El objetivo del monitoreo térmico es anticipar y prevenir:

- Caídas de rendimiento por throttling.
- Reinicios inesperados por protección térmica.
- Daño acumulativo por operación crónica a altas temperaturas.

Este monitoreo se basa en sensores integrados en los chips y en el software que los lee e interpreta.

## Sensores de temperatura

Los componentes modernos incluyen múltiples sensores térmicos integrados en el silicio:

- CPU:
  - Tdie (AMD) / Core Temperatures (Intel): temperatura real del die.
  - Tctl (AMD): valor compensado usado para control de ventiladores; puede no reflejar la temperatura real.
  - Tjunction (Intel): temperatura máxima permitida antes del throttling (por ejemplo, 100 °C).
- GPU:
  - GPU Hot Spot: punto más caliente del die (puede ser 20–30 °C más que la temperatura promedio).
  - VRAM Junction: temperatura de la memoria GDDR6/X (crítica en GPUs modernas).
  - VRM: en GPUs de gama alta, sensores en los reguladores de voltaje.
- Placa base:
  - VRM MOSFETs: temperatura de los transistores del regulador de voltaje.
  - Chipset: especialmente relevante en placas con chipset caliente (como algunos X570).
- SSD NVMe:
  - Muchos incluyen sensores SMART accesibles vía software.
  - Temperaturas >70 °C pueden activar throttling de rendimiento.

> No todos los sensores son expuestos al sistema operativo. Algunos requieren drivers específicos o firmware actualizado para ser visibles.

## Software de control (HWMonitor, etc.)

Existen varias herramientas gratuitas y profesionales para monitorear temperaturas, voltajes, velocidades de ventiladores y estados de throttling:

### HWInfo (recomendado)

- Ventajas:
  - Muestra todos los sensores disponibles, incluyendo Tdie, Hot Spot, VRM, SSD.
  - Indica explícitamente si hay thermal throttling activo.
  - Modo de sensores (en segundo plano) y modo de resumen.
  - Compatible con casi todos los fabricantes.
- Uso ideal: diagnóstico técnico, monitoreo en profundidad.

### Open Hardware Monitor

- Ventajas:
  - Código abierto, ligero, sin publicidad.
  - Muestra temperaturas, RPM de ventiladores, carga de CPU/GPU.
- Desventajas:
  - Menos sensores expuestos que HWInfo.
  - Interfaz menos intuitiva.
- Uso ideal: monitoreo básico en servidores o sistemas minimalistas.

### Core Temp / Ryzen Master / Intel XTU

- Especializados:
  - Core Temp: excelente para CPUs Intel, muestra temperatura por núcleo.
  - Ryzen Master: para AMD, con control de overclocking.
  - Intel XTU: para Intel, con ajustes de rendimiento y monitoreo.
- Uso ideal: usuarios que ajustan manualmente el rendimiento de su CPU.

### GPU-Z / MSI Afterburner

- Enfoque en GPU:
  - Muestran temperatura de GPU, VRAM, Hot Spot, uso de memoria, clocks.
  - Afterburner incluye on-screen display para juegos o benchmarks.
- Uso ideal: monitoreo de rendimiento gráfico, overclocking de GPU.

### SpeedFan (en desuso)

Aunque fue popular, ya no se actualiza y tiene problemas de compatibilidad con hardware moderno. No se recomienda.

Consejo práctico:

- Ejecuta HWInfo en modo sensores durante una carga sostenida (ej.: stress --cpu 16 o entrenamiento de modelo).
- Observa si aparece "Thermal Throttling: Yes" o temperaturas cercanas al límite (90–95 °C en CPU, 100–110 °C en GPU Hot Spot/VRAM).
- Si el VRM supera 100 °C o el SSD NVMe >80 °C, considera mejorar el flujo de aire o añadir disipadores.

## Quédate con...

- El monitoreo térmico es esencial para mantener el rendimiento sostenido y la estabilidad en cargas intensivas.
- HWInfo es la herramienta más completa y fiable para ver todos los sensores, incluyendo throttling activo.
- No confíes solo en la temperatura promedio: el Hot Spot (GPU) y Tdie (CPU) son más representativos del riesgo térmico.
- VRM, SSD NVMe y VRAM tienen sensores propios; monitóralos si usas cargas prolongadas.
- Si ves throttling o temperaturas >90 °C en CPU/GPU, revisa tu refrigeración y flujo de aire antes de culpar al hardware.
- Como desarrollador, integrar el monitoreo térmico en tus pruebas de estrés te ayuda a garantizar que tu software no solo es funcional, sino también térmicamente responsable.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/refrigeracion/flujo" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
