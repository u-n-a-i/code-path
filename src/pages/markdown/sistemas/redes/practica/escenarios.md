---
title: "Escenarios prácticos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Escenarios prácticos](#escenarios-prácticos)
  - [Compartir internet: IP forwarding y NAT](#compartir-internet-ip-forwarding-y-nat)
  - [Crear una red entre dos máquinas virtuales](#crear-una-red-entre-dos-máquinas-virtuales)
  - [Configurar un servidor DHCP local con `isc-dhcp-server`](#configurar-un-servidor-dhcp-local-con-isc-dhcp-server)
  - [Gestión de servicios de red: reiniciar pila y verificar interfaces](#gestión-de-servicios-de-red-reiniciar-pila-y-verificar-interfaces)
    - [Reiniciar la pila de red](#reiniciar-la-pila-de-red)
    - [Verificar estado de interfaces](#verificar-estado-de-interfaces)
    - [Diagnóstico integrado](#diagnóstico-integrado)
  - [Quédate con...](#quédate-con)

</div>

# Escenarios prácticos

La teoría de redes cobra utilidad real cuando se aplica a situaciones concretas: convertir un equipo Linux en router para compartir internet, interconectar máquinas virtuales para pruebas aisladas, o proporcionar configuración automática a dispositivos mediante DHCP. Estos escenarios no son ejercicios académicos: reproducen patrones arquitectónicos que aparecen en entornos productivos, desde redes domésticas hasta laboratorios de desarrollo. Dominar estas configuraciones permite diagnosticar problemas con mayor precisión, diseñar infraestructuras más flexibles y comprender cómo interactúan los componentes de la pila de red cuando operan en conjunto.

## Compartir internet: IP forwarding y NAT

Convertir un sistema Linux en gateway para compartir su conexión de internet con otros dispositivos requiere dos mecanismos fundamentales: reenvío de paquetes IP (*IP forwarding*) y traducción de direcciones de red (*NAT*). Esta configuración es común en routers domésticos, puntos de acceso móviles o entornos de prueba donde múltiples máquinas necesitan acceso a internet a través de una única conexión.

El reenvío de IP permite que el kernel acepte paquetes destinados a otras direcciones y los envíe por la interfaz adecuada. Por defecto, Linux descarta estos paquetes por seguridad. Para habilitarlo temporalmente:

```bash
sudo sysctl -w net.ipv4.ip_forward=1
```

Para hacerlo persistente, añadir `net.ipv4.ip_forward=1` en `/etc/sysctl.conf` o en un archivo bajo `/etc/sysctl.d/`.

El NAT, específicamente *masquerading*, reescribe la dirección de origen de los paquetes que salen hacia internet, sustituyendo la IP privada del dispositivo interno por la IP pública del gateway. Esto permite que múltiples dispositivos compartan una única dirección pública. Con `iptables`:

```bash
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

Donde `eth0` es la interfaz con conexión a internet. Para persistencia, usar `iptables-persistent` o integrar las reglas en scripts de arranque.

Los dispositivos en la red interna deben configurarse con el gateway como su ruta predeterminada y usar el mismo servidor DNS que el gateway. Una configuración típica: red interna `192.168.10.0/24`, gateway en `192.168.10.1`, dispositivos con gateway `192.168.10.1`.

> El firewall debe permitir el reenvío entre interfaces. Con `ufw`, habilitar `DEFAULT_FORWARD_POLICY="ACCEPT"` en `/etc/default/ufw` y añadir reglas específicas si se requiere filtrado. La seguridad perimetral sigue siendo responsabilidad del administrador: NAT no es un firewall.

## Crear una red entre dos máquinas virtuales

Aislar tráfico de prueba o simular topologías complejas requiere redes virtuales que no expongan tráfico a la red física. Los hipervisores como VirtualBox, VMware o KVM permiten crear redes internas o *host-only* donde las máquinas virtuales se comunican entre sí y, opcionalmente, con el anfitrión, pero no con internet.

En VirtualBox, crear una red interna desde el gestor: *Archivo → Herramientas → Administrador de red de anfitrión → Crear*. Asignar un nombre como `intnet` y configurar la interfaz del anfitrión si se requiere acceso desde el host. Luego, en cada VM, asignar el adaptador de red a "Red interna" y seleccionar `intnet`.

En KVM/libvirt, definir una red virtual con `virsh net-define`:

```xml
<network>
  <name>lab-red</name>
  <forward mode='nat'/>
  <bridge name='virbr1' stp='on' delay='0'/>
  <ip address='192.168.100.1' netmask='255.255.255.0'/>
</network>
```

Activar con `virsh net-start lab-red` y habilitar arranque automático con `virsh net-autostart lab-red`.

Dentro de las VMs, configurar direcciones estáticas en el mismo rango (`192.168.100.10/24`, `192.168.100.11/24`) o habilitar DHCP si la red virtual lo proporciona. Verificar conectividad con `ping 192.168.100.11` desde la primera VM.

Esta aproximación permite experimentar con enrutamiento, firewalls o servicios sin riesgo de afectar la red productiva. Las topologías pueden escalarse añadiendo más VMs, routers virtuales o incluso emulando enlaces de baja calidad con herramientas como `tc` (*traffic control*).

> Las redes *host-only* permiten comunicación VM↔host pero no internet; las redes NAT permiten internet pero aíslan las VMs entre sí salvo configuración explícita. Elegir según si se requiere acceso externo o aislamiento total.

## Configurar un servidor DHCP local con `isc-dhcp-server`

Un servidor DHCP automatiza la asignación de direcciones IP, gateways y DNS a dispositivos en una red local. Aunque routers domésticos incluyen esta función, configurar `isc-dhcp-server` en Linux proporciona control granular para laboratorios, redes aisladas o entornos de prueba.

La instalación en Ubuntu/Debian:

```bash
sudo apt install isc-dhcp-server
```

El archivo de configuración principal es `/etc/dhcp/dhcpd.conf`. Una configuración mínima para una red `192.168.100.0/24`:

```
subnet 192.168.100.0 netmask 255.255.255.0 {
  range 192.168.100.50 192.168.100.200;
  option routers 192.168.100.1;
  option domain-name-servers 8.8.8.8, 8.8.4.4;
  default-lease-time 600;
  max-lease-time 7200;
}
```

Definir la interfaz de escucha en `/etc/default/isc-dhcp-server`:

```
INTERFACESv4="eth1"
```

Donde `eth1` es la interfaz conectada a la red interna. Reiniciar el servicio:

```bash
sudo systemctl restart isc-dhcp-server
```

Verificar estado con `sudo systemctl status isc-dhcp-server` y revisar logs en `/var/log/syslog` o con `journalctl -u isc-dhcp-server`.

Para asignaciones fijas por dirección MAC (reservas):

```
host equipo-prueba {
  hardware ethernet 08:00:27:ab:cd:ef;
  fixed-address 192.168.100.10;
}
```

>  El servidor DHCP debe tener una IP estática en la interfaz de servicio. Si la interfaz cambia de estado (cable desconectado, VM apagada), el servicio puede fallar al iniciar. Validar la configuración con `dhcpd -t` antes de reiniciar.

## Gestión de servicios de red: reiniciar pila y verificar interfaces

La conectividad de red en Linux depende de múltiples componentes: kernel, gestores de configuración (NetworkManager, systemd-networkd), servicios auxiliares (DHCP, DNS). Cuando la conectividad falla, reiniciar selectivamente estos componentes puede restaurar operatividad sin reiniciar el sistema completo.

### Reiniciar la pila de red

El enfoque depende del gestor activo. Para sistemas con NetworkManager (Ubuntu desktop, Fedora):

```bash
sudo nmcli networking off && sudo nmcli networking on
```

O reiniciar el servicio completo:

```bash
sudo systemctl restart NetworkManager
```

Para sistemas con systemd-networkd (Ubuntu Server, Arch):

```bash
sudo systemctl restart systemd-networkd
sudo systemctl restart systemd-resolved
```

En configuraciones legacy con `/etc/network/interfaces`:

```bash
sudo systemctl restart networking
```

O gestionar interfaces individualmente:

```bash
sudo ip link set enp0s3 down && sudo ip link set enp0s3 up
```

### Verificar estado de interfaces

La suite `ip` proporciona visibilidad inmediata del estado operativo:

```bash
ip link show          # Estado físico de interfaces (UP/DOWN)
ip addr show          # Direcciones IP asignadas
ip route show         # Tabla de enrutamiento activa
```

Para diagnóstico rápido, `ip -br addr` produce salida compacta:

```
lo               UNKNOWN        127.0.0.1/8 ::1/128
enp0s3           UP             192.168.1.10/24
wlp2s0           DOWN
```

El estado `UP` indica que la interfaz está activa a nivel de enlace; `UNKNOWN` es normal en interfaces loopback. La ausencia de dirección IP sugiere fallo en DHCP o configuración estática incorrecta.

### Diagnóstico integrado

Combinar herramientas permite correlacionar evidencias:

```bash
# ¿La interfaz tiene IP?
ip -br addr show enp0s3

# ¿Existe ruta por defecto?
ip route | grep default

# ¿Resuelve DNS?
dig ejemplo.com +short

# ¿Alcanza el gateway?
ping -c 2 192.168.1.1
```

Si `ip addr` muestra dirección pero `ping` al gateway falla, el problema es de capa 2 (cable, switch, VLAN). Si el gateway responde pero `dig` falla, el problema es DNS. Este enfoque sistemático reduce el tiempo de diagnóstico.

> Reiniciar servicios de red puede interrumpir conexiones activas (SSH, transferencias). En sistemas remotos, preferir comandos que no corten la sesión actual (`ip link set ... up/down` es más seguro que reiniciar NetworkManager). Mantener una consola alternativa o acceso por consola física como respaldo.

## Quédate con...

*   Compartir internet requiere habilitar `net.ipv4.ip_forward` y configurar NAT con `iptables` MASQUERADE para reescribir direcciones de origen hacia internet.
*   Las redes virtuales (VirtualBox, KVM) permiten aislar tráfico de prueba; elegir entre *host-only* (VM↔host) o NAT (internet) según los requisitos de conectividad.
*   `isc-dhcp-server` automatiza asignación de IPs en redes locales; configurar rangos, opciones y reservas por MAC en `/etc/dhcp/dhcpd.conf`.
*   Reiniciar la pila de red depende del gestor activo: `nmcli` para NetworkManager, `systemctl restart systemd-networkd` para systemd-networkd.
*   `ip -br addr`, `ip route` y `ping` combinados permiten diagnóstico estructurado: verificar interfaz, ruta, DNS y conectividad en secuencia lógica.
*   La gestión segura de servicios de red en sistemas remotos requiere precaución: evitar comandos que corten la sesión activa y mantener acceso de respaldo por consola.
   

<div class="pagination">
  <a href="/markdown/sistemas/redes/practica/cortafuegos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/practica/analisis" class="next">Siguiente</a>
</div>
