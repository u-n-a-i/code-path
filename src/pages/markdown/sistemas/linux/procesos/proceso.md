---
title: "Definición y estados de un proceso"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Definición y estados de un proceso](#definición-y-estados-de-un-proceso)
  - [Estados de un proceso](#estados-de-un-proceso)
    - [R – Running (o Runnable)](#r--running-o-runnable)
    - [S – Interruptible Sleep](#s--interruptible-sleep)
    - [D – Uninterruptible Sleep](#d--uninterruptible-sleep)
    - [T – Stopped](#t--stopped)
    - [Z – Zombie](#z--zombie)
    - [Otros estados menos comunes:](#otros-estados-menos-comunes)
  - [Visualización de estados](#visualización-de-estados)
  - [Quédate con...](#quédate-con)

</div>

# Definición y estados de un proceso

En Linux, un proceso es una instancia en ejecución de un programa. Cada vez que lanzas un comando, abres una aplicación o el sistema inicia un servicio, se crea un proceso que el kernel gestiona asignándole recursos (CPU, memoria, archivos abiertos, etc.). Para administrar eficientemente cientos o miles de procesos simultáneos, el sistema les asigna identificadores únicos y los organiza en una jerarquía, además de rastrear su estado actual. Comprender qué es un proceso, cómo se identifica y en qué estados puede encontrarse es fundamental para monitorear el sistema, depurar problemas de rendimiento o gestionar tareas en segundo plano.

Identificación: PID y PPID
Cada proceso recibe dos identificadores clave al crearse:

PID (Process ID): un número entero único que identifica al proceso durante su vida útil. Los PID se reutilizan tras el reinicio, pero nunca coinciden entre procesos activos.
PPID (Parent Process ID): el PID del proceso que lo creó (su “padre”). La mayoría de los procesos heredan el entorno y permisos de su padre.
El primer proceso del sistema es init (o systemd en sistemas modernos), con PID 1. Todos los demás procesos descienden de él, formando un árbol jerárquico. Si un proceso padre termina antes que sus hijos, estos son adoptados por PID 1.

Puedes ver tu propio PID y el de otros con:

```bash
echo $$          # muestra el PID de la shell actual
ps -ef           # lista todos los procesos con PID y PPID
```

> El PID máximo depende del sistema, pero suele estar en /proc/sys/kernel/pid_max (por ejemplo, 32768 o más).

## Estados de un proceso

El kernel mantiene cada proceso en un estado específico que refleja su actividad actual. Estos estados aparecen en herramientas como ps o top como una letra:

### R – Running (o Runnable)

El proceso está ejecutándose en la CPU o está listo para ejecutarse tan pronto como el planificador lo asigne. Aunque solo un proceso por núcleo puede estar realmente en ejecución en un instante dado, muchos pueden estar en estado runnable.

### S – Interruptible Sleep

El proceso está esperando un evento (como entrada del teclado, datos de red o finalización de E/S) y puede ser despertado por una señal. Este es el estado más común para procesos inactivos pero activos (como un editor esperando que escribas).

### D – Uninterruptible Sleep

Similar a S, pero el proceso no puede ser interrumpido ni siquiera por señales. Suele ocurrir durante operaciones de E/S críticas (por ejemplo, acceso a disco). No es posible matar un proceso en estado D; debe completar su operación o fallar.

### T – Stopped

El proceso ha sido detenido manualmente, normalmente mediante una señal como SIGSTOP (Ctrl+Z en la terminal) o por un depurador. Puede reanudarse con SIGCONT.

### Z – Zombie

Un proceso ha terminado, pero su entrada aún permanece en la tabla de procesos porque su proceso padre no ha leído su estado de salida (mediante wait()). Los zombies no consumen recursos (ni CPU ni memoria), pero ocupan un PID. Si se acumulan, pueden agotar los PID disponibles.

> No se pueden “matar” los zombies con kill; solo desaparecen cuando el padre los recolecta o cuando el padre muere y init (PID 1) los adopta y limpia.

### Otros estados menos comunes:

- I – Idle (usado por subprocesos del kernel en algunos sistemas).
- X – Proceso muerto (transitorio, casi nunca visible).

## Visualización de estados

Con ps, puedes ver los estados actuales:

```bash
ps aux
```

La columna STAT muestra el estado (por ejemplo, S+ = sleep en primer plano, Z = zombie).

Ejemplo de salida:

```
USER   PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
ana   1234  0.0  0.1 123456  7890 pts/0    S+   10:00   0:00 vim notas.txt
root  5678  0.0  0.0      0     0 ?        Z    09:30   0:00 [defunct]
```

## Quédate con...

- Cada proceso tiene un PID único y un PPID que indica a su proceso padre.
- Los estados principales son:
- R (Running): en ejecución o listo.
- S (Sleeping): esperando un evento, interrumpible.
- D (Uninterruptible): en E/S crítica, no interrumpible.
- T (Stopped): detenido manualmente.
- Z (Zombie): terminado, esperando que el padre lo recoja.
- Los zombies no consumen recursos, pero deben limpiarse para evitar agotar PID.
- El estado de un proceso revela su comportamiento actual y es clave para diagnosticar bloqueos, altos consumos de CPU o procesos huérfanos.
- Herramientas como ps, top y htop muestran estos estados y son esenciales para la administración del sistema.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/procesos/monitoreo" class="next">Siguiente</a>
</div>
