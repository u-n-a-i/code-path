console.log("--- Bucles (Loops) en JavaScript ---");

// --- 1. `for` (El bucle más común para un número conocido de iteraciones) ---
// Se usa cuando sabes de antemano cuántas veces quieres que se repita un bloque de código.
// Sintaxis: `for (inicialización; condición; expresión_final) { ... }`

console.log("\n--- Bucle `for` (Iteraciones conocidas) ---");
for (let i = 0; i < 5; i++) {
  console.log(`Bucle for - Iteración: ${i}`); // Salida: 0, 1, 2, 3, 4
}

// Recorrer un array con `for`
const frutas = ["Manzana", "Plátano", "Cereza"];
console.log("\nBucle `for` para recorrer un array:");
for (let i = 0; i < frutas.length; i++) {
  console.log(`  Fruta en índice ${i}: ${frutas[i]}`);
}

// --- 2. `while` (Para repetir mientras una condición sea verdadera) ---
// Se usa cuando el número de iteraciones no es fijo, sino que depende de una condición.
// La condición se evalúa ANTES de cada iteración. ¡Cuidado con los bucles infinitos!

console.log("\n--- Bucle `while` (Condición verdadera) ---");
let contador = 0;
while (contador < 3) {
  console.log(`Bucle while - Contador: ${contador}`); // Salida: 0, 1, 2
  contador++; // Es crucial actualizar la variable de la condición para evitar un bucle infinito
}

// --- 3. `do...while` (Para repetir al menos una vez, luego mientras la condición sea verdadera) ---
// Similar a `while`, pero la condición se evalúa DESPUÉS de la primera iteración.
// Esto garantiza que el bloque de código se ejecute al menos una vez.

console.log("\n--- Bucle `do...while` (Al menos una vez) ---");
let numIntentos = 0;
let contraseñaCorrecta = false; // Simula una condición que podría volverse true
do {
  console.log(`Bucle do...while - Intento número: ${numIntentos + 1}`);
  numIntentos++;
  // Aquí podría haber lógica para verificar la contraseña
  if (numIntentos === 2) {
    contraseñaCorrecta = true; // Por ejemplo, la contraseña se acertó al segundo intento
  }
} while (numIntentos < 3 && !contraseñaCorrecta); // Se ejecuta mientras intentos < 3 Y contraseña no sea correcta
// Salida: Intento 1, Intento 2 (se detiene porque contraseñaCorrecta es true)

// --- 4. `for...of` (Para iterar sobre elementos iterables como arrays, strings, Map, Set) ---
// La forma más moderna y sencilla de recorrer los elementos de un array o string.

console.log("\n--- Bucle `for...of` (Elementos de colecciones) ---");
const colores = ["rojo", "verde", "azul"];
console.log("Bucle `for...of` para recorrer un array:");
for (const color of colores) {
  console.log(`  Color: ${color}`);
}

const palabra = "JavaScript";
console.log("\nBucle `for...of` para recorrer un string:");
for (const caracter of palabra) {
  console.log(`  Carácter: ${caracter}`);
}

// --- 5. `for...in` (Para iterar sobre las propiedades enumerables de un objeto) ---
// Recorre las claves (nombres de propiedades) de un objeto.
// No recomendado para arrays, ya que puede incluir propiedades no numéricas y el orden no está garantizado.

console.log("\n--- Bucle `for...in` (Propiedades de objetos) ---");
const persona = {
  nombre: "Alice",
  edad: 30,
  ciudad: "Madrid",
};
console.log("Bucle `for...in` para recorrer un objeto:");
for (const clave in persona) {
  // `clave` será "nombre", "edad", "ciudad"
  console.log(`  ${clave}: ${persona[clave]}`); // Acceder al valor usando la clave
}

// --- 6. Métodos de Array para Iteración (Funcionales) ---
// Aunque no son "bucles" en el sentido de `for`/`while`, son formas muy comunes
// y potentes de iterar sobre arrays, y son preferibles en JavaScript moderno.

console.log("\n--- Métodos de Array para Iteración ---");

const numeros = [10, 20, 30, 40];

// `forEach()`: Ejecuta una función para cada elemento. No devuelve un nuevo array.
console.log("`forEach()`:");
numeros.forEach(function (numero, index) {
  console.log(`  Elemento ${numero} en índice ${index}`);
});

// `map()`: Crea un nuevo array con los resultados de llamar a una función para cada elemento.
console.log("\n`map()` (crea un nuevo array):");
const numerosDobles = numeros.map((numero) => numero * 2);
console.log("  Numeros originales:", numeros);
console.log("  Numeros dobles (map):", numerosDobles);

// `filter()`: Crea un nuevo array con todos los elementos que pasen una prueba implementada por la función.
console.log("\n`filter()` (filtra elementos):");
const numerosGrandes = numeros.filter((numero) => numero > 25);
console.log("  Numeros grandes (filter):", numerosGrandes);

// `reduce()`: Ejecuta una función reductora sobre cada elemento del array, resultando en un único valor.
console.log("\n`reduce()` (reduce a un solo valor):");
const sumaTotal = numeros.reduce(
  (acumulador, numero) => acumulador + numero,
  0
); // 0 es el valor inicial del acumulador
console.log("  Suma total (reduce):", sumaTotal); // Salida: 100 (10+20+30+40)

// --- 7. `break` y `continue` (Control de flujo en bucles) ---

console.log("\n--- `break` y `continue` en bucles ---");

// `break`: Termina el bucle inmediatamente.
console.log("Uso de `break`:");
for (let i = 0; i < 5; i++) {
  if (i === 3) {
    console.log("  Se encontró el 3, saliendo del bucle con `break`.");
    break; // El bucle se detiene aquí
  }
  console.log(`  Bucle (break) - Iteración: ${i}`);
}
// Salida: 0, 1, 2, "Se encontró el 3..."

// `continue`: Salta la iteración actual y pasa a la siguiente.
console.log("\nUso de `continue`:");
for (let i = 0; i < 5; i++) {
  if (i === 2) {
    console.log("  Saltando la iteración 2 con `continue`.");
    continue; // La iteración 2 se salta, el console.log de abajo no se ejecuta
  }
  console.log(`  Bucle (continue) - Iteración: ${i}`);
}
// Salida: 0, 1, "Saltando...", 3, 4
