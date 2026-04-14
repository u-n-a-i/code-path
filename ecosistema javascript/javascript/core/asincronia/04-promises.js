console.log("--- Promises en JavaScript ---");
console.log("Inicio de la ejecución del script.");

// --- 1. Creación de una Promise ---
// Se crea una nueva Promise con un "executor function" que recibe dos argumentos:
// `resolve` (para cumplir la promesa) y `reject` (para rechazarla).

console.log("\n--- Creación y Consumo Básico de una Promise ---");

const miPrimeraPromesa = new Promise((resolve, reject) => {
  console.log("  [Promise]: El executor function está corriendo.");
  // Simulamos una operación asíncrona (ej. una petición de red, lectura de archivo)
  const exito = Math.random() > 0.5; // 50% de probabilidad de éxito

  setTimeout(() => {
    if (exito) {
      resolve("¡Operación completada con éxito!"); // La promesa se cumple
    } else {
      reject("¡Operación fallida! Hubo un error."); // La promesa se rechaza
    }
  }, 1000); // Se resuelve o rechaza después de 1 segundo
});

// Consumo de la Promise: `.then()` y `.catch()`
// `.then(onFulfilled, onRejected)`: Se ejecuta cuando la promesa se cumple (onFulfilled) o se rechaza (onRejected).
// `.catch(onRejected)`: Es un atajo para `.then(null, onRejected)`, solo maneja el rechazo.

miPrimeraPromesa
  .then((mensajeExito) => {
    console.log(`  [Promise .then()]: ${mensajeExito}`);
  })
  .catch((mensajeError) => {
    console.error(`  [Promise .catch()]: ${mensajeError}`);
  })
  .finally(() => {
    // `.finally()`: Se ejecuta siempre, independientemente del resultado (ES2018+)
    console.log("  [Promise .finally()]: La promesa ha finalizado su ciclo.");
  });

console.log("  [Script Principal]: La promesa ha sido creada y programada."); // Este mensaje aparece primero

// --- 2. Encadenamiento de Promises (`.then()` chaining) ---
// Las Promises son poderosas porque los métodos `.then()` siempre devuelven una nueva promesa.
// Esto permite encadenar operaciones asíncronas de forma secuencial y legible.

console.log("\n--- Encadenamiento de Promises ---");

function pasoAsync1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("    [Chain] Paso 1 completado.");
      resolve(10); // Pasa 10 al siguiente .then
    }, 500);
  });
}

function pasoAsync2(numero) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const resultado = numero * 2;
      console.log(
        `    [Chain] Paso 2 completado. Recibí ${numero}, devolviendo ${resultado}`
      );
      resolve(resultado); // Pasa el resultado al siguiente .then
    }, 500);
  });
}

function pasoAsync3(numero) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (numero > 15) {
        console.log(`    [Chain] Paso 3 completado. Recibí ${numero}.`);
        resolve(numero + 5);
      } else {
        console.error(
          `    [Chain] Paso 3 falló: El número ${numero} no es mayor que 15.`
        );
        reject("Error en paso 3"); // Rechaza la promesa
      }
    }, 500);
  });
}

pasoAsync1()
  .then((resultadoPaso1) => pasoAsync2(resultadoPaso1)) // El valor de pasoAsync1 se pasa a pasoAsync2
  .then((resultadoPaso2) => pasoAsync3(resultadoPaso2)) // El valor de pasoAsync2 se pasa a pasoAsync3
  .then((resultadoFinal) => {
    console.log(
      `  [Chain]: ¡Secuencia de Promises completada! Resultado final: ${resultadoFinal}`
    );
  })
  .catch((error) => {
    console.error(`  [Chain]: ¡Hubo un error en la secuencia! ${error}`);
  });

// --- 3. Métodos Estáticos de Promise ---
// `Promise.all()`, `Promise.race()`, `Promise.allSettled()`, `Promise.any()`
// Son útiles para manejar múltiples promesas concurrentemente.

console.log("\n--- Métodos Estáticos de Promise ---");

const promesaExitosa = Promise.resolve("Éxito!");
const promesaFallida = Promise.reject("Fallo!");
const promesaConRetraso = new Promise((resolve) =>
  setTimeout(() => resolve("Retrasado"), 100)
);

// `Promise.all(iterableDePromesas)`: Espera a que TODAS las promesas se cumplan.
// Si UNA sola falla, `Promise.all` se rechaza con el error de la primera que falla.
Promise.all([promesaExitosa, promesaConRetraso])
  .then((resultados) => {
    console.log("  [Promise.all Éxito]: Todos resueltos:", resultados); // Salida: ["Éxito!", "Retrasado"]
  })
  .catch((error) => {
    console.error("  [Promise.all Fallo]: Alguna falló:", error);
  });

Promise.all([promesaExitosa, promesaFallida, promesaConRetraso])
  .then((resultados) => {
    console.log("  [Promise.all Éxito]: Todos resueltos:", resultados);
  })
  .catch((error) => {
    console.error("  [Promise.all Fallo]: Alguna falló:", error); // Salida: "Fallo!" (promesaFallida)
  });

// `Promise.race(iterableDePromesas)`: Devuelve una promesa que se cumple o rechaza tan pronto
// como una de las promesas en el iterable se cumple o rechaza.
Promise.race([promesaConRetraso, promesaFallida])
  .then((resultado) => {
    console.log(
      "  [Promise.race]: La primera en resolverse/rechazarse:",
      resultado
    ); // Salida: "Retrasado"
  })
  .catch((error) => {
    console.error(
      "  [Promise.race Fallo]: La primera en resolverse/rechazarse fue un error:",
      error
    );
  });

// `Promise.allSettled(iterableDePromesas)`: (ES2020) Espera a que TODAS las promesas se "asienten"
// (cumplan o rechacen) y devuelve un array de objetos que describen el resultado de cada promesa.
Promise.allSettled([promesaExitosa, promesaFallida, promesaConRetraso]).then(
  (resultados) => {
    console.log("  [Promise.allSettled]: Todos asentados:", resultados);
    // Salida: [
    //   { status: "fulfilled", value: "Éxito!" },
    //   { status: "rejected", reason: "Fallo!" },
    //   { status: "fulfilled", value: "Retrasado" }
    // ]
  }
);

// `Promise.any(iterableDePromesas)`: (ES2021) Devuelve una promesa que se cumple tan pronto
// como una de las promesas en el iterable se cumple. Si todas fallan, se rechaza con un AggregateError.
Promise.any([promesaFallida, promesaConRetraso])
  .then((resultado) => {
    console.log("  [Promise.any]: La primera en cumplirse:", resultado); // Salida: "Retrasado"
  })
  .catch((error) => {
    console.error("  [Promise.any Fallo]: Todas las promesas fallaron:", error);
  });

console.log(
  "\nFin de la ejecución del script principal. Las promesas se resolverán asíncronamente."
);
