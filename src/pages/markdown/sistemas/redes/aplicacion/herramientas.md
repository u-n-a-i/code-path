---
title: "Uso de herramientas CLI"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Uso de herramientas CLI](#uso-de-herramientas-cli)
  - [`curl`: transferencia de datos mediante URLs](#curl-transferencia-de-datos-mediante-urls)
  - [`wget`: descarga orientada a archivos](#wget-descarga-orientada-a-archivos)
  - [`dig` y `nslookup`: consulta de registros DNS](#dig-y-nslookup-consulta-de-registros-dns)
  - [`telnet` y `nc` (netcat): conexión cruda a puertos](#telnet-y-nc-netcat-conexión-cruda-a-puertos)
  - [Quédate con...](#quédate-con)

</div>

# Uso de herramientas CLI

La interacción con servicios de red no requiere interfaces gráficas complejas: protocolos como HTTP, DNS o TCP son esencialmente intercambios de texto o bytes estructurados que pueden generarse e interpretarse directamente desde la línea de comandos. Herramientas como `curl`, `wget`, `dig` o `nc` exponen esta capa operativa, permitiendo probar conectividad, depurar respuestas de servidores, automatizar consultas o simular clientes personalizados sin depender de aplicaciones de propósito general. Esta capacidad de intervención directa transforma la terminal en un laboratorio de red portátil, donde cada comando es un experimento controlado sobre el comportamiento de sistemas distribuidos.

## `curl`: transferencia de datos mediante URLs

`curl` (*client URL*) es una herramienta multifuncional para transferir datos desde o hacia servidores usando más de veinte protocolos, incluyendo HTTP, HTTPS, FTP, SMTP e IMAP. Su diseño refleja la filosofía Unix: hacer una cosa bien, pero hacerla de forma composable. `curl` no navega páginas web; recupera recursos, envía peticiones con métodos personalizados, negocia autenticación, maneja cookies y expone cabeceras de respuesta para inspección.

Una invocación típica como `curl -I https://ejemplo.com` recupera únicamente las cabeceras HTTP mediante una petición `HEAD`, revelando el código de estado, el tipo de contenido, políticas de caché y configuración de seguridad sin descargar el cuerpo. Opciones como `-H` permiten inyectar cabeceras personalizadas (`-H "Authorization: Bearer token"`), `-d` envía datos en peticiones POST, y `-o` guarda la respuesta en un archivo local. La capacidad de scripting convierte a `curl` en un componente esencial para automatización: pruebas de salud de APIs, despliegues continuos que validan endpoints, o monitoreo simple de disponibilidad.

> `curl` muestra la respuesta cruda por defecto. Para inspeccionar el intercambio completo (petición y respuesta), usar `-v` (verbose) o `--trace-ascii` para un registro legible de cada byte transmitido, útil para depurar negociaciones TLS o malformaciones de protocolo.

## `wget`: descarga orientada a archivos

`wget` está especializado en la recuperación no interactiva de archivos desde servidores web y FTP. A diferencia de `curl`, que prioriza flexibilidad protocolar, `wget` optimiza escenarios de descarga robusta: reanudación de transferencias interrumpidas (`-c`), descarga recursiva de sitios completos (`-r`), y adaptación a límites de ancho de banda (`--limit-rate`). Su comportamiento por defecto —guardar el archivo con su nombre original en el directorio actual— lo hace ideal para scripts de instalación, respaldo de recursos estáticos o adquisición de datasets públicos.

La capacidad de operar en segundo plano sin intervención humana distingue a `wget` en entornos de servidor. Una instrucción como `wget -b https://ejemplo.com/datos.zip` inicia la descarga en background, registrando progreso en un archivo de log, permitiendo que la sesión de terminal se libere para otras tareas. Opciones como `--tries=3` y `--timeout=30` añaden resiliencia ante redes inestables, reintentando automáticamente ante fallos transitorios.

> `wget` y `curl` no son intercambiables por diseño: `wget` sobresale en descargas persistentes y recursivas; `curl` en interacción protocolar fina y scripting de APIs. Conocer ambas permite seleccionar la herramienta adecuada según el patrón de uso.

## `dig` y `nslookup`: consulta de registros DNS

`dig` (*Domain Information Groper*) y `nslookup` son utilidades para consultar el sistema de nombres de dominio, pero difieren en filosofía y salida. `dig` produce información estructurada y legible: cabecera de respuesta, sección de preguntas, respuestas autoritativas, tiempos de consulta y metadatos del servidor consultado. Una consulta típica como `dig ejemplo.com MX` revela los servidores de correo aceptantes para el dominio, sus prioridades y los registros TXT asociados para verificación SPF/DKIM.

`nslookup`, más antiguo, ofrece una interfaz interactiva que permite cambiar de servidor DNS en tiempo real o consultar tipos de registro específicos mediante comandos dentro de la sesión. Aunque funcional, su formato de salida es menos consistente y su desarrollo está estancado; `dig` es la herramienta recomendada para diagnóstico serio. Ambas respetan la configuración local de resolución (`/etc/resolv.conf`), pero permiten sobrescribirla consultando servidores específicos: `dig @8.8.8.8 ejemplo.com` evade el resolvedor por defecto para probar un DNS público.

> Las respuestas DNS pueden variar según el servidor consultado debido a caching, geolocalización o políticas de filtrado. Comparar resultados entre `dig @local`, `dig @1.1.1.1` y `dig @autoritativo` revela discrepancias que ayudan a diagnosticar problemas de propagación o configuración.

## `telnet` y `nc` (netcat): conexión cruda a puertos

`telnet` y `nc` (*netcat*) permiten establecer conexiones TCP (y en el caso de `nc`, también UDP) a puertos arbitrarios, enviando y recibiendo datos sin interpretación protocolar. Esta capacidad de "hablar crudo" con servicios los convierte en herramientas de diagnóstico universal: verificar si un puerto está abierto, simular clientes HTTP mínimos, probar handshakes de protocolos personalizados o depurar firewalls.

Una conexión como `telnet ejemplo.com 80` seguida de una petición HTTP manual (`GET / HTTP/1.0` + dos saltos de línea) revela la respuesta cruda del servidor web, incluyendo cabeceras y cuerpo, sin intermediación de navegador. `nc` amplía esta funcionalidad: `nc -l 9000` escucha en un puerto local, convirtiendo la terminal en un servidor eco para pruebas; `nc -zv ejemplo.com 22` verifica conectividad a un puerto sin establecer sesión completa, útil para escaneos rápidos.

> `telnet` transmite en texto plano y carece de soporte para TLS; su uso en producción está desaconsejado. `nc` es más versátil y activo en desarrollo, pero ambas herramientas deben emplearse con precaución: enviar datos malformados a servicios puede provocar comportamientos inesperados o ser registrado como actividad maliciosa.

## Quédate con...

*   `curl` es la herramienta versátil para interactuar con APIs y servicios web: soporta múltiples protocolos, personalización de cabeceras, autenticación y scripting automatizado.
*   `wget` está optimizado para descargas robustas y no interactivas: reanudación, recursividad y operación en background lo hacen ideal para adquisición de archivos en servidores.
*   `dig` proporciona consultas DNS estructuradas y detalladas; `nslookup` ofrece interactividad pero con formato menos consistente —preferir `dig` para diagnóstico profesional.
*   `telnet` y `nc` permiten conexión cruda a puertos TCP/UDP, útiles para probar conectividad, simular protocolos o depurar firewalls, pero requieren precaución por su falta de interpretación protocolar.
*   Estas herramientas no compiten: se complementan según el objetivo —`curl` para APIs, `wget` para archivos, `dig` para DNS, `nc` para conectividad baja nivel— y su dominio conjunto habilita diagnóstico y automatización efectiva desde la terminal.

<div class="pagination">
  <a href="/markdown/sistemas/redes/aplicacion/apis" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
