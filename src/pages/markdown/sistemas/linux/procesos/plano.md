---
title: "Trabajos en segundo plano"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Trabajos en segundo plano](#trabajos-en-segundo-plano)
  - [Iniciar un proceso directamente en segundo plano](#iniciar-un-proceso-directamente-en-segundo-plano)
  - [Gestionar trabajos con jobs, bg y fg](#gestionar-trabajos-con-jobs-bg-y-fg)
  - [Casos prácticos](#casos-prácticos)
  - [Limitaciones importantes](#limitaciones-importantes)
  - [Quédate con...](#quédate-con)

</div>

# Trabajos en segundo plano

En la terminal, no todos los procesos necesitan ejecutarse de forma interactiva o bloquear tu sesión. Linux permite gestionar trabajos (jobs) —procesos iniciados desde una shell— de forma flexible: puedes ejecutarlos en segundo plano, pausarlos, reanudarlos o moverlos entre primer y segundo plano sin perderlos. Esta funcionalidad es especialmente útil cuando lanzas tareas largas (como descargas, compilaciones o copias masivas) y deseas seguir usando la misma terminal para otros comandos. Las herramientas &, bg, fg y jobs forman un sistema coherente para controlar estos trabajos de forma interactiva.

## Iniciar un proceso directamente en segundo plano

Para evitar que un comando bloquee la terminal, añade el símbolo & al final:

```bash
tar -czf backup.tar.gz /datos &
```

Esto lanza el proceso en segundo plano inmediatamente. La shell devuelve el control al instante y muestra algo como: `[1] 12345`

Donde:

- [1] es el número de trabajo (job ID),
- 12345 es el PID del proceso.

El proceso se ejecuta sin interferir con tu sesión, pero sigue vinculado a la terminal: si cierras la terminal, recibirá una señal SIGHUP y se detendrá (a menos que uses nohup o disown, temas avanzados).

> Los procesos en segundo plano pueden seguir escribiendo en la terminal (por ejemplo, mensajes de error), lo que puede resultar confuso. Para evitarlo, redirige su salida: `comando > salida.log 2>&1 &`.

## Gestionar trabajos con jobs, bg y fg

Si ya iniciaste un proceso en primer plano, puedes pausarlo y moverlo a segundo plano:

```bash
# Pausar: presiona Ctrl+Z. El proceso entra en estado Stopped.
^Z
[1]+  Stopped                 sleep 100

# Ver trabajos actuales: usa jobs.
jobs # Salida: [1]+ Stopped sleep 10


# Reanudar en segundo plano: bg %1 (o solo bg si hay un solo trabajo).
bg %1 # El trabajo [1] continúa en segundo plano

# Traer al primer plano: fg %1 (o fg)
fg %1 # Recuperas el control interactivo del proceso
```

Los símbolos %1, %2, etc., se refieren al número de trabajo, no al PID. Puedes omitir el número si solo hay un trabajo activo.

> fg y bg solo funcionan con trabajos de la shell actual. No puedes manipular procesos iniciados desde otra terminal con estos comandos.

## Casos prácticos

```bash
# ------------------------------------------
# Compilar en segundo plano mientras editas:
# ------------------------------------------
make &
# Sigues trabajando...
fg    # Vuelves al make si quieres ver el resultado final

# -------------------------------------
# Pausar una tarea larga temporalmente:
# -------------------------------------
rsync -av /origen/ /destino/
# Presionas Ctrl+Z
jobs
bg    # La sincronización continúa sin bloquear

# -------------------------------------
# Monitorear varios trabajos:
# -------------------------------------
sleep 300 &
wget https://ejemplo.com/grande.iso &
jobs
# [1]- Running sleep 300
# [2]+ Running wget ...
```

## Limitaciones importantes

- Los trabajos en segundo plano mueren si cierras la terminal, a menos que uses:
  - nohup comando & → ignora SIGHUP.
  - disown %1 → desvincula el trabajo de la shell.
- Solo puedes gestionar trabajos creados desde la misma sesión de shell.
- Los scripts no interactivos (como los de cron) no soportan jobs, fg o bg.

## Quédate con...

- Usa comando & para iniciar un proceso directamente en segundo plano.
- Ctrl+Z pausa un proceso en primer plano; luego usa bg para continuar en segundo plano o fg para recuperarlo.
- jobs lista todos los trabajos activos de la shell actual con sus estados.
- Los números de trabajo (%1, %2) se usan con fg, bg y kill %1.
- Esta funcionalidad es ideal para tareas largas en sesiones interactivas, pero no sustituye a servicios del sistema (systemd) ni a herramientas como screen o tmux para sesiones persistentes.
- Dominar el control de trabajos te permite mantener una terminal productiva sin abrir múltiples pestañas innecesarias.

<div class="pagination">
  <a href="/markdown/sistemas/linux/procesos/envio" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/procesos/servicios" class="next">Siguiente</a>
</div>
