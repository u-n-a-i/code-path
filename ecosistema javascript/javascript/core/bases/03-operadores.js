// --- Operadores Aritméticos (para cálculos matemáticos) ---
let a = 10;
let b = 3;

console.log("--- Operadores Aritméticos ---");
console.log(`Suma (a + b): ${a + b}`); // Salida: 13
console.log(`Resta (a - b): ${a - b}`); // Salida: 7
console.log(`Multiplicación (a * b): ${a * b}`); // Salida: 30
console.log(`División (a / b): ${a / b}`); // Salida: 3.333...
console.log(`Módulo (resto de la división) (a % b): ${a % b}`); // Salida: 1 (10 dividido por 3 es 3 con un resto de 1)
console.log(`Exponenciación (a ** b): ${a ** b}`); // Salida: 1000 (10 elevado a la 3)

a++; // Incremento: a se convierte en 11
console.log(`Incremento (a++): ${a}`); // Salida: 11
b--; // Decremento: b se convierte en 2
console.log(`Decremento (b--): ${b}`); // Salida: 2

console.log("\n--- Operadores de Asignación (para asignar valores) ---");
let x = 5;
console.log(`Asignación inicial (x = 5): ${x}`); // Salida: 5
x += 3; // Equivalente a x = x + 3
console.log(`Suma y asignación (x += 3): ${x}`); // Salida: 8
x -= 2; // Equivalente a x = x - 2
console.log(`Resta y asignación (x -= 2): ${x}`); // Salida: 6
x *= 4; // Equivalente a x = x * 4
console.log(`Multiplicación y asignación (x *= 4): ${x}`); // Salida: 24
x /= 6; // Equivalente a x = x / 6
console.log(`División y asignación (x /= 6): ${x}`); // Salida: 4

console.log(
  "\n--- Operadores de Comparación (para comparar valores, devuelven booleanos) ---"
);
let num1 = 10;
let num2 = "10"; // Cadena de texto
let num3 = 5;

console.log(`Igualdad (solo valor) (num1 == num2): ${num1 == num2}`); // Salida: true (coerción de tipo: "10" se convierte a 10)
console.log(
  `Igualdad estricta (valor y tipo) (num1 === num2): ${num1 === num2}`
); // Salida: false (tipos diferentes)
console.log(`Desigualdad (solo valor) (num1 != num3): ${num1 != num3}`); // Salida: true
console.log(
  `Desigualdad estricta (valor y tipo) (num1 !== num2): ${num1 !== num2}`
); // Salida: true
console.log(`Mayor que (num1 > num3): ${num1 > num3}`); // Salida: true
console.log(`Menor que (num1 < num3): ${num1 < num3}`); // Salida: false
console.log(`Mayor o igual que (num1 >= num2): ${num1 >= num2}`); // Salida: true
console.log(`Menor o igual que (num1 <= num3): ${num1 <= num3}`); // Salida: false

console.log(
  "\n--- Operadores Lógicos (para combinar o negar expresiones booleanas) ---"
);
let esMayor = true;
let tieneDinero = false;

console.log(`AND Lógico (esMayor && tieneDinero): ${esMayor && tieneDinero}`); // Salida: false (ambas deben ser true)
console.log(`OR Lógico (esMayor || tieneDinero): ${esMayor || tieneDinero}`); // Salida: true (al menos una debe ser true)
console.log(`NOT Lógico (!esMayor): ${!esMayor}`); // Salida: false (invierte el booleano)

console.log("\n--- Operadores de Cadena (para concatenar textos) ---");
let saludo = "Hola";
let nombre = "Mundo";
console.log(`Concatenación ("Hola" + " " + "Mundo"): ${saludo + " " + nombre}`); // Salida: Hola Mundo

console.log("\n--- Operador Ternario (condicional conciso) ---");
let edad = 18;
let mensaje = edad >= 18 ? "Eres mayor de edad" : "Eres menor de edad";
console.log(`Ternario (edad >= 18 ? ...): ${mensaje}`); // Salida: Eres mayor de edad

console.log("\n--- Operador `typeof` (para verificar el tipo de dato) ---");
console.log(`typeof "Hola": ${typeof "Hola"}`); // Salida: string
console.log(`typeof 123: ${typeof 123}`); // Salida: number
console.log(`typeof true: ${typeof true}`); // Salida: boolean
console.log(`typeof undefined: ${typeof undefined}`); // Salida: undefined
console.log(`typeof null: ${typeof null}`); // Salida: object (una peculiaridad histórica de JS)
console.log(`typeof {}: ${typeof {}}`); // Salida: object

console.log("\n--- Operador Tilde (~) / NOT a nivel de bits ---");
// La tilde (~) invierte todos los bits de un número y luego le añade 1 y cambia el signo.
// Es equivalente a -(N + 1) para un entero N.
// Funciona a nivel de bits, lo que puede ser útil para algunas optimizaciones o algoritmos.

let numBit = 5; // En binario (8 bits): 00000101
let resultadoTilde = ~numBit; // Invierte a 11111010, que es -6 en complemento a dos
console.log(`Número original: ${numBit}`);
console.log(`~${numBit} (tilde): ${resultadoTilde}`); // Salida: -6

let numBitNegativo = -10; // En binario (ej. complemento a dos): ...11110110
let resultadoTildeNegativo = ~numBitNegativo; // Invierte a ...00001001, que es 9
console.log(`Número original: ${numBitNegativo}`);
console.log(`~${numBitNegativo} (tilde): ${resultadoTildeNegativo}`); // Salida: 9

// Un caso de uso común (aunque quizás menos legible para principiantes)
// es para convertir un valor a entero y verificar si es diferente de -1
// (útil en algunas búsquedas donde indexOf devuelve -1 si no encuentra)
let texto = "Hola mundo";
let indice = texto.indexOf("mundo"); // indexOf devuelve la posición o -1 si no se encuentra

console.log(`\nCaso de uso de Tilde con indexOf:`);
if (~indice) {
  // Si el índice NO es -1, entonces ~indice será un número Truthy diferente de 0
  console.log(`'mundo' fue encontrado en la posición: ${indice}`); // Salida: 5
} else {
  console.log(`'mundo' no fue encontrado.`);
}

let indiceNoEncontrado = texto.indexOf("javascript");
if (~indiceNoEncontrado) {
  // ~(-1) es 0, que es Falsy
  console.log(`'javascript' fue encontrado.`);
} else {
  console.log(`'javascript' no fue encontrado.`); // Salida: 'javascript' no fue encontrado.
}
