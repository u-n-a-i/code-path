---
title: "Configuración de red"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Configuración de red](#configuración-de-red)
  - [IP estática](#ip-estática)
  - [DHCP](#dhcp)
  - [IP estática versus DHCP](#ip-estática-versus-dhcp)
  - [Archivos de configuración: Netplan y interfaces](#archivos-de-configuración-netplan-y-interfaces)
    - [Netplan (Ubuntu 18.04+)](#netplan-ubuntu-1804)
    - [/etc/network/interfaces (sistemas legacy)](#etcnetworkinterfaces-sistemas-legacy)
  - [Quédate con...](#quédate-con)

</div>

# Configuración de red

La conectividad de un sistema Linux no emerge automáticamente: requiere que interfaces físicas se asocien con direcciones lógicas, que rutas predeterminadas apunten hacia gateways alcanzables, y que servidores DNS resuelvan nombres a direcciones IP. Esta configuración puede asignarse dinámicamente mediante protocolos de red o definirse estáticamente mediante archivos de configuración persistentes. La elección entre ambos enfoques no es trivial: determina cómo el sistema se integra en la infraestructura, cómo responde a cambios de topología y qué nivel de control administrativo se ejerce sobre la conectividad. Comprender los mecanismos de configuración permite diagnosticar fallos de red, automatizar despliegues y adaptar el comportamiento del sistema a requisitos específicos de cada entorno.

## IP estática

La configuración estática asigna manualmente parámetros de red que permanecen fijos entre reinicios: dirección IP, máscara de subred, gateway predeterminado y servidores DNS. Esta aproximación ofrece predictibilidad total: el sistema siempre tendrá la misma dirección, permitiendo que otros dispositivos lo localicen consistentemente mediante DNS estático o referencias directas por IP.

Los servidores que ofrecen servicios de red —web, base de datos, SSH— requieren típicamente IPs estáticas. Un servidor web cuya dirección cambia tras cada reinicio rompería enlaces DNS, invalidaría certificados TLS vinculados a dominios específicos, y dificultaría la administración remota. La configuración estática elimina esta incertidumbre: una vez definida, la dirección persiste hasta que un administrador la modifica explícitamente.

La implementación varía según el gestor de red del sistema. En configuraciones modernas con Netplan, se define en archivos YAML bajo `/etc/netplan/`. En sistemas legacy con `/etc/network/interfaces`, se especifica mediante directivas `iface`, `address`, `netmask`, y `gateway`. En ambos casos, los parámetros se aplican al reiniciar el servicio de red o el sistema completo.

> La IP estática requiere coordinación administrativa: la dirección asignada debe estar fuera del rango DHCP del router para evitar conflictos. Dos dispositivos con la misma IP en la misma red causan colisiones que interrumpen la conectividad de ambos.

## DHCP

DHCP (*Dynamic Host Configuration Protocol*) automatiza la asignación de parámetros de red mediante un servidor que responde a solicitudes de clientes. Cuando una interfaz se configura para DHCP, el sistema envía un broadcast `DHCPDISCOVER` al arrancar; el servidor responde con `DHCPOFFER` proponiendo una dirección IP y configuración asociada; el cliente solicita formalmente con `DHCPREQUEST`; el servidor confirma con `DHCPACK`. Este intercambio DORA (*Discover, Offer, Request, Acknowledge*) completa la configuración sin intervención manual.

La ventaja operativa es significativa: en redes con decenas o cientos de dispositivos, configurar cada uno manualmente sería laborioso y propenso a errores. DHCP centraliza la gestión: el administrador define rangos de direcciones, gateways y DNS en el servidor, y todos los clientes heredan esta configuración automáticamente. Cambios futuros —modificar el DNS primario, añadir un gateway secundario— se aplican en el servidor y se propagan a clientes al renovar concesión.

La concesión (*lease*) tiene duración limitada, típicamente horas o días. Antes de expirar, el cliente envía `DHCPREQUEST` directamente al servidor que otorgó la concesión para renovarla. Si el servidor no responde o la red cambia, el cliente reinicia el proceso DORA, posiblemente obteniendo una dirección diferente. Esta dinámica es aceptable para estaciones de trabajo pero problemática para servidores que requieren direcciones estables.

> DHCP no garantiza que la dirección se mantenga entre sesiones. Algunos servidores DHCP pueden asignar la misma IP basándose en la dirección MAC del cliente (*reservation*), pero esto requiere configuración en el servidor, no en el cliente. Para estabilidad garantizada sin configuración de servidor, usar IP estática en el cliente.

## IP estática versus DHCP

La elección entre configuración estática y dinámica responde a criterios de rol del dispositivo dentro de la infraestructura. Servidores, impresoras de red, dispositivos de gestión (switches, APs, firewalls) y cualquier equipo que deba ser localizable consistentemente requieren IPs estáticas. Estaciones de trabajo, dispositivos móviles, IoT de consumo y equipos temporarios funcionan adecuadamente con DHCP.

La gestión operativa también influye. DHCP reduce carga administrativa en entornos dinámicos: empleados que cambian de oficina, dispositivos que se conectan ocasionalmente, redes de invitados con alta rotación. La configuración estática exige documentación rigurosa: qué IP está asignada a qué dispositivo, qué rangos están reservados, qué subredes existen. Sin esta documentación, conflictos de IP son inevitables.

Desde la perspectiva de diagnóstico, DHCP introduce una variable adicional: la dirección puede cambiar, las opciones pueden variar entre servidores, la concesión puede expirar. Herramientas como `dhclient -v` muestran el proceso de negociación en detalle, revelando qué opciones ofrece el servidor y cuándo se renovó la concesión. La configuración estática elimina esta complejidad: los parámetros son fijos y verificables directamente en archivos de configuración.

En la práctica, muchos entornos combinan ambos enfoques: DHCP para la mayoría de dispositivos, con reservas basadas en MAC para equipos que requieren estabilidad pero se benefician de gestión centralizada. Esta aproximación híbrida ofrece predictibilidad sin sacrificar la flexibilidad operativa de DHCP.

> `dhclient` es el cliente DHCP de referencia en sistemas Unix-like. En distribuciones modernas con NetworkManager, la gestión DHCP está integrada: `nmcli con mod <perfil> ipv4.method auto` habilita DHCP, mientras que `nmcli con mod <perfil> ipv4.method manual` requiere configuración estática explícita.

## Archivos de configuración: Netplan y interfaces

Los sistemas Linux almacenan configuración de red en archivos que el gestor de red lee al arrancar. El formato y ubicación dependen de la distribución y versión, reflejando la evolución de herramientas de gestión a lo largo del tiempo.

### Netplan (Ubuntu 18.04+)

Netplan, introducido en Ubuntu 17.10 y estándar desde 18.04, utiliza archivos YAML bajo `/etc/netplan/` para definir configuración de red. Esta abstracción unifica la configuración para múltiples backends: NetworkManager en escritorios, systemd-networkd en servidores.

Un archivo típico `01-netcfg.yaml` para IP estática:

```yaml
network:
  version: 2
  ethernets:
    enp0s3:
      addresses:
        - 192.168.1.10/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 1.1.1.1
```

Para DHCP, la configuración se simplifica:

```yaml
network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: true
```

Los cambios se aplican con `netplan apply`, que valida la sintaxis y genera configuración para el backend correspondiente. `netplan try` aplica configuración temporalmente y revierte automáticamente si no hay confirmación en 120 segundos, útil para configuración remota donde un error podría cortar el acceso SSH.

> Netplan usa indentación YAML estricta: espacios, no tabuladores. Un error de indentación provoca fallo de validación. Los archivos se procesan en orden alfabético; configuraciones posteriores pueden anular anteriores, permitiendo overrides específicos por entorno.

### /etc/network/interfaces (sistemas legacy)

Antes de Netplan, Debian y Ubuntu utilizaban `/etc/network/interfaces` para configuración estática. Este formato, más antiguo pero aún presente en sistemas legacy y distribuciones como Debian stable, sigue siendo relevante para administración de infraestructura heredada.

Configuración estática típica:

```
auto enp0s3
iface enp0s3 inet static
    address 192.168.1.10
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8 1.1.1.1
```

Para DHCP:

```
auto enp0s3
iface enp0s3 inet dhcp
```

Los cambios requieren reiniciar el servicio: `systemctl restart networking` o `ifdown enp0s3 && ifup enp0s3`. A diferencia de Netplan, no hay validación previa ni rollback automático: un error de sintaxis puede dejar el sistema sin conectividad hasta acceso físico o consola de recuperación.

> NetworkManager puede coexistir con `/etc/network/interfaces`, pero típicamente ignora interfaces definidas allí, asumiendo que se gestionan manualmente. En sistemas con NetworkManager activo, preferir `nmcli` o archivos de configuración de NetworkManager (`/etc/NetworkManager/system-connections/`) para evitar conflictos de gestión.

## Quédate con...

*   La IP estática ofrece predictibilidad y estabilidad para servidores y dispositivos que deben ser localizables consistentemente, pero requiere coordinación administrativa para evitar conflictos.
*   DHCP automatiza la configuración de red mediante el ciclo DORA, reduciendo carga administrativa en entornos con muchos dispositivos o alta rotación de equipos.
*   La elección entre estática y DHCP depende del rol del dispositivo: servidores y equipos de infraestructura requieren estática; estaciones de trabajo y dispositivos temporales funcionan con DHCP.
*   Netplan (Ubuntu 18.04+) usa archivos YAML bajo `/etc/netplan/` con validación y rollback automático mediante `netplan try`, ideal para configuración remota segura.
*   `/etc/network/interfaces` es el formato legacy en Debian/Ubuntu antiguos, aún relevante para infraestructura heredada pero sin validación previa ni mecanismos de recuperación automática.
*   NetworkManager integra gestión DHCP y estática mediante `nmcli`, coexistiendo potencialmente con otros gestores; evitar configuración duplicada en múltiples sistemas para prevenir conflictos.

<div class="pagination">
  <a href="/markdown/sistemas/redes/practica/interfaces" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/practica/conectividad" class="next">Siguiente</a>
</div>
