console.log("--- Fechas (Date) y la futura API Temporal en JavaScript ---");

// --- 1. Objeto `Date` (El enfoque actual) ---
// El objeto `Date` de JavaScript maneja fechas y horas. Por defecto, opera en la zona horaria local
// del usuario o en UTC (Tiempo Universal Coordinado).

console.log("\n--- Usando el Objeto `Date` ---");

// Crear una fecha y hora actual
const ahora = new Date();
console.log("Fecha y hora actual:", ahora); // Salida: (ej. Fri May 23 2025 08:08:04 GMT+0200 (Central European Summer Time))

// Crear una fecha específica
const fechaEspecifica = new Date("2024-10-26T10:30:00"); // ISO 8601 string
console.log("Fecha específica (ISO):", fechaEspecifica);

const otraFecha = new Date(2023, 0, 15, 14, 0, 0); // Año, Mes (0-11), Día, Hora, Minuto, Segundo
console.log("Otra fecha (manual):", otraFecha); // Salida: Sun Jan 15 2023 14:00:00 GMT+0100

// Métodos para obtener componentes de la fecha (¡cuidado con los meses que son base 0!)
console.log("Año:", ahora.getFullYear());
console.log("Mes (0-11):", ahora.getMonth());
console.log("Día del mes (1-31):", ahora.getDate());
console.log("Día de la semana (0-6, domingo=0):", ahora.getDay());
console.log("Hora:", ahora.getHours());
console.log("Minutos:", ahora.getMinutes());
console.log("Segundos:", ahora.getSeconds());
console.log("Milisegundos:", ahora.getMilliseconds());
console.log("Zona horaria (offset en minutos):", ahora.getTimezoneOffset()); // Desplazamiento desde UTC en minutos

// Métodos UTC (usan UTC en lugar de la zona horaria local)
console.log("Hora UTC:", ahora.getUTCHours());

// Métodos para establecer componentes de la fecha
const fechaModificable = new Date();
fechaModificable.setFullYear(2026);
fechaModificable.setMonth(5); // Junio
console.log("Fecha modificada:", fechaModificable);

// Realizar cálculos con fechas (puede ser un poco complicado con `Date`)
const fechaFutura = new Date(ahora); // Crea una copia para no modificar 'ahora'
fechaFutura.setDate(ahora.getDate() + 7); // Suma 7 días
console.log("Fecha de hoy + 7 días:", fechaFutura);

const diferenciaMs = fechaFutura.getTime() - ahora.getTime(); // Diferencia en milisegundos
const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);
console.log("Diferencia en días:", diferenciaDias);

// Formatear fechas (los métodos `.toString()` a menudo no son suficientes)
console.log("Formato predeterminado:", ahora.toString());
console.log(
  "Formato legible (locale-aware):",
  ahora.toLocaleString("es-ES", { dateStyle: "full", timeStyle: "short" })
);
console.log("Solo fecha (ISO):", ahora.toISOString().split("T")[0]); // Común para bases de datos

// --- 2. API Temporal (El futuro de las Fechas en JavaScript) ---
// La API Temporal ofrece objetos inmutables para representar fechas, horas y duraciones.
// Está diseñada para ser más segura, clara y fácil de usar, eliminando las complejidades
// de `Date` (como la mutabilidad, problemas de zona horaria, y cálculos).

// NOTA: Para ejecutar esto en tu entorno, necesitarías un polyfill como `@js-temporal/polyfill`.
// En un navegador moderno sin polyfill, `Temporal` será `undefined`.
// Este código asume que `Temporal` está disponible.

if (typeof Temporal !== "undefined") {
  console.log("\n--- Usando la API Temporal (¡El Futuro!) ---");

  // Temporal.Now: Para obtener la fecha y hora actual en diferentes contextos
  const temporalAhora = Temporal.Now.instant(); // Punto en el tiempo exacto (UTC)
  console.log("Temporal Instant (ahora):", temporalAhora.toString());

  const temporalFechaHoraLocal = Temporal.Now.zonedDateTimeISO("Europe/Madrid"); // Fecha y hora local con zona horaria
  console.log(
    "Temporal ZonedDateTime (local):",
    temporalFechaHoraLocal.toString()
  );
  console.log("Año (Temporal):", temporalFechaHoraLocal.year);
  console.log("Mes (Temporal):", temporalFechaHoraLocal.month); // Meses son base 1
  console.log("Día (Temporal):", temporalFechaHoraLocal.day);

  // Temporal.PlainDate: Solo fecha (sin hora ni zona horaria)
  const plainFecha = Temporal.PlainDate.from("2025-01-20");
  console.log("Temporal PlainDate:", plainFecha.toString());

  // Temporal.PlainTime: Solo hora (sin fecha ni zona horaria)
  const plainHora = Temporal.PlainTime.from("15:30:45");
  console.log("Temporal PlainTime:", plainHora.toString());

  // Temporal.Duration: Para representar duraciones de tiempo
  const unaSemana = Temporal.Duration.from({ days: 7 });
  const tresHoras = Temporal.Duration.from({ hours: 3 });

  // Cálculos con Temporal (inmutables y claros)
  const proximaSemana = temporalFechaHoraLocal.add(unaSemana);
  console.log("Próxima semana (Temporal):", proximaSemana.toString());

  const fechaDeAquiADiezDias = plainFecha.add({ days: 10 });
  console.log(
    "Fecha de aquí a 10 días (Temporal):",
    fechaDeAquiADiezDias.toString()
  );

  // Comparación de fechas con Temporal
  const fecha1 = Temporal.PlainDate.from("2025-05-20");
  const fecha2 = Temporal.PlainDate.from("2025-05-23");
  console.log(
    "Fecha1 es antes que Fecha2:",
    Temporal.PlainDate.compare(fecha1, fecha2) < 0
  ); // Salida: true

  // Diferencia entre fechas (obtiene una Duración)
  const duracionEntreFechas = fecha2.since(fecha1);
  console.log("Diferencia entre fechas (días):", duracionEntreFechas.days); // Salida: 3

  // Formatear fechas con `toLocaleString` (Temporal se integra con esto)
  console.log(
    "Fecha local formateada (Temporal):",
    temporalFechaHoraLocal.toLocaleString("es-ES", {
      dateStyle: "full",
      timeStyle: "medium",
    })
  );
} else {
  console.log(
    "\n--- La API Temporal no está disponible directamente en este entorno. ---"
  );
  console.log(
    "Para probarla, puedes usar un polyfill (ej. `@js-temporal/polyfill`) o esperar a su implementación nativa en navegadores."
  );
}
