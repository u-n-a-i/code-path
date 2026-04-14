console.log("--- El Objeto `Error` en JavaScript ---");

// --- 1. Creación y Propiedades Básicas de un Objeto `Error` ---
// El constructor `Error()` puede recibir un mensaje opcional.
// Un objeto Error tiene al menos dos propiedades principales: `name` y `message`.

console.log("\n--- Creación y Propiedades Básicas ---");

try {
  // Lanzar un error simple
  throw new Error("Algo salió mal, pero lo capturamos.");
} catch (e) {
  console.error("Error capturado:", e); // Muestra el objeto Error completo
  console.error("Nombre del error:", e.name); // Salida: Error
  console.error("Mensaje del error:", e.message); // Salida: Algo salió mal, pero lo capturamos.
  console.error("Pila de llamadas (stack):", e.stack); // Muestra dónde ocurrió el error en el código
}

// Otros errores también son instancias de `Error` o sus subclases
try {
  const obj = null;
  console.log(obj.propiedad); // Esto lanzará un TypeError
} catch (e) {
  console.error("\nError capturado (TypeError):", e);
  console.error("Nombre del error:", e.name); // Salida: TypeError
  console.error("Mensaje del error:", e.message); // Salida: Cannot read properties of null (reading 'propiedad')
  console.error("Es instancia de Error?", e instanceof Error); // Salida: true
  console.error("Es instancia de TypeError?", e instanceof TypeError); // Salida: true
}

// --- 2. Subclases de `Error` Integradas ---
// JavaScript tiene varias subclases de `Error` para representar tipos específicos de problemas.
// Todas ellas heredan de `Error`.

console.log("\n--- Subclases de `Error` Integradas ---");

// `ReferenceError`: Se lanza cuando se hace referencia a una variable no declarada.
try {
  console.log(variableNoExiste);
} catch (e) {
  console.error("\nCapturado ReferenceError:", e.name, e.message);
}

// `TypeError`: Se lanza cuando un valor no es del tipo esperado o una operación no se puede realizar.
try {
  const num = 123;
  num.toUpperCase(); // `num` no es un string
} catch (e) {
  console.error("Capturado TypeError:", e.name, e.message);
}

// `RangeError`: Se lanza cuando un valor numérico está fuera del rango permitido.
try {
  new Array(-1); // Longitud de array inválida
} catch (e) {
  console.error("Capturado RangeError:", e.name, e.message);
}

// `SyntaxError`: Se lanza cuando el motor de JS encuentra código con sintaxis inválida.
// NOTA: Los SyntaxError usualmente detienen la ejecución antes de que el `try...catch` pueda atraparlos,
// a menos que sean evaluados dinámicamente (ej. con `eval()`).
console.log(
  "\nEjemplo de SyntaxError (si ocurriera en tiempo de ejecución de eval):"
);
try {
  eval("alert('Hola')"); // Si eval() tuviera un error sintáctico, se capturaría
} catch (e) {
  // Este catch solo se activa si eval() encuentra un error sintáctico
  console.error("Capturado SyntaxError (ejemplo):", e.name, e.message);
}

// `URIError`: Se lanza cuando las funciones de codificación/descodificación de URI globales
// (encodeURI(), decodeURIComponent(), etc.) se usan incorrectamente.
try {
  decodeURIComponent("%"); // Carácter inválido
} catch (e) {
  console.error("\nCapturado URIError:", e.name, e.message);
}

// `EvalError`: Obsoleto y generalmente no se usa en el código moderno.
// Solía lanzarse en problemas con la función global `eval()`.
/*
try {
  throw new EvalError("Este es un EvalError (obsoleto)");
} catch (e) {
  console.error("Capturado EvalError:", e.name, e.message);
}
*/

// --- 3. Errores Personalizados (`Custom Errors`) ---
// Puedes crear tus propias clases de error heredando de `Error`
// para hacer tu código más específico y legible.

console.log("\n--- Errores Personalizados ---");

class ValidationError extends Error {
  constructor(message, field) {
    super(message); // Llama al constructor de la clase padre (Error)
    this.name = "ValidationError"; // Sobrescribe el nombre del error
    this.field = field; // Propiedad personalizada
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

function validarEmail(email) {
  if (!email.includes("@")) {
    throw new ValidationError("El email debe contener un '@'", "email");
  }
  if (email.length < 5) {
    throw new ValidationError("El email es demasiado corto", "email");
  }
  return true;
}

function obtenerDatosApi(url) {
  // Simulamos un fallo de red
  const esFallo = Math.random() > 0.5;
  if (esFallo) {
    throw new NetworkError("Fallo al conectar con la API", 500);
  }
  return "Datos obtenidos con éxito.";
}

try {
  validarEmail("test@example.com");
  console.log("Email válido.");

  validarEmail("invalid-email"); // Esto lanzará ValidationError
  console.log("Esta línea no se ejecutará.");
} catch (e) {
  if (e instanceof ValidationError) {
    console.error(`Error de validación en el campo '${e.field}': ${e.message}`);
  } else {
    console.error("Error inesperado:", e.message);
  }
}

try {
  console.log("\nIntentando obtener datos de la API...");
  const datos = obtenerDatosApi("https://api.example.com/data");
  console.log(datos);
} catch (e) {
  if (e instanceof NetworkError) {
    console.error(`Error de red (Código ${e.statusCode}): ${e.message}`);
  } else {
    console.error("Otro tipo de error de API:", e.message);
  }
}

// --- 4. Diferencia entre `throw` y `console.error` ---
// `throw` crea y lanza un objeto Error, deteniendo el flujo normal del programa
// hasta que es capturado por un `try...catch`.
// `console.error` simplemente imprime un mensaje de error en la consola; no interrumpe el flujo.

console.log("\n--- `throw` vs `console.error` ---");

// Este error detendrá el script si no está en un try...catch
// throw new Error("¡Este error detendrá el script si no lo capturas!");

// Este solo imprime un mensaje y el script continúa
console.error("Esto es solo un mensaje de error en la consola.");
console.log("El script continúa después de `console.error`.");
