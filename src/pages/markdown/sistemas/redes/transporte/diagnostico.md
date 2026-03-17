---
title: "Herramientas de diagnóstico"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Herramientas de diagnóstico](#herramientas-de-diagnóstico)
  - [`netstat`, `ss`, `lsof` para ver conexiones activas](#netstat-ss-lsof-para-ver-conexiones-activas)
  - [`tcpdump` y Wireshark (visión general)](#tcpdump-y-wireshark-visión-general)
  - [Quédate con...](#quédate-con)

</div>

# Herramientas de diagnóstico

Diagnosticar el comportamiento de una red requiere observar lo que normalmente es invisible: flujos de paquetes, estados de conexión, puertos en escucha y tráfico en tránsito. Las herramientas de diagnóstico exponen esta capa operativa, permitiendo identificar cuellos de botella, detectar intrusiones, validar configuraciones o comprender por qué una aplicación no se conecta. No son instrumentos de último recurso: su uso proactivo transforma la administración de redes de una práctica reactiva en una disciplina basada en evidencia.

## `netstat`, `ss`, `lsof` para ver conexiones activas

Estas tres utilidades comparten un propósito: revelar qué conexiones de red están activas en el sistema, qué procesos las poseen y en qué estado se encuentran. Sin embargo, difieren en arquitectura, rendimiento y nivel de detalle.

`netstat` (*network statistics*) fue durante décadas la herramienta estándar para inspeccionar conexiones, tablas de enrutamiento e interfaces. Su sintaxis `netstat -tuln` muestra puertos TCP/UDP en escucha (`-l`), numéricamente (`-n`), sin resolver nombres. Aunque sigue presente en muchos sistemas por compatibilidad, está **obsoleta** en entornos modernos: consulta información mediante lectura de archivos en `/proc`, lo que la hace lenta en sistemas con miles de conexiones.

`ss` (*socket statistics*) es su reemplazo diseñado para el kernel Linux moderno. Accede directamente a la información de sockets mediante la interfaz `netlink`, ofreciendo rendimiento órdenes de magnitud superior. La sintaxis es similar (`ss -tuln`), pero con capacidades extendidas: filtrado por expresión (`ss dst :443`), visualización de estadísticas de TCP (`ss -ti`), y detalles de buffers y retransmisiones. En cualquier sistema actual, `ss` debe ser la primera opción para diagnóstico de conexiones.

`lsof` (*list open files*) explota una abstracción fundamental de Unix: "todo es un archivo", incluidos los sockets de red. Ejecutar `lsof -i :80` lista todos los procesos que tienen abierto un socket en el puerto 80, mostrando PID, usuario, protocolo y estado. Esta perspectiva centrada en procesos es invaluable para identificar qué aplicación está escuchando en un puerto inesperado o por qué un puerto no puede ser vinculado ("Address already in use").

> `ss` y `netstat` muestran sockets desde la perspectiva del kernel; `lsof` los muestra desde la perspectiva de los procesos. Usar ambas complementariamente permite cruzar información: `ss` revela el estado de la conexión, `lsof` identifica al responsable.

## `tcpdump` y Wireshark (visión general)

Mientras las herramientas anteriores operan a nivel de sockets del sistema operativo, `tcpdump` y Wireshark capturan tráfico a nivel de enlace, permitiendo observar los paquetes reales que circulan por la red. Esta visibilidad de bajo nivel es esencial para diagnosticar problemas de conectividad, analizar protocolos o investigar incidentes de seguridad.

`tcpdump` es una herramienta de línea de comandos que captura paquetes en una interfaz de red y los muestra en formato legible. Su potencia radica en el filtrado mediante expresiones BPF (*Berkeley Packet Filter*): `tcpdump -i eth0 'tcp port 443 and host 192.168.1.10'` captura únicamente tráfico HTTPS hacia o desde un host específico. La salida muestra timestamps, direcciones IP, puertos, flags TCP y longitud de payload. Con la opción `-w`, los paquetes se guardan en archivo `.pcap` para análisis posterior.

Wireshark es la interfaz gráfica que revoluciona el análisis de tráfico capturado. Importa archivos `.pcap` (de `tcpdump` o de su propia captura) y presenta cada paquete en tres paneles: lista de paquetes, desglose jerárquico de cabeceras por capa, y vista hexadecimal del payload. Su motor de disección interpreta cientos de protocolos, mostrando campos con nombres significativos en lugar de bytes crudos. Los filtros de visualización (`http.request.method == "POST"`) permiten aislar tráfico relevante en capturas de gigabytes.

> Capturar tráfico en producción requiere precaución. `tcpdump` con filtros estrictos minimiza el impacto en CPU y almacenamiento. Wireshark debe usarse sobre capturas previamente filtradas, no en tiempo real sobre enlaces de alto throughput. Además, el tráfico capturado puede contener datos sensibles: aplicar principios de mínima exposición y cifrar archivos `.pcap` en reposo.

## Quédate con...

*   `ss` reemplaza a `netstat` en sistemas modernos: mismo propósito, rendimiento muy superior mediante acceso directo al kernel vía netlink.
*   `lsof -i :puerto` identifica qué proceso posee un socket, útil para diagnosticar conflictos de vinculación o servicios no esperados.
*   `tcpdump` permite capturar y filtrar tráfico en tiempo real mediante expresiones BPF; su salida puede guardarse en `.pcap` para análisis offline.
*   Wireshark proporciona análisis visual profundo de paquetes capturados, con disección de protocolos y filtros potentes para explorar tráfico complejo.
*   La combinación `ss` (qué está conectado) + `tcpdump` (qué trafica) + Wireshark (por qué falla) cubre la mayoría de escenarios de diagnóstico de red.
*   La captura de tráfico expone datos sensibles: aplicar filtros estrictos, minimizar tiempo de captura y proteger los archivos resultantes.



<div class="pagination">
  <a href="/markdown/sistemas/redes/transporte/comparacion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/transporte/segmentacion" class="next">Siguiente</a>
</div>
