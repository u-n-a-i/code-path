console.log("--- Temporizadores (Time-Out, Interval, Clear) en JavaScript ---");
console.log("Inicio del script.");

// --- 1. `setTimeout(callback, delay)` ---
// Ejecuta una función (callback) **una única vez** después de un número específico de milisegundos (delay).

console.log("\n--- Uso de `setTimeout` ---");

console.log("Programando un mensaje para aparecer en 2 segundos...");
const timeoutId1 = setTimeout(() => {
  console.log(
    "  [setTimeout 2s]: ¡Este mensaje aparece después de 2 segundos!"
  );
}, 2000); // 2000 milisegundos = 2 segundos

console.log(
  "Programando un mensaje para aparecer en 0 milisegundos (tan pronto como sea posible)."
);
const timeoutId2 = setTimeout(() => {
  console.log(
    "  [setTimeout 0ms]: ¡Este mensaje aparece después de que el código síncrono termine!"
  );
}, 0);

console.log("`setTimeout` devuelve un ID (`timeoutId`):", timeoutId1);

// --- 2. `clearTimeout(timeoutId)` ---
// Cancela la ejecución de un `setTimeout` programado, siempre que no se haya ejecutado aún.
// Se usa el ID devuelto por `setTimeout`.

console.log("\n--- Uso de `clearTimeout` ---");

let mensajePendiente;
let timeoutId3 = setTimeout(() => {
  mensajePendiente = "¡Este mensaje NUNCA debería aparecer!";
  console.log(mensajePendiente);
}, 1000);

console.log("Intentando cancelar el setTimeout con ID:", timeoutId3);
clearTimeout(timeoutId3); // Cancelamos el temporizador

setTimeout(() => {
  if (!mensajePendiente) {
    console.log("  [clearTimeout]: ¡El setTimeout fue cancelado exitosamente!");
  }
}, 1500); // Damos tiempo para que el setTimeout original se hubiera disparado si no se cancelaba

// --- 3. `setInterval(callback, delay)` ---
// Ejecuta una función (callback) **repetidamente**, cada cierto número de milisegundos (delay).

console.log("\n--- Uso de `setInterval` ---");

let contador = 0;
console.log("Iniciando un intervalo que se ejecutará cada segundo (5 veces).");
const intervalId = setInterval(() => {
  contador++;
  console.log(`  [setInterval]: Tick #${contador}`);
  if (contador >= 5) {
    // Es crucial detener el intervalo una vez que ya no lo necesitas
    clearInterval(intervalId); // Ver siguiente sección
    console.log("  [setInterval]: Intervalo detenido después de 5 ticks.");
  }
}, 1000); // Cada 1000 milisegundos = 1 segundo

console.log("`setInterval` también devuelve un ID (`intervalId`):", intervalId);

// --- 4. `clearInterval(intervalId)` ---
// Cancela la ejecución repetitiva de un `setInterval`.
// Se usa el ID devuelto por `setInterval`.

console.log(
  "\n--- Uso de `clearInterval` (demostrado en el ejemplo anterior) ---"
);
console.log(
  "El `clearInterval` para el contador ya está integrado en el bloque `setInterval`."
);

// Un ejemplo adicional para mostrar el efecto inmediato de clearInterval
let contadorInmediato = 0;
const intervalIdInmediato = setInterval(() => {
  contadorInmediato++;
  console.log(
    `  [setInterval Inmediato]: ¡Este es el tick #${contadorInmediato}!`
  );
  if (contadorInmediato === 2) {
    console.log(
      "  [clearInterval]: Deteniendo el intervalo inmediato después del segundo tick."
    );
    clearInterval(intervalIdInmediato);
  }
}, 300);

// --- Consideraciones Importantes ---
console.log("\n--- Consideraciones Importantes ---");

// 1. **No son exactos:** El `delay` especificado es el *mínimo* tiempo de espera.
//    El Event Loop debe estar libre para ejecutar el callback. Si el hilo principal
//    está ocupado (ejecutando código síncrono pesado), el callback se retrasará.
console.log(
  "  Los temporizadores no garantizan una ejecución exacta en el tiempo especificado; solo un mínimo."
);

// 2. **Contexto `this`:** Dentro de los callbacks de `setTimeout` y `setInterval`
//    definidos con funciones tradicionales (`function() { ... }`), `this` se refiere
//    al objeto global (`window` en navegadores, `global` en Node.js).
//    Usa **arrow functions (`=>`)** para mantener el contexto `this` del ámbito envolvente.
class MyClass {
  constructor() {
    this.value = 42;
  }
  logValueWithDelay() {
    // Si usáramos function() { ... }, `this.value` sería undefined.
    setTimeout(() => {
      console.log(`  [Contexto this]: El valor es: ${this.value}`); // `this` se refiere a la instancia de MyClass
    }, 500);
  }
}
const instance = new MyClass();
instance.logValueWithDelay();

// 3. **Intervalos encadenados (`setTimeout` recursivo):**
//    Para secuencias de acciones con pausas, o para intervalos donde el tiempo entre
//    ejecuciones debe ser más preciso (considerando el tiempo que toma el callback),
//    a veces se prefiere encadenar `setTimeout` recursivamente en lugar de `setInterval`.
console.log(
  "\n--- `setTimeout` Recursivo (simulando intervalo más controlado) ---"
);
let contadorRecursivo = 0;
function ejecutarCadaSegundo() {
  contadorRecursivo++;
  console.log(`  [Recursivo]: Paso #${contadorRecursivo}`);
  if (contadorRecursivo < 3) {
    // Detener después de 3 ejecuciones
    setTimeout(ejecutarCadaSegundo, 1000);
  }
}
ejecutarCadaSegundo();

console.log(
  "Fin del script (el resto de salidas aparecerán de forma asíncrona)."
);
