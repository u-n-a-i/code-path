console.log("--- El Ciclo de Concurrencia (Event Loop) en JavaScript ---");
console.log("Inicio del script.");

// --- 1. Pila de Llamadas (Call Stack) ---
// La Pila de Llamadas es donde se ejecutan las funciones.
// JavaScript es de un solo hilo, lo que significa que solo puede hacer una cosa a la vez.

function funcionA() {
  console.log("  [Pila] Ejecutando funcionA.");
  funcionB();
  console.log("  [Pila] Volviendo de funcionB en funcionA.");
}

function funcionB() {
  console.log("  [Pila] Ejecutando funcionB.");
}

console.log("\n--- Demostración de la Pila de Llamadas ---");
funcionA(); // Esto empuja funcionA, luego funcionB, a la pila.
console.log("  [Pila] funcionA ha terminado.");

// --- 2. Operaciones Asíncronas y Web APIs / Node.js APIs ---
// Cuando JavaScript encuentra una operación asíncrona (como `setTimeout`, `Workspace`, eventos DOM),
// la delega a las Web APIs (en el navegador) o a las APIs de Node.js (en el servidor).
// Estas APIs ejecutan la tarea en segundo plano.

console.log("\n--- Operaciones Asíncronas (Web APIs / Node.js APIs) ---");

// `setTimeout`: Función asíncrona que programa una función para ejecutarse después de un retraso.
console.log("  [Pila] Programando `setTimeout(0)`...");
setTimeout(() => {
  console.log("  [Cola de Tareas] Callback de setTimeout (0ms) ejecutado.");
}, 0); // El 0ms no significa "ejecutar inmediatamente", sino "ejecutar tan pronto como la pila esté vacía".

console.log("  [Pila] Programando `setTimeout(2000)`...");
setTimeout(() => {
  console.log("  [Cola de Tareas] Callback de setTimeout (2000ms) ejecutado.");
}, 2000); // Se ejecutará después de al menos 2000ms

// `Promise`: Representa la eventual finalización (o falla) de una operación asíncrona.
// Los callbacks de Promises (`.then()`, `.catch()`) van a la Cola de Microtareas.

console.log("  [Pila] Creando y resolviendo una Promise...");
Promise.resolve("Datos resueltos de Promise").then((data) => {
  console.log(`  [Cola de Microtareas] Callback de Promise.then: ${data}`);
});

console.log("  [Pila] Otra Promise programada...");
new Promise((resolve) => {
  setTimeout(() => {
    resolve("Datos de Promise después de 1 segundo");
  }, 1000);
}).then((data) => {
  console.log(
    `  [Cola de Microtareas] Callback de Promise (con setTimeout): ${data}`
  );
});

// --- 3. Cola de Tareas (Callback Queue / Task Queue) ---
// Cuando una Web API/Node.js API termina su tarea asíncrona,
// el callback asociado se envía a la Cola de Tareas.
// Aquí esperan los callbacks de `setTimeout`, eventos DOM, `Workspace` (cuando descarga).

// Simulación de un evento DOM o I/O
console.log("  [Pila] Simulando un evento DOM (o I/O de archivo).");
// Imagina que esto es un click de un botón, o la lectura de un archivo
setTimeout(() => {
  // Usamos setTimeout para simular que la operación asíncrona "termina"
  console.log(
    "  [Cola de Tareas] Callback de evento DOM/I/O (simulado) ejecutado."
  );
}, 50); // Un pequeño retraso para que se vea el orden

// --- 4. Cola de Microtareas (Microtask Queue) ---
// Es una cola de mayor prioridad que la Cola de Tareas.
// Contiene los callbacks de Promises (`.then()`, `.catch()`, `.finally()`), `queueMicrotask()`.
// Se vacía *completamente* después de cada tarea de la Cola de Tareas, y antes de que el Event Loop
// pase a la siguiente tarea de la Cola de Tareas.

console.log("  [Pila] Añadiendo una microtarea directamente...");
queueMicrotask(() => {
  console.log(
    "  [Cola de Microtareas] Callback de `queueMicrotask` ejecutado."
  );
});

// --- 5. El Event Loop (El Corazón del Mecanismo) ---
// El Event Loop es un proceso constante que:
// A. Verifica si la Pila de Llamadas está vacía.
// B. Si la Pila de Llamadas está vacía, vacía *primero* la Cola de Microtareas.
// C. Si la Cola de Microtareas también está vacía, toma la primera tarea de la Cola de Tareas
//    y la empuja a la Pila de Llamadas para su ejecución.
// D. Repite el ciclo.

console.log("  [Pila] Fin del código síncrono principal.");
console.log("  El Event Loop está a punto de comenzar a procesar las colas.");

// El output final te mostrará el orden:
// 1. Todo el código síncrono.
// 2. Todas las microtareas (callbacks de Promise, queueMicrotask).
// 3. Las tareas de la cola de tareas (callbacks de setTimeout, eventos).

console.log("Fin del script.");
