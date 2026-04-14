console.log("--- Condicionales en JavaScript ---");

// --- 1. `if`, `else if`, `else` (El condicional más común) ---
// Permite ejecutar un bloque de código si una condición es verdadera,
// y otros bloques si las condiciones subsiguientes son verdaderas,
// o un bloque final si ninguna es verdadera.

let hora = 14; // Representa la hora del día (24h)

console.log("\n--- Usando `if`, `else if`, `else` ---");

if (hora < 12) {
  console.log("¡Buenos días!"); // Se ejecuta si hora es menor que 12
} else if (hora >= 12 && hora < 18) {
  console.log("¡Buenas tardes!"); // Se ejecuta si hora es 12 o más, pero menor que 18
} else {
  console.log("¡Buenas noches!"); // Se ejecuta si ninguna de las anteriores es verdadera
}
// Salida en este caso (hora = 14): ¡Buenas tardes!

let edad = 20;
let tieneCarnet = true;

if (edad >= 18 && tieneCarnet) {
  console.log("Puedes conducir legalmente.");
} else if (edad >= 18 && !tieneCarnet) {
  console.log("Eres mayor de edad, pero necesitas el carnet para conducir.");
} else {
  console.log("Aún no tienes edad para conducir.");
}
// Salida en este caso: Puedes conducir legalmente.

// --- 2. Operador Ternario (Condicional corto `? :`) ---
// Una forma concisa de escribir una sentencia `if-else` simple en una sola línea.
// Sintaxis: `condicion ? expresionSiVerdadero : expresionSiFalso;`

let temperatura = 22;
let clima = temperatura > 25 ? "Hace calor" : "Temperatura agradable";
console.log(`\n--- Usando Operador Ternario ---`);
console.log(`El clima es: ${clima}`); // Salida: El clima es: Temperatura agradable

let esAdmin = false;
let estadoUsuario = esAdmin ? "Administrador" : "Usuario estándar";
console.log(`Tipo de usuario: ${estadoUsuario}`); // Salida: Tipo de usuario: Usuario estándar

// --- 3. `switch` (Para múltiples opciones basadas en un solo valor) ---
// Útil cuando tienes una variable que puede tener muchos valores posibles,
// y quieres ejecutar diferentes bloques de código para cada valor.
// Es crucial usar `break;` para evitar la "caída" (fall-through) a los siguientes `case`.

let diaSemana = "Miércoles"; // Podemos usar números también (ej. 3)

console.log(`\n--- Usando \`switch\` ---`);
switch (diaSemana) {
  case "Lunes":
    console.log("Es el comienzo de la semana laboral.");
    break; // Sale del switch
  case "Martes":
  case "Miércoles": // Múltiples casos pueden compartir el mismo bloque
    console.log("Estamos a mitad de semana.");
    break;
  case "Jueves":
    console.log("Casi viernes...");
    break;
  case "Viernes":
    console.log("¡Es viernes y el cuerpo lo sabe!");
    break;
  case "Sábado":
  case "Domingo":
    console.log("¡Fin de semana!");
    break;
  default: // Se ejecuta si ningún 'case' coincide
    console.log("Día no reconocido.");
}
// Salida en este caso: Estamos a mitad de semana.

let color = "verde";
switch (color) {
  case "rojo":
    console.log("El color es rojo.");
    break;
  case "azul":
    console.log("El color es azul.");
    break;
  default:
    console.log("El color no es ni rojo ni azul.");
}
// Salida en este caso: El color no es ni rojo ni azul.

// --- 4. Cortocircuito con Operadores Lógicos (para asignar valores condicionalmente) ---
// Aunque no son condicionales en el sentido estricto, los operadores `&&` y `||`
// pueden usarse para asignar valores condicionalmente de forma concisa.

console.log(`\n--- Cortocircuito con Operadores Lógicos ---`);

// Operador `||` (OR lógico): asigna el primer valor "Truthy" que encuentra.
// Útil para establecer valores por defecto.
let usuarioAutenticado = null;
let nombreUsuario = usuarioAutenticado || "Invitado";
console.log(`Nombre de usuario (OR): ${nombreUsuario}`); // Salida: Invitado

usuarioAutenticado = "Carlos";
nombreUsuario = usuarioAutenticado || "Invitado";
console.log(`Nombre de usuario (OR con valor): ${nombreUsuario}`); // Salida: Carlos

// Operador `&&` (AND lógico): asigna el primer valor "Falsy" que encuentra,
// o el último valor "Truthy" si todos son "Truthy".
// Útil para ejecutar una acción sólo si una condición previa es verdadera.
let puedeAcceder = true;
let mensajeAcceso = puedeAcceder && "Acceso concedido."; // Si 'puedeAcceder' es true, 'mensajeAcceso' será "Acceso concedido."
console.log(`Mensaje de acceso (AND): ${mensajeAcceso}`); // Salida: Acceso concedido.

puedeAcceder = false;
mensajeAcceso = puedeAcceder && "Acceso concedido."; // Si 'puedeAcceder' es false, 'mensajeAcceso' será false
console.log(`Mensaje de acceso (AND con false): ${mensajeAcceso}`); // Salida: false

// Uso con funciones (ejecuta la función solo si la condición es verdadera)
function mostrarAdvertencia() {
  console.log("¡Advertencia: Tienes notificaciones pendientes!");
}
let hayNotificaciones = true;
hayNotificaciones && mostrarAdvertencia(); // La función se ejecuta si hayNotificaciones es true

hayNotificaciones = false;
hayNotificaciones && mostrarAdvertencia(); // La función NO se ejecuta
