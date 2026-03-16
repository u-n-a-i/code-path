---
title: "Servicios"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Servicios](#servicios)
  - [Concepto de unidad (unit)](#concepto-de-unidad-unit)
  - [Gestión de servicios con systemctl](#gestión-de-servicios-con-systemctl)
    - [Iniciar, detener y reiniciar](#iniciar-detener-y-reiniciar)
    - [Habilitar/deshabilitar en el arranque](#habilitardeshabilitar-en-el-arranque)
    - [Ver estado](#ver-estado)
  - [Consulta de registros con journalctl](#consulta-de-registros-con-journalctl)
  - [Quédate con...](#quédate-con)

</div>

# Servicios

En sistemas Linux modernos, los servicios —programas que se ejecutan en segundo plano para gestionar funciones del sistema como redes, servidores web, bases de datos o planificación de tareas— son administrados por systemd, el gestor de arranque y servicios estándar en la mayoría de las distribuciones. systemd reemplazó a sistemas más antiguos (como SysV init o Upstart) al ofrecer un modelo unificado, paralelo y robusto para controlar no solo servicios, sino también dispositivos, montajes, sockets y tareas temporizadas. Comprender cómo interactuar con systemd es esencial para administrar cualquier servidor o sistema Linux actual.

## Concepto de unidad (unit)

En systemd, todo lo que se gestiona se llama una unidad (unit). Cada unidad se define mediante un archivo de configuración (con extensión específica) ubicado normalmente en /etc/systemd/system/ (configuraciones locales) o /usr/lib/systemd/system/ (instaladas por paquetes).

Los tipos más comunes son:

.service: unidades de servicio (por ejemplo, nginx.service, ssh.service).
.socket: activación por socket.
.timer: tareas programadas (alternativa a cron).
.target: estados del sistema (equivalentes a los “niveles de ejecución” antiguos, como multi-user.target o graphical.target).
Cuando hablamos de “servicios”, nos referimos principalmente a unidades de tipo .service.

> Aunque los archivos tienen extensiones, systemctl permite omitirlas. Por ejemplo, systemctl status nginx equivale a systemctl status nginx.service.

## Gestión de servicios con systemctl

El comando principal para interactuar con systemd es systemctl. Sus operaciones más comunes son:

### Iniciar, detener y reiniciar

```bash
sudo systemctl start nginx        # inicia el servicio
sudo systemctl stop nginx         # lo detiene
sudo systemctl restart nginx      # lo reinicia (útil tras cambios de configuración)
sudo systemctl reload nginx       # recarga la configuración sin reiniciar (si el servicio lo soporta)
```

### Habilitar/deshabilitar en el arranque

```bash
sudo systemctl enable nginx       # el servicio se inicia automáticamente al arrancar
sudo systemctl disable nginx      # se desactiva el inicio automático
```

enable/disable no afectan al estado actual del servicio; solo configuran su comportamiento en el próximo arranque.

### Ver estado

```bash
systemctl status nginx
```

Muestra:

- Si el servicio está activo (running) o inactivo.
- El PID del proceso principal.
- Los últimos mensajes de registro (logs).
- Si está habilitado para el arranqu

Ejemplo de salida útil:

```
● nginx.service - A high performance web server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-01-14 10:00:00 CET; 2h ago
   Main PID: 1234 (nginx)
      Tasks: 5 (limit: 4627)
     Memory: 3.2M
        CPU: 120ms
     CGroup: /system.slice/nginx.service
             ├─1234 nginx: master process /usr/sbin/nginx
             └─1235 nginx: worker process
```

## Consulta de registros con journalctl

systemd incluye su propio sistema de registro llamado journald, que centraliza los logs de todos los servicios.

Para ver los logs de un servicio, usa:

```bash
sudo journalctl -u nginx
```

Opciones útiles:

- -f → seguir los logs en tiempo real (como tail -f)
- --since "1 hour ago" → filtrar por tiempo.
- -n 50 → mostrar solo las últimas 50 líneas.

Los logs incluyen marca de tiempo, nivel de severidad, PID y mensaje, lo que facilita la depuración de fallos de arranque o errores en tiempo de ejecución.

> A diferencia de los logs tradicionales en /var/log/, el journal es binario y más eficiente, aunque también puede escribirse en archivos de texto si se configura.

## Quédate con...

- systemd es el gestor de servicios estándar en Linux moderno.
- Las unidades (archivos .service) definen cómo se comporta un servicio.
- Usa systemctl start|stop|restart|status nombre para controlar servicios en tiempo real.
- Usa systemctl enable|disable nombre para configurar el inicio automático al arrancar.
- journalctl -u servicio es la forma principal de consultar los logs de un servicio.
- systemctl status y journalctl -f son tus mejores aliados para diagnosticar por qué un servicio no funciona.
- Dominar systemd te permite administrar de forma confiable servidores, contenedores y sistemas embebidos en entornos profesionales.

<div class="pagination">
  <a href="/markdown/sistemas/linux/procesos/plano" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
