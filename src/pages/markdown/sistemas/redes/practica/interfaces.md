---
title: "Interfaces de red en Linux"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Interfaces de red en Linux](#interfaces-de-red-en-linux)
  - [Nombres modernos de interfaces](#nombres-modernos-de-interfaces)
  - [Comandos esenciales](#comandos-esenciales)
    - [`ip`: gestión completa de interfaces y enrutamiento](#ip-gestión-completa-de-interfaces-y-enrutamiento)
    - [`ping`: prueba de conectividad básica](#ping-prueba-de-conectividad-básica)
    - [`traceroute`: seguimiento de ruta](#traceroute-seguimiento-de-ruta)
    - [`ss`: monitoreo de sockets y conexiones](#ss-monitoreo-de-sockets-y-conexiones)
    - [`nmcli`: gestión de NetworkManager](#nmcli-gestión-de-networkmanager)
  - [Quédate con...](#quédate-con)

</div>

# Interfaces de red en Linux

La configuración de red en sistemas Linux no depende de interfaces gráficas que ocultan los detalles operativos: cada dirección IP, cada ruta, cada estado de conexión es manipulable mediante comandos que exponen directamente la pila de red del kernel. Esta transparencia permite diagnóstico preciso, automatización mediante scripts y comprensión profunda de cómo el sistema operativo gestiona la conectividad. Dominar estas herramientas transforma la administración de red de un proceso de prueba y error en una disciplina basada en observación y control explícito.

## Nombres modernos de interfaces

La nomenclatura tradicional de interfaces (`eth0`, `wlan0`, `lo`) ha sido reemplazada en distribuciones modernas por un esquema predecible que refleja la topología física del hardware. Este sistema, implementado por systemd/udev, asigna nombres estables que no cambian entre reinicios ni dependen del orden de detección de dispositivos.

Las interfaces Ethernet cableadas siguen el patrón `en<tipo><índice>`: `enp0s3` indica Ethernet (`en`) en el bus PCI (`p`) posición 0, slot 3 (`s3`). Las interfaces inalámbricas usan `wl` en lugar de `en`: `wlp2s0` denota Wireless LAN en PCI posición 2, slot 0. Las interfaces loopback mantienen el nombre histórico `lo`.

Esta predictibilidad es crítica en servidores y entornos automatizados: un script de configuración puede referenciar `enp1s0` con certeza de que corresponde a la misma tarjeta física tras un reinicio, algo que `eth0` no garantizaba cuando el orden de detección variaba.

> Los nombres tradicionales (`eth0`, `wlan0`) pueden restaurarse mediante parámetros del kernel (`net.ifnames=0`) si se requiere compatibilidad con scripts legacy, aunque esto sacrifica la estabilidad de nomenclatura que el esquema moderno proporciona.

## Comandos esenciales

### `ip`: gestión completa de interfaces y enrutamiento

La suite `ip` de iproute2 reemplaza las herramientas obsoletas `ifconfig`, `route` y `arp`, ofreciendo una interfaz unificada para manipular interfaces, direcciones, rutas y tablas de enrutamiento. Su sintaxis sigue el patrón `ip <objeto> <acción> <parámetros>`.

`ip addr show` (o `ip a`) lista todas las interfaces con sus direcciones IP asignadas, estado (UP/DOWN), y dirección MAC. Cada interfaz muestra su índice numérico, nombre, estado, MTU, y direcciones IPv4/IPv6 con sus prefijos CIDR.

`ip link set <interfaz> up/down` activa o desactiva una interfaz a nivel de enlace. `ip addr add 192.168.1.10/24 dev enp0s3` asigna una dirección IP estática. `ip route show` despliega la tabla de enrutamiento, indicando gateway predeterminado y rutas específicas.

La versatilidad de `ip` permite consultas filtradas: `ip -br addr` produce salida compacta (una línea por interfaz), `ip -stats link show` añade contadores de paquetes y errores. Para scripting y automatización, `ip -j` genera salida JSON parseable.

> Los cambios realizados con `ip` son temporales: se pierden al reiniciar. Para configuración persistente, los comandos deben integrarse en archivos de configuración de red (Netplan, NetworkManager, o `/etc/network/interfaces` según la distribución).

### `ping`: prueba de conectividad básica

`ping` envía paquetes ICMP Echo Request a un destino y mide el tiempo de respuesta mediante ICMP Echo Reply. Esta herramienta simple verifica conectividad de capa de red, latencia del enlace y estabilidad de la ruta.

La invocación `ping -c 4 ejemplo.com` envía cuatro paquetes y muestra estadísticas: paquetes transmitidos/recibidos, pérdida porcentual, y tiempos mínimo/máximo/promedio de ida y vuelta (RTT). La pérdida de paquetes indica problemas de congestión, enlace defectuoso o filtrado por firewall.

`ping` también diagnostica resolución DNS: si `ping ejemplo.com` falla pero `ping 93.184.216.34` funciona, el problema es de resolución de nombres, no de conectividad. Opciones como `-I <interfaz>` fuerzan el uso de una interfaz específica, útil en sistemas con múltiples salidas de red.

> Algunos servidores bloquean ICMP por política de seguridad, haciendo que `ping` falle incluso cuando el servicio es accesible. La ausencia de respuesta no garantiza inalcanzabilidad; combinar con pruebas de puerto (`nc`, `curl`) ofrece diagnóstico más completo.

### `traceroute`: seguimiento de ruta

`traceroute` revela el camino que siguen los paquetes desde el origen hasta el destino, mostrando cada salto (router) intermedio y la latencia acumulada. Esta visibilidad es esencial para identificar dónde ocurren cuellos de botella, pérdidas de paquetes o enrutamiento subóptimo.

El comando funciona enviando paquetes con TTL incremental: el primer paquete tiene TTL=1, el router más cercano lo descarta y responde con ICMP "Time Exceeded"; el segundo tiene TTL=2, alcanzando el segundo salto, y así sucesivamente hasta llegar al destino. Cada respuesta revela la dirección IP (y a veces el nombre DNS) del router intermedio.

`traceroute -I ejemplo.com` usa ICMP en lugar de UDP por defecto, evitando filtrado en algunos firewalls. `mtr` combina `ping` y `traceroute` en tiempo real, mostrando pérdida de paquetes y latencia por salto de forma continua, útil para diagnóstico de intermitencia.

> **Nota:** Algunos routers no responden a ICMP o enmascaran su identidad por seguridad, apareciendo como `* * *` en la salida. Esto no indica fallo de conectividad, sino política de no-respuesta. La ruta puede estar funcional aunque algunos saltos sean invisibles.

### `ss`: monitoreo de sockets y conexiones

`ss` (*socket statistics*) expone el estado de conexiones de red activas, puertos en escucha y estadísticas de sockets TCP/UDP. Reemplaza a `netstat` con rendimiento superior y más opciones de filtrado.

`ss -tuln` muestra sockets TCP (`-t`) y UDP (`-u`) en escucha (`-l`) con direcciones numéricas (`-n`), revelando qué servicios están aceptando conexiones y en qué puertos. `ss -s` proporciona resumen estadístico: total de sockets, distribución por protocolo y estado.

El filtrado por expresión permite consultas específicas: `ss dst :443` muestra conexiones hacia el puerto 443, `ss state established` filtra solo conexiones activas. `ss -tp` añade información del proceso propietario (PID/nombre), útil para identificar qué aplicación posee un socket.

> `ss` consulta información del kernel vía netlink, no lee `/proc` como `netstat`. Esto lo hace significativamente más rápido en sistemas con miles de conexiones concurrentes, y permite filtrado en el kernel antes de devolver resultados.

### `nmcli`: gestión de NetworkManager

`nmcli` (*NetworkManager command line interface*) proporciona control sobre NetworkManager, el servicio de gestión de red predeterminado en muchas distribuciones modernas. A diferencia de `ip` que manipula el kernel directamente, `nmcli` gestiona configuraciones persistentes y perfiles de conexión.

`nmcli device status` lista interfaces físicas y su estado (conectado, desconectado, no gestionado). `nmcli connection show` muestra perfiles de conexión configurados, incluyendo SSID para Wi-Fi, direcciones IP, DNS y gateway.

`nmcli connection modify <perfil> ipv4.addresses 192.168.1.10/24` cambia configuración IP de forma persistente. `nmcli connection up <perfil>` activa una conexión. Para Wi-Fi, `nmcli device wifi list` escanea redes disponibles, `nmcli device wifi connect <SSID> password <clave>` establece conexión.

La ventaja de `nmcli` es la persistencia: los cambios sobreviven a reinicios y se integran con el ecosistema NetworkManager (applets gráficos, eventos de suspensión/reanudación). En servidores headless, `nmcli` permite gestión completa sin interfaz gráfica.

> NetworkManager no es universal: distribuciones como Debian tradicional o servidores minimalistas pueden usar `/etc/network/interfaces` o systemd-networkd. Verificar qué gestor de red está activo (`systemctl status NetworkManager`) antes de elegir herramientas.

## Quédate con...

*   Los nombres modernos de interfaces (`enp0s3`, `wlp2s0`) son predecibles y estables entre reinicios, reflejando la topología física del hardware en lugar del orden de detección.
*   `ip` reemplaza a `ifconfig` y `route`: gestiona interfaces, direcciones IP y tablas de enrutamiento con sintaxis unificada y opciones de filtrado avanzadas.
*   `ping` verifica conectividad básica mediante ICMP, midiendo latencia y pérdida de paquetes; la falta de respuesta puede indicar filtrado por firewall, no necesariamente inalcanzabilidad.
*   `traceroute` revela la ruta completa hacia un destino mostrando cada salto intermedio; `mtr` combina esta funcionalidad con monitoreo continuo de pérdida y latencia.
*   `ss` expone sockets activos y puertos en escucha con rendimiento superior a `netstat`, permitiendo filtrado por estado, puerto y proceso propietario.
*   `nmcli` gestiona configuraciones de red persistentes mediante NetworkManager, ideal para entornos que requieren perfiles de conexión que sobrevivan a reinicios y cambios de red.


<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/practica/configuracion" class="next">Siguiente</a>
</div>
