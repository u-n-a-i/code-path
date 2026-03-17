---
title: "Configuración de firewall básico"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Configuración de firewall básico](#configuración-de-firewall-básico)
  - [UFW (Uncomplicated Firewall)](#ufw-uncomplicated-firewall)
  - [Comandos esenciales](#comandos-esenciales)
  - [Reglas para servicios comunes](#reglas-para-servicios-comunes)
  - [Quédate con...](#quédate-con)

</div>

# Configuración de firewall básico

Un sistema conectado a una red expone inevitablemente servicios a ojos externos. Cada puerto abierto es una puerta potencialmente utilizable por cualquier entidad capaz de alcanzar la dirección IP. El firewall actúa como el portero que decide qué tráfico cruza esa frontera, basándose no en la identidad del visitante sino en reglas explícitas que definen lo permitido y lo denegado. En Linux, esta función de filtrado de paquetes reside en el kernel, pero su gestión directa requiere conocimiento profundo de tablas iptables; ufw simplifica esta complejidad ofreciendo una interfaz humana para políticas de seguridad esenciales.

## UFW (Uncomplicated Firewall)

UFW es una capa de abstracción sobre el subsistema de filtrado de paquetes de Linux (netfilter/iptables o nftables). Su diseño prioriza la usabilidad sin sacrificar la efectividad: permite definir políticas de seguridad mediante comandos legibles en lugar de reglas complejas de manipulación de tablas. Por defecto, UFW configura una política de "denegar todo el tráfico entrante, permitir todo el tráfico saliente". Esta aproximación de "denegar por defecto" es fundamental: obliga al administrador a autorizar explícitamente cada servicio que debe ser accesible desde el exterior, reduciendo la superficie de ataque a lo estrictamente necesario.

La herramienta opera sobre perfiles de aplicaciones que mapean nombres de servicios a puertos y protocolos. Cuando se permite un servicio como `ssh` o `http`, UFW consulta su base de datos interna para identificar los puertos correspondientes (22/tcp, 80/tcp) y genera las reglas iptables subyacentes. Esto abstrae la complejidad técnica pero requiere comprensión de qué servicios se están exponiendo realmente.

## Comandos esenciales

La gestión del firewall sigue un ciclo de verificación, configuración y activación. El orden es crítico: configurar reglas antes de habilitar el firewall previene bloqueos accidentales que podrían cortar el acceso remoto al sistema.

El comando `ufw status` muestra el estado actual y las reglas activas. En una instalación nueva, típicamente reporta `Status: inactive`. Ejecutar `ufw status verbose` añade detalles sobre las políticas por defecto (incoming, outgoing, routed). Esta verificación previa es esencial para confirmar que no hay reglas conflictivas antes de aplicar cambios.

La activación se realiza con `ufw enable`. Este comando aplica las reglas cargadas y configura el firewall para iniciarse automáticamente en el arranque del sistema. UFW advierte explícitamente que habilitarlo puede interrumpir conexiones SSH existentes si no hay una regla que permita el puerto 22. La desactivación temporal con `ufw disable` detiene el filtrado pero no elimina las reglas configuradas, permitiendo pruebas sin pérdida de configuración.

> El orden de operación es vital: primero `ufw allow 22` (o el puerto de gestión remota), luego `ufw enable`. Habilitar el firewall sin una regla de acceso remoto bloqueará todas las conexiones entrantes, incluyendo SSH, requiriendo acceso físico o consola de recuperación para restaurar la conectividad.

## Reglas para servicios comunes

Cada servicio de red que debe ser accesible desde el exterior requiere una regla explícita. La sintaxis básica es `ufw allow <puerto>/<protocolo>` o `ufw allow <nombre-servicio>`. Usar nombres de servicio es preferible cuando están definidos en `/etc/services`, ya que mejora la legibilidad y reduce errores de tipeo.

Para un servidor web típico, se permiten los puertos estándar de HTTP y HTTPS:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

O usando nombres de servicio reconocidos:

```bash
sudo ufw allow http
sudo ufw allow https
```

Para acceso remoto, SSH es crítico. Permitir el puerto 22 es estándar, aunque algunos administradores optan por puertos no estándar para reducir ruido de escaneos automatizados (seguridad por oscuridad, no protección real):

```bash
sudo ufw allow 22/tcp
```

Las reglas se pueden limitar por dirección IP de origen para mayor restricción. Por ejemplo, permitir SSH solo desde una IP de administración específica:

```bash
sudo ufw allow from 192.168.1.50 to any port 22
```

Esto reduce drásticamente la superficie de ataque: incluso si hay vulnerabilidades en el servicio SSH, solo son explotables desde la IP autorizada.

> UFW evalúa las reglas en orden. Las primeras coincidencias determinan la acción. Aunque UFW gestiona el orden automáticamente para reglas básicas, al añadir reglas complejas con inserción (`ufw insert`), verificar el orden con `ufw status numbered` es esencial para garantizar que las reglas de允许 no sean anuladas por denegaciones anteriores.

## Quédate con...

*   UFW es una interfaz simplificada sobre iptables/nftables que prioriza usabilidad para gestión básica de firewall en Linux.
*   La política por defecto segura es "denegar entrante, permitir saliente"; obliga a autorizar explícitamente cada servicio expuesto.
*   El orden de operación es crítico: configurar reglas de acceso remoto (SSH) antes de ejecutar `ufw enable` para evitar bloqueo accidental.
*   Los servicios comunes se permiten por puerto (`80/tcp`) o por nombre (`http`), siendo los nombres más legibles pero dependientes de definiciones locales.
*   Restringir reglas por IP de origen (`allow from <IP>`) reduce la superficie de ataque limitando quién puede intentar conectar a un servicio.
*   Verificar el estado con `ufw status verbose` y el orden con `ufw status numbered` permite auditar la configuración activa y detectar conflictos.

<div class="pagination">
  <a href="/markdown/sistemas/redes/practica/servicios" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/practica/escenarios" class="next">Siguiente</a>
</div>
