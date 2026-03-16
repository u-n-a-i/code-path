---
title: "Función de la PSU"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Función de la PSU](#función-de-la-psu)
  - [AC vs. DC. Voltios (V), Amperios (A), Vatios (W)](#ac-vs-dc-voltios-v-amperios-a-vatios-w)
  - [Conversión de corriente](#conversión-de-corriente)
  - [Importancia de la estabilidad](#importancia-de-la-estabilidad)
  - [Quédate con...](#quédate-con)

</div>

# Función de la PSU

La fuente de alimentación (Power Supply Unit, o PSU) es el componente encargado de convertir la electricidad de la red —corriente alterna (AC) a 110–240 V— en los niveles de corriente continua (DC) estables y precisos que requieren los componentes internos de una computadora: CPU, GPU, RAM, discos, etc. Aunque rara vez recibe atención (suele esconderse en la parte inferior del gabinete), la PSU es la base de la estabilidad eléctrica del sistema. Una fuente de baja calidad o insuficiente puede causar reinicios aleatorios, corrupción de datos, daño permanente a componentes e incluso fallos catastróficos.

La PSU es un dispositivo electrónico que regula, filtra y distribuye energía a todos los componentes del sistema mediante cables y conectores estandarizados (24-pin ATX, 8-pin EPS, PCIe 6+2 pin, SATA, etc.). No solo reduce el voltaje, sino que también protege contra sobretensiones, cortocircuitos y fluctuaciones de la red eléctrica. Su calidad se mide no solo por su potencia nominal (en vatios), sino por la pureza de la corriente que entrega, su eficiencia energética y su capacidad para mantener voltajes estables bajo cargas variables.

## AC vs. DC. Voltios (V), Amperios (A), Vatios (W)

Entender las unidades eléctricas básicas es esencial para dimensionar correctamente una PSU:

- Corriente alterna (AC): es la forma en que la electricidad se distribuye en la red doméstica (110 V en América, 230 V en Europa). Cambia de dirección 50–60 veces por segundo (Hz).
- Corriente continua (DC): es lo que usan los componentes electrónicos. La PSU convierte AC en DC a voltajes específicos: +12 V, +5 V y +3.3 V.

Las tres magnitudes clave son:

- Voltios (V): “presión” eléctrica. Los componentes requieren voltajes muy precisos (por ejemplo, una CPU moderna opera entre 0.8 V y 1.4 V, regulado internamente desde +12 V).
- Amperios (A): cantidad de corriente que fluye. Componentes con alto consumo (como la GPU) necesitan muchos amperios en la línea +12 V.
- Vatios (W): potencia real consumida. Se calcula como W=V×A. Por ejemplo, una GPU que consume 20 A a +12 V usa 12×20=240 W.

La PSU debe suministrar suficientes vatios en cada línea de voltaje, no solo en total.

## Conversión de corriente

El proceso interno de una PSU moderna (de tipo conmutación) incluye varias etapas:

1. Filtro EMI: elimina ruido de la red eléctrica y evita que la PSU emita interferencias.
1. Rectificación y filtrado: convierte AC en DC bruto (~300–400 V).
1. Conversión de conmutación: transistores de alta velocidad “cortan” esta corriente en pulsos, que pasan por un transformador de alta frecuencia para reducir el voltaje.
1. Regulación y filtrado final: circuitos estabilizan las salidas a +12 V, +5 V y +3.3 V con tolerancias muy ajustadas (±5% o menos).

En fuentes de gama alta, cada línea tiene su propio circuito de regulación (regulación independiente), lo que mejora la estabilidad frente a cargas desequilibradas.

## Importancia de la estabilidad

La estabilidad eléctrica es crítica por varias razones:

- Integridad de los datos: un voltaje inestable en la línea +3.3 V (usada por la RAM y chips del chipset) puede causar errores de lectura/escritura, pantallazos azules o corrupción de archivos.
- Vida útil de los componentes: voltajes excesivos o ruido eléctrico aceleran el desgaste por electromigración en los transistores del CPU o GPU.
- Rendimiento determinista: bajo cargas variables (como al compilar o renderizar), una PSU de baja calidad puede dejar caer el voltaje en +12 V, provocando throttling o reinicios.
- Protección del sistema: buenas PSU incluyen circuitos de protección contra:
  - OCP (Over-Current Protection): exceso de corriente.
  - OVP/UVP (Over/Under-Voltage Protection): voltajes fuera de rango.
  - SCP (Short-Circuit Protection): cortocircuitos.
  - OPP (Over-Power Protection): sobrecarga de potencia.

Una PSU certificada (80 PLUS, con componentes de calidad) no solo ahorra energía, sino que actúa como una barrera de seguridad entre la red eléctrica y tu hardware.

> Nunca subdimensiones una PSU. Aunque tu sistema consuma 300 W en promedio, los picos momentáneos (especialmente en GPUs modernas) pueden superar los 500 W. Una PSU de 500–600 W de buena calidad es un punto de partida seguro para sistemas de gama media; los de gama alta con GPU potente necesitan 750–1000 W o más.

## Quédate con...

- La PSU convierte AC de la red en DC estable (+12 V, +5 V, +3.3 V) para todos los componentes.
- Voltios, amperios y vatios están relacionados: W=V×A;la PSU debe entregar suficiente corriente en cada línea.
- El proceso de conversión incluye filtrado, rectificación y regulación para garantizar señales limpias y estables.
- La estabilidad eléctrica previene fallos, corrupción de datos y daños permanentes; no se trata solo de potencia, sino de calidad.
- Invierte en una PSU de marca reconocida y certificada (80 PLUS Bronze o superior); es la base invisible de un sistema confiable.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/psu/formato" class="next">Siguiente</a>
</div>
