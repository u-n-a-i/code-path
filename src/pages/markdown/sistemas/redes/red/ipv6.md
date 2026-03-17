---
title: "IPv6"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [IPv6](#ipv6)
  - [Direcciones de 128 bits, notación hexadecimal](#direcciones-de-128-bits-notación-hexadecimal)
  - [Tipos de direcciones: unicast, multicast, anycast](#tipos-de-direcciones-unicast-multicast-anycast)
    - [Unicast](#unicast)
    - [Multicast](#multicast)
    - [Anycast](#anycast)
  - [Ventajas de IPv6](#ventajas-de-ipv6)
    - [Espacio de direcciones](#espacio-de-direcciones)
    - [Autoconfiguración](#autoconfiguración)
    - [Seguridad integrada](#seguridad-integrada)
    - [Otras mejoras arquitectónicas](#otras-mejoras-arquitectónicas)
  - [Quédate con...](#quédate-con)

</div>

# IPv6

La agotamiento del espacio de direcciones IPv4, anticipado desde los años 1990 pero diferido mediante técnicas de conservación, impulsó el desarrollo de un sucesor que no solo ampliara el direccionamiento sino que corrigiera deficiencias arquitectónicas acumuladas. IPv6, estandarizado en RFC 2460 (1998) y actualizado en RFC 8200 (2017), no es una mejora incremental sino una reimaginación que preserva la esencia de IP —mejor esfuerzo, enrutamiento jerárquico, protocolos de transporte compatibles— mientras elimina complejidades históricas y habilita funcionalidades nuevas. Su adopción, más lenta de lo proyectado por inercia de infraestructura IPv4, continúa creciendo inexorablemente a medida que la escasez de direcciones IPv4 se agudiza y las nuevas redes se despliegan sin legado que proteger.

## Direcciones de 128 bits, notación hexadecimal

El espacio de direcciones IPv6 es de 128 bits, proporcionando 2^128 ≈ 3.4 × 10^38 direcciones. Esta cantidad es astronómica: aproximadamente 667 mil millones de direcciones por milímetro cuadrado de superficie terrestre. La abundancia elimina la necesidad de conservación agresiva, NAT complejo, y las distorsiones arquitectónicas que estos imponen.

La notación hexadecimal con dos puntos agrupa los 128 bits en ocho bloques de 16 bits (cuatro hexadecimales cada uno), separados por `:`. Ejemplo completo:

`2001:0db8:85a3:0000:0000:8a2e:0370:7334`

Reglas de compresión mejoran la legibilidad:

- **Omisión de ceros iniciales:** Cada grupo de 16 bits puede comprimirse eliminando ceros a la izquierda. `0db8` → `db8`, `0000` → `0`, `0370` → `370`.

- **Compresión de secuencias de ceros:** Una única secuencia de grupos consecutivos de ceros puede reemplazarse por `::`. Esta compresión puede aplicarse solo una vez por dirección para evitar ambigüedad. La dirección anterior comprimida:

`2001:db8:85a3::8a2e:370:7334`

La notación CIDR con prefijo de longitud se mantiene: `2001:db8::/32` indica que los primeros 32 bits son prefijo de red. La máscara de subred en formato IPv4 no se utiliza; el prefijo es suficiente.

## Tipos de direcciones: unicast, multicast, anycast

IPv6 simplifica la taxonomía de direcciones eliminando el broadcast, reemplazado por multicast más eficiente, y formalizando el anycast que en IPv4 era práctica no estandarizada.

### Unicast

Identifican interfaces individuales. Un paquete enviado a una dirección unicast se entrega a esa interfaz específica. Subtipos principales:

**Link-local:** `fe80::/10`. Alcance restringido al enlace local —segmento de red físicamente conectado— no enrutables más allá. Utilizadas para descubrimiento de vecinos (NDP), autoconfiguración, y comunicación local antes de obtener dirección global. Cada interfaz IPv6 tiene obligatoriamente una link-local, típicamente autoconfigurada a partir de MAC (EUI-64) o aleatoria.

**Global unicast:** Equivalentes a direcciones IPv4 públicas, enrutables globalmente. El prefijo `2000::/3` (2000-3fff en primer hexteto) designa espacio global asignado por RIRs. La estructura típica es: 48 bits de prefijo de sitio asignado por ISP, 16 bits de subred para organización, 64 bits de identificador de interfaz.

**Unique local:** `fc00::/7`. Similar a RFC 1918 de IPv4 pero con probabilidad baja de colisión por aleatoriedad en los 40 bits siguientes al prefijo. Para comunicación interna no enrutable global, con posibilidad de interconexión privada entre sitios sin conflicto de direcciones.

**Loopback:** `::1`. Equivalente a `127.0.0.1`, siempre local.

### Multicast

Identifican grupos de interfaces. Un paquete a dirección multicast se entrega a todos los miembros del grupo. Prefijo `ff00::/8`. La estructura incluye flags (transitorio/permanente), alcance (nodo, enlace, sitio, organización, global), y identificador de grupo.

Multicast IPv6 es fundamental para operación de red: NDP (Neighbor Discovery Protocol) utiliza `ff02::1` (todos los nodos del enlace) y `ff02::2` (todos los routers). La gestión de grupos mediante MLD (Multicast Listener Discovery), equivalente a IGMP de IPv4, permite que routers rastreen membresía de segmentos.

### Anycast

Identifican interfaces múltiples configuradas intencionalmente con la misma dirección. Un paquete a anycast se entrega a la interfaz "más cercana" según métrica de enrutamiento —típicamente el router con menor costo en la tabla de enrutamiento.

Anycast formaliza una práctica común en IPv4 (DNS raíz, 8.8.8.8) en el estándar. Aplicaciones: servicios distribuidos globalmente (DNS, CDN) donde el cliente alcanza la instancia topológicamente más próxima sin configuración especial. La "cercanía" es determinada por el enrutamiento, no por latencia medida, lo que puede no coincidir con la instancia de menor latencia real en todos los casos.

## Ventajas de IPv6

### Espacio de direcciones

La abundancia elimina el NAT, restaurando la semántica end-to-end de internet original. Cada dispositivo puede tener dirección global única, contactable desde cualquier otro punto de la red. Esto simplifica protocolos peer-to-peer, telefonía IP, juegos en línea, y cualquier aplicación donde conexiones iniciadas desde ambos lados son deseables.

La asignación de 64 bits para identificador de interfaz (en prefijos /64 típicos) permite autoconfiguración sin estado basada en MAC (EUI-64) o aleatoria, garantizando unicidad sin coordinación central en el enlace local.

### Autoconfiguración

IPv6 soporta múltiples mecanismos de asignación de direcciones:

**SLAAC (Stateless Address Autoconfiguration):** Los routers anuncian prefijos de red mediante mensajes de Router Advertisement (RA). Los hosts generan automáticamente su identificador de interfaz (EUI-64 o privacidad aleatoria), combinando con el prefijo para formar dirección global. Sin servidor, sin estado mantenido en la red, inmediato y escalable.

**DHCPv6:** Para entornos que requieren control centralizado, asignación específica, o información adicional (DNS, dominio). Puede operar stateful (asignaciones trackeadas) o stateless (solo información complementaria, dirección por SLAAC).

La autoconfiguración reduce drásticamente la carga administrativa de despliegue de redes grandes, donde la configuración manual de IPv4 es impracticable y DHCPv4 requiere infraestructura de servidores.

### Seguridad integrada

IPsec —conjunto de protocolos para autenticación, integridad y confidencialidad— fue especificado como obligatorio en IPv6 original. Aunque la obligatoriedad se relajó por consideraciones de implementación, la arquitectura de IPv6 facilita la seguridad:

- **Tamaño de direcciones:** El escaneo de redes (reconocimiento de hosts activos) es impracticable en IPv6. Un atacante no puede escanear un /64 en tiempo razonable; la seguridad por oscuridad se vuelve efectiva numéricamente.

- **Extension headers:** Estructura de cabecera flexible que permite incluir opciones de seguridad sin fragmentación de cabecera base.

- **NDP (Neighbor Discovery Protocol):** Reemplaza ARP de IPv4 con mecanismos más robustos, incluyendo SEND (SEcure Neighbor Discovery) que criptográficamente autentica mensajes de descubrimiento, previniendo spoofing de vecinos.

- **Direcciones temporales:** IPv6 genera direcciones con identificador aleatorio que cambian periódicamente, dificultando el seguimiento de dispositivos por dirección fija, mejora de privacidad sobre EUI-64 original.

### Otras mejoras arquitectónicas

**Cabecera simplificada:** 40 bytes fijos en IPv6 versus 20-60 variables en IPv4. Campos eliminados (checksum de cabecera, fragmentación, opciones) o movidos a extension headers. Procesamiento más eficiente en routers de alta velocidad.

**Sin fragmentación en routers:** Solo hosts finales fragmentan, basándose en Path MTU Discovery. Los routers tienen camino de datos más simple, sin reensamblaje ni fragmentación.

**Jumbograms:** Soporte para paquetes mayores de 65,535 bytes (hasta 4 GB teóricos), útil para redes de alta velocidad con MTU grandes.

**Mobilidad:** Soporte integrado para que dispositivos mantengan dirección al cambiar de punto de conexión a la red, relevante para dispositivos móviles y handover entre redes.

> La transición IPv4-IPv6 no es instantánea ni completa. Mecanismos de coexistencia son necesarios: dual-stack (ambos protocolos simultáneamente), tunneling (IPv6 sobre IPv4 o viceversa), y traducción (NAT64/DNS64). La complejidad de transición ha sido barrera de adopción, pero la escasez creciente de IPv4 y el despliegue de infraestructura nueva sin legado IPv4 aceleran la transición. El profesional de redes debe dominar ambos protocolos y las técnicas de interconexión, operando en un mundo de red dual durante años o décadas.


## Quédate con...

- IPv6 utiliza direcciones de 128 bits en notación hexadecimal con compresión de ceros iniciales y secuencias (::), proporcionando espacio prácticamente ilimitado que elimina la necesidad de NAT y restaura conectividad end-to-end.
- Los tres tipos de direcciones son unicast (individual, con subtipos link-local, global, unique local), multicast (grupo, reemplazando broadcast), y anycast (múltiples interfaces con misma dirección, entrega al más cercano).
- SLAAC permite autoconfiguración sin estado mediante anuncios de router y generación local de identificador; DHCPv6 proporciona control centralizado cuando se requiere; ambos mecanismos reducen carga administrativa respecto a IPv4.
- La seguridad integrada incluye IPsec obligatorio originalmente (ahora recomendado), NDP con opciones de autenticación criptográfica, y direcciones temporales que mejoran privacidad; el tamaño del espacio hace el escaneo de redes impracticable.
- Mejoras arquitectónicas adicionales: cabecera de tamaño fijo simplificada, eliminación de fragmentación en routers, soporte para jumbogramas, y movilidad integrada; la transición dual-stack y tunneling continuará durante años.



<div class="pagination">
  <a href="/markdown/sistemas/redes/red/subredes" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/red/auxiliares" class="next">Siguiente</a>
</div>
