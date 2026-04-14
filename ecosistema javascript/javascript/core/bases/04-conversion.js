console.log("--- Conversión de Tipos ---");

// 1. Conversión a Cadena (String)

let numero = 123;
let booleano = true;
let nulo = null;
let indefinido = undefined;
let objeto = { a: 1 };
let array = [1, 2];

console.log("\n--- A String (Cadena de Texto) ---");

// Explícita (usando String() o .toString())
console.log("String(numero):", String(numero), typeof String(numero)); // "123", string
console.log(
  "booleano.toString():",
  booleano.toString(),
  typeof booleano.toString()
); // "true", string
console.log("nulo + '':", nulo + "", typeof (nulo + "")); // "null", string (coerción implícita)
console.log("indefinido + '':", indefinido + "", typeof (indefinido + "")); // "undefined", string (coerción implícita)
console.log(
  "JSON.stringify(objeto):",
  JSON.stringify(objeto),
  typeof JSON.stringify(objeto)
); // {"a":1}, string (para objetos complejos)
console.log("array.join('-'):", array.join("-"), typeof array.join("-")); // "1-2", string (útil para arrays)

// Implícita (cuando se espera una cadena)
let resultadoConcat = "La edad es: " + numero;
console.log(
  "Concatenación implícita:",
  resultadoConcat,
  typeof resultadoConcat
); // "La edad es: 123", string

// 2. Conversión a Número (Number)

let cadenaNumero = "456";
let cadenaTexto = "Hola";
let booleanoTrue = true;
let booleanoFalse = false;
let nuloNum = null;
let indefinidoNum = undefined;

console.log("\n--- A Number (Número) ---");

// Explícita (usando Number() o operadores unarios)
console.log(
  "Number(cadenaNumero):",
  Number(cadenaNumero),
  typeof Number(cadenaNumero)
); // 456, number
console.log(
  "Number(cadenaTexto):",
  Number(cadenaTexto),
  typeof Number(cadenaTexto)
); // NaN, number (no es un número válido)
console.log(
  "Number(booleanoTrue):",
  Number(booleanoTrue),
  typeof Number(booleanoTrue)
); // 1, number
console.log(
  "Number(booleanoFalse):",
  Number(booleanoFalse),
  typeof Number(booleanoFalse)
); // 0, number
console.log("Number(nuloNum):", Number(nuloNum), typeof Number(nuloNum)); // 0, number
console.log(
  "Number(indefinidoNum):",
  Number(indefinidoNum),
  typeof Number(indefinidoNum)
); // NaN, number

// Operador unario + (explícita y concisa)
console.log("+cadenaNumero:", +cadenaNumero, typeof +cadenaNumero); // 456, number
console.log("+booleanoTrue:", +booleanoTrue, typeof +booleanoTrue); // 1, number

// parseInt() y parseFloat() (para cadenas con números al inicio)
console.log("parseInt('100px'):", parseInt("100px"), typeof parseInt("100px")); // 100, number (ignora lo que no es número)
console.log(
  "parseFloat('10.5em'):",
  parseFloat("10.5em"),
  typeof parseFloat("10.5em")
); // 10.5, number

// Implícita (en operaciones aritméticas)
let sumaCadenas = "5" - "3"; // El operador resta fuerza la conversión a número
console.log(
  "Operación implícita ('5' - '3'):",
  sumaCadenas,
  typeof sumaCadenas
); // 2, number

// 3. Conversión a Booleano (Boolean)

let cero = 0;
let cadenaVacia = "";
let objVacio = {};
let arrVacio = [];
let miNull = null;
let miUndefined = undefined;

console.log("\n--- A Boolean (Booleano) ---");

// Explícita (usando Boolean())
console.log("Boolean(0):", Boolean(cero), typeof Boolean(cero)); // false, boolean
console.log("Boolean(''):", Boolean(cadenaVacia), typeof Boolean(cadenaVacia)); // false, boolean
console.log("Boolean({}):", Boolean(objVacio), typeof Boolean(objVacio)); // true, boolean (objeto vacío es truthy)
console.log("Boolean([]):", Boolean(arrVacio), typeof Boolean(arrVacio)); // true, boolean (array vacío es truthy)
console.log("Boolean(null):", Boolean(miNull), typeof Boolean(miNull)); // false, boolean
console.log(
  "Boolean(undefined):",
  Boolean(miUndefined),
  typeof Boolean(miUndefined)
); // false, boolean
console.log("Boolean(' '):", Boolean(" "), typeof Boolean(" ")); // true, boolean (cadena con espacio es truthy)

// Operador de negación doble (!!) (explícita y común para forzar booleano)
console.log("!!cero:", !!cero, typeof !!cero); // false, boolean
console.log("!!cadenaVacia:", !!cadenaVacia, typeof !!cadenaVacia); // false, boolean
console.log("!!objVacio:", !!objVacio, typeof !!objVacio); // true, boolean

// Implícita (en contextos lógicos como 'if' o operadores lógicos)
if (cadenaVacia) {
  console.log("Esto no se imprimirá porque '' es Falsy.");
} else {
  console.log("La cadena vacía es evaluada como Falsy en un 'if'.");
}
