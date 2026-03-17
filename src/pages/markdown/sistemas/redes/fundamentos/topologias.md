---
title: "Topologías de red"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Topologías de red](#topologías-de-red)
  - [Topología física](#topología-física)
  - [Topología lógica](#topología-lógica)
    - [Física vs. lógica: una distinción práctica](#física-vs-lógica-una-distinción-práctica)
  - [Topologías básicas](#topologías-básicas)
    - [Bus](#bus)
    - [Estrella](#estrella)
    - [Anillo](#anillo)
    - [Malla](#malla)
  - [Ventajas y desventajas comparadas](#ventajas-y-desventajas-comparadas)
  - [Quédate con...](#quédate-con)

</div>

# Topologías de red

La disposición en que se interconectan los nodos determina cómo circula la información, cómo se gestionan los fallos y qué complejidad requiere la administración de la infraestructura. Esta organización, conocida como topología, no es un detalle secundario: condiciona el rendimiento, la escalabilidad y el costo de cualquier red, desde un pequeño hogar hasta un centro de datos global.

Una topología de red describe el patrón de interconexión entre dispositivos. Este concepto se analiza desde dos perspectivas complementarias: la disposición física de los cables y equipos, y el camino lógico que siguen los datos al transmitirse. Ambas dimensiones influyen en el comportamiento de la red, pero responden a criterios de diseño distintos.

## Topología física

La topología física se refiere a la distribución tangible de los componentes: dónde se ubican los cables, cómo se conectan los switches, qué ruta siguen los enlaces entre edificios. Es la arquitectura visible que un técnico puede recorrer y documentar. Esta capa determina aspectos como la longitud máxima de los cables, los puntos únicos de fallo y la facilidad para añadir nuevos nodos.

## Topología lógica

La topología lógica define cómo se comportan los datos al atravesar la red, independientemente de su trazado físico. Describe el camino que sigue una trama desde su origen hasta su destino, las reglas de acceso al medio y los mecanismos de direccionamiento. Dos redes con cableado idéntico pueden operar con lógicas distintas: una puede usar difusión (broadcast) para todas las comunicaciones, mientras que otra establece caminos conmutados punto a punto.

### Física vs. lógica: una distinción práctica

La separación entre ambas topologías no es teórica: tiene implicaciones directas en el diseño. Por ejemplo, una red Ethernet moderna suele tener topología física en estrella (todos los dispositivos conectados a un switch central), pero su topología lógica puede comportarse como un bus compartido si el switch opera en modo hub, o como una malla de enlaces punto a punto si utiliza conmutación inteligente. Esta flexibilidad permite optimizar el cableado sin sacrificar el rendimiento lógico.

## Topologías básicas

### Bus

En la topología de bus, todos los nodos comparten un único canal de comunicación, típicamente un cable coaxial al que se conectan mediante derivaciones. Cuando un dispositivo transmite, la señal se propaga en ambas direcciones y es recibida por todos los participantes, quienes deciden si procesarla según la dirección de destino.

Esta configuración fue común en las primeras redes Ethernet (10BASE2, 10BASE5). Su principal ventaja radica en la simplicidad y el bajo costo inicial: requiere menos cable que otras topologías y es fácil de extender linealmente. Sin embargo, presenta limitaciones críticas: una rotura en el cable principal interrumpe toda la red, el rendimiento decae drásticamente con el aumento de nodos debido a las colisiones, y la localización de fallos resulta compleja.

### Estrella

La topología en estrella centraliza la conexión: cada nodo se enlaza individualmente a un dispositivo concentrador, como un switch o un hub. Toda la comunicación entre dispositivos periféricos debe pasar por este punto central, que gestiona el reenvío de las tramas.

Esta arquitectura domina las redes locales modernas por razones prácticas. Facilita la administración: añadir o retirar un nodo no afecta al resto de la red. El aislamiento de fallos es inmediato: si un cable se daña, solo se pierde la conexión del dispositivo afectado. Además, permite mezclar velocidades y tecnologías en distintos puertos del concentrador.

La desventaja principal es la dependencia del nodo central. Si el switch falla, toda la red queda inoperativa. Por esta razón, en entornos críticos se implementan switches redundantes con protocolos de conmutación automática. El costo de cableado también es mayor, ya que cada dispositivo requiere su propio enlace hasta el concentrador.

### Anillo

En la topología de anillo, los nodos se conectan formando un circuito cerrado donde cada dispositivo tiene exactamente dos vecinos. Los datos viajan en una dirección predeterminada, pasando de nodo en nodo hasta alcanzar su destino. Algunas implementaciones, como Token Ring, utilizan un mecanismo de testigo (token) que circula por el anillo: solo el nodo que posee el testigo puede transmitir, evitando colisiones.

Esta configuración ofrece un comportamiento predecible: el tiempo máximo de espera para transmitir está acotado, lo que la hace atractiva para aplicaciones con requisitos de tiempo real. Además, el rendimiento se mantiene estable incluso con alta carga, ya que no hay colisiones aleatorias.

No obstante, presenta vulnerabilidades operativas. Una falla en un solo nodo o enlace puede interrumpir todo el anillo, salvo que se implementen mecanismos de redundancia como anillos dobles con conmutación automática (FDDI). La expansión también es más compleja: añadir un nodo requiere interrumpir temporalmente el anillo o disponer de conectores especiales que permitan la inserción en caliente.

### Malla

La topología de malla establece múltiples rutas entre los nodos. En su forma completa, cada dispositivo se conecta directamente a todos los demás; en su variante parcial, solo existen enlaces redundantes entre nodos críticos. Esta redundancia es la esencia de la malla: proporciona caminos alternativos para que los datos alcancen su destino incluso si varios enlaces fallan simultáneamente.

Internet, en su núcleo, opera como una malla parcial de routers interconectados. Esta arquitectura maximiza la resiliencia y permite distribuir la carga entre múltiples rutas, optimizando el uso del ancho de banda disponible.

El costo es la contrapartida inevitable. Una malla completa requiere un número de enlaces que crece cuadráticamente con el número de nodos (n*(n-1)/2), lo que la hace inviable económicamente más allá de pequeños grupos. La configuración y el enrutamiento también son más complejos, exigiendo protocolos dinámicos que calculen las mejores rutas en tiempo real.

> Las topologías híbridas combinan características de varias configuraciones básicas. Por ejemplo, una red corporativa puede usar estrella en cada planta del edificio (física) y malla parcial entre los switches de distribución (lógica), equilibrando costo, rendimiento y tolerancia a fallos según la criticidad de cada segmento.

## Ventajas y desventajas comparadas

La selección de una topología no responde a preferencias teóricas, sino a un análisis de compromisos. La siguiente síntesis ayuda a evaluar cada opción según criterios prácticos:

| Topología | Escalabilidad | Tolerancia a fallos | Costo inicial | Complejidad administrativa |
|-----------|---------------|----------------------|----------------|-----------------------------|
| **Bus**   | Baja          | Muy baja             | Muy bajo       | Media                       |
| **Estrella** | Alta       | Media (depende del centro) | Medio     | Baja                        |
| **Anillo** | Media        | Baja (sin redundancia) | Medio       | Media-Alta                  |
| **Malla** | Muy alta      | Muy alta             | Muy alto       | Alta                        |


La escalabilidad mide la facilidad para añadir nuevos nodos sin reestructurar la red. La tolerancia a fallos indica cuántas interrupciones puede absorber la topología antes de perder conectividad global. El costo inicial considera cableado, equipos y mano de obra. La complejidad administrativa refleja el esfuerzo requerido para configurar, monitorear y resolver incidencias.

En la práctica, la topología en estrella domina las redes locales por su equilibrio entre costo y gestión. La malla parcial se reserva para enlaces críticos entre switches de núcleo o routers de borde. El bus y el anillo han quedado relegados a contextos históricos o aplicaciones especializadas con requisitos muy específicos.

> La topología física puede evolucionar sin cambiar la lógica. Migrar de hubs a switches en una red en estrella transforma su comportamiento: de un medio compartido propenso a colisiones a enlaces dedicados full-duplex. Esta mejora lógica no requiere recablear, solo actualizar el equipo central.

## Quédate con...

- La topología física describe la disposición tangible de cables y equipos; la lógica define cómo circulan los datos, independientemente del trazado físico.
- Bus: simple y económico, pero vulnerable a fallos únicos y con rendimiento decreciente al crecer la red.
- Estrella: fácil de administrar y escalar, con aislamiento de fallos, pero dependiente del dispositivo central.
- Anillo: comportamiento predecible y sin colisiones, pero sensible a interrupciones si no hay redundancia.
- Malla: máxima resiliencia y optimización de rutas, con costo y complejidad proporcionales a su robustez.
- Las redes reales suelen combinar topologías: estrella en el acceso, malla parcial en el núcleo, adaptándose a los requisitos de cada capa.

<div class="pagination">
  <a href="/markdown/sistemas/redes/fundamentos/intro" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/fundamentos/medios" class="next">Siguiente</a>
</div>
