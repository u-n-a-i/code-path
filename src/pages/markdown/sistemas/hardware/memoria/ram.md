---
title: "RAM"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [RAM](#ram)
  - [Funcionamiento](#funcionamiento)
  - [Tipos de RAM](#tipos-de-ram)
  - [DDR generaciones](#ddr-generaciones)
  - [Diferencias en pines, voltaje y velocidad](#diferencias-en-pines-voltaje-y-velocidad)
  - [Quédate con...](#quédate-con)

</div>

# RAM

La memoria de acceso aleatorio (RAM, por sus siglas en inglés) es el componente que permite a la CPU trabajar con datos y programas de forma rápida y flexible durante la ejecución. A diferencia del almacenamiento persistente, la RAM es volátil: su contenido se pierde al apagar el sistema, pero a cambio ofrece tiempos de acceso extremadamente bajos. Para un desarrollador, entender cómo funciona la RAM, qué tipos existen y cómo han evolucionado las generaciones DDR no solo ayuda a elegir hardware adecuado, sino también a escribir código que aproveche mejor el subsistema de memoria, evitando cuellos de botella innecesarios.

## Funcionamiento

La RAM moderna se basa en tecnología DRAM (Dynamic Random Access Memory), donde cada bit se almacena en un condensador y un transistor. El condensador mantiene una carga eléctrica (1) o no (0), pero esta se pierde con el tiempo, por lo que debe refrescarse periódicamente (miles de veces por segundo). Este "refresco" es lo que hace que la memoria sea dinámica y, en parte, limita su velocidad.

Cuando la CPU necesita un dato, envía una dirección de memoria al controlador de RAM (integrado en la CPU desde 2008). El módulo de RAM responde tras una latencia fija (medida en nanosegundos), devolviendo el dato a través del bus de memoria. Este proceso es transparente para el software, pero su eficiencia depende de factores como la frecuencia, los timings y la configuración de canales (dual/quad channel).

## Tipos de RAM

Existen varios tipos de memoria según su uso y arquitectura:

- DRAM: memoria dinámica estándar, usada en módulos de escritorio y portátiles (DIMM/SO-DIMM).
- SRAM (Static RAM): más rápida y no requiere refresco, pero mucho más cara. Se usa en cachés L1/L2 de la CPU.
- SDRAM (Synchronous DRAM): sincroniza sus operaciones con el reloj del sistema, base de todas las DDR modernas.
- DDR SDRAM (Double Data Rate SDRAM): transfiere datos tanto en el flanco ascendente como descendente del reloj, doblando la tasa efectiva de transferencia. Es el estándar desde principios de los 2000.

Hoy, prácticamente toda la RAM de consumo es DDR SDRAM, en sus sucesivas generaciones.

## DDR generaciones

Desde DDR1 hasta DDR5, cada generación ha mejorado la velocidad, eficiencia y densidad:

| Generación | Año aprox. | Frecuencia efectiva | Voltaje típico          | Ancho de bus                  | Max. por módulo |
| ---------- | ---------- | ------------------- | ----------------------- | ----------------------------- | --------------- |
| DDR        | 2000       | 200–400 MT/s        | 2.5 V                   | 64 bits                       | 1 GB            |
| DDR2       | 2004       | 400–800 MT/s        | 1.8 V                   | 64 bits                       | 4 GB            |
| DDR3       | 2007       | 800–2133 MT/s       | 1.5 V (1.35 V en DDR3L) | 64 bits                       | 16 GB           |
| DDR4       | 2014       | 1600–3200+ MT/s     | 1.2 V                   | 64 bits                       | 64 GB           |
| DDR5       | 2020       | 3200–8400+ MT/s     | 1.1 V                   | 64 bits (doble canal interno) | 128 GB+         |

Notas clave:

- La frecuencia efectiva (MT/s, MegaTransfers per second) es el doble de la frecuencia del reloj (gracias a DDR).
- DDR5 introduce un doble canal interno: cada módulo se divide en dos canales de 32 bits, mejorando el ancho de banda incluso en configuraciones de un solo módulo.
- DDR5 incluye un PMIC (Power Management IC) en el módulo, regulando el voltaje localmente para mayor estabilidad.

> Aunque DDR5 ofrece mayor ancho de banda, su latencia absoluta (en nanosegundos) es similar o ligeramente mayor que DDR4. Sin embargo, el mayor ancho de banda compensa esta latencia en cargas con alto paralelismo (IA, renderizado, bases de datos). En aplicaciones sensibles a latencia (juegos, tiempo real), el beneficio puede ser menor al principio, pero crece con el tiempo a medida que el software se optimiza para DDR5.

## Diferencias en pines, voltaje y velocidad

Cada generación de DDR es físicamente incompatible con las anteriores, lo que evita errores de instalación:

- DDR4: módulos DIMM de 288 pines; SO-DIMM (portátiles) de 260 pines.
- DDR5: DIMM de 288 pines, pero con la muesca en posición distinta respecto a DDR4; SO-DIMM de 262 pines.

El voltaje ha disminuido progresivamente para reducir el consumo y el calor:

- DDR3: 1.5 V → DDR4: 1.2 V → DDR5: 1.1 V.
- Versiones de bajo voltaje (DDR3L, DDR4L) existen para portátiles y servidores.

La velocidad no solo ha aumentado en frecuencia, sino también en ancho de banda:

- DDR4-3200: ~25.6 GB/s por módulo en single channel.
- DDR5-6000: ~48 GB/s por módulo (gracias al doble canal interno).

> Una placa base solo admite una generación de RAM. Una placa DDR4 no acepta DDR5, y viceversa, incluso si el número de pines es similar. La muesca evita el encaje físico, pero forzarlo dañaría la placa o el módulo.

## Quédate con...

- La RAM (DRAM) almacena datos volátiles con acceso rápido, esencial para la ejecución de programas.
- Las generaciones DDR1 a DDR5 han mejorado velocidad, eficiencia y densidad, pero no son compatibles entre sí.
- DDR4 y DDR5 usan 288 pines, pero con muescas en distinta posición; el voltaje y la gestión de energía también difieren.
- DDR5 duplica el ancho de banda mediante canales internos y reduce el voltaje, ideal para cargas de datos masivos.
- Al elegir RAM, verifica la compatibilidad con la placa base y CPU, no solo la frecuencia: una DDR5 no funcionará en una placa DDR4, y viceversa.
- Como desarrollador, diseña estructuras de datos que maximicen el uso del ancho de banda (accesos secuenciales, alineación) para aprovechar al máximo la generación de RAM disponible.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/memoria/memoria" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/memoria/arquitectura" class="next">Siguiente</a>
</div>
