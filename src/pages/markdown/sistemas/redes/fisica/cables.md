---
title: "Tipos de cables y conectores"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Tipos de cables y conectores](#tipos-de-cables-y-conectores)
  - [Cables](#cables)
    - [UTP: categorías y evolución](#utp-categorías-y-evolución)
    - [Coaxial: RG-6 y RG-59](#coaxial-rg-6-y-rg-59)
    - [Fibra óptica: monomodo versus multimodo](#fibra-óptica-monomodo-versus-multimodo)
  - [Conectores](#conectores)
    - [RJ45](#rj45)
    - [BNC](#bnc)
    - [Conectores de fibra óptica](#conectores-de-fibra-óptica)
  - [Normas de cableado](#normas-de-cableado)
    - [T568A y T568B](#t568a-y-t568b)
    - [Patch cord versus cable directo versus cable cruzado](#patch-cord-versus-cable-directo-versus-cable-cruzado)
    - [Longitudes máximas permitidas](#longitudes-máximas-permitidas)
  - [Quédate con...](#quédate-con)

</div>

# Tipos de cables y conectores

La infraestructura física de comunicación depende de componentes mecánicos estandarizados que garantizan interoperabilidad entre equipos de diferentes fabricantes. Cables y conectores son la materialización visible de la capa física: elementos aparentemente simples —metal, plástico, vidrio— cuyas especificaciones precisas determinan si una red funcionará a la velocidad diseñada o fallará de modo intermitente e inexplicable. La selección correcta no es decorativa; es la condición necesaria para que las señales codificadas, moduladas y multiplexadas puedan viajar sin degradación inaceptable.

## Cables

### UTP: categorías y evolución

El par trenzado no blindado (UTP, Unshielded Twisted Pair) domina el cableado estructurado de edificios por su equilibrio entre costo, flexibilidad y capacidad. Las categorías definen especificaciones de transmisión que han evolucionado paralelamente a las necesidades de velocidad de red.

**Cat5e (Category 5 enhanced):** Especificado hasta 100 MHz de ancho de banda, soporta 1000BASE-T (Gigabit Ethernet) a 100 metros con todas las cuatro parejas utilizadas simultáneamente. Mejora la especificación original Cat5 en rechazo de diafonía (crosstalk) mediante trenzado más estricto y aislamiento mejorado. Aún encontrado en instalaciones antiguas, aunque obsoleto para nuevos despliegues.

**Cat6:** Especificado hasta 250 MHz. El cable incluye separador longitudinal de plástico (splines) que mantiene los pares separados, reduciendo diafonía interna (NEXT, Near-End Crosstalk). Soporta 10GBASE-T a 55 metros, o 100 metros a velocidades menores. La especificación incluye requisitos más estrictos de impedancia y atenuación.

**Cat6a (Augmented):** Especificado hasta 500 MHz, soporta 10GBASE-T a la distancia completa de 100 metros. El aumento de frecuencia requiere blindaje individual de pares (U/FTP) o blindaje global (F/UTP) en implementaciones más exigentes, aumentando diámetro y rigidez del cable. La diafonía alienígena (AXT, crosstalk de cables adyacentes) se controla mediante blindaje o separación física.

**Cat7:** Especificado hasta 600 MHz con blindaje individual de pares y global (S/FTP). Diseñado para 10GBASE-T con márgenes de calidad superiores, aunque su adopción fue limitada por la aparición de Cat6a y por su conector no-RJ45 (GG45 o TERA) que nunca alcanzó masa crítica en el mercado.

**Cat8:** Especificado hasta 2000 MHz (2 GHz), diseñado para centros de datos, no para cableado horizontal general. Soporta 25GBASE-T y 40GBASE-T en distancias de 30 metros, con conectores RJ45 blindados. Las aplicaciones son conexiones intra-rack o entre racks contiguos, donde la velocidad prioriza sobre la distancia.

La evolución de categorías ilustra el compromiso fundamental: mayor frecuencia requiere mayor aislamiento entre pares, blindaje más efectivo, y tolerancias de fabricación más estrictas. Cada salto de categoría aumenta costo, diámetro, rigidez y complejidad de instalación. La selección de categoría debe proyectarse para la vida útil de la instalación —típicamente 10-15 años— considerando no las necesidades actuales sino las velocidades que se requerirán en esa ventana temporal.

### Coaxial: RG-6 y RG-59

El cable coaxial mantiene relevancia en nichos específicos a pesar de su obsolescencia en redes de datos modernas. La designación "RG" (Radio Guide) es sistema militar originario de la Segunda Guerra Mundial, aún utilizado convencionalmente aunque las especificaciones modernas son más precisas.

**RG-59:** Diámetro del conductor central ~0.81 mm, aislante de polietileno, blindaje de malla trenzada. Diseñado originalmente para video compuesto de baja frecuencia. Inadecuado para aplicaciones de alta frecuencia modernas debido a alta atenuación; aún encontrado en sistemas de CCTV analógico antiguos.

**RG-6:** Conductor central ~1.0 mm, aislante de espuma de polietileno de menor permitividad dieléctrica, blindaje de aluminio sólido más malla trenzada. Menor atenuación y mejor protección contra interferencias que RG-59. Dominante en distribución de televisión por cable (CATV), cable modems (DOCSIS), y sistemas de satélite. Las variantes RG-6/U (uso general) y RG-6/Q (cuádruple blindaje para máxima inmunidad) cubren aplicaciones residenciales e institucionales.

El coaxial ofrece ancho de banda superior al par trenzado —hasta cientos de MHz o GHz dependiendo del tipo— con inmunidad a interferencias externas por la geometría del blindaje. Sin embargo, su rigidez, diámetro, y costo de conectores limitan su uso frente al par trenzado en instalaciones de datos. Persiste donde su capacidad de frecuencia es insustituible o donde la infraestructura legada lo impone.

### Fibra óptica: monomodo versus multimodo

La fibra óptica transporta luz, no electricidad, mediante núcleos de vidrio de ultra-pureza. La distinción fundamental entre tipos reside en el diámetro del núcleo y el modo de propagación de la luz.

**Fibra multimodo (MMF):** Núcleo de 50 o 62.5 micrómetros de diámetro, suficientemente amplio para permitir múltiples trayectorias ópticas (modos) simultáneas. La luz de un pulso viaja por caminos de longitud ligeramente distinta, llegando al receptor en momentos dispersos. Esta dispersión modal limita la distancia y velocidad: OM3 (50/125 μm, laser-optimized) soporta 10 Gbps hasta 300 metros; OM4 hasta 400 metros; OM5 (wideband multimodo) permite multiplexación por longitud de onda (SWDM) para 40-100 Gbps en distancias cortas. Las fuentes ópticas son LEDs o VCSELs (láseres de bajo costo). Los conectores son tolerantes a desalineaciones de micras. Aplicaciones: redes de edificios, campus, centros de datos intra-rack.

**Fibra monomodo (SMF):** Núcleo de 8-10 micrómetros, tan estrecho que solo permite propagación del modo fundamental. Eliminada la dispersión modal, la limitación principal es la dispersión cromática —diferentes longitudes de onda viajan a velocidades ligeramente distintas— y no linealidades ópticas a potencias elevadas. Las fuentes son láseres de alta coherencia. Los conectores requieren precisión submicrométrica; el acoplamiento es crítico. Las especificaciones OS1 (cinta ajustada, menor atenuación) y OS2 (cinta suelta, mejor rendimiento a longitudes de onda múltiples) soportan distancias de decenas de kilómetros sin regeneración, velocidades de 100 Gbps, 400 Gbps, y más mediante técnicas de modulación complejas. Aplicaciones: redes metropolitanas, larga distancia, troncal de centros de datos.

La elección entre multimodo y monomodo involucra trade-offs de costo versus capacidad. El equipo óptico para multimodo (transceptores de VCSEL) es sustancialmente más barato; la fibra misma es comparable en costo. Para distancias cortas donde el presupuesto de enlace no es restrictivo, el multimodo es económicamente óptimo. Para distancias superiores a 500 metros o velocidades superiores a 40 Gbps, el monomodo se vuelve inevitable. La tendencia en centros de datos modernos es migración hacia monomodo incluso para distancias cortas, "future-proofing" la infraestructura contra demandas de capacidad crecientes.

## Conectores

### RJ45

El conector modular RJ45 (Registered Jack 45) es el estándar de facto para ethernet sobre par trenzado. Su diseño de 8 posiciones y 8 contactos (8P8C, aunque RJ45 específicamente implica pinout de datos) permite conexiones rápidas sin herramientas especializadas mediante mecanismo de presión que corta y contacta simultáneamente (crimpado).

Las variantes de blindaje (RJ45 blindado, STP) incluyen carcasa metálica conectada a tierra para protección contra interferencias electromagnéticas, esencial en categorías superiores (Cat6a, Cat8) donde la diafonía alienígena es crítica. Los conectores para cables sólidos (infraestructura permanente) y para cables trenzados (patch cords flexibles) tienen diseños de cuchilla ligeramente diferentes.

La debilidad del RJ45 es su tamaño y su mecanismo de retención por clip plástico, propenso a rotura. En entornos de alta densidad de puertos, conectores de perfil bajo o con retención mejorada (con clip protegido o de metal) mitigan estos problemas. La estandarización universal garantiza que cualquier cable RJ45 conecte equipos de cualquier fabricante, pero esta universalidad implica que la calidad de la conexión —la integridad del contacto, la fuerza de retención, la protección contra flexiones— depende críticamente de la calidad de fabricación del conector específico.

### BNC

El conector BNC (Bayonet Neill-Concelman) utiliza mecanismo de bayoneta de media vuelta para acoplamiento rápido y seguro. Dominante en video profesional (SDI, Serial Digital Interface) y en redes coaxiales históricas (10BASE2 Thin Ethernet). Ofrece impedancia controlada de 50 ohmios (para RF y datos) o 75 ohmios (para video), con buen rendimiento hasta GHz. La conexión positiva por bayoneta permite conexión en espacios confinados donde roscas serían impracticables. Persiste en aplicaciones de video broadcast, instrumentación de RF, y sistemas de comunicaciones militares y aeroespaciales donde la confiabilidad mecánica es prioridad.

### Conectores de fibra óptica

**SC (Subscriber Connector):** Conector de casquillo cuadrado con mecanismo de empuje-bloqueo (push-pull). Simple, robusto, económico. Historically dominante en redes de telecomunicaciones; aún común en aplicaciones de PON (Passive Optical Network) para fibra hasta el hogar. El perfil relativamente grande limita la densidad de puertos.

**ST (Straight Tip):** Conector de bayoneta circular, similar a BNC en mecanismo de acoplamiento. Obsoleto en instalaciones nuevas por mayor tiempo de conexión y menor densidad, pero persisten en infraestructura legada y en entornos industriales donde la conexión positiva de bayoneta se prefiere por resistencia a vibración.

**LC (Lucent Connector):** Conector de casquillo rectangular de perfil reducido, derivado del diseño RJ45 pero miniaturizado para fibra. Mecanismo de pestillo similar a RJ45. Su pequeño tamaño —la mitad del SC— permite densidades de puerto duplicadas, crítica en switches de centro de datos. Dominante en instalaciones modernas. Variantes de unibody (cuerpo integrado) y modular (conector separable del boot) ofrecen trade-offs de robustez versus flexibilidad de reparación.

**Conectores de alta densidad:** MPO (Multi-fiber Push-On) y MTP (versión mejorada de MPO) conectan 8, 12 o 24 fibras simultáneamente en un único conector rectangular. Utilizados en troncales de centros de datos donde múltiples fibras deben conectar entre racks o entre edificios. La polaridad (configuración de fibras transmisoras y receptoras) debe gestionarse cuidadosamente en el diseño del cableado.

## Normas de cableado

### T568A y T568B

Estas normas definen la asignación de pines en conectores RJ45 para par trenzado. Ambas especificaciones mantienen el par trenzado hasta el punto de terminación, crítico para el rechazo de diafonía.

| Pin | T568A | T568B |
|-----|-------|-------|
| 1 | Blanco/Verde | Blanco/Naranja |
| 2 | Verde | Naranja |
| 3 | Blanco/Naranja | Blanco/Verde |
| 4 | Azul | Azul |
| 5 | Blanco/Azul | Blanco/Azul |
| 6 | Naranja | Verde |
| 7 | Blanco/Marrón | Blanco/Marrón |
| 8 | Marrón | Marrón |

T568B es el estándar dominante en Estados Unidos y en instalaciones de red modernas globales. T568A se reserva para aplicaciones de cableado telefónico integrado o para cumplir especificaciones gubernamentales históricas. La diferencia esencial es el intercambio de los pares naranja y verde: en T568B, el par naranja (pines 1-2) transmite en 10/100 Mbps; en T568A, el par verde. Para Gigabit Ethernet y superiores, donde todas las cuatro parejas se utilizan simultáneamente, la distinción es menos crítica pero aún relevante para consistencia de documentación.

La importancia de la norma no es el color en sí, sino la consistencia: ambos extremos de un cable de infraestructura deben seguir la misma asignación para que los pares mantengan su trenzado hasta la terminación. Un cable con un extremo T568A y otro T568B funciona para 10/100 Mbps (es un cable cruzado, véase abajo), pero Gigabit requiere consistencia de pares que solo se logra con la misma norma en ambos extremos o con cables cruzados específicamente diseñados.

### Patch cord versus cable directo versus cable cruzado

**Cable directo (straight-through):** Ambos extremos siguen la misma norma (T568B-T568B o T568A-T568A). Utilizado para conectar dispositivos de diferente tipo: PC a switch, router a switch, AP a switch. El pin 1 en un extremo conecta al pin 1 en el otro, y así sucesivamente. Es el cable estándar de infraestructura y patch cords.

**Cable cruzado (crossover):** Un extremo T568B, otro T568A. Intercambia los pares de transmisión y recepción: lo que se transmite en pines 1-2 de un extremo se recibe en pines 3-6 del otro, y viceversa. Requerido históricamente para conectar dispositivos del mismo tipo: PC a PC, switch a switch, router a router. Los puertos modernos implementan Auto-MDI/MDIX, detectando automáticamente la necesidad de cruce y adaptando electrónicamente, haciendo los cables cruzados obsoletos para equipos contemporáneos. Persisten en entornos con hardware legacy o para propósitos específicos de prueba.

**Rollover (console cable):** Cable específico para acceso a consola de dispositivos de red (routers, switches). Un extremo RJ45, otro DB9 serial o USB, con pines invertidos para señales de consola. No es un cable ethernet funcional; es un adaptador de señalización.

### Longitudes máximas permitidas

Las especificaciones de ethernet definen límites de distancia basados en presupuestos de enlace: la atenuación y la diafonía acumuladas no deben impedir la recuperación de la señal con tasa de error aceptable.

**Par trenzado:** 100 metros para el enlace completo (cableado horizontal), compuesto por 90 metros de cable sólido de infraestructura permanente más 10 metros de patch cords (típicamente 5 metros en cada extremo). Esta distancia garantiza funcionamiento de 10BASE-T a 10GBASE-T según categoría. Los patch cords, al ser trenzados para flexibilidad, tienen atenuación ligeramente superior al cable sólido equivalente; su longitud debe minimizarse dentro del presupuesto total.

**Fibra óptica multimodo:** Varía drásticamente con la velocidad y la generación de fibra. OM3 soporta 10 Gbps a 300 metros, 40 Gbps a 100 metros; OM4 duplica estas distancias aproximadamente. Las velocidades de 100 Gbps y superiores requieren fibras OM5 o distancias muy cortas.

**Fibra óptica monomodo:** Kilómetros de distancia. OS2 soporta 10 Gbps a 10 km sin amplificación; 40/100 Gbps a 10 km con transceptores apropiados; velocidades mayores con limitaciones de distancia que dependen de la complejidad de modulación. Los cables submarinos transoceánicos, con amplificación óptica en línea (EDFA) y regeneración cuando necesario, extienden estas distancias a miles de kilómetros.

**Coaxial:** Dependiente de la aplicación. RG-6 para CATV soporta cientos de metros para señales de TV analógica o digital; para datos DOCSIS 3.1, la distancia entre el nodo óptico y el módem se limita típicamente a 100-200 metros para garantizar velocidades de gigabit.

Estos límites son máximos teóricos bajo condiciones ideales. En práctica, instalaciones de calidad dejan márgenes de seguridad: cableado de 90 metros en lugar de 99, fibras de categoría superior a la estrictamente necesaria, conectores de calidad verificada. La infraestructura de cableado es el elemento de red más difícil y costoso de modificar post-instalación; su diseño debe proyectarse para la vida útil del edificio, no para las necesidades inmediatas.


## Quédate con...

- Las categorías de UTP (Cat5e a Cat8) definen progresivamente mayor ancho de banda y capacidad, con trade-offs de costo, rigidez y blindaje; la selección debe proyectarse para la vida útil de la instalación, no solo necesidades actuales.
- El coaxial (RG-6) persiste en aplicaciones de video y cable módem por su ancho de banda superior; la fibra óptica ofrece distinción fundamental entre multimodo (costo bajo, distancia corta, LEDs/VCSELs) y monomodo (capacidad ilimitada prácticamente, láseres, precisión extrema).
- Los conectores RJ45 dominan el par trenzado con mecanismo de presión universal; BNC persiste en video y RF; en fibra, LC ha reemplazado SC por densidad de puerto, mientras MPO/MTP habilitan conexiones de múltiples fibras para troncales de alta capacidad.
- Las normas T568A y T568B definen la asignación de pines; la consistencia en ambos extremos de un cable es crítica para mantener la integridad del par trenzado y el rechazo de diafonía.
- Cables directos conectan dispositivos diferentes; cables cruzados (hoy obsoletos por Auto-MDI/MDIX) conectaban dispositivos iguales; los límites de distancia (100 m para UTP, variables para fibra según velocidad) derivan de presupuestos de atenuación y diafonía que garantizan recuperación de señal fiable.


<div class="pagination">
  <a href="/markdown/sistemas/redes/fisica/senales" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/fisica/estandares" class="next">Siguiente</a>
</div>
