---
title: "Firewall"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Firewall](#firewall)
  - [Políticas por defecto: la base de la seguridad](#políticas-por-defecto-la-base-de-la-seguridad)
  - [Herramientas de firewall por distribución](#herramientas-de-firewall-por-distribución)
    - [UFW (Uncomplicated Firewall) — Simple y efectivo](#ufw-uncomplicated-firewall--simple-y-efectivo)
  - [firewalld — Dinámico y orientado a zonas](#firewalld--dinámico-y-orientado-a-zonas)
  - [iptables / nftables — Control total (avanzado)](#iptables--nftables--control-total-avanzado)
  - [Reglas comunes: abrir y cerrar puertos](#reglas-comunes-abrir-y-cerrar-puertos)
  - [Quédate con...](#quédate-con)

</div>

# Firewall

Un firewall (cortafuegos) es un componente esencial de la seguridad en sistemas Linux, ya que controla el tráfico de red entrante y saliente según reglas definidas por el administrador. Su función principal es permitir o denegar conexiones basadas en criterios como la dirección IP, el puerto, el protocolo (TCP/UDP) o la interfaz de red. En entornos modernos, donde los servidores están expuestos a internet, configurar un firewall correctamente es tan importante como mantener el sistema actualizado. Linux ofrece varias herramientas para gestionar firewalls, desde interfaces simples como UFW hasta sistemas avanzados como firewalld, iptables o nftables, cada una con distintos niveles de complejidad y flexibilidad.

## Políticas por defecto: la base de la seguridad

La regla más importante en cualquier firewall es la política predeterminada (default policy): qué hacer con el tráfico que no coincide con ninguna regla explícita.

- Política recomendada:
  - Entrada (INPUT): DROP o REJECT (denegar todo por defecto).
  - Salida (OUTPUT): ACCEPT (permitir que el sistema se comunique libremente).
  - Reenvío (FORWARD): DROP (a menos que el sistema sea un router).

Esta estrategia de “permiso explícito” minimiza la superficie de ataque: solo se abren los puertos estrictamente necesarios.

> DROP descarta el paquete sin respuesta; REJECT envía un mensaje de error al remitente. REJECT es más amigable para diagnóstico, pero DROP puede dificultar el escaneo de puertos.

## Herramientas de firewall por distribución

### UFW (Uncomplicated Firewall) — Simple y efectivo

Diseñado para facilitar la configuración del firewall, UFW es ideal para servidores personales o principiantes. Usa una sintaxis clara y gestiona reglas sobre iptables en segundo plano.

Instalación (en Debian/Ubuntu):

```bash
sudo apt install ufw

# Comandos básicos:
sudo ufw default deny incoming    # política predeterminada: denegar entrada
sudo ufw default allow outgoing   # permitir salida

sudo ufw allow 22/tcp             # abrir puerto SSH
sudo ufw allow from 192.168.1.0/24  # permitir una red local
sudo ufw deny 23                  # bloquear Telnet (puerto 23)

sudo ufw enable                   # activar el firewall
sudo ufw status verbose           # ver reglas activas
```

Extremadamente legible. Ideal para servidores estáticos con pocos servicios.

## firewalld — Dinámico y orientado a zonas

Usado por defecto en RHEL, CentOS, Fedora y openSUSE, firewalld permite cambiar reglas sin reiniciar el firewall, lo que es útil en entornos con múltiples perfiles de red (por ejemplo, portátil en casa vs. oficina).

Concepto clave: zonas

Cada interfaz de red se asigna a una zona (como public, home, trusted), y cada zona tiene reglas predefinidas.

Comandos básicos:

```bash
sudo firewall-cmd --permanent --add-port=80/tcp    # abrir puerto 80
sudo firewall-cmd --reload                        # aplicar cambios permanentes

sudo firewall-cmd --list-all                      # ver reglas actuales
sudo firewall-cmd --get-active-zones              # ver zonas activas
```

Gestión dinámica y soporte para D-Bus, ideal para escritorios o servidores con cambios frecuentes de red.

## iptables / nftables — Control total (avanzado)

- iptables: herramienta clásica de bajo nivel. Potente pero verbosa.
- nftables: sucesor moderno, más eficiente y con sintaxis unificada. Ya es el backend predeterminado en muchas distribuciones.

Estas herramientas se usan cuando se necesitan reglas complejas (NAT, limitación de tasa, filtrado por estado). No se recomiendan para uso básico.

> Si usas UFW o firewalld, no mezcles reglas con iptables/nftables directamente, ya que pueden interferir.

## Reglas comunes: abrir y cerrar puertos

UFW:

```bash
# Abrir un puerto
sudo ufw allow 80/tcp          # HTTP
sudo ufw allow 443/tcp         # HTTPS
sudo ufw allow OpenSSH         # por nombre de servicio (definido en /etc/services)

# Cerrar un puerto
sudo ufw delete allow 80/tcp   # elimina la regla de apertura
# o
sudo ufw deny 80/tcp           # bloquea explícitamente (menos común)
```

firewalld:

```bash
# Abrir un puerto
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-port=3306/tcp --permanent  # MySQL

# Cerrar un puerto
sudo firewall-cmd --remove-port=80/tcp --permanent
```

Tras modificar reglas en firewalld, ejecuta --reload. En UFW, los cambios son inmediatos tras enable o al añadir reglas.

## Quédate con...

- La política predeterminada debe ser denegar toda entrada no explícitamente permitida.
- UFW es ideal para principiantes y servidores simples (Debian/Ubuntu).
- firewalld es adecuado para entornos dinámicos con múltiples perfiles de red (RHEL/Fedora).
- iptables/nftables son para casos avanzados; evítalos si no los necesitas.
- Siempre verifica las reglas activas tras configurar (ufw status, firewall-cmd --list-all).
- Un firewall bien configurado es tu primera línea de defensa contra accesos no autorizados.
- Nunca abras puertos innecesarios: cada puerto abierto es una posible vía de ataque.

<div class="pagination">
  <a href="/markdown/sistemas/linux/redes/ssh" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
