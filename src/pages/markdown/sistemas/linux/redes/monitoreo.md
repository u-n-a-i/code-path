---
title: "Comandos de monitoreo de conexiones"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Comandos de monitoreo de conexiones](#comandos-de-monitoreo-de-conexiones)
  - [Visualizar puertos abiertos y conexiones con ss](#visualizar-puertos-abiertos-y-conexiones-con-ss)
  - [Identificación de procesos por puerto: lsof -i](#identificación-de-procesos-por-puerto-lsof--i)
  - [Casos prácticos de diagnóstico](#casos-prácticos-de-diagnóstico)
  - [Quédate con...](#quédate-con)

</div>

# Comandos de monitoreo de conexiones

En Linux, conocer qué servicios están escuchando en puertos de red y qué conexiones están activas es fundamental para la administración del sistema, la seguridad y la depuración de aplicaciones. Herramientas como ss y netstat permiten inspeccionar el estado de las conexiones TCP/UDP, identificar procesos asociados a puertos y detectar servicios inesperados o maliciosos. Aunque ambas herramientas ofrecen funcionalidades similares, ss (socket statistics) ha reemplazado a netstat en sistemas modernos por su mayor velocidad y eficiencia, ya que accede directamente a la información del kernel sin depender de interfaces obsoletas.

## Visualizar puertos abiertos y conexiones con ss

El comando ss es la herramienta recomendada en sistemas actuales (parte del paquete iproute2). Muestra sockets de red de forma rápida y detallada.

Comandos esenciales

Conexiones establecidas:

```bash
ss -tuln
```

- Opciones:
  - -t → TCP
  - -u → UDP
  - -l → puertos en escucha (listening)
  - -n → muestra números de puerto (no resuelve nombres)

Conexiones con proceso asociado:

```bash
ss -tulnp
```

La opción -p muestra el PID y nombre del proceso (requiere privilegios de root para ver procesos ajenos).

Ejemplo de salida:

```
Netid  State   Recv-Q Send-Q Local Address:Port  Peer Address:Port
tcp    LISTEN  0      128    0.0.0.0:22          0.0.0.0:*        users:(("sshd",pid=1234,fd=3))
tcp    ESTAB   0      0      192.168.1.10:22     192.168.1.5:54321 users:(("sshd",pid=5678,fd=4))
```

> ss es significativamente más rápido que netstat, especialmente en sistemas con muchas conexiones.

Aunque aún presente en muchos sistemas, netstat (parte del paquete net-tools) está en desuso. Su sintaxis es similar:

```bash
netstat -tulnp
```

Sin embargo, netstat depende de /proc/net/, lo que lo hace más lento y menos preciso en sistemas modernos. Se recomienda usarlo solo si ss no está disponible.
Algunas distribuciones mínimas (como Alpine o contenedores) no incluyen netstat por defecto.

## Identificación de procesos por puerto: lsof -i

El comando lsof (list open files) puede mostrar qué procesos tienen archivos de red abiertos, lo que es ideal para identificar qué programa está usando un puerto específico.

```bash
sudo lsof -i :80        # muestra quién usa el puerto 80
sudo lsof -i TCP        # muestra todas las conexiones TCP
sudo lsof -i @192.168.1.10  # conexiones hacia esa IP

# Ejemplo útil:
$ sudo lsof -i :3000
COMMAND   PID USER   FD TYPE DEVICE SIZE/OFF NODE NAME
node    12345 ana   20u IPv6 123456      0t0  TCP *:3000 (LISTEN)
# Esto revela que un proceso node (PID 12345) está escuchando en el puerto 3000.
```

> lsof requiere privilegios elevados para ver procesos de otros usuarios. Sin sudo, solo verás tus propios procesos.

## Casos prácticos de diagnóstico

```bash
# ¿Qué servicio está usando el puerto 8080?
sudo ss -ltnp | grep :8080
# o
sudo lsof -i :8080

# ¿Hay conexiones entrantes sospechosas?
ss -tnp state established # Busca conexiones desde IPs desconocidas o a puertos inusuales.

# ¿Mi servidor web está escuchando?
ss -ltn | grep ':80\b' # El \b asegura que coincida con el puerto 80, no con 8080.
```

## Quédate con...

- Usa ss -tulnp como herramienta principal para monitorear conexiones y puertos.
- netstat es legado; evítalo en sistemas modernos.
- lsof -i es ideal para identificar qué proceso usa un puerto específico.
- La opción -p en ss o netstat muestra el PID y nombre del proceso (usa sudo para ver todos).
- Combinar estas herramientas permite diagnosticar problemas de red, detectar servicios no autorizados y depurar aplicaciones que usan sockets.
- El monitoreo de conexiones es una habilidad esencial para la seguridad, rendimiento y correcto funcionamiento de cualquier sistema conectado a una red.

<div class="pagination">
  <a href="/markdown/sistemas/linux/redes/comandos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/redes/ssh" class="next">Siguiente</a>
</div>
