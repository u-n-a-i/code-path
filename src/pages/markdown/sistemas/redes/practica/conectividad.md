---
title: "Diagnóstico de conectividad"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Diagnóstico de conectividad](#diagnóstico-de-conectividad)
  - [`ping`, `traceroute`, `mtr`: diagnóstico de alcance y ruta](#ping-traceroute-mtr-diagnóstico-de-alcance-y-ruta)
  - [`ip route show`, `ip addr show`: inspección de configuración local](#ip-route-show-ip-addr-show-inspección-de-configuración-local)
  - [`ss -tuln`: verificación de puertos y servicios locales](#ss--tuln-verificación-de-puertos-y-servicios-locales)
  - [Quédate con...](#quédate-con)

</div>

# Diagnóstico de conectividad

La conectividad de red no es un estado binario: un sistema puede tener interfaz activa, dirección IP asignada y tabla de enrutamiento configurada, y aún así ser incapaz de alcanzar un destino específico. Diagnosticar fallos requiere observar la pila de red en múltiples niveles —enlace, red, transporte— y correlacionar evidencias para identificar dónde se rompe la cadena de comunicación. Las herramientas de diagnóstico en Linux exponen esta capa operativa, permitiendo verificar configuraciones, medir latencia, trazar rutas y detectar puertos bloqueados. Dominar estas utilidades transforma la resolución de problemas de red de un proceso de prueba y error en una metodología basada en observación sistemática.

## `ping`, `traceroute`, `mtr`: diagnóstico de alcance y ruta

Estas tres herramientas operan en la capa de red, utilizando protocolos ICMP para verificar conectividad y mapear el camino hacia destinos remotos. Cada una aporta una perspectiva distinta: `ping` confirma alcance básico, `traceroute` revela la topología intermedia, y `mtr` combina ambas con monitoreo continuo.

`ping` envía paquetes ICMP Echo Request a un destino y espera respuestas Echo Reply. La invocación `ping -c 4 ejemplo.com` transmite cuatro paquetes y muestra estadísticas: paquetes enviados/recibidos, pérdida porcentual, y tiempos mínimo/máximo/promedio de ida y vuelta (RTT). La pérdida de paquetes indica congestión, enlace defectuoso o filtrado por firewall; latencias elevadas sugieren rutas subóptimas o saturación de enlaces. Cuando `ping` falla, el primer paso es probar con la dirección IP directa (`ping 93.184.216.34`): si funciona con IP pero no con nombre, el problema es de resolución DNS, no de conectividad.

`traceroute` revela el camino que siguen los paquetes hacia un destino, mostrando cada salto (router) intermedio y la latencia acumulada. Funciona enviando paquetes con TTL (*Time To Live*) incremental: el primer paquete tiene TTL=1, el router más cercano lo descarta y responde con ICMP "Time Exceeded"; el segundo tiene TTL=2, alcanzando el segundo salto, y así sucesivamente. Cada respuesta revela la dirección IP (y a veces el nombre DNS) del router intermedio. La opción `traceroute -I` usa ICMP en lugar de UDP por defecto, evitando filtrado en algunos firewalls.

`mtr` (*My TraceRoute*) combina `ping` y `traceroute` en tiempo real, mostrando pérdida de paquetes y latencia por salto de forma continua. Mientras `traceroute` ofrece una instantánea, `mtr` permite observar fluctuaciones: un salto con pérdida intermitente sugiere congestión temporal; pérdida consistente en un salto específico indica un enlace problemático. La interfaz interactiva permite pausar, reiniciar o exportar resultados, facilitando diagnóstico de intermitencia que herramientas estáticas no capturan.

> Algunos routers y firewalls bloquean ICMP por política de seguridad, apareciendo como `* * *` en `traceroute` o sin respuesta en `ping`. La ausencia de respuesta no garantiza inalcanzabilidad: combinar con pruebas de capa de transporte (`curl`, `nc`) ofrece diagnóstico más completo.

## `ip route show`, `ip addr show`: inspección de configuración local

Antes de diagnosticar conectividad remota, es esencial verificar la configuración local: qué interfaces están activas, qué direcciones IP tienen asignadas, y cómo el sistema decide hacia dónde enviar el tráfico. La suite `ip` de iproute2 proporciona esta visibilidad con precisión y detalle.

`ip addr show` (o `ip a`) lista todas las interfaces de red con sus direcciones IP asignadas, estado operativo, dirección MAC y MTU. Cada interfaz muestra su índice numérico, nombre (`lo`, `enp0s3`, `wlp2s0`), estado (`UP`/`DOWN`), y direcciones IPv4/IPv6 con prefijos CIDR. La salida incluye información crítica: una interfaz `DOWN` indica problema físico o de configuración; ausencia de dirección IP sugiere fallo en DHCP o configuración estática incorrecta; múltiples direcciones en una interfaz pueden indicar configuración compleja o conflictos.

`ip route show` despliega la tabla de enrutamiento del kernel, indicando cómo el sistema decide el siguiente salto para cada destino. La entrada `default via 192.168.1.1 dev enp0s3` especifica el gateway predeterminado: todo tráfico hacia redes no locales se envía a `192.168.1.1` a través de la interfaz `enp0s3`. Rutas específicas (`10.0.0.0/8 via 192.168.1.254`) permiten enrutamiento dirigido para redes internas. La ausencia de ruta por defecto explica por qué un sistema puede comunicarse localmente pero no alcanzar internet.

La combinación de ambas consultas permite diagnóstico estructurado: `ip a` verifica que la interfaz tenga dirección válida; `ip route` confirma que existe ruta hacia el destino; si ambas son correctas pero la conectividad falla, el problema probablemente reside más allá del host local —firewall, router intermedio o destino inalcanzable.

> Los cambios realizados con comandos `ip` son temporales: se pierden al reiniciar. Para configuración persistente, integrar comandos en archivos de configuración de red (Netplan, NetworkManager) según la distribución.

## `ss -tuln`: verificación de puertos y servicios locales

La conectividad no solo depende de alcanzar un destino: requiere que el servicio esperado esté escuchando en el puerto correcto y aceptando conexiones. `ss` (*socket statistics*) expone el estado de sockets TCP/UDP en el sistema, permitiendo verificar qué servicios están activos y accesibles localmente.

La invocación `ss -tuln` muestra sockets TCP (`-t`) y UDP (`-u`) en escucha (`-l`) con direcciones numéricas (`-n`), revelando qué puertos están abiertos y en qué interfaces. Una salida típica:

```
State  Recv-Q Send-Q Local Address:Port  Peer Address:Port
LISTEN 0      128          0.0.0.0:22         0.0.0.0:*
LISTEN 0      128          0.0.0.0:80         0.0.0.0:*
LISTEN 0      128             [::]:22            [::]:*
```

Esto indica que SSH (puerto 22) y HTTP (puerto 80) están escuchando en todas las interfaces IPv4 e IPv6. La columna `Local Address:Port` identifica dónde escucha el servicio: `127.0.0.1:3306` significa que MySQL solo acepta conexiones locales; `0.0.0.0:443` indica que HTTPS está accesible desde cualquier interfaz.

El filtrado por expresión permite consultas específicas: `ss -tuln dst :443` muestra solo sockets hacia puerto 443; `ss -tuln sport = :80` filtra por puerto de origen. La opción `-p` añade información del proceso propietario (PID/nombre), útil para identificar qué aplicación posee un socket inesperado.

> `ss` consulta información del kernel vía netlink, no lee `/proc` como `netstat`. Esto lo hace significativamente más rápido en sistemas con miles de conexiones concurrentes, y permite filtrado en el kernel antes de devolver resultados.

## Quédate con...

*   `ping` verifica conectividad básica mediante ICMP, midiendo latencia y pérdida de paquetes; probar con IP directa ayuda a aislar problemas de resolución DNS.
*   `traceroute` revela la ruta completa hacia un destino mostrando cada salto intermedio; `mtr` combina esta funcionalidad con monitoreo continuo de pérdida y latencia para diagnosticar intermitencia.
*   `ip addr show` y `ip route show` permiten inspeccionar configuración local: interfaces activas, direcciones asignadas y tabla de enrutamiento, esenciales para descartar problemas del host antes de investigar la red.
*   `ss -tuln` expone sockets TCP/UDP en escucha, permitiendo verificar qué servicios están activos y en qué puertos, crítico para confirmar que un servidor está realmente aceptando conexiones.
*   El diagnóstico efectivo sigue una secuencia lógica: verificar configuración local (`ip a`, `ip route`), confirmar alcance (`ping`), trazar ruta (`traceroute`/`mtr`), y validar servicios (`ss`, `curl`).
*   La ausencia de respuesta ICMP no garantiza inalcanzabilidad: firewalls pueden bloquear ping mientras permiten tráfico de aplicación; combinar herramientas de distintas capas ofrece diagnóstico robusto.

<div class="pagination">
  <a href="/markdown/sistemas/redes/practica/configuracion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/practica/dns" class="next">Siguiente</a>
</div>
