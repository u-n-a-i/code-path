// --- Ejemplo Unificado: Tipos de Datos (Truthy/Falsy) y Symbol ---

// 1. Valores Falsy (se evalúan como 'false' en un contexto booleano)
const valorFalsy1 = 0; // El número cero
const valorFalsy2 = ""; // Cadena de texto vacía
const valorFalsy3 = null; // Ausencia intencional de cualquier valor
const valorFalsy4 = undefined; // Variable declarada pero sin valor asignado (o propiedad inexistente)
const valorFalsy5 = NaN; // Not-a-Number (resultado de operaciones matemáticas inválidas)
const valorFalsy6 = false; // El booleano false

console.log("--- Valores Falsy ---");
if (valorFalsy1) {
  console.log("0 es Truthy");
} else {
  console.log("0 es Falsy");
}
if (valorFalsy2) {
  console.log("'' es Truthy");
} else {
  console.log("'' es Falsy");
}
if (valorFalsy3) {
  console.log("null es Truthy");
} else {
  console.log("null es Falsy");
}
if (valorFalsy4) {
  console.log("undefined es Truthy");
} else {
  console.log("undefined es Falsy");
}
if (valorFalsy5) {
  console.log("NaN es Truthy");
} else {
  console.log("NaN es Falsy");
}
if (valorFalsy6) {
  console.log("false es Truthy");
} else {
  console.log("false es Falsy");
}

// 2. Valores Truthy (se evalúan como 'true' en un contexto booleano)
const valorTruthy1 = 1; // Cualquier número diferente de cero (positivo o negativo)
const valorTruthy2 = "Hola"; // Cualquier cadena de texto no vacía (incluso con espacios)
const valorTruthy3 = {}; // Objeto vacío
const valorTruthy4 = []; // Array vacío
const valorTruthy5 = true; // El booleano true
const valorTruthy6 = function () {}; // Cualquier función

console.log("\n--- Valores Truthy ---");
if (valorTruthy1) {
  console.log("1 es Truthy");
}
if (valorTruthy2) {
  console.log("'Hola' es Truthy");
}
if (valorTruthy3) {
  console.log("{} es Truthy");
}
if (valorTruthy4) {
  console.log("[] es Truthy");
}
if (valorTruthy5) {
  console.log("true es Truthy");
}
if (valorTruthy6) {
  console.log("Una función es Truthy");
}

// 3. Tipo de dato Symbol (valores únicos e inmutables)
console.log("\n--- Tipo de Dato Symbol ---");

// Creando Symbols
const idUnico1 = Symbol("id"); // El argumento es una descripción, no el valor del Symbol
const idUnico2 = Symbol("id");
const nombrePropiedad = Symbol("nombre");

console.log("idUnico1:", idUnico1);
console.log("idUnico2:", idUnico2);

// Los Symbols son siempre únicos, incluso si tienen la misma descripción
console.log("idUnico1 === idUnico2:", idUnico1 === idUnico2); // Salida: false

// Usando Symbols como claves de propiedades de objetos (garantiza unicidad)
const usuario = {
  [idUnico1]: 101,
  [nombrePropiedad]: "Elena",
  edad: 28,
};

console.log("ID de usuario (usando Symbol):", usuario[idUnico1]); // Acceder usando el Symbol
console.log("Nombre de usuario (usando Symbol):", usuario[nombrePropiedad]); // Acceder usando el Symbol
console.log("Edad del usuario:", usuario.edad);

// Iterar sobre las claves del objeto no mostrará las propiedades Symbol por defecto
console.log("Claves del objeto 'usuario' (Object.keys):", Object.keys(usuario)); // No muestra los Symbols

// Para obtener las propiedades Symbol, se usa Object.getOwnPropertySymbols()
console.log(
  "Claves Symbol del objeto 'usuario':",
  Object.getOwnPropertySymbols(usuario)
);

// Los Symbols son Truthy (aunque no se usan en este contexto comúnmente)
const miSymbol = Symbol("test");
if (miSymbol) {
  console.log("Un Symbol es Truthy."); // Salida: Un Symbol es Truthy.
}
