console.log("--- Cadenas de Texto (Strings) en JavaScript ---");

// --- 1. Creación de Strings ---
// Puedes crear strings usando comillas simples, dobles o plantillas literales (backticks).

console.log("\n--- Creación de Strings ---");

const cadenaSimple = "Hola, mundo!"; // Comillas simples
const cadenaDoble = "JavaScript es genial."; // Comillas dobles
const nombre = "Alice";
const edad = 30;
// Plantillas literales (Template Literals - ES6+) permiten interpolación y multi-línea
const plantillaLiteral = `Mi nombre es ${nombre} y tengo ${edad} años.`;
const cadenaMultiLinea = `
  Esta es una cadena
  que ocupa
  varias líneas.
`;

console.log("Cadena simple:", cadenaSimple);
console.log("Cadena doble:", cadenaDoble);
console.log("Plantilla literal:", plantillaLiteral);
console.log("Cadena multi-línea:", cadenaMultiLinea);

// --- 2. Longitud de un String (`.length`) ---
// La propiedad `length` devuelve el número de caracteres en la cadena.

console.log("\n--- Longitud de String (`.length`) ---");
console.log("Longitud de 'Hola, mundo!':", cadenaSimple.length); // Salida: 12

// --- 3. Acceso a Caracteres (Indexación) ---
// Puedes acceder a caracteres individuales usando la notación de corchetes `[]`
// o el método `.charAt()`. Los índices comienzan desde 0.

console.log("\n--- Acceso a Caracteres ---");
const texto = "Programación";
console.log("Primer carácter (texto[0]):", texto[0]); // Salida: P
console.log("Cuarto carácter (texto.charAt(3)):", texto.charAt(3)); // Salida: g
console.log("Último carácter:", texto[texto.length - 1]); // Salida: n (con notación de corchetes)

// --- 4. Concatenación de Strings ---
// Unir dos o más strings. Puedes usar el operador `+` o el método `.concat()`.
// Las plantillas literales son a menudo la forma más limpia.

console.log("\n--- Concatenación de Strings ---");
const parte1 = "Hola";
const parte2 = " ";
const parte3 = "JavaScript";

const resultadoConcat1 = parte1 + parte2 + parte3;
console.log("Concatenación con '+':", resultadoConcat1);

const resultadoConcat2 = parte1.concat(parte2, parte3, "!");
console.log("Concatenación con .concat():", resultadoConcat2);

const resultadoConcat3 = `${parte1}${parte2}${parte3}!`;
console.log("Concatenación con plantilla literal:", resultadoConcat3);

// --- 5. Búsqueda de Substrings ---
// Métodos para verificar si una cadena contiene otra, o para encontrar su posición.

console.log("\n--- Búsqueda de Substrings ---");
const frase = "El perro corre en el parque.";

console.log("¿Contiene 'perro'? (.includes()):", frase.includes("perro")); // Salida: true
console.log("¿Contiene 'gato'? (.includes()):", frase.includes("gato")); // Salida: false

console.log("Posición de 'corre' (.indexOf()):", frase.indexOf("corre")); // Salida: 9 (primer índice)
console.log("Posición de 'el' (.indexOf()):", frase.indexOf("el")); // Salida: 0
console.log(
  "Última posición de 'el' (.lastIndexOf()):",
  frase.lastIndexOf("el")
); // Salida: 15

console.log("¿Empieza con 'El'? (.startsWith()):", frase.startsWith("El")); // Salida: true
console.log(
  "¿Termina con 'parque.'? (.endsWith()):",
  frase.endsWith("parque.")
); // Salida: true

// --- 6. Extracción de Substrings ---
// Métodos para obtener una parte de una cadena.

console.log("\n--- Extracción de Substrings ---");
const cadenaOriginal = "Mozilla";

// .slice(inicio, fin): Extrae desde 'inicio' hasta 'fin' (sin incluir 'fin').
// Puede usar índices negativos para contar desde el final.
console.log(".slice(0, 3):", cadenaOriginal.slice(0, 3)); // Salida: Moz
console.log(".slice(3):", cadenaOriginal.slice(3)); // Salida: illa (desde el índice 3 hasta el final)
console.log(".slice(-3):", cadenaOriginal.slice(-3)); // Salida: lla (los últimos 3 caracteres)

// .substring(inicio, fin): Similar a slice, pero no acepta índices negativos.
console.log(".substring(0, 3):", cadenaOriginal.substring(0, 3)); // Salida: Moz

// .substr(inicio, longitud): Extrae desde 'inicio' un número específico de caracteres. (Obsoleto, prefiere slice/substring)
// console.log(".substr(1, 2):", cadenaOriginal.substr(1, 2)); // Salida: oz

// --- 7. Modificación (Creación de nuevas cadenas modificadas) ---
// Métodos para cambiar mayúsculas/minúsculas, reemplazar partes, etc.

console.log("\n--- Modificación de Strings (creando nuevas) ---");
const saludo = "  ¡Hola a todos!  ";

console.log("A mayúsculas (.toUpperCase()):", saludo.toUpperCase()); // Salida:   ¡HOLA A TODOS!
console.log("A minúsculas (.toLowerCase()):", saludo.toLowerCase()); // Salida:   ¡hola a todos!

// .trim(): Elimina espacios en blanco al principio y al final.
console.log("Eliminar espacios (.trim()):", saludo.trim()); // Salida: ¡Hola a todos!

// .replace(buscar, reemplazar): Reemplaza la primera ocurrencia.
console.log(".replace('todos', 'amigos'):", saludo.replace("todos", "amigos")); // Salida:   ¡Hola a amigos!

// .replaceAll(buscar, reemplazar): Reemplaza todas las ocurrencias (ES2021+).
const fraseNumeros = "uno uno dos tres uno";
console.log(
  ".replaceAll('uno', 'mil'):",
  fraseNumeros.replaceAll("uno", "mil")
); // Salida: mil mil dos tres mil

// .split(separador): Divide una cadena en un array de substrings.
const listaCompras = "Manzana,Plátano,Naranja";
const items = listaCompras.split(",");
console.log(".split(',') (array):", items); // Salida: ["Manzana", "Plátano", "Naranja"]

const fraseDividida = "Hola Mundo JS".split(" ");
console.log(".split(' ') (array):", fraseDividida); // Salida: ["Hola", "Mundo", "JS"]

// --- 8. Comparación de Strings ---
// La comparación es lexicográfica (basada en el orden Unicode de los caracteres).
// Ten cuidado con mayúsculas/minúsculas.

console.log("\n--- Comparación de Strings ---");
const str1 = "apple";
const str2 = "Apple";
const str3 = "banana";

console.log("str1 === str2:", str1 === str2); // Salida: false (diferencia de mayúsculas)
console.log(
  "str1.toLowerCase() === str2.toLowerCase():",
  str1.toLowerCase() === str2.toLowerCase()
); // Salida: true

console.log("str1 < str3:", str1 < str3); // Salida: true ("apple" viene antes que "banana")

// --- 9. Conversión de Tipos ---
// Los strings pueden ser convertidos a números, y otros tipos a strings.

console.log("\n--- Conversión de Tipos ---");
const numeroComoString = "123";
const booleanoComoString = "true";
const numeroReal = 45.67;

// String a Number
console.log("parseInt('123'):", parseInt(numeroComoString)); // Salida: 123
console.log("Number('123'):", Number(numeroComoString)); // Salida: 123
console.log("+ '123':", +numeroComoString); // Salida: 123 (operador unario +)

// Otros tipos a String
console.log("String(numeroReal):", String(numeroReal)); // Salida: "45.67"
console.log("numeroReal.toString():", numeroReal.toString()); // Salida: "45.67"
console.log("true + '' (coerción):", true + ""); // Salida: "true"

// --- 10. Inmutabilidad (Concepto clave) ---
// Los métodos de string no modifican la cadena original; siempre devuelven una nueva cadena.

console.log("\n--- Inmutabilidad de Strings ---");
let original = "original";
let modificada = original.toUpperCase(); // `toUpperCase` devuelve una nueva cadena

console.log("Cadena original:", original); // Salida: original (no ha cambiado)
console.log("Cadena modificada:", modificada); // Salida: ORIGINAL
