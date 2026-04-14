// js/app.js

// Importación por nombre: se usa el mismo nombre que se exportó.
// Podemos importar varios elementos en una sola línea.
import { PI, sumar, dividir } from "./operaciones.js";

// Podemos renombrar las importaciones si hay conflictos o si queremos un nombre diferente.
import { restar as substract, obtenerResto } from "./operaciones.js";

// Importación por defecto: no se usan llaves y se le puede dar cualquier nombre.
import mensajeRandom from "./utils.js";

// Importación por nombre de la clase Saludar
import { Saludar } from "./utils.js";

console.log("Módulo 'app.js' cargado.");

// --- Usando las funcionalidades importadas ---
console.log("\n--- Usando funcionalidades importadas ---");

console.log("El valor de PI es:", PI); // De operaciones.js

let resultadoSuma = sumar(5, 3);
console.log("5 + 3 =", resultadoSuma); // De operaciones.js

let resultadoResta = substract(10, 4);
console.log("10 - 4 =", resultadoResta); // De operaciones.js (renombrado)

let resultadoDivision = dividir(20, 5);
console.log("20 / 5 =", resultadoDivision); // De operaciones.js

try {
  dividir(10, 0);
} catch (error) {
  console.error("Error al dividir:", error.message);
}

let resultadoModulo = obtenerResto(17, 5);
console.log("17 % 5 =", resultadoModulo); // De operaciones.js (renombrado)

console.log("Mensaje aleatorio:", mensajeRandom()); // De utils.js (exportación por defecto)
console.log("Otro mensaje aleatorio:", mensajeRandom()); // De utils.js

const miSaludo = new Saludar("Sofía"); // De utils.js
console.log(miSaludo.saludarFormalmente());

console.log("\n--- Final de la ejecución de app.js ---");
