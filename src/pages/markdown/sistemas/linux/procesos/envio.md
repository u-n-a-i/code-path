---
title: "Envío de señales a procesos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Envío de señales a procesos](#envío-de-señales-a-procesos)
  - [Señales comunes y su propósito](#señales-comunes-y-su-propósito)
  - [Enviar señales con kill](#enviar-señales-con-kill)
  - [Alternativas: killall y pkill](#alternativas-killall-y-pkill)
    - [killall](#killall)
    - [pkill](#pkill)
  - [Flujo recomendado para terminar un proceso](#flujo-recomendado-para-terminar-un-proceso)
  - [Quédate con...](#quédate-con)

</div>

# Envío de señales a procesos

En Linux, los procesos no se “matan” de forma brusca por defecto; en cambio, se les envían señales, que son notificaciones asíncronas que indican al proceso que debe realizar una acción específica. Estas señales permiten desde solicitar un cierre ordenado hasta forzar la terminación inmediata o incluso recargar configuraciones sin reiniciar. El sistema define más de 30 señales, pero solo unas pocas son de uso común. Comprender cuándo y cómo usarlas —con herramientas como kill, killall y pkill— es clave para administrar procesos de forma segura, evitando pérdida de datos o corrupción de estado.

## Señales comunes y su propósito

Cada señal tiene un nombre simbólico (como SIGTERM) y un número asociado. Las más relevantes son:

- SIGTERM (15):
  Solicitud de terminación ordenada. Es la señal predeterminada de kill. Da al proceso la oportunidad de limpiar recursos, guardar datos y cerrar conexiones antes de salir. La mayoría de los programas bien escritos capturan esta señal y responden adecuadamente.
- SIGKILL (9):
  Terminación inmediata e incondicional. El kernel detiene el proceso al instante, sin darle chance de reaccionar. No puede ser ignorada ni capturada. Úsala solo como último recurso, ya que puede causar pérdida de datos o archivos corruptos.
- SIGHUP (1):
  Originalmente significaba “colgar la línea” (de las conexiones telefónicas), hoy se usa comúnmente para indicar a un servicio que recargue su configuración sin detenerse. Muchos servidores (como Apache, Nginx o SSH) lo soportan.

Otras señales útiles:

- SIGSTOP (19): detiene un proceso (no puede ser ignorado).
- SIGCONT (18): reanuda un proceso detenido.
- SIGINT (2): interrupción desde el teclado (Ctrl+C).

> Nunca uses SIGKILL si no has intentado primero SIGTERM. Un cierre ordenado previene errores y mantiene la integridad del sistema.

## Enviar señales con kill

A pesar de su nombre, kill no mata procesos por defecto: envía señales.

```bash
# Su sintaxis básica es:
kill -SEÑAL PID

# Ejemplos:
kill 1234          # envía SIGTERM (15) al proceso 1234
kill -15 1234      # explícito: SIGTERM
kill -9 1234       # SIGKILL: terminación forzada
kill -1 1234       # SIGHUP: recargar configuración

# Puedes listar todas las señales con:
kill -l
```

## Alternativas: killall y pkill

Cuando no conoces el PID, sino el nombre del proceso, estas herramientas son más prácticas:

### killall

Envía una señal a todos los procesos con un nombre dado:

```bash
killall firefox        # envía SIGTERM a todos los procesos llamados "firefox"
killall -9 servidor    # fuerza la terminación de "servidor"
```

> En algunos sistemas (como Solaris), killall mata todos los procesos. En Linux, actúa por nombre, pero verifica siempre el comportamiento en tu distribución.

### pkill

Más flexible: permite usar patrones parciales o expresiones regulares:

```bash
pkill -f "python script.py"   # mata procesos cuya línea de comandos coincida
pkill -u ana                  # mata todos los procesos del usuario "ana"
pkill -x nginx                # solo si el nombre coincide exactamente

# Para enviar una señal distinta de SIGTERM:
pkill -SIGKILL nombre
# o
pkill -9 nombre
```

## Flujo recomendado para terminar un proceso

```bash
# 1- Intenta primero un cierre ordenado:
kill PID
# o
pkill nombre

# 2- Espera unos segundos. Si el proceso persiste, insiste con SIGTERM explícito.

# 3- Solo si sigue activo tras 10–30 segundos, usa SIGKILL:
kill -9 PID
```

Este enfoque respeta el diseño del software y minimiza riesgos.

## Quédate con...

- SIGTERM (15) es la señal estándar para solicitar un cierre ordenado.
- SIGKILL (9) fuerza la terminación inmediata; úsalo solo como último recurso.
- SIGHUP (1) suele usarse para recargar configuraciones sin reiniciar.
- Usa kill con PID para precisión; pkill o killall con nombre para conveniencia.
- Nunca saltes directamente a SIGKILL: siempre intenta primero un cierre limpio.
- Las señales son una parte esencial del modelo de procesos Unix: permiten comunicación, control y cooperación entre programas.

<div class="pagination">
  <a href="/markdown/sistemas/linux/procesos/monitoreo" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/procesos/plano" class="next">Siguiente</a>
</div>
