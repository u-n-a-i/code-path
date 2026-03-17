---
title: "IPv4"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [IPv4](#ipv4)
  - [Direcciones de 32 bits, notación decimal con puntos](#direcciones-de-32-bits-notación-decimal-con-puntos)
  - [Clases históricas versus CIDR](#clases-históricas-versus-cidr)
  - [Máscara de subred y cálculo de redes/subredes](#máscara-de-subred-y-cálculo-de-redessubredes)
  - [Quédate con...](#quédate-con)

</div>

# IPv4

IPv4 es el protocolo de capa de red que ha sostenido la internet durante más de cuatro décadas, desde su despliegue en ARPANET hasta la actualidad. Con un espacio de direcciones de 32 bits, proporciona aproximadamente 4.3 mil millones de direcciones teóricas —una cantidad que parecía inagotable en los años 1980 pero que reveló su insuficiencia ante la proliferación de dispositivos conectados. Esta limitación impulsó innovaciones arquitectónicas —NAT, CIDR, IPv6— que extienden la vida útil de IPv4 mientras demuestran tanto la flexibilidad como las tensiones de un diseño de escala planetaria.

## Direcciones de 32 bits, notación decimal con puntos

Una dirección IPv4 es un número de 32 bits, típicamente expresado en notación decimal punteada para legibilidad humana: cuatro octetos (bytes) separados por puntos, cada uno representado como decimal de 0 a 255. La dirección `192.168.1.1` corresponde a los 32 bits `11000000.10101000.00000001.00000001`.

Esta representación, conveniente para configuración manual, oculta la naturaleza binaria que subyace a todas las operaciones de enrutamiento. Los routers examinan prefijos de bits, no octetos decimales. La confusión entre representación humana y estructura real es fuente frecuente de errores: `192.168.1.1` y `192.168.2.1` parecen "cercanas" decimalmente, pero sus patrones de bits pueden pertenecer a redes completamente distintas según la máscara de subred.

El espacio de 32 bits permite 2^32 = 4,294,967,296 direcciones. Aproximadamente 18 millones son reservadas para usos especiales: privadas (RFC 1918), multicast, loopback, experimental, documentación. El espacio utilizable efectivo es menor, y la fragmentación por asignaciones históricas ineficientes reduce aún más la disponibilidad de bloques contiguos.

## Clases históricas versus CIDR

El sistema original de direccionamiento IPv4, especificado en 1981, dividía el espacio de direcciones en **clases** según los bits más significativos del primer octeto:

| Clase | Primeros bits | Rango primer octeto | Bits de red | Bits de host | Tamaño de red | Uso típico |
|-------|---------------|---------------------|-------------|--------------|---------------|------------|
| A | 0 | 0-127 | 8 | 24 | 16,777,216 hosts | Grandes organizaciones |
| B | 10 | 128-191 | 16 | 16 | 65,536 hosts | Organizaciones medianas |
| C | 110 | 192-223 | 24 | 8 | 256 hosts | Pequeñas redes |
| D | 1110 | 224-239 | — | — | — | Multicast |
| E | 1111 | 240-255 | — | — | — | Experimental |

Este esquema de clases era rígido e ineficiente. Una organización que necesitara 300 direcciones debía solicitar una clase B (65,536 direcciones), desperdiciando más del 99%. O una que necesitara 2,000 direcciones no podía usar una clase C (256 insuficientes), forzando a clase B igualmente desperdiciada. La alternativa de múltiples clases C fragmentaba la tabla de enrutamiento global, que crecía exponencialmente.

El **CIDR (Classless Inter-Domain Routing)**, estandarizado en 1993 (RFC 1518, 1519), eliminó las clases. Las direcciones IPv4 se interpretan puramente como prefijos de longitud variable, especificados explícitamente mediante notación de barra: `192.168.0.0/24` indica que los primeros 24 bits son prefijo de red, los últimos 8 bits identifican hosts. Esta red puede asignarse a quien la necesite, sin importar que históricamente fuera clase C.

CIDR habilitó **agregación de rutas**: múltiples prefijos contiguos se anuncian como uno solo. Un ISP con bloques `192.168.0.0/24` a `192.168.255.0/24` puede agregarlos como `192.168.0.0/16`, reduciendo una entrada en la tabla de enrutamiento global. Esta agregación es esencial para la escalabilidad de internet; sin ella, la tabla global excedería la capacidad de routers principales.

El CIDR también permitió **subredes de tamaño variable (VLSM)**: dentro de una asignación, diferentes subredes pueden tener diferentes máscaras según necesidad. Una organización con `/16` puede asignar `/24` para departamentos pequeños, `/23` para medianos, `/22` para grandes, optimizando el uso del espacio sin la rigidez de clases.

## Máscara de subred y cálculo de redes/subredes

La **máscara de subred** es un patrón de 32 bits que identifica qué porción de una dirección IP corresponde al prefijo de red y qué porción al identificador de host. Los bits de máscara en 1 indican posición de red; en 0, posición de host. La notación CIDR (`/n`) es equivalente a los primeros `n` bits en 1, resto en 0.

| Notación CIDR | Máscara decimal | Máscara binaria | Hosts disponibles |
|---------------|-----------------|-----------------|-------------------|
| /8 | 255.0.0.0 | 11111111.00000000.00000000.00000000 | 16,777,214 |
| /16 | 255.255.0.0 | 11111111.11111111.00000000.00000000 | 65,534 |
| /24 | 255.255.255.0 | 11111111.11111111.11111111.00000000 | 254 |
| /30 | 255.255.255.252 | 11111111.11111111.11111111.11111100 | 2 |

Los cálculos de subred son operaciones bit a bit fundamentales:

**Dirección de red:** AND bit a bit entre dirección IP y máscara. Resulta en todos los bits de host en cero. `192.168.1.100` AND `255.255.255.0` = `192.168.1.0`.

**Dirección de broadcast:** OR con el inverso de la máscara (bits de host en 1, red en 0). `192.168.1.0` OR `0.0.0.255` = `192.168.1.255`.

**Rango de hosts utilizables:** Desde dirección de red + 1 hasta broadcast - 1. Para `/24`, de `.1` a `.254`.

**Número de hosts:** 2^(bits de host) - 2 (reservados red y broadcast). Para `/24`: 2^8 - 2 = 254.

El subnetting (división de redes) y supernetting (agregación) son operaciones inversas. Dividir una `/24` en dos `/25` proporciona dos redes de 126 hosts cada una. Agregar dos `/24` contiguas en un `/23` proporciona una red de 510 hosts.

La aritmética de subredes es competencia fundamental del profesional de redes. Determinar si dos direcciones están en la misma red, calcular la máscara óptima para una población de hosts, diseñar un esquema de direccionamiento jerárquico que permita agregación eficiente —estas operaciones subyacen a toda configuración y troubleshooting de redes IP.

> La escasez de direcciones IPv4 ha producido prácticas que distorsionan la arquitectura original. El NAT (Network Address Translation) permite que múltiples dispositivos compartan una única dirección pública, pero rompe la semántica de conexión end-to-end: los servidores no pueden ser contactados sin configuración explícita de mapeo de puertos, los protocolos que transportan direcciones en payload requieren ayudas especiales, y la depuración de conectividad se complica por la ocultación de direcciones reales. IPv6 fue diseñado para eliminar estas distorsiones mediante abundancia de direcciones, aunque la transición ha sido más lenta de lo anticipado por inercia de infraestructura y percepción de "suficiencia" del NAT para aplicaciones dominantes.


## Quédate con...

- IPv4 utiliza direcciones de 32 bits expresadas en notación decimal punteada, proporcionando aproximadamente 4.3 mil millones de direcciones teóricas, insuficientes para la escala moderna de dispositivos conectados.
- El sistema de clases (A, B, C) era rígido e ineficiente, forzando asignaciones excesivas o fragmentación de tablas de enrutamiento; CIDR eliminó las clases permitiendo prefijos de longitud arbitraria especificada explícitamente.
- CIDR habilitó agregación de rutas (reducir múltiples prefijos contiguos a anuncios más cortos) y subredes de tamaño variable (VLSM), esenciales para la escalabilidad de internet y la eficiencia del uso del espacio de direcciones.
- La máscara de subred identifica bits de red versus bits de host mediante operaciones bit a bit (AND para dirección de red, OR con inversa para broadcast); el cálculo de rangos, hosts disponibles, y subdivisiones es competencia operativa fundamental.
- La escasez de IPv4 impulsó NAT y otras técnicas de conservación que distorsionan la arquitectura end-to-end, diferirando la adopción de IPv6 que restauraría la semántica original mediante abundancia de direcciones.


<div class="pagination">
  <a href="/markdown/sistemas/redes/red/funciones" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/red/subredes" class="next">Siguiente</a>
</div>
