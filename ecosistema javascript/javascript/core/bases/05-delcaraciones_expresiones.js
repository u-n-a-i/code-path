console.log("--- Declaraciones (Statements) y Expresiones (Expressions) ---");

// --- 1. Expresiones (Expressions) ---
// Una expresión es una unidad de código que se evalúa para producir un valor.
// Piensa en ellas como "cosas que producen un resultado".
// Cada expresión tiene un valor resultante.

console.log("\n--- Expresiones ---");

// Expresión de valor literal
const numeroLiteral = 100; // '100' es una expresión literal que produce el valor 100
console.log("Expresión literal:", numeroLiteral);

// Expresión aritmética
const suma = 5 + 3; // '5 + 3' es una expresión que se evalúa a 8
console.log("Expresión aritmética (5 + 3):", suma);

// Expresión de asignación
let x = 10;
const y = (x = 20); // '(x = 20)' es una expresión de asignación que se evalúa al valor asignado (20)
console.log("Expresión de asignación (y = (x = 20)):", y); // Salida: 20
console.log("Valor de x después de la asignación:", x); // Salida: 20

// Expresión de llamada a función
function multiplicar(a, b) {
  return a * b;
}
const resultadoMultiplicacion = multiplicar(4, 5); // 'multiplicar(4, 5)' es una expresión que se evalúa a 20
console.log(
  "Expresión de llamada a función (multiplicar(4, 5)):",
  resultadoMultiplicacion
);

// Expresión de comparación
const esMayor = 7 > 3; // '7 > 3' es una expresión que se evalúa a true
console.log("Expresión de comparación (7 > 3):", esMayor);

// Expresión de operador lógico
const ambosVerdaderos = true && false; // 'true && false' es una expresión que se evalúa a false
console.log("Expresión de operador lógico (true && false):", ambosVerdaderos);

// Expresión de operador ternario
const parOImpar = 6 % 2 === 0 ? "Par" : "Impar"; // Todo el ternario es una expresión que se evalúa a "Par"
console.log("Expresión de operador ternario:", parOImpar);

// Expresión de creación de objeto literal
const persona = { nombre: "Ana", edad: 25 }; // Todo el `{ nombre: "Ana", edad: 25 }` es una expresión
console.log("Expresión de objeto literal:", persona);

// Expresión de array literal
const numeros = [1, 2, 3]; // Todo el `[1, 2, 3]` es una expresión
console.log("Expresión de array literal:", numeros);

// --- 2. Declaraciones (Statements) ---
// Una declaración es una instrucción que realiza una acción.
// Piensa en ellas como "cosas que hacen algo".
// Las declaraciones no necesariamente producen un valor que se pueda asignar a una variable.

console.log("\n--- Declaraciones ---");

// Declaración de variable (let, const, var)
// `let nombre = "Juan";` es una declaración. Aunque `nombre = "Juan"` es una expresión,
// la línea completa que incluye `let` es una declaración.
let nombre = "Juan";
console.log("Declaración de variable:", nombre);

// Declaración de función
// `function saludar() { ... }` es una declaración de función.
function saludar() {
  console.log("¡Hola desde una función!");
}
saludar(); // Llamada a la función (esto es una expresión de llamada a función)

// Declaración condicional (if/else)
// `if (...) { ... } else { ... }` es una declaración. No produce un valor directamente.
let temperatura = 28;
if (temperatura > 25) {
  console.log("Declaración if/else: Hace calor.");
} else {
  console.log("Declaración if/else: Temperatura agradable.");
}

// Declaración de bucle (for, while, do...while)
// `for (...) { ... }` es una declaración.
console.log("Declaración de bucle (for):");
for (let i = 0; i < 3; i++) {
  console.log("  Iteración:", i);
}

// Declaración switch
// `switch (...) { ... }` es una declaración.
let dia = 3;
switch (dia) {
  case 1:
    console.log("Declaración switch: Lunes");
    break;
  case 3:
    console.log("Declaración switch: Miércoles"); // Se ejecutará este
    break;
  default:
    console.log("Declaración switch: Otro día");
}

// Declaración de importación (módulos ES6)
// import { miFuncion } from './modulo.js'; // Esto sería una declaración de importación
// console.log("Declaración de importación: (comentada, requiere módulo)");

// Declaración de exportación
// export const API_KEY = "abc"; // Esto sería una declaración de exportación
// console.log("Declaración de exportación: (comentada, requiere módulo)");

// --- 3. ¿Cuándo se convierte una Expresión en una Declaración (Expression Statement)? ---
// Cuando una expresión se encuentra sola en una línea de código y no forma parte
// de una construcción más grande (como una asignación), se convierte en una "declaración de expresión".
// Es decir, JavaScript la evalúa, pero el valor resultante simplemente se descarta (a menos que se use, por ejemplo, en la consola).

console.log("\n--- Expresiones como Declaraciones de Expresión ---");
// Esta es una expresión...
5 + 8; // ...pero cuando está sola, es una declaración de expresión. El resultado (13) se calcula y se descarta.
console.log(
  "5 + 8; (La expresión se evalúa, pero el valor se descarta si no se asigna)"
);

multiplicar(2, 2); // La llamada a la función es una expresión, pero al estar sola, es una declaración de expresión.
console.log(
  "multiplicar(2, 2); (La función se ejecuta, pero el retorno (4) se descarta si no se asigna)"
);

// Lo mismo ocurre con `x = 30;`
let z;
z = 30; // `z = 30` es una expresión de asignación, pero la línea completa es una declaración de expresión.
console.log(
  "z = 30; (La expresión de asignación es también una declaración de expresión)",
  z
);

// --- Un ejemplo donde se ve claramente la diferencia ---
// Dentro de un `if`, esperamos una expresión (un valor booleano)
if (5 > 3) {
  // `5 > 3` es una expresión (evalúa a true)
  console.log("El condicional if espera una expresión.");
}

// console.log(if (true) {}); // Esto causaría un error, porque un 'if' es una declaración, no una expresión que produce un valor.
