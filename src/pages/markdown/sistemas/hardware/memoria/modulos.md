---
title: "Módulos y timings"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Módulos y timings](#módulos-y-timings)
  - [Los valores CL (CAS Latency)](#los-valores-cl-cas-latency)
  - [Otros timings](#otros-timings)
  - [Perfiles XMP/EXPO](#perfiles-xmpexpo)
  - [Quédate con...](#quédate-con)

</div>

# Módulos y timings

La velocidad de la memoria RAM no depende únicamente de su frecuencia (por ejemplo, DDR4-3200), sino también de una serie de parámetros de temporización conocidos como timings. Estos valores definen cuántos ciclos de reloj debe esperar la memoria antes de responder a una solicitud de la CPU. Aunque parecen detalles técnicos reservados a entusiastas, los timings influyen directamente en la latencia real de la RAM y, por tanto, en el rendimiento de aplicaciones sensibles a la respuesta inmediata, como juegos, compiladores o sistemas de tiempo real. Además, tecnologías como XMP (Intel) y EXPO (AMD) permiten configurar estos parámetros de forma automática para obtener el máximo rendimiento sin ajustes manuales.

## Los valores CL (CAS Latency)

El CAS Latency (CL, por Column Address Strobe Latency) es el timing más conocido y relevante. Indica el número de ciclos de reloj que transcurren entre que la CPU solicita un dato y que la RAM comienza a entregarlo. Por ejemplo, una RAM DDR4-3200 con CL16 tiene una latencia de 16 ciclos.

Sin embargo, comparar CL entre distintas frecuencias puede ser engañoso. Lo que realmente importa es la latencia en nanosegundos (ns).

Aunque el CL es mayor en el segundo caso, la latencia real es idéntica gracias a la mayor frecuencia. Por eso, siempre evalúa la latencia en ns, no solo el valor CL.

## Otros timings

Además del CAS Latency, existen otros timings que afectan el rendimiento, aunque con menor impacto:

- tRCD (RAS to CAS Delay): ciclos entre activar una fila y acceder a una columna.
- tRP (RAS Precharge Time): tiempo para cerrar una fila antes de abrir otra.
- tRAS (Row Active Time): tiempo mínimo que una fila debe permanecer abierta.

Estos cuatro valores suelen mostrarse juntos como, por ejemplo: 16-18-18-36 (CL-tRCD-tRP-tRAS).

- Valores más bajos = menor latencia, pero también menor estabilidad.
- Valores más altos = mayor estabilidad, pero mayor latencia.

En la mayoría de los sistemas, estos timings se configuran automáticamente según el estándar JEDEC (por ejemplo, DDR4-2666 CL19), pero pueden ajustarse manualmente para overclocking o reducirse con perfiles predefinidos.

## Perfiles XMP/EXPO

Para simplificar el uso de RAM de alto rendimiento, los fabricantes incluyen perfiles de overclocking almacenados en un chip SPD (Serial Presence Detect) del módulo:

- XMP (Extreme Memory Profile): estándar de Intel. Al activarlo en la UEFI, la placa base aplica automáticamente la frecuencia, voltaje y timings optimizados para ese módulo.
- EXPO (Extended Profiles for Overclocking): estándar abierto de AMD, introducido con las CPUs Ryzen 7000. Funciona de forma similar a XMP, pero está diseñado específicamente para la arquitectura AM5 y DDR5.

Estos perfiles permiten que una RAM DDR5-6000 funcione a su velocidad nominal sin que el usuario tenga que ajustar decenas de parámetros manualmente. Sin embargo, deben activarse explícitamente en la UEFI; de lo contrario, la RAM funcionará a la velocidad base JEDEC (por ejemplo, DDR5-4800), desperdiciando su potencial.

> No todos los módulos son compatibles con todos los controladores de memoria. Incluso con XMP/EXPO activado, puede ser necesario ajustar ligeramente el voltaje del fabric (SoC en AMD) o los timings secundarios para lograr estabilidad, especialmente en configuraciones de 2x32 GB o más.

Aunque XMP/EXPO mejora el rendimiento, también puede aumentar ligeramente el consumo y la temperatura del controlador de memoria. En sistemas 24/7 (servidores, estaciones de desarrollo), prioriza la estabilidad sobre la máxima frecuencia si no es crítica para tu flujo de trabajo.

## Quédate con...

- El CAS Latency (CL) indica ciclos de espera, pero la latencia real en nanosegundos es lo que afecta al rendimiento.
- Otros timings (tRCD, tRP, tRAS) también influyen, pero con menor impacto que el CL.
- XMP (Intel) y EXPO (AMD) son perfiles predefinidos que activan automáticamente la frecuencia y timings óptimos de la RAM.
- Si no activas XMP/EXPO en la UEFI, tu RAM funcionará a velocidades base (JEDEC), más lentas que las anunciadas.
- La estabilidad es clave: una RAM a 6000 MT/s inestable rinde peor que una a 5600 MT/s estable.
- Como desarrollador, entiende que la memoria no es solo “más GB = mejor”; latencia, ancho de banda y configuración definen el rendimiento real de tu sistema.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/memoria/arquitectura" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/memoria/rom" class="next">Siguiente</a>
</div>
