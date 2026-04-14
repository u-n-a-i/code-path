console.log("--- Operadores Rest (`...`) y Spread (`...`) en JavaScript ---");

// --- 1. Operador REST (`...`) ---
// El operador REST se usa en la **definición de funciones** (o desestructuración)
// para **recolectar** un número indefinido de argumentos en un array.
// Siempre debe ser el último parámetro en una función.

console.log("\n--- Operador REST (`...`) (Recolectar) ---");

// Ejemplo 1: En una función, recolectando argumentos
function sumarTodos(a, b, ...otrosNumeros) {
  // `otrosNumeros` recolecta el resto de argumentos
  let suma = a + b;
  for (const num of otrosNumeros) {
    suma += num;
  }
  return suma;
}

console.log("sumarTodos(1, 2):", sumarTodos(1, 2)); // `a=1`, `b=2`, `otrosNumeros=[]` -> Salida: 3
console.log("sumarTodos(1, 2, 3):", sumarTodos(1, 2, 3)); // `a=1`, `b=2`, `otrosNumeros=[3]` -> Salida: 6
console.log("sumarTodos(1, 2, 3, 4, 5):", sumarTodos(1, 2, 3, 4, 5)); // `a=1`, `b=2`, `otrosNumeros=[3, 4, 5]` -> Salida: 15

// Ejemplo 2: En la desestructuración de arrays
const [primero, segundo, ...restoArray] = [10, 20, 30, 40, 50];
console.log("\nDesestructuración de array con Rest:");
console.log("Primero:", primero); // Salida: 10
console.log("Segundo:", segundo); // Salida: 20
console.log("Resto del array:", restoArray); // Salida: [30, 40, 50]

// Ejemplo 3: En la desestructuración de objetos
const { nombre, edad, ...otrosDatos } = {
  nombre: "Elena",
  edad: 28,
  ciudad: "Madrid",
  profesion: "Desarrolladora",
};
console.log("\nDesestructuración de objeto con Rest:");
console.log("Nombre:", nombre); // Salida: Elena
console.log("Edad:", edad); // Salida: 28
console.log("Otros datos:", otrosDatos); // Salida: {ciudad: "Madrid", profesion: "Desarrolladora"}

// --- 2. Operador SPREAD (`...`) ---
// El operador SPREAD se usa para **expandir** (desempacar) elementos de un iterable
// (como un array o string) o propiedades de un objeto.
// Se usa en llamadas a funciones, literales de array o literales de objeto.

console.log("\n--- Operador SPREAD (`...`) (Expandir/Desempacar) ---");

// Ejemplo 1: Expandir un array en una llamada a función
function multiplicar(a, b, c) {
  return a * b * c;
}
const numerosParaMultiplicar = [2, 3, 4];
// Sin spread: multiplicar(numerosParaMultiplicar[0], numerosParaMultiplicar[1], numerosParaMultiplicar[2])
console.log(
  "Multiplicar con Spread en llamada a función:",
  multiplicar(...numerosParaMultiplicar)
); // Salida: 24

// Ejemplo 2: Combinar arrays (equivalente a `concat()`, pero más conciso)
const array1 = [1, 2, 3];
const array2 = [4, 5];
const arrayCombinado = [...array1, ...array2, 6];
console.log("\nCombinar arrays con Spread:", arrayCombinado); // Salida: [1, 2, 3, 4, 5, 6]

// Ejemplo 3: Crear una copia superficial de un array
const originalArray = [10, 20, 30];
const copiaArray = [...originalArray]; // Crea un nuevo array con los mismos elementos
copiaArray.push(40);
console.log("\nCopia superficial de array con Spread:");
console.log("Original:", originalArray); // Salida: [10, 20, 30] (no modificado)
console.log("Copia:", copiaArray); // Salida: [10, 20, 30, 40]

// Ejemplo 4: Expandir un string en un array de caracteres
const palabra = "Hola";
const caracteres = [...palabra];
console.log("\nExpandir string en array de caracteres con Spread:", caracteres); // Salida: ["H", "o", "l", "a"]

// Ejemplo 5: Combinar objetos (copia propiedades de un objeto a otro) (ES2018+)
const objBase = { a: 1, b: 2 };
const objAdicional = { c: 3, d: 4 };
const objCombinado = { ...objBase, ...objAdicional, e: 5 };
console.log("\nCombinar objetos con Spread:", objCombinado); // Salida: {a: 1, b: 2, c: 3, d: 4, e: 5}

// Ejemplo 6: Sobrescribir propiedades al combinar objetos
const settings = { theme: "dark", notifications: true, language: "en" };
const userSettings = { notifications: false, language: "es" };
// Las propiedades en `userSettings` sobrescriben las de `settings`
const finalSettings = { ...settings, ...userSettings };
console.log("\nSobrescribir propiedades de objeto con Spread:", finalSettings); // Salida: {theme: "dark", notifications: false, language: "es"}

// Ejemplo 7: Crear una copia superficial de un objeto
const originalObj = { x: 1, y: 2 };
const copiaObj = { ...originalObj };
copiaObj.x = 10;
console.log("\nCopia superficial de objeto con Spread:");
console.log("Original:", originalObj); // Salida: {x: 1, y: 2}
console.log("Copia:", copiaObj); // Salida: {x: 10, y: 2}

// Nota sobre copia superficial: si el objeto tiene objetos anidados, solo copia la referencia.
const complejo = { id: 1, datos: { valor: 100 } };
const copiaCompleja = { ...complejo };
copiaCompleja.datos.valor = 200; // Esto MODIFICA el objeto anidado en el original también
console.log("\nCopia superficial de objeto con objeto anidado:");
console.log("Original (datos.valor):", complejo.datos.valor); // Salida: 200
console.log("Copia (datos.valor):", copiaCompleja.datos.valor); // Salida: 200

// --- Diferencias Clave entre REST y SPREAD ---
console.log("\n--- Diferencias Clave ---");
console.log(
  "1. **REST:** Colecta múltiples elementos y los agrupa en un array."
);
console.log(
  "   Ubicación: En la **declaración de funciones** (parámetros) o **desestructuración**."
);
console.log("   Ejemplo: `function miFuncion(a, b, ...resto)`");

console.log(
  "\n2. **SPREAD:** Expande elementos de un iterable o propiedades de un objeto."
);
console.log(
  "   Ubicación: En la **llamada a funciones** (argumentos), **literales de array** o **literales de objeto**."
);
console.log(
  "   Ejemplo: `otraFuncion(...miArray)`, `[...array1, ...array2]`, `{...obj1, ...obj2}`"
);

console.log(
  "\nRecuerda: Misma sintaxis (`...`), pero propósitos opuestos según el contexto."
);
