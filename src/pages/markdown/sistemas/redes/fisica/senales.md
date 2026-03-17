---
title: "Señales, medios y codificación"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Señales, medios y codificación](#señales-medios-y-codificación)
  - [Señales](#señales)
    - [Señales analógicas versus digitales](#señales-analógicas-versus-digitales)
    - [Amplitud, frecuencia, fase](#amplitud-frecuencia-fase)
    - [Ancho de banda](#ancho-de-banda)
    - [Ruido, atenuación e interferencia](#ruido-atenuación-e-interferencia)
    - [Relación señal/ruido (SNR)](#relación-señalruido-snr)
  - [Medios de transmisión](#medios-de-transmisión)
    - [Medios guiados](#medios-guiados)
    - [Medios no guiados](#medios-no-guiados)
  - [Codificación](#codificación)
    - [Codificación digital](#codificación-digital)
    - [Modulación](#modulación)
    - [Multiplexación](#multiplexación)
  - [Quédate con...](#quédate-con)

</div>

# Señales, medios y codificación

La información, en su esencia abstracta, carece de peso ni extensión. Para viajar entre dos puntos, debe adherirse a alguna propiedad física mensurable que varíe en el espacio y el tiempo. Esta adherencia —la señal— es el acto fundamental de comunicación: imprimir patrón sobre energía, de modo que el patrón sobreviva al viaje y pueda ser recuperado. Las propiedades de esa señal, las características del medio que la porta, y las técnicas de codificación que optimizan su supervivencia, constituyen el dominio completo de la capa física.

## Señales

### Señales analógicas versus digitales

La distinción entre analógico y digital no reside en el medio físico —toda energía es inherentemente continua— sino en la interpretación que hacemos de ella. Una señal analógica varía continuamente en amplitud, y cualquier valor dentro de su rango es significativo. Una señal digital reconoce solo estados discretos, típicamente dos, y todos los valores intermedios se interpretan como uno u otro estado según umbrales de decisión.

El teléfono tradicional es analógico: la tensión en la línea reproduce continuamente las variaciones de presión sonora del micrófono. La voz del interlocutor emerge directamente de estas variaciones eléctricas. El sistema telefónico moderno digitaliza esta señal: muestrea la tensión 8000 veces por segundo (suficiente según el teorema de Nyquist para capturar frecuencias hasta 4 kHz), cuantiza cada muestra en 8 bits (256 niveles), y transmite la secuencia binaria. En el destino, la conversión inversa reconstruye una aproximación de la señal original.

La digitalización sacrifica información continua por robustez. Mientras una señal analógica acumula ruido irreversiblemente en cada etapa de amplificación, una señal digital puede regenerarse perfectamente: el receptor decide si cada bit es 0 o 1, descarta el ruido superpuesto, y retransmite una señal limpia. Esta regeneración es la base de las redes modernas: los bits sobreviven viajes de miles de kilómetros donde señales analógicas equivalentes habrían quedado irreconociblemente degradadas.

### Amplitud, frecuencia, fase

Toda señal periódica puede describirse mediante tres parámetros fundamentales. La **amplitud** es la intensidad máxima de la oscilación: en una onda electromagnética, la intensidad del campo eléctrico; en una señal eléctrica, el voltaje pico. La **frecuencia** es la velocidad de oscilación, ciclos por segundo (Hz), inversamente relacionada con el período de cada ciclo. La **fase** describe el desplazamiento temporal de la onda respecto a un referente: dos señales de igual amplitud y frecuencia pueden sumarse constructivamente (fase igual) o destructivamente (fase opuesta, cancelándose).

Estos parámetros no son meras descripciones matemáticas; son grados de libertad explotables para codificar información. Una señal puede modificar su amplitud (modulación de amplitud, ASK), su frecuencia (modulación de frecuencia, FSK), o su fase (modulación de fase, PSK) para representar bits. Sistemas avanzados modifican simultáneamente amplitud y fase (QAM), multiplicando la capacidad de transmisión.

### Ancho de banda

El ancho de banda de un medio es el rango de frecuencias que puede transmitir sin atenuación inaceptable. No es un límite abrupto sino una degradación gradual: frecuencias cercanas al centro del rango pasan con mínima pérdida; frecuencias extremas se atenúan progresivamente. La definición operativa fija umbrales típicamente a -3 dB (mitad de potencia) respecto al nivel de referencia.

El ancho de banda limita directamente la velocidad de transmisión. Según el teorema de Nyquist, un canal de ancho de banda B puede transportar máximo 2B símbolos por segundo sin interferencia intersimbólica. Un cable de par trenzado de 100 MHz de ancho de banda teórico podría, idealmente, transportar 200 Mbaud. Prácticamente, la distorsión de fase y la atenuación frecuencia-dependiente reducen esta capacidad, requiriendo ecualización y técnicas de compensación.

### Ruido, atenuación e interferencia

Tres fenómenos degradan las señales en tránsito. La **atenuación** es la pérdida de energía con la distancia: resistencia eléctrica en cables, dispersión en fibra, expansión geométrica en espacio libre. La atenuación es predecible y compensable mediante amplificación, pero los amplificadores introducen distorsión y añaden ruido propio.

El **ruido** es energía aleatoria no deseada que se suma a la señal. El ruido térmico (agitación aleatoria de electrones) es fundamental e ineliminable, presente en todo conductor a temperatura finita. El ruido de disparo (fluctuaciones en corriente debidas a naturaleza discreta de la carga) afecta dispositivos semiconductores. El ruido inducido proviene de fuentes externas: motores eléctricos, sistemas de encendido, otros circuitos de comunicación.

La **interferencia** es señal no deseada con estructura, proveniente de otras comunicaciones que comparten medio o espectro. En cables no blindados, el acoplamiento electromagnético (crosstalk) permite que señales de pares adyacentes se superpongan. En inalámbrico, señales de otras celdas, otros estándares, o incluso hornos microondas (que emiten en 2.4 GHz) interfieren con la comunicación deseada.

### Relación señal/ruido (SNR)

La SNR (Signal-to-Noise Ratio) cuantifica la dominancia de la señal útil sobre el ruido de fondo, típicamente expresada en decibelios: SNR(dB) = 10 log₁₀(Pseñal/Pruido). Una SNR de 30 dB significa que la señal es mil veces más potente que el ruido; de 3 dB, apenas el doble.

El teorema de Shannon-Hartley establece el límite absoluto de capacidad de un canal ruidoso: C = B log₂(1 + SNR), donde C es la capacidad en bits por segundo, B el ancho de banda. Un canal de 1 MHz con SNR de 30 dB (≈1000 lineal) tiene capacidad teórica de aproximadamente 10 Mbps. Este límite es inalcanzable prácticamente —requeriría codificación infinitamente compleja— pero orienta el diseño: sistemas reales operan a fracciones de esta capacidad, y mejorar SNR o ancho de banda son las únicas vías para aumentar velocidad.

## Medios de transmisión

### Medios guiados

**Par trenzado (UTP/STP):** Dos conductores de cobre aislados, enrollados helicoidalmente. El trenzado cancela interferencias electromagnéticas por inducción simétrica. UTP (Unshielded Twisted Pair) es económico y dominante en redes de edificios; STP (Shielded) añade blindaje metálico para entornos industrialmente ruidosos. Categorías definen capacidad: Cat5e (100 MHz, 1 Gbps), Cat6 (250 MHz, 1 Gbps con mejor inmunidad), Cat6a (500 MHz, 10 Gbps), Cat8 (2000 MHz, 25-40 Gbps en distancias cortas). La limitación es la atenuación creciente con frecuencia y el efecto piel que concentra corriente en la superficie del conductor.

**Coaxial:** Conductor central cilíndrico, aislante dieléctrico, malla conductora externa, funda protectora. La geometría coaxial confina el campo electromagnético entre conductores, minimizando radiación hacia fuera y captación desde fuera. Ofrece ancho de banda superior al par trenzado —cientos de MHz— con mejor inmunidad a interferencias. Historically utilizado en redes ethernet (10BASE2, 10BASE5) y aún en cable modems (DOCSIS) y distribución de señal de video. La rigidez mecánica y costo limitan su uso frente a la flexibilidad del par trenzado para instalaciones estructuradas.

**Fibra óptica:** Núcleo de vidrio o plástico ultra-puro (5-10 μm en monomodo, 50-62.5 μm en multimodo), revestimiento de índice menor, recubrimiento protector. La luz se guía por reflexión interna total, con atenuación de 0.2-0.5 dB/km (monomodo) versus decenas de dB/km en cobre a alta frecuencia. La fibra no conduce electricidad, inmune a interferencias electromagnéticas y descargas atmosféricas. El ancho de banda es teóricamente terahertz, prácticamente limitado por dispersión y no linealidades. Los conectores (LC, SC, ST) requieren precisión submicrométrica; la instalación es más delicada que en cobre.

### Medios no guiados

**Radiofrecuencia:** Ondas electromagnéticas de 3 kHz a 300 GHz, propagándose por espacio libre con atenuación que aumenta con el cuadrado de la distancia (o cuarta potencia en entornos con múltiples trayectorias). La propagación puede ser por onda de superficie (siguiendo la curvatura terrestre, AM broadcast), ionosférica (reflexión en capas ionizadas, comunicaciones transcontinentales de HF), o espacial (línea visual directa, VHF/UHF y superiores). La regulación espectral asigna bandas específicas para servicios, evitando interferencias destructivas.

**Microondas:** Frecuencias de 1-300 GHz, utilizadas para enlaces punto-a-punto terrestres y satelitales. Las antenas parabólicas concentran energía en haces direccionales, permitiendo alta potencia efectiva y rechazo de interferencias laterales. Los enlaces terrestres requieren repetidores cada 30-50 km debido a la curvatura terrestre. Los satélites en órbita geoestacionaria actúan como repetidores a 35,786 km de altitud, introduciendo latencia de ~250 ms por ida y vuelta. Los sistemas LEO (Starlink, etc.) reducen latencia mediante constelaciones en órbita baja, a costa de complejidad de seguimiento.

**Infrarrojo:** Radiación electromagnética de 300 GHz a 400 THz, justo por debajo del espectro visible. Utilizado en comunicaciones de corto alcance (mandos a distancia, IrDA entre dispositivos portátiles, LiFi para transmisión de datos mediante luz LED modulada). No atraviesa obstáculos opacos, proporcionando seguridad inherente contra escucha no autorizada, pero limitando aplicaciones a línea visual directa o reflexiones controladas.

## Codificación

### Codificación digital

Las secuencias binarias deben convertirse en formas de onda apropiadas para el medio. Las codificaciones de línea determinan esta conversión, balanceando eficiencia espectral, capacidad de sincronización, y robustez contra componente DC.

**NRZ (Non-Return-to-Zero):** Nivel alto para 1, nivel bajo para 0, mantenido durante todo el período de bit. Simple pero problemática: secuencias largas de 0s o 1s carecen de transiciones, dificultando la sincronización de reloj, y el componente DC (valor promedio no nulo) complica acoplamiento mediante transformadores. Utilizada en interfaces seriales de corta distancia donde estos problemas son manejables.

**Manchester:** Cada bit se codifica como transición: 0 es flanco ascendente en el centro del período, 1 es flanco descendente. Garantiza transición en cada bit, facilitando sincronización, y mantiene balance DC perfecto. El costo es duplicar el ancho de banda requerido: la frecuencia máxima es el doble de la tasa de bits. Utilizada en ethernet 10BASE-T y RFID, donde la robustez de sincronización compensa la ineficiencia espectral.

**4B/5B:** Cada grupo de 4 bits de datos se mapea a 5 bits de código, seleccionados de modo que nunca haya más de tres ceros consecutivos. Esto garantiza suficientes transiciones para sincronización sin el costo del 50% de Manchester. Utilizada en 100BASE-TX (Fast Ethernet) y FDDI, combinada con codificación MLT-3 de tres niveles.

**8B/10B:** Similar principio extendido: 8 bits de datos se codifican en 10, con balance DC controlado y suficientes transiciones. Ofrece 256 códigos de datos válidos y códigos de control adicionales para sincronización de trama y gestión de enlace. Utilizada en Gigabit Ethernet, PCI Express, SATA, USB 3.0. La eficiencia del 80% es aceptable dado el ancho de banda disponible en estos medios.

### Modulación

Cuando el medio no permite señales baseband (como radiofrecuencia), los bits modulan una portadora de frecuencia mucho mayor.

**ASK (Amplitude Shift Keying):** Dos amplitudes distintas representan 0 y 1. Simple pero poco robusta ante ruido de amplitud (común). Utilizada en RFID pasivos y comunicaciones ópticas simples.

**FSK (Frequency Shift Keying):** Dos frecuencias distintas representan los estados. Más robusta que ASK porque el ruido afecta menos a frecuencia que a amplitud. Utilizada en modems telefónicos de baja velocidad, Bluetooth, y sistemas de control industrial.

**PSK (Phase Shift Keying):** Dos fases distintas (0° y 180° para BPSK) representan los bits. Muy eficiente en potencia: para una probabilidad de error dada, PSK requiere menos energía por bit que ASK o FSK. BPSK (Binary PSK) transporta 1 bit por símbolo; QPSK (Quadrature PSK, cuatro fases) transporta 2 bits; 8-PSK transporta 3 bits. Utilizada en Wi-Fi, satélites, y sistemas donde la potencia es limitada.

**QAM (Quadrature Amplitude Modulation):** Combina modulación de amplitud y fase. QAM-16 utiliza 4 amplitudes y 4 fases para 16 símbolos distintos (4 bits por símbolo). QAM-256, utilizada en cable modems modernos y Wi-Fi de alta velocidad, transporta 8 bits por símbolo. La complejidad crece exponencialmente: símbolos más cercanos en la constelación son más difíciles de distinguir ante ruido, requiriendo mejor SNR para mantener la tasa de error.

### Multiplexación

Múltiples comunicaciones pueden compartir un medio mediante técnicas de multiplexación que separan señales en dimensiones ortogonales.

**TDM (Time Division Multiplexing):** El tiempo se divide en ranuras; cada comunicación utiliza ranuras periódicamente asignadas. Digital por naturaleza, utilizado en redes telefónicas tradicionales (T1/E1) y en variantes modernas como TDMA en comunicaciones móviles. Requiere sincronización precisa entre emisor y receptor.

**FDM (Frequency Division Multiplexing):** El ancho de banda se divide en canales de frecuencia no superpuestos, separados por bandas de guarda. Analógico por naturaleza, utilizado en radio broadcast (cada estación en su frecuencia) y en sistemas de cable donde múltiples canales de TV coexisten en el mismo coaxial. OFDM (Orthogonal FDM) es variante digital donde subportadoras se superponen ortogonalmente, maximizando uso espectral; utilizada en Wi-Fi, 4G/5G, y ADSL.

**WDM (Wavelength Division Multiplexing):** Variante de FDM para fibra óptica. Múltiples longitudes de onda (colores) de luz coexisten en la misma fibra sin interferir, cada una transportando canales independientes de gigabits. WDM denso (DWDM) utiliza decenas o cientos de longitudes de onda espaciadas 0.8 nm o menos, transformando un par de fibras en infraestructura de terabits. Los amplificadores ópticos (EDFA) pueden amplificar todas las longitudes de onda simultáneamente sin conversión a eléctrico, permitiendo transmisiones transoceánicas sin regeneración intermedia.


## Quédate con...

- Las señales digitales sobreviven mejor que las analógicas porque pueden regenerarse perfectamente en repetidores, descartando ruido acumulado; la digitalización es la base de la fiabilidad de redes modernas.
- Amplitud, frecuencia y fase son los tres grados de libertad fundamentales de toda señal periódica, explotables individualmente o combinadamente (QAM) para codificar información.
- El ancho de banda limita la velocidad de símbolos según Nyquist; la relación señal-ruido (SNR) limita la eficiencia de bits por símbolo según Shannon; juntos determinan la capacidad teórica máxima de cualquier canal.
- Los medios guiados (par trenzado, coaxial, fibra óptica) confinan la energía, ofreciendo control y seguridad; los no guiados (radiofrecuencia, microondas, infrarrojo) liberan la energía, permitiendo movilidad pero exponiéndose a interferencias y escucha.
- Las codificaciones de línea (NRZ, Manchester, 4B/5B, 8B/10B) optimizan la representación de bits para sincronización de reloj, balance DC, y eficiencia espectral; las modulaciones (ASK, FSK, PSK, QAM) adaptan señales digitales a medios que requieren portadoras.
- La multiplexación (TDM por tiempo, FDM por frecuencia, WDM por longitud de onda) permite compartir infraestructura física entre múltiples comunicaciones independientes, escalando la capacidad de sistemas sin aumentar el número de cables o fibras.



<div class="pagination">
  <a href="/markdown/sistemas/redes/fisica/funciones" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/fisica/cables" class="next">Siguiente</a>
</div>
