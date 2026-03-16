---
title: "Monitoreo"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Monitoreo](#monitoreo)
  - [ps: instantáneas de procesos](#ps-instantáneas-de-procesos)
  - [Opciones clave](#opciones-clave)
  - [top: monitoreo en tiempo real](#top-monitoreo-en-tiempo-real)
    - [Secciones clave de top](#secciones-clave-de-top)
  - [Interacción con top](#interacción-con-top)
  - [htop: una experiencia mejorada](#htop-una-experiencia-mejorada)
  - [Quédate con...](#quédate-con)

</div>

# Monitoreo

Monitorear los procesos y el uso de recursos es una tarea diaria en la administración de sistemas Linux. Saber qué está consumiendo CPU, memoria o tiempo de E/S permite identificar cuellos de botella, depurar aplicaciones lentas, detectar procesos maliciosos o simplemente entender cómo se comporta tu sistema en tiempo real. Las herramientas ps, top y htop forman la base de este monitoreo: ps ofrece instantáneas puntuales ideales para scripts y diagnóstico rápido; top proporciona una vista dinámica en tiempo real; y htop mejora esta experiencia con una interfaz más intuitiva y funciones interactivas. Dominar estas herramientas te da control total sobre el estado de tu sistema.

## ps: instantáneas de procesos

El comando ps (process status) muestra una foto fija de los procesos en el momento de su ejecución. Es ideal para scripts, búsquedas específicas o cuando necesitas salida estructurada sin actualización continua.

## Opciones clave

La combinación más usada es ps aux:

- a → muestra procesos de todos los usuarios (no solo el tuyo).
- u → formato orientado al usuario, con columnas como CPU%, MEM%, VSZ (memoria virtual), RSS (memoria residente).
- x → incluye procesos sin terminal asociada (como servicios en segundo plano).

Ejemplo:

```bash
ps aux | grep nginx
```

Otras combinaciones útiles:

- ps -ef → formato estándar POSIX, muestra PID, PPID y línea de comandos completa.
- ps -u ana → procesos del usuario ana.
- ps -o pid,ppid,cmd,%cpu,%mem --sort=-%cpu → personaliza las columnas y ordena por uso de CPU descendente.

ps no actualiza automáticamente; para seguimiento continuo, combínalo con watch:

```bash
watch -n 2 'ps aux | head -10'
```

## top: monitoreo en tiempo real

top es un visor dinámico que actualiza automáticamente la lista de procesos (por defecto, cada 3 segundos). Muestra no solo los procesos, sino también estadísticas globales del sistema en la parte superior.

### Secciones clave de top

1. Resumen del sistema (parte superior):
   - Uptime: tiempo desde el último arranque.
   - Carga promedio (load average): promedio de procesos en estado runnable o uninterruptible sleep en los últimos 1, 5 y 15 minutos. Valores superiores al número de núcleos indican saturación.
   - Tareas: total, ejecutando, durmiendo, detenidas, zombies.
   - Uso de CPU: desglose en %us (usuario), %sy (sistema), %id (inactivo), %wa (espera de E/S), etc.
   - Memoria: total, usada, libre, caché/búfer.
2. Lista de procesos (parte inferior):
   - Ordenada por defecto por uso de CPU.
   - Columnas clave: PID, USER, PR (prioridad), NI (nice), VIRT (memoria virtual), RES (memoria física), SHR (memoria compartida), %CPU, %MEM, TIME+, COMMAND.

## Interacción con top

- q → salir.
- k → matar un proceso (te pedirá el PID y la señal).
- r → cambiar la prioridad (renice) de un proceso.
- P → ordenar por CPU; M → por memoria; N → por PID.
- 1 → mostrar uso por núcleo de CPU.

> La carga del sistema (load average) no es un porcentaje, sino un número absoluto. En un sistema de 4 núcleos, una carga de 4.0 significa que todos los núcleos están completamente ocupados.

## htop: una experiencia mejorada

htop es una versión moderna y amigable de top, con mejoras significativas:

- Interfaz coloreada y legible.
- Desplazamiento vertical y horizontal con las flechas.
- Árbol de procesos (con F5) para ver relaciones padre-hijo.
- Menús interactivos (accesibles con F1–F10 o clic si el terminal lo permite).
- Filtros de búsqueda (F3).
- Matado de procesos directo con F9.

Instalación (en sistemas basados en Debian/Ubuntu):

```bash
sudo apt install htop

# Uso básico:
htop
```

En htop, puedes:

- Seleccionar un proceso con las flechas y pulsar F9 para enviarle una señal.
- Pulsar F6 para elegir el criterio de ordenación.
- Ver gráficos de uso de CPU, memoria y swap en la parte superior.

> Aunque htop no viene instalado por defecto en todos los sistemas mínimos (como servidores Docker), es ampliamente disponible y recomendado para uso interactivo.

## Quédate con...

- Usa ps aux para obtener listados estáticos y filtrables de procesos.
- top ofrece monitoreo en tiempo real con estadísticas del sistema; domina sus atajos para depuración rápida.
- htop es más visual e intuitivo, ideal para análisis interactivo en entornos con interfaz.
- La carga del sistema (load average) mide la demanda de CPU, no el porcentaje de uso.
- El uso de memoria debe interpretarse junto con caché y buffers: Linux usa memoria libre para caché, lo que no indica escasez.
- Estas herramientas son esenciales para mantener el rendimiento, seguridad y estabilidad de cualquier sistema Linux.

<div class="pagination">
  <a href="/markdown/sistemas/linux/procesos/proceso" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/procesos/envio" class="next">Siguiente</a>
</div>
