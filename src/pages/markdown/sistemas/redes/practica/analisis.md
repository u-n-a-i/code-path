---
title: "Análisis de puertos y tráfico"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Análisis de puertos y tráfico](#análisis-de-puertos-y-tráfico)
  - [Nmap: descubrimiento y escaneo](#nmap-descubrimiento-y-escaneo)
  - [Tcpdump: inspección profunda de tráfico](#tcpdump-inspección-profunda-de-tráfico)
  - [Quédate con...](#quédate-con)

</div>

# Análisis de puertos y tráfico

La red opera constantemente intercambiando paquetes que permanecen invisibles para el usuario final hasta que ocurre un fallo o una intrusión. Recuperar esa visibilidad requiere herramientas capaces de interrogar activamente a los dispositivos para descubrir qué servicios exponen y de escuchar pasivamente el medio para inspeccionar el contenido real del tráfico. Esta dualidad entre escaneo activo y captura pasiva constituye la base del análisis de seguridad y diagnóstico avanzado: una revela la superficie de ataque potencial, la otra valida el comportamiento real de la comunicación. Dominar estas técnicas permite auditar la propia infraestructura, detectar configuraciones erróneas y comprender cómo se materializan los protocolos en señales eléctricas y datos binarios.

## Nmap: descubrimiento y escaneo

Nmap (*Network Mapper*) es la herramienta estándar para exploración de redes y auditoría de seguridad. Su función principal es enviar paquetes diseñados específicamente hacia objetivos y analizar las respuestas para inferir información sobre el estado de los hosts, los puertos abiertos, las versiones de software ejecutándose e incluso el sistema operativo subyacente. A diferencia de herramientas de diagnóstico como `ping` que solo verifican alcanzabilidad, Nmap construye un perfil detallado del objetivo mediante técnicas de sondeo variadas.

El escaneo de puertos es la operación más común. Un puerto abierto indica que un servicio está escuchando y aceptando conexiones en ese punto de acceso lógico. Nmap distingue entre estados críticos: *open* (abierto, acepta conexiones), *closed* (cerrado, reachable pero sin servicio escuchando) y *filtered* (filtrado, sin respuesta debido a firewalls o reglas de seguridad). Esta distinción es vital para identificar vectores de ataque: un puerto filtrado sugiere protección activa, mientras que uno abierto expone un servicio potencialmente vulnerable.

La sintaxis básica `nmap <objetivo>` realiza un escaneo predeterminado de los 1000 puertos más comunes. Opciones avanzadas permiten afinar el análisis: `-sS` ejecuta un escaneo SYN sigiloso que no completa el handshake TCP (útil para evadir logs básicos), `-sV` detecta versiones de servicios (identificando si un servidor web es Apache 2.4.41 o Nginx 1.18), y `-O` intenta adivinar el sistema operativo basándose en huellas de pila TCP. La salida proporciona un mapa claro de la superficie de red, esencial para validar que solo los servicios esperados están expuestos.

> El escaneo de redes ajenas sin autorización explícita es ilegal en la mayoría de jurisdicciones. Nmap es una herramienta de administración y auditoría que debe utilizarse exclusivamente en infraestructura propia o bajo contrato formal. Algunos sistemas de detección de intrusos (IDS) alertan inmediatamente ante escaneos Nmap por el patrón característico de sus paquetes.

## Tcpdump: inspección profunda de tráfico

Mientras Nmap interroga activamente, `tcpdump` observa pasivamente. Esta utilidad de línea de comandos captura paquetes que atraviesan una interfaz de red específica, permitiendo inspeccionar cabeceras y cargas útiles en tiempo real. Su valor en el análisis de tráfico radica en la capacidad de filtrar ruido y focalizarse en flujos específicos mediante expresiones BPF (*Berkeley Packet Filter*), revelando detalles que herramientas de mayor nivel ocultan.

El análisis efectivo requiere construir filtros precisos. La expresión `tcpdump -i eth0 'host 192.168.1.10 and port 80'` aísla todo el tráfico HTTP hacia o desde un host específico. Añadir `and not port 22` excluye el ruido de sesiones SSH activas. Esta capacidad de disección permite validar comportamientos de protocolo: verificar si un handshake TLS se completa correctamente, identificar retransmisiones TCP excesivas que sugieren congestión, o detectar paquetes malformados que podrían indicar ataques o errores de implementación.

La salida de `tcpdump` muestra timestamps, direcciones IP, puertos, flags TCP (SYN, ACK, FIN, RST) y longitudes de paquete. Interpretar estas señales permite diagnosticar problemas complejos: una ráfaga de flags RST indica conexiones rechazadas abruptamente; múltiples retransmisiones sugieren pérdida de paquetes en la ruta; paquetes con ventana cero señalan saturación del receptor. Para análisis forense o detallado, la opción `-w archivo.pcap` guarda el tráfico crudo para inspección posterior en Wireshark, combinando la captura ligera de terminal con la visualización gráfica profunda.

> La captura de tráfico en interfaces compartidas (como Wi-Fi público) puede exponer datos sensibles de terceros. Incluso en redes propias, el tráfico cifrado (HTTPS, SSH) mostrará cabeceras visibles pero payload ilegible. El análisis se limita entonces a metadatos: quién habla con quién, cuándo, cuánto y con qué frecuencia, sin acceder al contenido semántico.

## Quédate con...

*   El análisis de red combina escaneo activo (Nmap) para descubrir servicios y captura pasiva (tcpdump) para inspeccionar el tráfico real.
*   Nmap identifica estados de puertos (abierto, cerrado, filtrado) y versiones de servicios, proporcionando un mapa de la superficie de ataque potencial.
*   Tcpdump permite filtrado preciso mediante expresiones BPF para aislar flujos específicos y analizar flags TCP, retransmisiones y patrones de tráfico.
*   La interpretación de salida de tcpdump revela problemas de congestión, configuración o seguridad mediante la observación de flags, timestamps y secuencias.
*   El uso de herramientas de escaneo requiere autorización explícita; el escaneo no autorizado de redes ajenas constituye una actividad ilegal en la mayoría de países.
*   La combinación de ambas herramientas —Nmap para perfilado inicial, tcpdump para validación detallada— cubre la mayoría de escenarios de auditoría y diagnóstico de red avanzado.

<div class="pagination">
  <a href="/markdown/sistemas/redes/practica/escenarios" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
