console.log("--- Números en JavaScript ---");

// --- 1. Declaración y Tipos de Números ---
// En JavaScript, todos los números son de tipo `number`, que es un número de punto flotante de doble precisión (IEEE 754).
// Esto significa que no hay distinción explícita entre enteros y decimales a nivel de tipo.

console.log("\n--- Declaración y Tipos ---");
let entero = 42;
let decimal = 3.14159;
let negativo = -10;
let conExponente = 1.23e5; // 1.23 * 10^5 = 123000
let hexadecimal = 0xff; // 255 en decimal
let octal = 0o377; // 255 en decimal (prefijo 0o)
let binario = 0b11111111; // 255 en decimal (prefijo 0b)

console.log("Entero:", entero, typeof entero);
console.log("Decimal:", decimal, typeof decimal);
console.log("Negativo:", negativo, typeof negativo);
console.log("Con exponente:", conExponente, typeof conExponente);
console.log("Hexadecimal (0xFF):", hexadecimal, typeof hexadecimal);
console.log("Octal (0o377):", octal, typeof octal);
console.log("Binario (0b11111111):", binario, typeof binario);

// Límites de números seguros
console.log("Máximo número seguro:", Number.MAX_SAFE_INTEGER); // 2^53 - 1
console.log("Mínimo número seguro:", Number.MIN_SAFE_INTEGER); // -(2^53 - 1)
console.log("Número máximo representable:", Number.MAX_VALUE); // ~1.79E+308
console.log("Número mínimo representable (positivo):", Number.MIN_VALUE); // ~5e-324

// BigInt (Para números enteros muy grandes, más allá de MAX_SAFE_INTEGER)
// Se crea añadiendo 'n' al final del número o con `BigInt()`
const numeroMuyGrande = 9007199254740991n + 1n; // Más allá del límite seguro de Number
console.log(
  "Número muy grande (BigInt):",
  numeroMuyGrande,
  typeof numeroMuyGrande
);
// console.log(numeroMuyGrande + 1); // Error: Cannot mix BigInt and other types, debe operar solo con otros BigInts

// --- 2. Operaciones Aritméticas Básicas ---
console.log("\n--- Operaciones Aritméticas ---");
let num1 = 15;
let num2 = 4;

console.log(`Suma (${num1} + ${num2}): ${num1 + num2}`);
console.log(`Resta (${num1} - ${num2}): ${num1 - num2}`);
console.log(`Multiplicación (${num1} * ${num2}): ${num1 * num2}`);
console.log(`División (${num1} / ${num2}): ${num1 / num2}`);
console.log(`Módulo (${num1} % ${num2}): ${num1 % num2}`); // Resto de la división
console.log(`Exponenciación (${num1} ** 2): ${num1 ** 2}`); // num1 elevado a la 2

// --- 3. Precisión de Punto Flotante ---
// JavaScript puede tener problemas de precisión con los números decimales debido a cómo se representan en binario.
console.log("\n--- Precisión de Punto Flotante ---");
console.log("0.1 + 0.2:", 0.1 + 0.2); // Salida: 0.30000000000000004 (no 0.3 exacto)
console.log("0.1 + 0.2 === 0.3:", 0.1 + 0.2 === 0.3); // Salida: false

// Para comparar números flotantes, a menudo se usa una pequeña tolerancia (epsilon)
const epsilon = 0.000001;
const sumaFlotante = 0.1 + 0.2;
if (Math.abs(sumaFlotante - 0.3) < epsilon) {
  console.log("0.1 + 0.2 es aproximadamente 0.3");
}

// --- 4. Valores Numéricos Especiales ---
console.log("\n--- Valores Numéricos Especiales ---");

// `NaN` (Not-a-Number): Resulta de operaciones matemáticas inválidas.
console.log("10 / 'abc':", 10 / "abc"); // Salida: NaN
console.log("Math.sqrt(-1):", Math.sqrt(-1)); // Salida: NaN
console.log("NaN === NaN:", NaN === NaN); // Salida: false (NaN nunca es igual a nada, ni a sí mismo)
console.log("isNaN(10 / 'abc'):", isNaN(10 / "abc")); // Salida: true (función para comprobar NaN)
console.log("Number.isNaN(10 / 'abc'):", Number.isNaN(10 / "abc")); // Más robusto que isNaN global

// `Infinity` y `-Infinity`: Resultado de divisiones por cero o números extremadamente grandes/pequeños.
console.log("1 / 0:", 1 / 0); // Salida: Infinity
console.log("-1 / 0:", -1 / 0); // Salida: -Infinity
console.log("Number.isFinite(1 / 0):", Number.isFinite(1 / 0)); // Salida: false

// --- 5. Conversión a Números ---
// Métodos para convertir otros tipos de datos a números.

console.log("\n--- Conversión a Números ---");

// `Number()`: Convierte un valor a tipo Number.
console.log("Number('123'):", Number("123")); // Salida: 123
console.log("Number('Hola'):", Number("Hola")); // Salida: NaN
console.log("Number(true):", Number(true)); // Salida: 1
console.log("Number(false):", Number(false)); // Salida: 0
console.log("Number(null):", Number(null)); // Salida: 0
console.log("Number(undefined):", Number(undefined)); // Salida: NaN

// `parseInt()`: Convierte una cadena a un entero. Ignora caracteres no numéricos después de un número válido.
console.log("parseInt('100px'):", parseInt("100px")); // Salida: 100
console.log("parseInt('  20.5 '):", parseInt("  20.5 ")); // Salida: 20
console.log("parseInt('a100'):", parseInt("a100")); // Salida: NaN

// `parseFloat()`: Convierte una cadena a un número de punto flotante.
console.log("parseFloat('10.5em'):", parseFloat("10.5em")); // Salida: 10.5
console.log("parseFloat('20'):", parseFloat("20")); // Salida: 20

// Operador unario `+`: Una forma concisa de convertir a número.
console.log("+ '42':", +"42"); // Salida: 42
console.log("+ '3.14':", +"3.14"); // Salida: 3.14
console.log("+ 'abc':", +"abc"); // Salida: NaN

// --- 6. Métodos de Instancia de Number (en el prototipo) ---
// Métodos disponibles en los objetos Number.

console.log("\n--- Métodos de Instancia de Number ---");

let valor = 123.45678;

// `toFixed(digitos)`: Formatea un número usando notación de punto fijo (redondea si es necesario).
console.log("valor.toFixed(2):", valor.toFixed(2)); // Salida: "123.46" (retorna un string)
console.log("10.toFixed(2):", (10.0).toFixed(2)); // Salida: "10.00"

// `toPrecision(precision)`: Formatea un número a una longitud especificada (redondea).
console.log("valor.toPrecision(4):", valor.toPrecision(4)); // Salida: "123.5" (retorna un string)

// `toExponential(digitos)`: Convierte un número a notación exponencial.
console.log("valor.toExponential(2):", valor.toExponential(2)); // Salida: "1.23e+2" (retorna un string)

// `toString(base)`: Convierte un número a su representación de cadena en una base numérica específica (decimal, binario, etc.).
let decimalBase = 255;
console.log("decimalBase.toString():", decimalBase.toString()); // Salida: "255" (base 10 por defecto)
console.log("decimalBase.toString(2):", decimalBase.toString(2)); // Salida: "11111111" (binario)
console.log("decimalBase.toString(16):", decimalBase.toString(16)); // Salida: "ff" (hexadecimal)

// --- 7. Objeto Global `Math` ---
// Proporciona propiedades y métodos para constantes y funciones matemáticas.

console.log("\n--- Objeto Global `Math` ---");

console.log("Math.PI:", Math.PI); // El valor de Pi
console.log("Math.E:", Math.E); // La base de los logaritmos naturales

console.log("Math.abs(-5):", Math.abs(-5)); // Valor absoluto: 5
console.log("Math.round(4.7):", Math.round(4.7)); // Redondea al entero más cercano: 5
console.log("Math.floor(4.7):", Math.floor(4.7)); // Redondea hacia abajo: 4
console.log("Math.ceil(4.3):", Math.ceil(4.3)); // Redondea hacia arriba: 5
console.log("Math.max(1, 5, 2):", Math.max(1, 5, 2)); // El mayor de los argumentos: 5
console.log("Math.min(1, 5, 2):", Math.min(1, 5, 2)); // El menor de los argumentos: 1
console.log("Math.random():", Math.random()); // Número pseudo-aleatorio entre 0 (inclusive) y 1 (exclusivo)
console.log("Math.pow(2, 3):", Math.pow(2, 3)); // 2 elevado a la 3: 8
console.log("Math.sqrt(25):", Math.sqrt(25)); // Raíz cuadrada de 25: 5
