console.log("--- JSON (JavaScript Object Notation) en JavaScript ---");

// --- 1. ¿Qué es JSON? ---
// JSON es un formato de texto para representar datos estructurados.
// Se basa en la sintaxis de objetos de JavaScript, pero es independiente del lenguaje.
// Los tipos de datos válidos en JSON son:
// - Objetos: `{ "clave": "valor" }`
// - Arrays: `[valor1, valor2]`
// - Strings: `"una cadena de texto"` (¡siempre con comillas dobles!)
// - Números: `123`, `3.14`, `-10`
// - Booleanos: `true`, `false`
// - `null`: `null`

console.log("\n--- ¿Qué es JSON? ---");

// Ejemplo de una cadena JSON (¡es un string!)
const jsonString = `{
  "nombre": "Carlos",
  "edad": 35,
  "esEstudiante": false,
  "cursos": ["Matemáticas", "Programación"],
  "direccion": {
    "calle": "Calle Sol",
    "numero": 10
  },
  "contacto": null
}`;

console.log("Cadena JSON (tipo string):", typeof jsonString);
console.log(jsonString);

// --- 2. Conversión entre JSON y Objetos/Arrays de JavaScript ---
// JavaScript proporciona el objeto global `JSON` con dos métodos principales:
// - `JSON.parse()`: Convierte una cadena JSON a un objeto/valor de JavaScript.
// - `JSON.stringify()`: Convierte un objeto/valor de JavaScript a una cadena JSON.

console.log("\n--- Conversión: `JSON.parse()` y `JSON.stringify()` ---");

// `JSON.parse()`: De JSON String a Objeto JavaScript
const objetoJS = JSON.parse(jsonString);
console.log("\nObjeto JavaScript después de `JSON.parse()`:");
console.log(objetoJS);
console.log("Tipo del resultado:", typeof objetoJS);
console.log("Accediendo a una propiedad:", objetoJS.nombre);
console.log("Accediendo a un elemento de array:", objetoJS.cursos[0]);

// `JSON.stringify()`: De Objeto JavaScript a JSON String
const miObjetoJS = {
  producto: "Laptop",
  precio: 999.99,
  disponible: true,
  especificaciones: {
    ram: "16GB",
    almacenamiento: "512GB SSD",
  },
  etiquetas: ["electrónica", "ordenador"],
  fabricante: null,
};

const nuevaJsonString = JSON.stringify(miObjetoJS);
console.log("\nCadena JSON después de `JSON.stringify(miObjetoJS)`:");
console.log(nuevaJsonString);
console.log("Tipo del resultado:", typeof nuevaJsonString);

// `JSON.stringify()` con parámetros opcionales:
// - `replacer` (función o array): Para filtrar o transformar valores.
// - `space` (string o number): Para indentar la salida JSON, haciéndola más legible.

// Ejemplo con `space` (indentación para legibilidad)
const prettyJson = JSON.stringify(miObjetoJS, null, 2); // 2 espacios de indentación
console.log("\nCadena JSON indentada con `JSON.stringify(obj, null, 2)`:");
console.log(prettyJson);

// Ejemplo con `replacer` (filtrando una propiedad)
function replacer(key, value) {
  if (key === "precio") {
    return undefined; // Excluye la propiedad 'precio'
  }
  return value;
}
const filteredJson = JSON.stringify(miObjetoJS, replacer, 2);
console.log("\nCadena JSON con 'precio' filtrado con `replacer`:");
console.log(filteredJson);

// Ejemplo con `replacer` (solo incluye ciertas propiedades)
const propsAIncluir = ["producto", "disponible"];
const selectedPropsJson = JSON.stringify(miObjetoJS, propsAIncluir, 2);
console.log(
  "\nCadena JSON con solo propiedades seleccionadas con `replacer` (array):"
);
console.log(selectedPropsJson);

// --- 3. Casos de Uso Comunes de JSON ---
console.log("\n--- Casos de Uso Comunes de JSON ---");

// 1. **Comunicación Cliente-Servidor (APIs RESTful):**
// El caso de uso más frecuente. El navegador envía datos JSON al servidor y el servidor responde con JSON.
console.log(
  "Caso de uso 1: Intercambio de datos entre cliente y servidor (APIs)."
);
// Ejemplo (simulado):
// fetch('/api/data')
//   .then(response => response.json()) // Convierte la respuesta JSON a objeto JS
//   .then(data => console.log('Datos de la API:', data));

// fetch('/api/submit', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ item: 'Nuevo elemento', cantidad: 5 }) // Envía objeto JS como JSON
// });

// 2. **Almacenamiento de Datos:**
// - **LocalStorage/SessionStorage en el navegador:** Solo almacenan strings, así que los objetos JS se stringifican a JSON.
console.log(
  "\nCaso de uso 2: Almacenamiento de datos en LocalStorage/SessionStorage."
);
localStorage.setItem(
  "configuracionUsuario",
  JSON.stringify({ tema: "oscuro", notificaciones: true })
);
const configGuardada = JSON.parse(localStorage.getItem("configuracionUsuario"));
console.log("Configuración de usuario desde LocalStorage:", configGuardada);

// - **Archivos de configuración:** Muchos sistemas usan archivos JSON para configurar aplicaciones (ej. `package.json` en Node.js).
console.log("Caso de uso 3: Archivos de configuración (ej. `package.json`).");

// 3. **Mensajes entre Microservicios / Colas de Mensajes:**
// JSON es un formato popular para que diferentes servicios se comuniquen entre sí.
console.log(
  "Caso de uso 4: Mensajes entre microservicios o colas de mensajes."
);

// 4. **Bases de Datos NoSQL (ej. MongoDB):**
// Algunas bases de datos almacenan documentos directamente en formato JSON (o BSON, una variante binaria).
console.log("Caso de uso 5: Almacenamiento en bases de datos NoSQL.");

// --- 4. Consideraciones de Seguridad con JSON ---
console.log("\n--- Consideraciones de Seguridad ---");

// 1. **`JSON.parse()` y JSON Inseguro:**
// Si usas `JSON.parse()` en una cadena JSON que proviene de una fuente no confiable,
// y esa cadena contiene código JavaScript malicioso (ej. usando el antiguo y peligroso `eval()`),
// esto podría ser un problema. Sin embargo, `JSON.parse()` **no ejecuta código JavaScript**
// por diseño; solo parsea la estructura de datos.
// El riesgo principal es que datos maliciosos pero válidos puedan explotar vulnerabilidades
// en el código que *procesa* esos datos.
const jsonInseguro = `{"__proto__": {"isAdmin": true}}`; // Ejemplo de posible ataque de "Prototype Pollution"

try {
  const objInseguro = JSON.parse(jsonInseguro);
  console.log(
    "JSON parseado (potencialmente inseguro si se usa mal):",
    objInseguro
  );
  // La clave aquí es cómo se *usa* `objInseguro` después.
  // Por ejemplo, si tu código luego fusiona esto con otro objeto sin validación:
  // Object.assign({}, defaultSettings, objInseguro); // Podría sobreescribir propiedades del prototipo
} catch (e) {
  console.error("Error al parsear JSON inseguro:", e.message);
}
console.log(
  "`JSON.parse()` es seguro en sí mismo, pero los datos maliciosos que parsea pueden ser peligrosos si no se validan."
);

// 2. **Inyección de Datos / Validación:**
// El principal riesgo no es `JSON.parse()` en sí, sino la **validación de los datos** que recibes.
// Siempre valida los datos JSON entrantes (desde APIs, formularios, etc.) antes de usarlos en tu aplicación.
// No confíes ciegamente en que los datos tienen el formato y contenido esperados.
// Usa esquemas de validación (ej. JSON Schema) en el servidor y, a veces, también en el cliente.
console.log("Validar datos JSON entrantes es CRÍTICO para la seguridad.");
console.log(
  "Nunca confíes en los datos recibidos de fuentes externas sin validación."
);

// 3. **Cross-Site Request Forgery (CSRF):**
// Aunque no es directamente un problema de JSON, es un riesgo al enviar JSON a un servidor.
// Un atacante puede engañar a un usuario para que envíe una solicitud JSON maliciosa a tu servidor.
// Se mitiga con tokens CSRF.
console.log(
  "JSON es vulnerable a CSRF como otras peticiones. Usa tokens CSRF."
);

// 4. **Exposición de Datos Sensibles:**
// Asegúrate de no serializar datos sensibles (contraseñas, claves privadas) en JSON que se envíe al cliente o se almacene públicamente.
console.log("Cuidado con la exposición de datos sensibles en JSON.");

// 5. **Sobrecarga de Datos (Denial of Service):**
// Parsear JSON muy grande o anidado excesivamente puede consumir muchos recursos.
// Implementa límites de tamaño y profundidad de anidación.
console.log(
  "Ten en cuenta el tamaño y la complejidad del JSON para evitar ataques de DoS."
);
