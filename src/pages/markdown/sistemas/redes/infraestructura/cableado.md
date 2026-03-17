---
title: "Cableado y estándares"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Cableado y estándares](#cableado-y-estándares)
  - [Ethernet y categorías de cable](#ethernet-y-categorías-de-cable)
  - [Conectores RJ-45 y estandarización T568](#conectores-rj-45-y-estandarización-t568)
  - [Crimpado: técnica y errores comunes](#crimpado-técnica-y-errores-comunes)
  - [Pruebas de cable: certificación y diagnóstico](#pruebas-de-cable-certificación-y-diagnóstico)
  - [Quédate con...](#quédate-con)

</div>

# Cableado y estándares

La infraestructura física que transporta los bits entre dispositivos no es un medio pasivo: cada cable, conector y norma de instalación determina la velocidad máxima, la distancia alcanzable y la resistencia a interferencias del enlace. Ethernet, el estándar dominante en redes cableadas, define especificaciones precisas para cables de par trenzado que equilibran costo, rendimiento y facilidad de despliegue. Comprender estas especificaciones permite seleccionar el medio adecuado para cada escenario, instalar conexiones confiables y diagnosticar fallos físicos que las capas superiores de la pila de red no pueden resolver.

## Ethernet y categorías de cable

Ethernet sobre par trenzado utiliza pares de conductores de cobre entrelazados para cancelar interferencias electromagnéticas mutuas y reducir la susceptibilidad a ruido externo. Cada categoría define parámetros eléctricos como ancho de banda, atenuación, diafonía (crosstalk) y resistencia a interferencias, determinando la velocidad y distancia máxima soportada.

Cat5e (*Category 5 enhanced*) soporta Gigabit Ethernet (1000BASE-T) hasta 100 metros, con ancho de banda de 100 MHz. Es la categoría mínima recomendada para instalaciones nuevas, suficiente para la mayoría de entornos residenciales y oficinas pequeñas. Su costo reducido y disponibilidad lo mantienen relevante, aunque carece de blindaje contra interferencias en entornos eléctricamente ruidosos.

Cat6 eleva el ancho de banda a 250 MHz y mejora el aislamiento entre pares mediante un separador plástico interno que reduce la diafonía. Soporta 10GBASE-T hasta 50 metros, o 1000BASE-T a los 100 metros completos. Es la opción equilibrada para instalaciones que anticipan actualizaciones futuras sin incurrir en el costo de categorías superiores.

Cat6a (*augmented*) extiende el rendimiento de 10GBASE-T a los 100 metros completos, con ancho de banda de 500 MHz y blindaje mejorado contra interferencias externas (alien crosstalk). Requiere conectores y herramientas específicas, y su radio de curvatura mínimo es mayor, complicando instalaciones en espacios reducidos. Se reserva para centros de datos, enlaces troncales o entornos industriales con alta densidad electromagnética.

> La categoría del cable no garantiza rendimiento por sí sola: una instalación deficiente (curvas pronunciadas, conectores mal crimpados, exceso de destrenzado) degrada el enlace a la categoría del eslabón más débil. El cable certificado solo funciona si se respeta el estándar de instalación completo.

## Conectores RJ-45 y estandarización T568

El conector RJ-45 (*Registered Jack 45*) es la interfaz física que termina los cables Ethernet, con ocho contactos que corresponden a los ocho conductores de cuatro pares trenzados. Aunque su diseño parece simple, la disposición de los hilos dentro del conector sigue estándares precisos que garantizan compatibilidad y rendimiento.

Dos esquemas de cableado definen el orden de los conductores: T568A y T568B. Ambos funcionan eléctricamente igual, pero difieren en la posición de los pares naranja y verde. La clave no es cuál elegir, sino mantener consistencia: ambos extremos de un cable directo deben usar el mismo estándar. T568B es más común en entornos comerciales; T568A se prefiere en instalaciones gubernamentales o cuando se requiere compatibilidad con cableado telefónico heredado.

| Pin | T568A | T568B | Función en 10/100BASE-T |
|-----|-------|-------|-------------------------|
| 1 | Blanco-verde | Blanco-naranja | TX+ |
| 2 | Verde | Naranja | TX- |
| 3 | Blanco-naranja | Blanco-verde | RX+ |
| 4 | Azul | Azul | No usado |
| 5 | Blanco-azul | Blanco-azul | No usado |
| 6 | Naranja | Verde | RX- |
| 7 | Blanco-marrón | Blanco-marrón | No usado |
| 8 | Marrón | Marrón | No usado |

En Gigabit Ethernet (1000BASE-T), los cuatro pares se utilizan bidireccionalmente, eliminando la distinción entre transmisión y recepción. Por esta razón, un cable mal cableado puede funcionar a 100 Mbps pero fallar a 1 Gbps: los pares no utilizados en Fast Ethernet pueden estar defectuosos sin afectar enlaces lentos.

> Los cables cruzados (*crossover*), que intercambian TX y RX entre extremos, eran necesarios para conectar dispositivos del mismo tipo (PC a PC, switch a switch) en Ethernet antiguo. Los dispositivos modernos implementan Auto-MDIX, que detecta y corrige automáticamente la polaridad, haciendo obsoletos los cables cruzados en la mayoría de escenarios.

## Crimpado: técnica y errores comunes

El crimpado es el proceso de fijar mecánicamente los conductores al conector RJ-45 mediante una herramienta que deforma los contactos metálicos para perforar el aislamiento y establecer contacto eléctrico. Una terminación correcta requiere precisión: los hilos deben estar completamente insertados hasta el fondo del conector, el aislamiento exterior debe quedar bajo la pestaña de sujeción del conector, y el orden de colores debe respetar el estándar elegido.

El error más frecuente es destrenzar demasiado los pares cerca del conector. El trenzado cancela interferencias; al deshacerlo, se introduce diafonía que degrada la señal, especialmente a altas frecuencias. El estándar TIA/EIA-568 limita el destrenzado a 13 mm (0.5 pulgadas) desde el conector. Exceder este límite puede convertir un cable Cat6 en un enlace con rendimiento de Cat5e o inferior.

Otro error común es la inserción incompleta: si un conductor no alcanza el fondo del conector, el contacto puede ser intermitente o nulo. Esto genera fallos difíciles de diagnosticar: el enlace puede negociar velocidad pero perder paquetes aleatoriamente, o funcionar solo en ciertas orientaciones del cable. La inspección visual antes de crimpado y la prueba posterior son esenciales.

> Las herramientas de crimpado varían en calidad. Una herramienta barata puede no aplicar presión uniforme en los ocho contactos, generando conexiones marginales que fallan con vibración, temperatura o tiempo. Invertir en una herramienta certificada reduce retrabajos y garantiza confiabilidad a largo plazo.

## Pruebas de cable: certificación y diagnóstico

Un cable instalado no es funcional hasta que se verifica eléctricamente. Las pruebas básicas con un tester de continuidad confirman que cada conductor está conectado al pin correcto en ambos extremos y que no hay cortocircuitos entre pares. Sin embargo, esta verificación mínima no detecta problemas de rendimiento que solo aparecen a alta velocidad.

Los certificadores de cable avanzados miden parámetros críticos: atenuación (pérdida de señal con la distancia), diafonía cercana (NEXT, interferencia entre pares en el mismo extremo), diafonía lejana (FEXT), relación señal-ruido (SNR) y retardo de propagación entre pares. Estos valores se comparan con los límites del estándar TIA/EIA-568 para la categoría declarada. Un cable que pasa continuidad pero falla en NEXT puede funcionar a 100 Mbps pero colapsar a 1 Gbps bajo carga.

La certificación genera un informe con resultados por parámetro y frecuencia, esencial para garantizar cumplimiento en instalaciones profesionales o para diagnosticar fallos intermitentes. En entornos residenciales, un tester básico combinado con prueba de throughput real (por ejemplo, transferencia de archivos grande) puede ser suficiente, pero no sustituye la certificación en entornos críticos.

> Las pruebas deben realizarse con el cable instalado, no en banco. La curvatura, tensión mecánica, proximidad a fuentes de interferencia y calidad de los puntos de patch pueden degradar el rendimiento respecto a mediciones en condiciones ideales.

## Quédate con...

*   Las categorías de cable Ethernet (Cat5e, Cat6, Cat6a) definen ancho de banda, velocidad máxima y distancia soportada; elegir la categoría adecuada anticipa requisitos futuros sin sobredimensionar costos.
*   Los conectores RJ-45 deben cablearse siguiendo T568A o T568B de forma consistente en ambos extremos; la elección del estándar es menos crítica que la uniformidad en toda la instalación.
*   El crimpado correcto requiere minimizar el destrenzado de pares (<13 mm), insertar conductores hasta el fondo del conector y asegurar que el aislamiento exterior quede sujeto por la pestaña del RJ-45.
*   Las pruebas de continuidad son necesarias pero insuficientes: parámetros como NEXT, atenuación y SNR determinan si un cable soporta realmente la velocidad declarada bajo carga operativa.
*   La certificación profesional mide parámetros eléctricos contra estándares TIA/EIA-568; en entornos no críticos, pruebas de throughput real complementan la verificación básica.
*   La calidad del enlace depende del eslabón más débil: cable certificado, conectores adecuados, herramienta de crimpado precisa e instalación que respete radios de curvatura y límites de destrenzado.

<div class="pagination">
  <a href="/markdown/sistemas/redes/infraestructura/segmentacion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/infraestructura/wifi" class="next">Siguiente</a>
</div>
