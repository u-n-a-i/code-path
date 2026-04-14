console.log("--- Callbacks en JavaScript ---");
console.log("Inicio de la ejecución.");

// --- 1. Callbacks Síncronos (Ejecución Inmediata o Controlada) ---
// Aunque se pasan como argumento, se ejecutan dentro del mismo hilo de ejecución
// de la función principal.

console.log("\n--- Callbacks Síncronos ---");

// `forEach`: El callback se ejecuta para cada elemento del array, de forma síncrona.
const numeros = [1, 2, 3];
console.log("Iterando con forEach:");
numeros.forEach(function (numero) {
  console.log(`  Callback forEach: Procesando número ${numero}`);
});
console.log("forEach ha terminado.");

// `map`: Similar a forEach, pero devuelve un nuevo array.
const cuadrados = numeros.map(function (numero) {
  return numero * numero;
});
console.log("Números cuadrados (con map):", cuadrados);

// Función que acepta un callback y lo ejecuta inmediatamente
function ejecutarFuncion(callback) {
  console.log("  Dentro de ejecutarFuncion: ejecutando el callback...");
  callback(); // El callback se invoca aquí
  console.log("  Dentro de ejecutarFuncion: callback ejecutado.");
}

ejecutarFuncion(function () {
  console.log("    ¡Hola desde el callback síncrono!");
});

// --- 2. Callbacks Asíncronos (Ejecución en el Futuro) ---
// Aquí es donde los callbacks realmente brillan. Se ejecutan cuando una operación
// que lleva tiempo (como un temporizador o una petición de red) se completa.
// El hilo principal de JavaScript no se bloquea mientras espera.

console.log("\n--- Callbacks Asíncronos ---");

// `setTimeout`: Un callback que se ejecuta después de un retraso de tiempo.
console.log("Programando un callback con setTimeout (2 segundos)...");
setTimeout(function () {
  console.log("  [Callback setTimeout]: ¡Mensaje después de 2 segundos!");
}, 2000);

// Simulación de una petición a una API (callback al finalizar)
function obtenerDatosDeUsuario(id, callback) {
  console.log(`  Simulando petición de datos para el usuario con ID: ${id}`);
  // Simulamos un retraso de red
  setTimeout(function () {
    const datosUsuario = { id: id, nombre: "Juan Pérez", edad: 30 };
    console.log("  Datos recibidos (simulado).");
    callback(datosUsuario); // Ejecutamos el callback con los datos
  }, 1500);
}

obtenerDatosDeUsuario(123, function (usuario) {
  console.log("  [Callback API]: Datos de usuario obtenidos:");
  console.log("    Nombre:", usuario.nombre);
  console.log("    Edad:", usuario.edad);
});

// `addEventListener`: El callback se ejecuta cuando ocurre un evento (ej. un clic).
// Esto es típico en desarrollo web.
// (Este ejemplo necesita un entorno de navegador para funcionar visualmente)
/*
console.log("\n--- Callbacks con Eventos (requiere entorno de navegador) ---");
document.addEventListener('DOMContentLoaded', function() {
  const boton = document.createElement('button');
  boton.textContent = "Haz clic aquí";
  document.body.appendChild(boton);

  boton.addEventListener('click', function() {
    console.log("  [Callback Evento]: ¡Botón clickeado!");
    alert("¡Has hecho clic en el botón!");
  });
  console.log("  Botón añadido. Esperando el evento click...");
});
*/

// --- 3. El "Callback Hell" (Infierno de Callbacks) ---
// Cuando hay muchas operaciones asíncronas encadenadas, los callbacks anidados
// pueden volverse difíciles de leer y mantener.

console.log('\n--- El "Callback Hell" (Problema Común) ---');

function paso1(callback) {
  setTimeout(() => {
    console.log("  Paso 1 completado.");
    callback("Datos del Paso 1");
  }, 500);
}

function paso2(data1, callback) {
  setTimeout(() => {
    console.log(`  Paso 2 completado (con datos de Paso 1: ${data1}).`);
    callback("Datos del Paso 2");
  }, 500);
}

function paso3(data2, callback) {
  setTimeout(() => {
    console.log(`  Paso 3 completado (con datos de Paso 2: ${data2}).`);
    callback("Datos del Paso 3");
  }, 500);
}

// Ejemplo de callback hell:
console.log("Iniciando secuencia de pasos (simulando Callback Hell)...");
paso1(function (data1) {
  paso2(data1, function (data2) {
    paso3(data2, function (data3) {
      console.log(`  Todos los pasos completados. Resultado final: ${data3}`);
    });
  });
});
console.log("Secuencia de pasos programada. El código síncrono continúa.");

// --- 4. Alternativas modernas a los Callbacks para la Asincronía ---
// Para evitar el "Callback Hell", surgieron las Promises y Async/Await.
// Son formas más elegantes de manejar la asincronía que se construyen sobre callbacks.

console.log("\n--- Alternativas (Promises y Async/Await) ---");

function paso1Promise() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("  [Promise] Paso 1 completado.");
      resolve("Datos del Paso 1 (Promise)");
    }, 500);
  });
}

function paso2Promise(data1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `  [Promise] Paso 2 completado (con datos de Paso 1: ${data1}).`
      );
      resolve("Datos del Paso 2 (Promise)");
    }, 500);
  });
}

// Usando Promises para una secuencia más legible
paso1Promise()
  .then((data1) => paso2Promise(data1))
  .then((data2) => {
    console.log(
      `  [Promise] Todos los pasos completados. Resultado final: ${data2}`
    );
  })
  .catch((error) => console.error("Error en la secuencia Promise:", error));

// Async/Await (aún más legible para secuencias)
async function ejecutarSecuenciaAsync() {
  try {
    console.log("\n  [Async/Await] Iniciando secuencia...");
    const data1 = await paso1Promise();
    const data2 = await paso2Promise(data1);
    console.log(
      `  [Async/Await] Todos los pasos completados. Resultado final: ${data2}`
    );
  } catch (error) {
    console.error("  [Async/Await] Error en la secuencia:", error);
  }
}
ejecutarSecuenciaAsync();

console.log(
  "\nFin del script (el resto de salidas aparecerán de forma asíncrona)."
);
