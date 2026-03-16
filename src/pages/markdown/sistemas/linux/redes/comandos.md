---
title: "Comandos de diagnóstico de red"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Comandos de diagnóstico de red](#comandos-de-diagnóstico-de-red)
  - [Verificación de la configuración de red: ip addr](#verificación-de-la-configuración-de-red-ip-addr)
    - [Interfaces comunes](#interfaces-comunes)
  - [Pruebas de conectividad: ping](#pruebas-de-conectividad-ping)
  - [Seguimiento de ruta: traceroute y mtr](#seguimiento-de-ruta-traceroute-y-mtr)
  - [Herramientas de configuración modernas](#herramientas-de-configuración-modernas)
    - [ip: el reemplazo de ifconfig](#ip-el-reemplazo-de-ifconfig)
    - [nmcli: control de NetworkManager desde CLI](#nmcli-control-de-networkmanager-desde-cli)
  - [Archivos de configuración por distribución](#archivos-de-configuración-por-distribución)
  - [Resolución de nombres](#resolución-de-nombres)
    - [/etc/hosts](#etchosts)
    - [systemd-resolved](#systemd-resolved)
  - [Consulta manual de DNS: dig y nslookup](#consulta-manual-de-dns-dig-y-nslookup)
  - [Quédate con...](#quédate-con)

</div>

# Comandos de diagnóstico de red

La conectividad de red es fundamental en cualquier sistema Linux moderno, ya sea para acceder a internet, comunicarse con servidores o gestionar infraestructura en la nube. Diagnosticar problemas de red requiere una combinación de herramientas que permitan verificar la configuración local, probar la conectividad y rastrear la ruta hasta un destino. Aunque muchas distribuciones incluyen interfaces gráficas para redes, los comandos de terminal ofrecen mayor precisión, reproducibilidad y capacidad de automatización. Además, el ecosistema de red en Linux ha evolucionado: herramientas antiguas como ifconfig han sido reemplazadas por alternativas más potentes como ip, y la gestión de DNS ahora se integra con servicios como systemd-resolved.

## Verificación de la configuración de red: ip addr

El comando ip addr (abreviado comúnmente como ip a) muestra las interfaces de red y sus direcciones asignadas. Es el sucesor moderno de ifconfig y forma parte del paquete iproute2, estándar en todos los sistemas actuales.

Ejemplo de salida:

```bash
$ ip a
1: lo: <LOOPBACK,UP> mtu 65536 ...
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP> ...
    inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic eth0
3: wlan0: <BROADCAST,MULTICAST> ...
```

### Interfaces comunes

- lo (loopback): interfaz virtual para comunicación interna (127.0.0.1). Siempre debe estar activa.
- eth0, enp3s0, etc.: interfaces Ethernet (el nombre varía según la convención de systemd).
- wlan0, wlp2s0, etc.: interfaces inalámbricas.

> Si no ves una dirección IP en una interfaz esperada, el problema puede estar en DHCP, el cableado, el controlador o la configuración de red.

## Pruebas de conectividad: ping

ping envía paquetes ICMP Echo Request a un destino y espera respuestas. Es la primera prueba para verificar si un host está accesible.

```bash
ping google.com
```

- Si hay respuesta → hay conectividad de red básica.
- Si falla → puede ser por:
  - Falta de resolución DNS (prueba con una IP: ping 8.8.8.8).
  - Firewall bloqueando ICMP.
  - Problema de enrutamiento o desconexión física.

Usa ping -c 4 google.com para limitar a 4 paquetes y evitar bucles infinitos.

## Seguimiento de ruta: traceroute y mtr

Cuando ping falla, necesitas saber dónde se pierde la conexión. traceroute (o tracepath) muestra cada salto (hop) entre tu máquina y el destino.

```bash
traceroute google.com
```

Sin embargo, traceroute es estático. Para análisis en tiempo real, usa mtr (my traceroute), que combina ping y traceroute:

```bash
mtr --report google.com   # resumen rápido
mtr google.com            # vista interactiva en vivo
```

mtr muestra latencia y pérdida de paquetes por salto, ideal para identificar cuellos de botella en la red.

## Herramientas de configuración modernas

### ip: el reemplazo de ifconfig

Además de ip addr, el comando ip gestiona rutas, túneles y enlaces:

- ip route show → tabla de enrutamiento.
- ip link set eth0 up → activa una interfaz.
- ip addr add 192.168.1.20/24 dev eth0 → asigna una IP manualmente.

> ifconfig está obsoleto. Aunque aún disponible en muchos sistemas, no muestra información completa (como múltiples direcciones IPv6).

### nmcli: control de NetworkManager desde CLI

En escritorios (Ubuntu, Fedora, etc.), NetworkManager gestiona redes. Su interfaz CLI, nmcli, permite operar sin GUI:

```bash
nmcli device status          # estado de interfaces
nmcli connection show        # perfiles de red guardados
nmcli device wifi list       # redes Wi-Fi disponibles
nmcli device wifi connect "MiRed" password "clave"
```

Útil en servidores con entorno gráfico o cuando necesitas scripts portables en sistemas con NetworkManager.

## Archivos de configuración por distribución

La persistencia de la configuración de red depende del gestor usado:

- Netplan (Ubuntu 18.04+):
  - Archivos en /etc/netplan/\*.yaml.
  - Aplica con: sudo netplan apply.
- Debian/Clásico:
  - /etc/network/interfaces (usado con ifup/ifdown).
- RHEL/CentOS 7–8:
  - /etc/sysconfig/network-scripts/ifcfg-eth0.
- RHEL 9+/Fedora:
  - Usa NetworkManager con archivos en /etc/NetworkManager/system-connections/ o nmcli.

> Nunca edites estos archivos sin entender el gestor subyacente. Un error puede dejar el sistema sin red.

## Resolución de nombres

Traducir nombres (google.com) a direcciones IP (142.250.180.46) es esencial para la navegación. Linux usa varios mecanismos:

### /etc/hosts

Archivo local que mapea nombres a IPs. Tiene prioridad sobre DNS.

```bash
127.0.0.1   localhost
192.168.1.50   servidor-local
```

Útil para pruebas, bloqueo de dominios o entornos sin DNS.

### systemd-resolved

Servicio moderno que gestiona DNS, caché y resolución mDNS/LPD. Integra con NetworkManager y proporciona una interfaz unificada.

Ver configuración:

```bash
resolvectl status
```

> En sistemas con systemd-resolved, /etc/resolv.conf suele ser un enlace simbólico a un archivo gestionado dinámicamente.

## Consulta manual de DNS: dig y nslookup

```bash
# dig (Domain Information Groper): herramienta moderna, detallada y scriptable.
dig google.com A        # consulta registro A (IPv4)
dig @8.8.8.8 google.com # usa servidor DNS específico

# nslookup: más antiguo, pero aún presente. Menos fiable en algunos casos.
nslookup google.com
```

Si ping google.com falla pero ping 8.8.8.8 funciona, el problema está en la resolución DNS, no en la conectividad.

## Quédate con...

- Usa ip a para ver direcciones IP e interfaces; reemplaza a ifconfig.
- ping prueba conectividad básica; empieza con una IP pública (8.8.8.8) para aislar problemas de DNS.
- mtr es superior a traceroute para diagnóstico interactivo de rutas.
- Las interfaces comunes son lo (loopback), eth0/en* (Ethernet) y wlan0/wl* (Wi-Fi).
- nmcli permite gestionar redes en sistemas con NetworkManager desde la terminal.
- La configuración persistente depende de la distribución: Netplan, interfaces, o NetworkManager.
- Para DNS, consulta primero /etc/hosts, luego usa dig para pruebas externas.
- El diagnóstico de red sigue un flujo lógico: configuración local → conectividad → resolución de nombres → ruta. Seguir este orden evita suposiciones erróneas y acelera la solución de problemas.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/redes/monitoreo" class="next">Siguiente</a>
</div>
