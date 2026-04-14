console.log("--- Manejo de Excepciones con `try...catch...finally` ---");

// --- 1. Bloque `try...catch` básico ---
// `try`: Contiene el código que podría generar un error.
// `catch`: Se ejecuta si ocurre un error dentro del bloque `try`. Recibe el objeto `error` como argumento.

console.log("\n--- Ejemplo Básico `try...catch` ---");

try {
  console.log("Intentando ejecutar un código que podría fallar...");
  // Aquí simulamos un error accediendo a una propiedad de una variable no definida
  // Descomenta la siguiente línea para ver el error en acción:
  // console.log(variableNoDeclarada.propiedad);

  // O forzar un error explícitamente:
  throw new Error("¡Este es un error personalizado forzado!");

  console.log("Esta línea no se ejecutará si hay un error arriba.");
} catch (error) {
  // El control salta directamente aquí si ocurre un error en el `try`
  console.log("¡Se ha capturado un error!");
  console.error("Tipo de error:", error.name); // Por ejemplo, "ReferenceError", "TypeError", "Error"
  console.error("Mensaje de error:", error.message); // El mensaje descriptivo del error

  // También puedes verificar el tipo de error
  if (error instanceof ReferenceError) {
    console.warn(
      "Advertencia: ¡Parece que intentaste usar una variable no definida!"
    );
  } else if (
    error instanceof Error &&
    error.message.includes("personalizado")
  ) {
    console.info("Info: Se capturó un error personalizado.");
  }
}
console.log("El programa continúa después del bloque `try...catch`.");

// --- 2. Bloque `finally` (Opcional, se ejecuta siempre) ---
// `finally`: El código dentro de este bloque se ejecuta siempre,
// ya sea que haya ocurrido un error o no, y después de `try` y `catch`.
// Es útil para limpiar recursos (cerrar archivos, conexiones de red, etc.).

console.log("\n--- Ejemplo con `finally` ---");

function realizarOperacion(exito) {
  try {
    console.log("Iniciando operación...");
    if (!exito) {
      throw new Error("La operación ha fallado intencionalmente.");
    }
    console.log("Operación completada con éxito.");
    return "Resultado exitoso"; // Si no hay error, esto se retorna
  } catch (error) {
    console.error("Error en la operación:", error.message);
    // return "Error en la operación"; // Podrías retornar aquí también
  } finally {
    // Esto siempre se ejecuta, incluso si hay un `return` en `try` o `catch`
    console.log(
      "Finalizando operación: Recursos liberados o limpieza realizada."
    );
  }
}

// Caso 1: La operación es exitosa
console.log("\n--- Caso: Operación Exitosa ---");
let resultadoExito = realizarOperacion(true);
console.log("Resultado final:", resultadoExito); // Salida: Resultado exitoso (después del finally)

// Caso 2: La operación falla
console.log("\n--- Caso: Operación Fallida ---");
let resultadoFallo = realizarOperacion(false);
console.log("Resultado final (después del catch):", resultadoFallo); // Salida: undefined (porque no hay return en el catch)

// --- 3. Tipos de Errores Comunes en JavaScript ---

console.log("\n--- Tipos de Errores Comunes ---");

// ReferenceError: Se produce al intentar acceder a una variable no declarada.
try {
  console.log(variableInexistente);
} catch (e) {
  console.error("Capturado ReferenceError:", e.message);
}

// TypeError: Se produce cuando una operación no puede ser realizada porque el valor no es del tipo esperado.
try {
  null.metodo(); // Intentar llamar a un método en null
} catch (e) {
  console.error("Capturado TypeError:", e.message);
}

// SyntaxError: Se produce cuando el código tiene errores de sintaxis y no puede ser interpretado.
// NOTA: SyntaxError no puede ser capturado por `try...catch` si ocurre en el código en tiempo de parseo inicial,
// solo si se evalúa dinámicamente (ej. con `eval()`). Lo común es que detenga el script antes.
/*
try {
  eval("console.log('Hola'; // Falta un paréntesis)"); // Ejemplo de SyntaxError con eval
} catch (e) {
  console.error("Capturado SyntaxError:", e.message);
}
*/

// RangeError: Se produce cuando un número está fuera del rango de valores permitidos.
try {
  new Array(-1); // Intentar crear un array con una longitud negativa
} catch (e) {
  console.error("Capturado RangeError:", e.message);
}

// URIError: Se produce cuando las funciones de codificación/descodificación de URI globales
// (encodeURI(), decodeURI(), etc.) se utilizan incorrectamente.
try {
  decodeURIComponent("%"); // Carácter inválido
} catch (e) {
  console.error("Capturado URIError:", e.message);
}

// Error (el tipo genérico): Usado para errores generales o como base para errores personalizados.
// Como el que usamos al inicio con `throw new Error(...)`.

// --- 4. Lanzar Excepciones Personalizadas (`throw`) ---
// Puedes lanzar tus propios errores usando la palabra clave `throw`.
// Generalmente, lanzas instancias de `Error` o de sus subclases.

console.log("\n--- Lanzar Excepciones Personalizadas (`throw`) ---");

function dividir(a, b) {
  if (b === 0) {
    throw new Error("No se puede dividir por cero."); // Lanzamos un error personalizado
  }
  return a / b;
}

try {
  console.log("Resultado de 10 / 2:", dividir(10, 2));
  console.log("Resultado de 5 / 0:", dividir(5, 0)); // Esto lanzará un error
} catch (error) {
  console.error("Error al intentar dividir:", error.message);
}
