---
title: "Modos de transmisión"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Modos de transmisión](#modos-de-transmisión)
  - [Simplex](#simplex)
  - [Half-duplex](#half-duplex)
  - [Full-duplex](#full-duplex)
  - [Quédate con...](#quédate-con)

</div>

# Modos de transmisión

La comunicación entre dos dispositivos implica necesariamente un flujo de información que puede organizarse de distintas maneras según la direccionalidad permitida en el medio compartido. Esta organización —el modo de transmisión— determina si los interlocutores pueden enviar y recibir simultáneamente, si deben alternar turnos, o si uno solo transmite mientras el otro permanece pasivo. La elección del modo no es arbitraria: responde a limitaciones físicas del medio, a costos de implementación, a protocolos de comunicación establecidos, y a las necesidades específicas de la aplicación. Comprender estas modalidades es esencial para entender por qué ciertas tecnologías se comportan como lo hacen y por qué algunas arquitecturas de red resultan eficientes o frustrantes según el contexto de uso.

## Simplex

En el modo simplex, la información fluye en una única dirección, establecida permanentemente por el diseño del sistema. Un extremo es siempre emisor, el otro siempre receptor, sin posibilidad de reversión ni de confirmación de recepción a través del mismo canal. Esta asimetría estructural simplifica la implementación hardware —se necesita un solo transmisor y un solo receptor, sin circuitería de conmutación— pero limita drásticamente la interactividad.

Los ejemplos clásicos ilustran contextos donde la unidireccionalidad es inherentemente deseable o aceptable. La radiodifusión terrestre y televisiva tradicional opera en simplex: la emisora transmite, millones de receptores captan, pero no existe canal de retorno a través del mismo medio (las interacciones del público ocurren por vías alternativas: teléfono, internet). Los sistemas de megafonía, los teleprompters, y ciertos sensores unidireccionales (termómetros de lectura remota, cámaras de vigilancia sin control de movimiento) comparten esta lógica. En redes de computadoras puros, el simplex es rareza; la necesidad de confirmaciones de recepción (ACKs), control de flujo y corrección de errores demanda alguna forma de comunicación bidireccional.

La eficiencia espectral del simplex es máxima en teoría: todo el ancho de banda se destina a la transmisión en una dirección. Sin embargo, la imposibilidad de feedback obliga a diseños conservadores: sin confirmación de que los datos llegaron correctamente, los protocolos deben asumir peores condiciones de canal e incorporar redundancia excesiva, reduciendo la eficiencia efectiva.

## Half-duplex

El modo half-duplex permite comunicación bidireccional, pero no simultánea. Ambos dispositivos pueden transmitir y recibir, pero no al mismo tiempo; deben alternar turnos, coordinando quién habla y quién escucha en cada momento. Esta alternancia puede gestionarse mediante protocolos explícitos (señales de control que indican "turno de transmitir") o detectarse colisiones cuando ambos intentan hablar simultáneamente.

La economía del half-duplex reside en la reutilización del medio: un único canal físico sirve para ambas direcciones, reduciendo costos de cableado o espectro. La limitación es la latencia inherente al cambio de dirección: cada transición de "hablar" a "escuchar" o viceversa introduce un tiempo de guarda, necesario para que los circuitos se estabilicen y el medio se despeje de señales residuales. En medios compartidos como el ethernet clásico con coaxial (10BASE2, 10BASE5) o las primeras versiones de Wi-Fi, el half-duplex era obligado por la naturaleza del medio: múltiples dispositivos compartían el mismo espacio de transmisión, haciendo imposible la simultaneidad sin colisión destructiva.

El protocolo CSMA/CD (Carrier Sense Multiple Access with Collision Detection) implementado en ethernet original ejemplifica la gestión del half-duplex: los dispositivos escuchan antes de transmitir (carrier sense), acceden múltiples al medio compartido (multiple access), y detectan colisiones si dos transmiten simultáneamente, retrocediendo y reintentando tras un tiempo aleatorio. Este mecanismo funcionó razonablemente bien para cargas moderadas, pero su eficiencia decae con la contención: a medida que más dispositivos compiten por el medio, las colisiones se multiplican y el tiempo efectivo de transmisión se reduce.

Las comunicaciones por radioaficionado, los walkie-talkies ("pulsar para hablar"), y los sistemas de bus de campo industrial (RS-485 en modo half-duplex) operan en esta modalidad. En todos los casos, la aplicación tolera o se adapta a la no simultaneidad: conversaciones estructuradas con turnos definidos, polling maestro-esclavo donde un controlador interroga secuencialmente a dispositivos, o transmisiones breves intercaladas con pausas de recepción.

## Full-duplex

El modo full-duplex habilita transmisión simultánea en ambas direcciones, como una conversación telefónica donde ambos interlocutores pueden hablar y escuchar al mismo tiempo. Esta simultaneidad puede lograrse mediante dos medios físicos separados —un par de cables para cada dirección— o mediante técnicas de multiplexación que comparten un único medio sin interferencia entre direcciones.

La separación física es el método más antiguo y robusto: dos canales independientes, frecuentemente implementados como pares trenzados separados en cables de cuatro hilos (dos pares), permiten que transmisor y receptor operen continuamente sin interferirse. Las líneas telefónicas tradicionales utilizan esta arquitectura: un par para la voz del abonado A hacia B, otro par para la voz de B hacia A, ambos activos permanentemente durante la llamada.

La multiplexación por división de frecuencia (FDD, Frequency Division Duplex) asigna bandas espectrales distintas a cada dirección en un medio compartido. Las redes celulares LTE y 5G utilizan FDD: el terminal transmite en la banda de uplink, recibe en la banda de downlink, separadas por un guarda de frecuencia que evita interferencias. Esta separación es rígida: el operador asigna espectro fijo a cada dirección, lo que puede generar ineficiencia si el tráfico es asimétrico —como típicamente ocurre en internet, donde el downstream supera ampliamente al upstream— dejando subutilizada la banda de uplink.

La multiplexación por división de tiempo (TDD, Time Division Duplex) alterna rápidamente la dirección del canal en intervalos milimétricos. En una fracción de milisegundo el medio transmite de A a B, en la siguiente fracción de B a A, con una guarda temporal entre ambas. La aparente simultaneidad es una ilusión sostenida por la velocidad: los buffers en ambos extremos almacenan datos durante los intervalos de "silencio" manteniendo flujos continuos hacia las capas superiores. Wi-Fi, Bluetooth y las versiones TDD de 5G emplean esta técnica, que permite adaptación dinámica: si el tráfico es mayoritariamente downstream, se asignan más intervalos de tiempo a esa dirección, optimizando el uso del espectro.

Los switches ethernet modernos y las interfaces de red han eliminado el half-duplex de las infraestructuras cableadas contemporáneas. Cada conexión punto-a-punto entre dispositivo y switch opera en full-duplex mediante pares separados dentro del mismo cable: los pares 1-2 transmiten, los pares 3-6 reciben (en 100BASE-TX), o se utilizan los cuatro pares bidireccionalmente con cancelación de eco (en 1000BASE-T). La eliminación del dominio de colisión —cada dispositivo tiene su canal dedicado al switch— permite que emisión y recepción ocurran simultáneamente sin contención, duplicando teóricamente la capacidad respecto al half-duplex: un enlace de 1 Gbps full-duplex puede transportar 1 Gbps en cada dirección simultáneamente, 2 Gbps de throughput agregado.

> La distinción entre full-duplex y "doble simplex" es sutil pero importante. Dos canales simplex independientes —uno para cada dirección— funcionan como full-duplex desde la perspectiva del usuario, pero técnicamente son dos sistemas simplex acoplados. El full-duplex verdadero implica un único medio compartido donde ambas direcciones coexisten mediante técnicas de multiplexación. En la práctica, esta distinción es relevante para ingenieros de sistemas de comunicación que diseñan el medio físico, pero el desarrollador de aplicaciones típicamente percibe ambos casos como "comunicación bidireccional simultánea".


## Quédate con...

- El modo simplex establece flujo unidireccional permanente, eficiente en uso de medio pero incapaz de feedback, adecuado para broadcast y sensores unidireccionales pero insuficiente para comunicación interactiva de datos.
- El half-duplex permite comunicación alternada en ambas direcciones mediante un único medio compartido, economizando recursos pero introduciendo latencia por cambio de dirección y requiriendo protocolos de control de acceso para evitar colisiones.
- El full-duplex habilita transmisión simultánea mediante separación física (dos canales) o multiplexación (FDD por frecuencia, TDD por tiempo), eliminando la contención del medio y duplicando la capacidad efectiva en infraestructuras modernas.
- La transición histórica en redes locales —de half-duplex con coaxial compartido a full-duplex con switches dedicados— ilustra cómo la evolución tecnológica resuelve limitaciones arquitectónicas mediante cambios en el medio físico y la topología de interconexión.
- La selección del modo implica trade-offs entre costo de infraestructura, eficiencia espectral, latencia de cambio de dirección y adaptabilidad a patrones de tráfico asimétricos, consideraciones que configuran el diseño de sistemas desde redes celulares hasta buses de chip.



<div class="pagination">
  <a href="/markdown/sistemas/redes/fundamentos/medios" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
