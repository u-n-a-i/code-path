---
title: "Tarjetas de red especializadas"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Tarjetas de red especializadas](#tarjetas-de-red-especializadas)
  - [Tarjetas de red](#tarjetas-de-red)
  - [Ethernet](#ethernet)
    - [Gbps (Gigabits por segundo)](#gbps-gigabits-por-segundo)
    - [Ventajas de las NICs Ethernet dedicadas](#ventajas-de-las-nics-ethernet-dedicadas)
  - [Tarjetas Wi-Fi](#tarjetas-wi-fi)
  - [Tarjetas Bluetooth](#tarjetas-bluetooth)
  - [Quédate con...](#quédate-con)

</div>

# Tarjetas de red especializadas

Aunque la mayoría de las placas base modernas incluyen conectividad de red integrada —Ethernet, Wi-Fi y a veces Bluetooth—, existen escenarios en los que esta integración no es suficiente. Las tarjetas de red especializadas ofrecen mayores velocidades, menor latencia, mayor estabilidad, características avanzadas de gestión y compatibilidad con estándares profesionales. Para un desarrollador que trabaja con redes, servidores, virtualización, transferencia de grandes volúmenes de datos o entornos de baja latencia (como trading algorítmico o sistemas distribuidos), estas tarjetas no son un lujo, sino una herramienta esencial para garantizar un rendimiento de red predecible, seguro y eficiente.

## Tarjetas de red

Una tarjeta de red (NIC, Network Interface Card) es un componente que permite a una computadora conectarse a una red. Puede instalarse en una ranura PCIe (x1, x4) o conectarse vía USB (menos común en entornos profesionales). A diferencia de las soluciones integradas, las NICs dedicadas suelen usar controladores de calidad, chips de fabricantes reconocidos (Intel, Broadcom, Aquantia) y firmware optimizado, lo que se traduce en mayor fiabilidad y rendimiento.

## Ethernet

El estándar Ethernet define la velocidad y el tipo de conexión cableada. Las tarjetas especializadas superan ampliamente las capacidades del Ethernet integrado en placas de consumo:

### Gbps (Gigabits por segundo)

- 1 Gbps (Gigabit Ethernet):
  - Estándar en la mayoría de placas base desde ~2010.
  - Suficiente para uso doméstico, oficina y servidores ligeros.
  - Ancho de banda real: ~110–120 MB/s.
- 2.5 Gbps / 5 Gbps:
  - Nuevos estándares para redes domésticas de alta gama y NAS.
  - Requieren routers/switches compatibles.
  - Ideales para transferir datasets grandes o respaldos rápidos en entornos locales.
- 10 Gbps (10 Gigabit Ethernet):
  - Estándar en servidores, estaciones de trabajo profesionales y centros de datos.
  - Velocidad real: ~1.16 GB/s.
  - Usado en:
    - Transferencia de datasets de IA.
    - Virtualización con múltiples máquinas.
    - Render farms y flujos de trabajo colaborativos.
  - Requiere cableado Cat6a/Cat7 y switch 10GbE (aunque existen soluciones como 10GBase-T sobre Cat6 a distancias cortas).
- 25/40/100 Gbps y más:
  - Para centros de datos de alto rendimiento.
  - Generalmente en servidores con múltiples puertos y soporte para SR-IOV, RDMA o tecnologías de virtualización de red.

### Ventajas de las NICs Ethernet dedicadas

- Menor uso de CPU: offload de tareas (TCP checksum, TSO, LRO) mediante hardware.
- Drivers estables y actualizados: especialmente en Linux, los drivers de Intel son de referencia.
- Soporte para VLAN, jumbo frames, bonding (LACP).
- Calidad del chip: un controlador Intel I210 o X550 es más fiable que un Realtek genérico.

> En entornos de desarrollo de redes o pruebas de estrés, una NIC dedicada evita que el tráfico de red sobrecargue la CPU o interfiera con otros subsistemas.

## Tarjetas Wi-Fi

Las tarjetas Wi-Fi dedicadas (generalmente en formato M.2 o PCIe x1 con antenas externas) superan al Wi-Fi integrado en:

- Soporte para estándares recientes: Wi-Fi 6 (802.16) y Wi-Fi 6E/7 (6 GHz), con mayor ancho de banda y menor congestión.
- MIMO espacial: más antenas = mayor throughput y estabilidad (2x2, 4x4).
- Calidad de los componentes: amplificadores de potencia y LNA (Low-Noise Amplifiers) de mayor calidad reducen la pérdida de señal.
- Antenas externas: permiten colocarlas lejos de la interferencia del gabinete (metal, GPU, PSU).

Casos de uso:

- Desarrollo de aplicaciones IoT o móviles que requieren pruebas en redes reales.
- Entornos sin cableado disponible, pero con necesidad de alta velocidad (4K streaming, transferencia inalámbrica de datasets).
- Laboratorios de seguridad inalámbrica (muchas tarjetas soportan modo monitor y inyección de paquetes, a diferencia del Wi-Fi integrado).

> No todas las tarjetas Wi-Fi tienen buen soporte en Linux. Las de Intel suelen ser las más compatibles; las de baja gama a menudo carecen de drivers adecuados.

## Tarjetas Bluetooth

Aunque el Bluetooth suele integrarse junto al Wi-Fi (en módulos M.2 CNVi o PCIe), existen tarjetas USB o PCIe dedicadas para:

- Bluetooth de última generación: 5.0, 5.2, 5.3 con mayor alcance, velocidad y eficiencia energética.
- Soporte para periféricos profesionales: auriculares de baja latencia (aptX LL), controles MIDI, sensores industriales.
- Mayor estabilidad: evita interferencias con el Wi-Fi integrado (aunque ambos usan 2.4 GHz, los chips dedicados gestionan mejor la coexistencia).

Sin embargo, en la mayoría de los casos, una tarjeta Wi-Fi+Bluetooth de calidad (como las de Intel AX200/AX210) es suficiente. Las tarjetas Bluetooth puras son raras y generalmente innecesarias.

## Quédate con...

- Las tarjetas Ethernet dedicadas (10 GbE, 2.5 GbE) son esenciales para transferencias rápidas, servidores y entornos de red exigentes.
- Intel y Broadcom son los fabricantes de referencia en calidad y compatibilidad, especialmente en Linux.
- Las tarjetas Wi-Fi dedicadas con antenas externas ofrecen mejor rendimiento y cobertura que las soluciones integradas, y son vitales para pruebas de red o desarrollo inalámbrico.
- En desarrollo profesional, evita el "networking integrado de bajo costo": un chip Realtek o MediaTek puede ahorrar unos euros, pero costará horas de depuración por inestabilidad o drivers deficientes.
- Como desarrollador, si tu flujo de trabajo implica redes, virtualización o transferencia de grandes volúmenes de datos, invertir en una NIC de calidad mejora no solo la velocidad, sino también la previsibilidad y la reproducibilidad de tus pruebas.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/tarjetas/sonido" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/tarjetas/controladores" class="next">Siguiente</a>
</div>
