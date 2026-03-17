---
title: "Medios de transmisión"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Medios de transmisión](#medios-de-transmisión)
  - [Medios guiados](#medios-guiados)
    - [Par trenzado](#par-trenzado)
    - [Fibra óptica](#fibra-óptica)
  - [Medios no guiados](#medios-no-guiados)
    - [Wi-Fi y redes inalámbricas locales](#wi-fi-y-redes-inalámbricas-locales)
    - [Bluetooth y redes personales](#bluetooth-y-redes-personales)
    - [Satelital](#satelital)
  - [Ancho de banda](#ancho-de-banda)
  - [Latencia](#latencia)
  - [Jitter](#jitter)
  - [Quédate con...](#quédate-con)

</div>

# Medios de transmisión

La comunicación de datos entre dispositivos requiere un vehículo físico que transporte señales electromagnéticas desde un punto a otro. Este vehículo —el medio de transmisión— determina las propiedades fundamentales de cualquier enlace de red: qué tan rápido puede transmitirse información, qué distancias son alcanzables, qué interferencias pueden afectar la señal, y qué costos implica su despliegue. La elección del medio no es meramente técnica; configura topologías de red posibles, arquitecturas de sistema, e incluso modelos de negocio en la industria de telecomunicaciones.

Los medios se clasifican en dos categorías según la direccionalidad de la propagación. Los **medios guiados** confinan la energía electromagnética dentro de un conductor físico —cables de cobre, fibras de vidrio— ofreciendo control sobre la trayectoria de la señal y protección contra interferencias externas. Los **medios no guiados** liberan la energía al ambiente —ondas de radio, infrarrojos, microondas— permitiendo movilidad pero exponiendo la transmisión a obstáculos, interferencias y escucha no autorizada. Esta dicotomía estructura toda la infraestructura de comunicaciones moderna, desde los cables submarinos que interconectan continentes hasta las redes celulares que permiten la movilidad urbana.

## Medios guiados

### Par trenzado

El par trenzado consiste en dos conductores de cobre aislados —típicamente 0.4 a 0.6 mm de diámetro— enrollados helicoidalmente entre sí. El trenzado no es decorativo: al torcer los cables, las interferencias electromagnéticas externas se inducen por igual en ambos conductores, cancelándose mediante la recepción diferencial. Cuanto más denso el trenzado —medido en vueltas por metro— mayor la protección contra interferencias, pero también mayor la complejidad de fabricación y el costo.

La categorización moderna (Cat5e, Cat6, Cat6a, Cat7, Cat8) refleja la evolución hacia frecuencias más altas. Un cable Cat5e, diseñado para 100 MHz, soporta gigabit ethernet en distancias cortas. Cat6a, a 500 MHz, mantiene 10 Gbps hasta 100 metros. La progresión implica mejoras en el aislamiento entre pares —separadores plásticos, blindajes metálicos— y en la uniformidad de la impedancia característica (típicamente 100 ohmios ±15%). El par trenzado no blindado (UTP) domina en instalaciones de edificios por su flexibilidad y bajo costo; las variantes blindadas (STP, FTP) se reservan para entornos industrialmente ruidosos.

La limitación fundamental del cobre es la atenuación: la resistencia eléctrica del conductor convierte energía de la señal en calor, degradando la relación señal-ruido con la distancia. A frecuencias más altas, el efecto piel —concentración de corriente en la superficie del conductor— aumenta efectivamente la resistencia, limitando el ancho de banda útil. Por esto, los estándares ethernet especifican distancias máximas de 100 metros para par trenzado; más allá, se requieren repetidores o medios alternativos.

### Fibra óptica

La fibra óptica transmite información mediante pulsos de luz —típicamente en ventanas de infrarrojo cercano, 850, 1310 o 1550 nanómetros— a través de filamentos de vidrio o plástico ultra-puros. El principio físico es la reflexión interna total: cuando la luz incide sobre la interfaz entre el núcleo de la fibra (índice de refracción alto) y el revestimiento (índice menor) con ángulo suficientemente oblicuo, se refleja completamente sin pérdida, guiándose por el cable en zigzag millones de veces por kilómetro.

Las **fibras multimodo** tienen núcleos gruesos (50 o 62.5 micrómetros), permitiendo múltiples trayectorias ópticas (modos) simultáneas. Son más fáciles de conectar —toleran desalineaciones mayores— pero los diferentes modos llegan en momentos ligeramente distintos, dispersando pulsos rápidos (dispersión modal). Esto limita su uso a distancias cortas (< 2 km) y velocidades moderadas, típicamente en redes de edificios o campus.

Las **fibras monomodo** utilizan núcleos finos (8-10 micrómetros), tan estrechos que solo propagan un modo fundamental. Eliminada la dispersión modal, la limitación principal es la dispersión cromática —diferentes longitudes de onda viajan a velocidades ligeramente distintas— permitiendo distancias de decenas o cientos de kilómetros sin regeneración. Los amplificadores ópticos (EDFA, Amplificadores de Fibra Dopada con Erbio) pueden reforzar señales directamente en el dominio óptico, sin conversión a eléctrico.

La capacidad de la fibra es teóricamente inmensa: un solo par de fibras puede transportar terabits por segundo mediante multiplexación por división de longitud de onda (WDM), donde múltiples láseres de colores ligeramente distintos coexisten sin interferir. Los cables submarinos transoceánicos —como los que conectan Europa y América— contienen docenas de pares de fibras, cada uno con cientos de canales WDM, proporcionando capacidades de petabits. La atenuación en fibra es órdenes de magnitud menor que en cobre: 0.2 dB/km en monomodo versus decenas de dB/km en par trenzado a alta frecuencia.

## Medios no guiados

### Wi-Fi y redes inalámbricas locales

Las redes inalámbricas operan en espectros de radiofrecuencia regulados internacionalmente. Las bandas ISM (Industrial, Científica y Médica) —2.4 GHz y 5 GHz principalmente— están disponibles sin licencia, lo que impulsó la proliferación de Wi-Fi. La banda de 2.4 GHz ofrece mayor penetración en obstáculos y alcance, pero está congestionada por bluetooth, microondas, y dispositivos inalámbricos diversos. La banda de 5 GHz proporciona canales más anchos y menos interferencias, pero atenúa más rápidamente con la distancia y atraviesa peores obstáculos.

El estándar IEEE 802.11 ha evolucionado mediante sucesivas enmiendas: 802.11n introdujo MIMO (Multiple Input Multiple Output), utilizando múltiples antenas para transmitir flujos paralelos; 802.11ac expandió el ancho de canal hasta 160 MHz en 5 GHz; 802.11ax (Wi-Fi 6) implementa OFDMA (Acceso Múltiple por División de Frecuencias Ortogonales), dividiendo canales en subportadoras asignables a diferentes usuarios simultáneamente, mejorando eficiencia en entornos densos.

La propagación de radiofrecuencias en interiores es compleja: reflexiones en paredes, suelos y techos crean múltiples trayectorias que pueden sumarse constructiva o destructivamente según la fase, causando desvanecimiento selectivo en frecuencia. La movilidad del receptor introduce variación temporal (desvanecimiento por multitrayecto Doppler). Los sistemas modernos mitigan estos efectos mediante diversidad de antenas, codificación robusta, y adaptación de tasa según condiciones del canal.

### Bluetooth y redes personales

Bluetooth opera en la banda de 2.4 GHz mediante saltos de frecuencia rápidos (1600 saltos/segundo), dividiendo la banda en 79 canales de 1 MHz y transmitiendo brevemente en cada uno secuencialmente. Esta técnica proporciona resistencia contra interferencias estrechas: una señal interferente afecta solo una fracción de los saltos. El protocolo está optimizado para bajo consumo energético y baja latencia de establecimiento de conexión —adecuado para periféricos— sacrificando ancho de banda: Bluetooth clásico proporciona hasta 3 Mbps, mientras que Bluetooth Low Energy (BLE) prioriza años de duración de batería en dispositivos pequeños sobre velocidad de transferencia.

### Satelital

Las comunicaciones satelitales utilizan vehículos en órbita geoestacionaria (GEO, 35,786 km de altitud), órbita media (MEO, 8,000-20,000 km), o órbita baja (LEO, 500-2,000 km) como repetidores activos. Los satélites GEO permanecen fijos respecto a un punto de la superficie, simplificando el apuntamiento de antenas terrestres, pero introducen una latencia inherente de ~250 milisegundos por ida y vuelta debido a la velocidad finita de la luz. Los sistemas LEO —como Starlink— reducen latencia a 20-40 ms mediante constelaciones de miles de satélites en órbita cercana, compensando la mayor complejidad de seguimiento y handover entre satélites.

El medio satelital es inherentemente broadcast: la señal descendente cubre vastas áreas geográficas, facilitando distribución masiva pero requiriendo cifrado para privacidad. La atenuación por lluvia (rain fade) afecta severamente las frecuencias de ondas milimétricas utilizadas para alto ancho de banda, mientras que la competencia por espectro orbital —recurso finito regulado internacionalmente— limita la densidad de constelaciones.

## Ancho de banda

El ancho de banda de un medio mide la diferencia entre las frecuencias más alta y más baja que puede transmitir efectivamente, típicamente expresado en hercios (Hz). Conceptualmente, determina cuánta información puede codificarse simultáneamente: según el teorema de Nyquist-Shannon, la tasa máxima de datos es proporcional al ancho de banda multiplicado por la eficiencia espectral (bits por Hz) permitida por el ruido.

En medios guiados, el ancho de banda está limitado por características físicas: en par trenzado, la atenuación creciente con la frecuencia establece un límite práctico; en fibra, la dispersión cromática y no linealidades ópticas restringen la utilidad de ventanas espectrales extremadamente anchas. En medios no guiados, las regulaciones espectrales son típicamente el cuello de botella: las bandas licenciadas son caras y escasas; las bandas libres están congestionadas.

La distinción entre ancho de banda analógico (espectral) y tasa de bits (digital) es crucial. Un medio con 20 MHz de ancho de banda puede transportar 100 Mbps con modulación eficiente (QAM-256, MIMO 2x2) o solo 10 Mbps con modulación conservadora (BPSK) en condiciones de baja relación señal-ruido. El desarrollador de red debe comprender que el "ancho de banda" cotidiano —los megabits por segundo contratados— es una realización técnica dependiente del medio físico, no una propiedad intrínseca del cable o del aire.

## Latencia

La latencia es el tiempo que tarda un bit en viajar desde el emisor hasta el receptor. Se compone de componentes múltiples: tiempo de propagación física (distancia / velocidad de la señal en el medio), tiempo de procesamiento en equipos intermedios, tiempo de encolado en buffers, y tiempo de serialización (tiempo necesario para poner todos los bits de un paquete en el medio).

En medios guiados, la velocidad de propagación es típicamente 60-80% de la velocidad de la luz en vacío debido a la permitividad dieléctrica del aislante. Una señal en fibra óptica atraviesa Nueva York y Londres (~5,500 km) en aproximadamente 28 milisegundos; el mismo trayecto por satélite GEO añade 250 ms de ida. En redes de acceso, la latencia de encolado en buffers sobredimensionados (bufferbloat) puede superar ampliamente la latencia de propagación física, degradando interactividad incluso con abundante ancho de banda disponible.

Para aplicaciones interactivas —voz sobre IP, gaming, trading de alta frecuencia— la latencia es crítica. La percepción humana nota retrasos superiores a 150 ms en conversación bidireccional; algoritmos de trading requieren latencias sub-milisegundo entre centros de datos. La proximidad física importa: los centros de datos se ubican estratégicamente cerca de usuarios y entre sí, y los cables submarinos se trazan siguiendo grandes círculos terrestres para minimizar distancia, no rutas geográficas.

## Jitter

El jitter es la variabilidad en la latencia de paquetes sucesivos. Mientras la latencia constante puede compensarse mediante buffering —retrasar intencionalmente la reproducción para acumular reserva— el jitter requiere buffers adaptativos que crecen cuando la red es irregular, introduciendo a su vez mayor latencia.

En medios compartidos —Wi-Fi con contención por múltiples dispositivos, redes celulares con handover entre celdas— el jitter surge de la competencia por el medio y de las retransmisiones ante errores. En redes conmutadas, el jitter proviene de la variabilidad en la longitud de colas en routers intermedios. Las aplicaciones de streaming multimedia utilizan buffers de desbordamiento (jitter buffers) que absorben variaciones, sacrificando latencia por suavidad de reproducción. Las aplicaciones de control industrial o teleoperación requieren jitter mínimo, típicamente mediante reserva de recursos (QoS, Quality of Service) o redes deterministas como TSN (Time-Sensitive Networking).

La relación entre estas tres métricas configura el diseño de sistemas distribuidos. Un medio puede ofrecer abundante ancho de banda pero latencia inaceptable para tiempo real; puede proporcionar baja latencia media pero jitter que dificulta sincronización; puede ser económico pero inadecuado para distancias requeridas. El ingeniero de redes selecciona y combina medios —fibra troncal, cobre de acceso, inalámbrico de última milla— optimizando el trade-off entre costo, capacidad y características temporales según las necesidades específicas de cada segmento de la arquitectura.

> La distinción entre capacidad (ancho de banda) y velocidad de respuesta (latencia) es frecuentemente confundida. Un enlace de gigabit con alta latencia —satelital, por ejemplo— transferirá un archivo grande rápidamente una vez iniciada la transmisión, pero será percibido como "lento" para navegación web o aplicaciones interactivas donde cada clic inicia nuevas conexiones. El desarrollador debe diseñar aplicaciones que minimicen viajes de ida y vuelta (round-trips) independientemente del ancho de banda disponible, utilizando conexiones persistentes, prefetching, y técnicas de renderizado progresivo.


## Quédate con...

- Los medios guiados (par trenzado, fibra óptica) confinan la señal electromagnética, ofreciendo control, seguridad y eficiencia energética, mientras que los medios no guiados (radiofrecuencia, satelital) sacrifican estas propiedades por movilidad y flexibilidad de despliegue.
- El par trenzado evoluciona mediante categorías que soportan frecuencias crecientes, pero la atenuación y el efecto piel limitan su utilidad a distancias cortas; la fibra óptica, mediante reflexión interna total en monomodo o multimodo, proporciona capacidades de terabit y distancias transoceánicas con atenuación mínima.
- El ancho de banda espectral determina la tasa teórica máxima de información, pero la tasa de bits efectiva depende de la modulación, la relación señal-ruido y las técnicas de multiplexación utilizadas.
- La latencia comprende propagación física, procesamiento y encolado; domina la experiencia en aplicaciones interactivas independientemente del ancho de banda disponible, siendo crítica en trading, gaming y comunicaciones en tiempo real.
- El jitter —variabilidad de latencia— obliga a buffers adaptativos en aplicaciones multimedia y requiere mecanismos de calidad de servicio (QoS) o redes deterministas para control industrial y teleoperación.



<div class="pagination">
  <a href="/markdown/sistemas/redes/fundamentos/topologias" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/fundamentos/modos" class="next">Siguiente</a>
</div>
