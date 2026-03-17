---
title: "Subnetting"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Subnetting](#subnetting)
  - [¿Por qué subdividir redes?](#por-qué-subdividir-redes)
  - [Ejemplos de subnetting](#ejemplos-de-subnetting)
    - [De /24 a subredes menores](#de-24-a-subredes-menores)
    - [De /16 a múltiples /24](#de-16-a-múltiples-24)
    - [Cálculo de hosts y redes](#cálculo-de-hosts-y-redes)
    - [VLSM: Subnetting variable](#vlsm-subnetting-variable)
  - [Quédate con...](#quédate-con)

</div>

# Subnetting

La subdivisión de redes —subnetting— es la práctica de dividir un bloque de direcciones IP en segmentos menores, cada uno operando como red independiente con su propio prefijo de enrutamiento. Esta técnica, habilitada por CIDR, transforma la asignación rígida de clases en una herramienta de diseño topológico flexible, permitiendo que administradores de red adapten el direccionamiento a la estructura organizacional, geográfica o funcional de la infraestructura, en lugar de forzar la organización a las restricciones numéricas de las direcciones.

## ¿Por qué subdividir redes?

Las razones para subnetting son múltiples y se refuerzan mutuamente:

**Optimización del espacio de direcciones:** Una asignación `/16` proporciona 65,534 hosts, cantidad que rara vez necesita una única LAN. Dividir en múltiples `/24` permite asignar redes de tamaño apropiado a diferentes departamentos, edificios o segmentos, reduciendo el dominio de broadcast y facilitando la gestión.

**Segmentación administrativa:** Diferentes subredes pueden tener políticas distintas: seguridad perimetral, control de acceso, calidad de servicio. El router que interconecta subredes aplica estas políticas en sus interfaces, creando límites de control donde el tráfico entre segmentos es examinado y filtrado.

**Eficiencia de enrutamiento:** Las subredes se anuncian agregadas hacia fuera. Un router interno conoce todas las subredes específicas; un router externo ve solo el prefijo agregado. Esta jerarquía reduce el tamaño de tablas de enrutamiento y la complejidad de propagación de cambios.

**Aislamiento de fallos:** Un problema de broadcast storm en una subred no afecta a otras. La segmentación contiene la propagación de tráfico anómalo y facilita la diagnosis al limitar el alcance de síntomas.

**Asignación geográfica:** Una organización multinacional puede asignar bloques de subredes por región, facilitando la agregación de rutas y la optimización de caminos en la red troncal.

## Ejemplos de subnetting

### De /24 a subredes menores

Una red `/24` (`192.168.1.0/24`) proporciona 256 direcciones, 254 utilizables para hosts. Para crear cuatro subredes de aproximadamente 60 hosts cada una:

Se necesitan 6 bits de host (2^6 - 2 = 62 hosts). Con 32 bits totales, 32 - 6 = 26 bits de red. Se subdivide en `/26`.

| Subred | Dirección de red | Rango de hosts | Broadcast |
|--------|------------------|----------------|-----------|
| 1 | 192.168.1.0/26 | .1 - .62 | .63 |
| 2 | 192.168.1.64/26 | .65 - .126 | .127 |
| 3 | 192.168.1.128/26 | .129 - .190 | .191 |
| 4 | 192.168.1.192/26 | .193 - .254 | .255 |

Cada subred pierde dos direcciones (red y broadcast), resultando en 62 hosts utilizables. El `/24` original se ha dividido en cuatro `/26`, con máscara `255.255.255.192`.

### De /16 a múltiples /24

Una organización con asignación `10.0.0.0/16` (65,536 direcciones) puede estructurar jerárquicamente:

- `10.0.0.0/24` a `10.0.255.0/24`: 256 subredes de edificio o departamento en sede principal
- `10.1.0.0/16`: Reservado para sede secundaria completa
- `10.2.0.0/16` a `10.9.0.0/16`: Otras ubicaciones regionales
- `10.255.0.0/24`: Infraestructura de red (loops de router, management)

Esta estructura permite que routers de backbone agreguen: hacia fuera, solo se anuncia `10.0.0.0/8`; internamente, cada región conoce sus subredes específicas.

### Cálculo de hosts y redes

La aritmética de subnetting sigue reglas binarias inmutables:

**Dado un prefijo /p, bits de host = 32 - p**

**Hosts utilizables = 2^(bits de host) - 2** (reservados dirección de red y broadcast)

**Número de subredes posibles al dividir /p en /q (donde q > p): 2^(q-p)**

Ejemplo: ¿Cuántas subredes `/28` caben en un `/24`?

Bits prestados: 28 - 24 = 4. Subredes: 2^4 = 16. Cada `/28` tiene 32 - 28 = 4 bits de host, 2^4 - 2 = 14 hosts utilizables.

Verificación: 16 subredes × 16 direcciones cada una (incluyendo red y broadcast) = 256 direcciones, el espacio original del `/24`.

### VLSM: Subnetting variable

La asignación de diferentes tamaños de subred dentro del mismo prefijo —VLSM (Variable Length Subnet Masking)— optimiza el uso del espacio cuando diferentes segmentos tienen poblaciones distintas.

Dado `192.168.1.0/24`:

| Segmento | Hosts necesarios | Bits de host | Máscara | Asignación |
|----------|------------------|--------------|---------|------------|
| Servidores | 50 | 6 (/26) | 255.255.255.192 | 192.168.1.0/26 |
| Oficina A | 25 | 5 (/27) | 255.255.255.224 | 192.168.1.64/27 |
| Oficina B | 10 | 4 (/28) | 255.255.255.240 | 192.168.1.96/28 |
| Enlaces WAN (3) | 2 cada uno | 2 (/30) | 255.255.255.252 | 192.168.1.112/30, .116/30, .120/30 |
| Reserva | — | — | — | 192.168.1.124/30 en adelante |

El diseño VLSM requiere planificación cuidadosa para evitar solapamiento. Las subredes más grandes se asignan primero, alineadas a límites de su propia máscara; las menores ocupan el espacio remanente.

Los enlaces punto-a-punto entre routers necesitan solo 2 direcciones (una por cada extremo). El uso de `/30` (o `/31` en RFC 3021, que elimina broadcast en enlaces punto-a-punto) conserva direcciones que de otro modo se desperdiciarían en subredes mayores.

> El subnetting es operación de bits, no de decimales. La tentación de trabajar directamente con octetos decimales conduce a errores cuando las divisiones no alinean con límites de byte. Una subred `/26` puede comenzar en `.0`, `.64`, `.128`, `.192` —valores que son múltiplos de 64— pero no en `.100` o `.50`. La práctica de convertir a binario, verificar alineación de bits de subred, y luego convertir de vuelta, evita errores de diseño que son difíciles de diagnosticar una vez desplegados.


## Quédate con...

- El subnetting subdivide bloques de direcciones en redes menores para optimizar espacio, segmentar administrativamente, eficientizar enrutamiento, aislar fallos, y asignar geográficamente, adaptando el direccionamiento a la topología real de la organización.
- Dividir un `/24` en `/26` produce cuatro subredes de 62 hosts utilizables cada una; la máscara resultante es `255.255.255.192` y las subredes alinean a múltiplos de 64 en el último octeto.
- La fórmula fundamental: bits de host = 32 - prefijo; hosts utilizables = 2^(bits de host) - 2; número de subredes al dividir /p en /q = 2^(q-p).
- VLSM permite asignar diferentes tamaños de subred dentro del mismo prefijo, optimizando el uso del espacio cuando segmentos tienen poblaciones heterogéneas; los enlaces punto-a-punto utilizan `/30` o `/31` para conservar direcciones.
- El subnetting es operación bit a bit que requiere alineación a límites binarios; el diseño cuidadoso y verificación de no solapamiento son esenciales para evitar fallos de conectividad difíciles de diagnosticar.



<div class="pagination">
  <a href="/markdown/sistemas/redes/red/ipv4" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/red/ipv6" class="next">Siguiente</a>
</div>
