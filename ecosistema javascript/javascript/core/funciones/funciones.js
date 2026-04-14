console.log("--- Funciones en JavaScript ---");

// --- 1. Funciones Declaradas (Function Declarations) ---
// La forma más común y tradicional de definir una función.
// Se "elevan" (hoisting), lo que significa que puedes llamarlas antes de su definición en el código.
function saludar(nombre) {
  return `¡Hola, ${nombre}!`;
}
console.log("\n--- Funciones Declaradas ---");
console.log("Llamando a saludar('Ana'):", saludar("Ana")); // Puedes llamar antes de la declaración física (debido al hoisting)

// --- 2. Funciones Expresadas (Function Expressions) ---
// Una función se asigna a una variable. No se "elevan" de la misma manera que las declaradas;
// deben definirse antes de ser llamadas (o te dará un ReferenceError).
const despedirse = function (nombre) {
  return `¡Adiós, ${nombre}!`;
};
console.log("\n--- Funciones Expresadas ---");
console.log("Llamando a despedirse('Pedro'):", despedirse("Pedro"));

// --- 3. Funciones Flecha (Arrow Functions) ---
// Introducidas en ES6 (ECMAScript 2015), son una sintaxis más concisa para funciones,
// especialmente útiles para funciones anónimas cortas. Tienen un comportamiento diferente de `this`.
const sumar = (a, b) => a + b; // Para una sola expresión, el 'return' es implícito
const obtenerMensaje = (usuario) => {
  // Para más de una línea, se usan llaves y 'return' explícito
  const mensaje = `Bienvenido, ${usuario}.`;
  return mensaje;
};
console.log("\n--- Funciones Flecha ---");
console.log("Sumando (5, 7) con flecha:", sumar(5, 7));
console.log("Obteniendo mensaje para 'Laura':", obtenerMensaje("Laura"));

// --- 4. Funciones Anónimas ---
// Funciones sin nombre. Se usan a menudo como argumentos para otras funciones
// (callbacks) o en expresiones de función. Las funciones flecha son a menudo anónimas.
console.log("\n--- Funciones Anónimas ---");
const numeros = [1, 2, 3];
// Usando una función anónima como callback para forEach
numeros.forEach(function (num) {
  console.log("Número del array (anónima):", num);
});

// O con función flecha (también anónima)
numeros.map((num) => num * 10); // Esta flecha es una función anónima

// --- 5. Funciones Auto-ejecutadas (IIFE - Immediately Invoked Function Expressions) ---
// Funciones que se definen y se ejecutan inmediatamente después de su creación.
// Se usan para crear un ámbito privado y evitar la contaminación del ámbito global.
console.log("\n--- Funciones Auto-ejecutadas (IIFE) ---");
(function () {
  const variablePrivada = "Soy privada del IIFE";
  console.log("Dentro del IIFE:", variablePrivada);
})();
// console.log(variablePrivada); // Error: variablePrivada is not defined (está encapsulada)

// --- 6. Funciones de Primera Clase (First-Class Functions) ---
// En JavaScript, las funciones son "ciudadanos de primera clase", lo que significa que:
// - Pueden asignarse a variables.
// - Pueden pasarse como argumentos a otras funciones.
// - Pueden ser retornadas por otras funciones.
console.log("\n--- Funciones de Primera Clase ---");

// Asignar a una variable (ya lo vimos con funciones expresadas)
const miFuncion = saludar;
console.log("Función asignada a variable:", miFuncion("Elena"));

// Pasar como argumento (ejemplo con forEach y una función declarada)
function procesarElemento(elemento) {
  console.log("Procesando elemento:", elemento);
}
const elementos = ["a", "b", "c"];
elementos.forEach(procesarElemento); // Pasamos 'procesarElemento' como argumento

// Retornar una función
function crearMultiplicador(factor) {
  return function (numero) {
    // Retorna una función anónima
    return numero * factor;
  };
}
const duplicar = crearMultiplicador(2);
console.log("Función retornada (duplicar 5):", duplicar(5)); // Salida: 10
const triplicar = crearMultiplicador(3);
console.log("Función retornada (triplicar 5):", triplicar(5)); // Salida: 15

// --- 7. Funciones Integradas (Built-in Functions) ---
// Funciones que vienen predefinidas en JavaScript y en el entorno de ejecución (navegador/Node.js).
console.log("\n--- Funciones Integradas (Built-in) ---");
console.log("parseInt('10.5'):", parseInt("10.5")); // Convierte a entero
console.log("Math.random():", Math.random()); // Número aleatorio entre 0 y 1
console.log("decodeURIComponent('%20'):", decodeURIComponent("%20")); // Descodifica URI
// console.log() es otra función integrada.

// --- 8. Funciones de Orden Superior (Higher-Order Functions) ---
// Funciones que toman una o más funciones como argumentos o devuelven una función.
// Los métodos de array como `map`, `filter`, `forEach`, `reduce` son ejemplos comunes.
console.log("\n--- Funciones de Orden Superior ---");

function aplicarOperacion(arr, operacion) {
  // 'operacion' es una función pasada como argumento
  const resultado = [];
  for (const item of arr) {
    resultado.push(operacion(item));
  }
  return resultado;
}
const numerosOriginales = [1, 2, 3];
const numerosAlCuadrado = aplicarOperacion(
  numerosOriginales,
  (num) => num * num
); // num => num * num es una función
console.log("Números al cuadrado:", numerosAlCuadrado); // Salida: [1, 4, 9]

// Otro ejemplo con un método de array (map es una función de orden superior)
const nombresMayus = ["ana", "luis"].map((nombre) => nombre.toUpperCase());
console.log("Nombres en mayúsculas (map):", nombresMayus);

// --- 9. Funciones Puras ---
// Una función pura cumple dos condiciones:
// 1. Siempre devuelve el mismo resultado para los mismos argumentos.
// 2. No produce efectos secundarios (no modifica variables externas, no hace llamadas a la red, etc.).
console.log("\n--- Funciones Puras ---");

let valorGlobal = 10; // Variable externa

// Función Pura:
function sumarPura(a, b) {
  return a + b; // Siempre el mismo resultado para mismos inputs, no modifica nada fuera
}
console.log("Sumar pura (2, 3):", sumarPura(2, 3)); // Salida: 5
console.log("Sumar pura (2, 3):", sumarPura(2, 3)); // Salida: 5 (siempre el mismo)

// Función Impura (modifica un estado externo):
function sumarImpura(a) {
  valorGlobal += a; // Modifica una variable externa
  return valorGlobal;
}
console.log("Sumar impura (5):", sumarImpura(5)); // Salida: 15 (valorGlobal ahora es 15)
console.log("Sumar impura (5):", sumarImpura(5)); // Salida: 20 (valorGlobal ahora es 20)
// Los resultados varían porque depende del estado externo `valorGlobal`

// --- 10. Funciones Recursivas (y mención a Tail Call Optimization - TCO) ---
// Una función que se llama a sí misma para resolver un problema, dividiéndolo en subproblemas más pequeños.
// La TCO (Tail Call Optimization) es una optimización que algunos motores de JS pueden aplicar
// a las llamadas de cola para evitar desbordamiento de pila en recursiones muy profundas.
// ECMAScript 2015 la especifica, pero no todos los motores la implementan completamente.

console.log("\n--- Funciones Recursivas ---");

// Ejemplo clásico: factorial (n!)
function factorial(n) {
  // Caso base: cuando la recursión debe terminar
  if (n === 0 || n === 1) {
    return 1;
  }
  // Paso recursivo: la función se llama a sí misma
  return n * factorial(n - 1);
}
console.log("Factorial de 5 (5!):", factorial(5)); // Salida: 120 (5 * 4 * 3 * 2 * 1)

// Ejemplo de función recursiva con una "llamada de cola" (tail call)
// Una función es "tail recursive" si la llamada recursiva es la última operación
// antes de que la función retorne. Esto es donde TCO puede aplicar.
function factorialTCO(n, acumulador = 1) {
  if (n === 0 || n === 1) {
    return acumulador;
  }
  // La llamada recursiva es la última operación, su resultado es el resultado final.
  return factorialTCO(n - 1, acumulador * n);
}
console.log("Factorial de 5 (con TCO):", factorialTCO(5)); // Salida: 120

// TCO es una optimización de rendimiento, no cambia la lógica, pero previene errores de "stack overflow"
// en recursiones muy profundas en entornos que la soporten.
