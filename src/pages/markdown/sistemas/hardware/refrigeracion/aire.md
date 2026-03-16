---
title: "Refrigeración por aire"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Refrigeración por aire](#refrigeración-por-aire)
  - [Disipadores](#disipadores)
    - [Materiales](#materiales)
    - [Aletas](#aletas)
    - [Heatpipes (tubos de calor)](#heatpipes-tubos-de-calor)
  - [Tipos de ventiladores](#tipos-de-ventiladores)
    - [Tamaño](#tamaño)
    - [CFM (Cubic Feet per Minute)](#cfm-cubic-feet-per-minute)
    - [Ruido](#ruido)
  - [Quédate con...](#quédate-con)

</div>

# Refrigeración por aire

La refrigeración por aire es el método más común, económico y fiable para disipar el calor generado por los componentes de una computadora. Utiliza una combinación de disipadores metálicos y ventiladores para transferir el calor desde la CPU, GPU u otros chips al aire circundante. Aunque carece del potencial extremo de la refrigeración líquida, una solución por aire bien diseñada puede ofrecer un rendimiento térmico excelente, bajo ruido y cero riesgo de fugas. Para un desarrollador cuya estación de trabajo opera durante horas bajo cargas intensivas —como compilación, entrenamiento de modelos o renderizado—, elegir un sistema de refrigeración por aire adecuado es una decisión crítica para mantener el rendimiento sostenido y la tranquilidad acústica.

El principio básico es simple: el calor del chip se conduce a un disipador metálico, cuya gran superficie permite transferir ese calor al aire. Un ventilador fuerza el flujo de aire a través del disipador, acelerando la convección. Este sistema no requiere mantenimiento (más allá de limpieza periódica), es silencioso en configuraciones bien equilibradas y tiene una vida útil que supera con creces la del resto del hardware.

## Disipadores

El disipador es el corazón de la refrigeración por aire. Sus características determinan la eficiencia térmica:

### Materiales

- Cobre: excelente conductividad térmica (~400 W/m·K), ideal para la base y las heatpipes. Más caro y pesado.
- Aluminio: buena relación costo/peso/conductividad (~200 W/m·K), usado en las aletas. Más ligero y económico.
- Diseños híbridos: base de cobre + aletas de aluminio, equilibrando rendimiento y costo.

### Aletas

- Superficie: más aletas = mayor área de contacto con el aire = mejor disipación.
- Espaciado: demasiadas aletas muy juntas dificultan el flujo de aire, especialmente con ventiladores de baja presión estática. El espaciado óptimo depende del tipo de ventilador usado.
- Tratamientos: algunas aletas incluyen recubrimientos negros para mejorar ligeramente la radiación (aunque el efecto es mínimo).

### Heatpipes (tubos de calor)

- Funcionamiento: tubos sellados que contienen un fluido de bajo punto de ebullición. El calor en un extremo vaporiza el fluido; el vapor viaja al extremo frío, se condensa y regresa por capilaridad.
- Ventaja: transfieren calor de forma extremadamente eficiente (mucho más que el metal sólido), permitiendo que la base del disipador esté lejos de las aletas.
- Número y disposición: más heatpipes y mejor contacto con el IHS (Integrated Heat Spreader) de la CPU mejoran el rendimiento. Los disipadores de gama alta usan 6–8 heatpipes.

> La calidad del contacto entre la CPU y el disipador es crítica. Una instalación incorrecta (torcido, presión desigual) crea microhuecos que reducen drásticamente la conducción, incluso con buena pasta térmica.

## Tipos de ventiladores

El ventilador mueve el aire a través del disipador. Sus características definen el equilibrio entre refrigeración y ruido:

### Tamaño

- 80–92 mm: comunes en disipadores compactos o gabinetes pequeños. Mayor ruido a altas RPM.
- 120 mm: estándar óptimo: buen flujo de aire con RPM más bajas = menos ruido.
- 140 mm: máximo flujo con mínimas RPM; ideal para gabinetes amplios y sistemas silenciosos.

### CFM (Cubic Feet per Minute)

- Mide el volumen de aire movido por minuto. A mayor CFM, mayor capacidad de refrigeración.
- Presión estática: ventiladores con alta presión estática (medida en mm H₂O) pueden forzar aire a través de disipadores densos; los de alto CFM pero baja presión estática son mejores para flujo general en gabinetes.

### Ruido

- Medido en decibelios (dBA).
  - <20 dBA: prácticamente inaudible.
  - 25–30 dBA: silencioso (oficina).
  - 35 dBA: perceptible; >40 dBA: molesto en entornos silenciosos.
- Curvas de ruido-RPM: los ventiladores modernos usan rodamientos de calidad (fluid dynamic, magnetic levitation) para reducir ruido a bajas RPM. La mayoría incluye control PWM (4 pines) para ajustar la velocidad según la temperatura.

> Para estaciones de trabajo silenciosas, prioriza ventiladores de 120/140 mm con control PWM, alta presión estática y ruido <25 dBA a 50% de carga. Marca modelos como los Noctua NF-A12x25, be quiet! Silent Wings o Arctic P12/P14.

## Quédate con...

- La refrigeración por aire es fiable, silenciosa y sin mantenimiento, ideal para la mayoría de estaciones de desarrollo.
- Los disipadores combinan cobre (base/heatpipes) y aluminio (aletas); más heatpipes y mejor contacto = mejor rendimiento.
- Los ventiladores de 120/140 mm ofrecen el mejor equilibrio entre flujo de aire, presión estática y ruido.
- CFM y presión estática definen la eficacia; dBA define la molestia acústica.
- Una instalación correcta (presión uniforme, pasta térmica bien aplicada) es tan importante como la calidad del disipador.
- Para cargas sostenidas (IA, compilación), un disipador robusto con buen flujo de aire evita el thermal throttling y mantiene el rendimiento estable sin ruido excesivo.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/refrigeracion/principios" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/refrigeracion/pasta" class="next">Siguiente</a>
</div>
