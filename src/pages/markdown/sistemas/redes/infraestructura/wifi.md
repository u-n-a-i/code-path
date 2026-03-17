---
title: "Wi-Fi"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Wi-Fi](#wi-fi)
  - [Frecuencias: 2.4 GHz vs 5 GHz](#frecuencias-24-ghz-vs-5-ghz)
  - [Canales y gestión de interferencia](#canales-y-gestión-de-interferencia)
  - [Seguridad: WPA2, WPA3 y contraseñas fuertes](#seguridad-wpa2-wpa3-y-contraseñas-fuertes)
  - [Quédate con...](#quédate-con)

</div>

# Wi-Fi

La comunicación inalámbrica elimina la dependencia del cable físico pero introduce complejidades propias del medio compartido: señales que se superponen, obstáculos que atenúan la propagación y dispositivos que compiten por el mismo espectro. Wi-Fi, basado en el estándar IEEE 802.11, transforma ondas de radio en enlaces de datos confiables mediante técnicas de modulación, gestión de acceso al medio y cifrado. Comprender cómo operan las frecuencias, los canales y los mecanismos de seguridad permite diseñar redes que equilibran cobertura, rendimiento y protección sin depender de configuraciones por defecto que rara vez se adaptan al entorno real.

## Frecuencias: 2.4 GHz vs 5 GHz

Las redes Wi-Fi operan principalmente en dos bandas de frecuencia no licenciadas: 2.4 GHz y 5 GHz. Cada una ofrece características distintas que influyen directamente en el alcance, la velocidad y la resistencia a interferencias.

La banda de 2.4 GHz proporciona mayor alcance físico porque las ondas de menor frecuencia atraviesan mejor obstáculos como paredes, muebles o suelos. Sin embargo, su espectro es estrecho: solo tres canales no solapados (1, 6 y 11 en la mayoría de regiones) comparten el espacio con dispositivos Bluetooth, hornos microondas, teléfonos inalámbricos y redes vecinas. Esta congestión genera interferencia co-canal y adyacente, degradando el throughput y aumentando la latencia. En entornos urbanos densos, la banda de 2.4 GHz suele estar saturada, limitando su utilidad a dispositivos de bajo ancho de banda o como respaldo de cobertura.

La banda de 5 GHz ofrece espectro más amplio, con hasta 23 canales no solapados dependiendo de la regulación local. Esto reduce drásticamente la probabilidad de interferencia entre redes cercanas. Además, las frecuencias más altas permiten modulaciones más eficientes (256-QAM, 1024-QAM en Wi-Fi 6), habilitando velocidades teóricas superiores. La contrapartida es un alcance reducido: las ondas de 5 GHz se atenúan más rápido con la distancia y tienen menor capacidad para penetrar materiales densos. Por esta razón, la banda de 5 GHz es preferible para aplicaciones que requieren alto throughput —streaming 4K, videollamadas, transferencia de archivos— siempre que el dispositivo esté dentro de un rango razonable del punto de acceso.

> Los routers modernos de banda dual o tri-banda emiten simultáneamente en 2.4 GHz y 5 GHz (y 6 GHz en Wi-Fi 6E), permitiendo que los dispositivos se conecten a la frecuencia más adecuada según su ubicación y requisitos. La función "band steering" intenta dirigir automáticamente a los clientes hacia 5 GHz cuando la señal es suficiente, pero su efectividad depende de la implementación del fabricante.

## Canales y gestión de interferencia

Un canal Wi-Fi es un segmento específico del espectro de frecuencia asignado para una transmisión. En 2.4 GHz, cada canal ocupa aproximadamente 22 MHz, pero están separados solo por 5 MHz, lo que causa solapamiento entre canales adyacentes. Solo los canales 1, 6 y 11 (en regiones que siguen la normativa FCC/ETSI) no se superponen entre sí. Configurar redes vecinas en canales solapados —por ejemplo, una en canal 3 y otra en canal 6— genera interferencia destructiva que degrada ambas conexiones.

En 5 GHz, los canales son más anchos (20, 40, 80 o incluso 160 MHz en configuraciones de alto rendimiento) pero están más espaciados, permitiendo múltiples redes coexistentes sin interferencia. El ancho de canal mayor incrementa el throughput potencial pero también la susceptibilidad a ruido: un canal de 80 MHz tiene más probabilidad de intersectar con fuentes de interferencia que uno de 20 MHz. Por esta razón, en entornos congestionados puede ser preferible forzar anchos de canal menores para priorizar estabilidad sobre velocidad máxima.

La selección automática de canal, habilitada por defecto en muchos routers, escanea el espectro al arranque y elige el canal menos congestionado. Sin embargo, esta decisión es estática: no se reevalúa durante la operación. En entornos dinámicos donde redes vecinas cambian de canal o aparecen nuevos dispositivos, la configuración manual basada en un análisis previo con herramientas como `iwlist`, `Wi-Fi Analyzer` o `Acrylic Wi-Fi` suele ofrecer resultados más consistentes.

> Los canales DFS (*Dynamic Frequency Selection*) en 5 GHz (típicamente 52-144) permiten acceso a espectro adicional pero requieren que el punto de acceso monitoree continuamente la presencia de radares meteorológicos o militares. Si detecta una señal de radar, debe abandonar el canal en segundos. Esta característica puede causar desconexiones breves en entornos cercanos a aeropuertos o instalaciones gubernamentales.

## Seguridad: WPA2, WPA3 y contraseñas fuertes

La naturaleza abierta del medio radioeléctrico expone el tráfico Wi-Fi a cualquier dispositivo dentro del rango de recepción. Sin cifrado, un atacante puede capturar paquetes, extraer credenciales, inyectar tráfico o suplantar identidades. Los protocolos de seguridad Wi-Fi evolucionan para cerrar vulnerabilidades descubiertas en implementaciones anteriores.

WPA2 (*Wi-Fi Protected Access 2*), basado en el estándar IEEE 802.11i y obligatorio desde 2006, utiliza el algoritmo AES-CCMP para cifrar el tráfico y autenticar dispositivos mediante una clave precompartida (PSK) o un servidor RADIUS (WPA2-Enterprise). Su debilidad principal radica en el handshake de cuatro vías: un atacante que capture este intercambio puede intentar descifrar la clave PSK mediante fuerza bruta offline si la contraseña es débil. El ataque KRACK (*Key Reinstallation Attack*), publicado en 2017, explotó una vulnerabilidad en la implementación del handshake, aunque fue mitigado mediante actualizaciones de firmware en dispositivos compatibles.

WPA3, estandarizado en 2018, introduce mejoras arquitectónicas. El modo Personal utiliza SAE (*Simultaneous Authentication of Equals*), un protocolo de intercambio de claves resistente a ataques de diccionario offline: incluso si un atacante captura el handshake, no puede probar contraseñas sin interactuar con la red en tiempo real. El modo Enterprise ofrece cifrado de 192 bits para entornos gubernamentales o críticos. Además, WPA3 implementa *forward secrecy*: la compromisión de una clave no permite descifrar tráfico capturado previamente.

La fortaleza de la contraseña sigue siendo crítica incluso con WPA3. Una PSK debe tener al menos 12-16 caracteres, combinando mayúsculas, minúsculas, números y símbolos, evitando patrones predecibles o palabras de diccionario. Las frases de paso (*passphrases*) largas pero memorables —como "CaféMañana#Lluvia2024!"— ofrecen mejor seguridad y usabilidad que cadenas cortas complejas.

> WPA3 no es retrocompatible con dispositivos antiguos. En redes mixtas, muchos routers ofrecen un modo "WPA2/WPA3 Transitional" que permite conexiones con ambos protocolos. Esta configuración mantiene compatibilidad pero reduce la seguridad global al nivel del protocolo más débil aceptado. Siempre que sea posible, migrar todos los dispositivos a WPA3 y deshabilitar WPA2 mejora la postura de seguridad.

## Quédate con...

*   La banda de 2.4 GHz ofrece mayor alcance pero solo tres canales no solapados, siendo vulnerable a congestión en entornos densos; 5 GHz proporciona más canales y velocidad, con menor alcance y penetración.
*   Los canales solapados en 2.4 GHz (1, 6, 11 son los únicos no interferentes) deben configurarse manualmente para evitar degradación por interferencia co-canal o adyacente.
*   El ancho de canal mayor (40/80/160 MHz) incrementa throughput pero también la exposición a ruido; en entornos congestionados, anchos menores pueden ofrecer mayor estabilidad.
*   WPA2 con AES es el mínimo aceptable; WPA3 con SAE protege contra ataques de fuerza bruta offline y ofrece forward secrecy, pero requiere hardware compatible.
*   La seguridad Wi-Fi depende tanto del protocolo como de la fortaleza de la contraseña: frases de paso largas y aleatorias son más efectivas que cadenas cortas complejas.
*   La gestión proactiva de frecuencias, canales y actualizaciones de firmware es esencial para mantener rendimiento y seguridad en redes inalámbricas operativas.


<div class="pagination">
  <a href="/markdown/sistemas/redes/infraestructura/cableado" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/infraestructura/incidencias" class="next">Siguiente</a>
</div>
