console.log("--- Async/Await en JavaScript ---");
console.log("Inicio del script.");

// --- 1. Funciones que devuelven Promises (la base de async/await) ---
// Normalmente, estas serían funciones que simulan llamadas a API, bases de datos, etc.

function simularLlamadaAPI(id) {
  console.log(`  [API]: Iniciando llamada API para ID ${id}...`);
  return new Promise((resolve, reject) => {
    const exito = Math.random() > 0.3; // 70% de éxito

    setTimeout(() => {
      if (exito) {
        resolve({ id: id, data: `Datos para ${id}` });
      } else {
        reject(`Error: No se pudieron obtener datos para ID ${id}`);
      }
    }, 1000); // Simula 1 segundo de latencia
  });
}

function procesarDatos(datos) {
  console.log(`  [Procesador]: Procesando: ${datos.data}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Datos procesados: ${datos.data.toUpperCase()}`);
    }, 500); // Simula 0.5 segundos de procesamiento
  });
}

// --- 2. Uso Básico de `async`/`await` ---
// Envuelve el código asíncrono en una función `async` para poder usar `await`.

console.log("\n--- Uso Básico de Async/Await ---");

async function obtenerYProcesarDatos(userId) {
  try {
    console.log(
      `  [Async Function]: Intentando obtener y procesar datos para el usuario ${userId}`
    );

    // `await` pausa la ejecución hasta que la promesa se resuelve.
    // El valor resuelto se asigna a `rawData`.
    const rawData = await simularLlamadaAPI(userId);
    console.log(`  [Async Function]: Datos recibidos: ${rawData.data}`);

    const processed = await procesarDatos(rawData);
    console.log(`  [Async Function]: Datos procesados: ${processed}`);

    return processed; // La función async devuelve este valor envuelto en una Promise.
  } catch (error) {
    // Si alguna de las Promises (`simularLlamadaAPI` o `procesarDatos`) se rechaza,
    // el control salta directamente a este bloque `catch`.
    console.error(`  [Async Function ERROR]: ${error}`);
    // Si una función async lanza un error, la Promise que devuelve se rechaza.
    throw error; // Re-lanzar el error para que sea capturado por el siguiente .catch si es necesario
  }
}

// Llamar a la función async y consumir su Promise resultante
obtenerYProcesarDatos(1)
  .then((resultado) =>
    console.log("  [Llamada Principal]: Operación exitosa:", resultado)
  )
  .catch((err) =>
    console.error("  [Llamada Principal]: Error en la operación:", err)
  );

// Este mensaje aparecerá antes que los resultados de la función async,
// demostrando que `async/await` no bloquea el hilo principal.
console.log(
  "  [Script Principal]: La función `obtenerYProcesarDatos` ha sido llamada."
);

// --- 3. Ejecución Concurrente con `Promise.all` en `async`/`await` ---
// Aunque `await` hace que el código parezca síncrono, no significa que debas ejecutar
// operaciones asíncronas en secuencia si pueden ejecutarse en paralelo.
// Usa `Promise.all` para esto.

console.log("\n--- Concurrencia con `Promise.all` en Async/Await ---");

async function obtenerMultiplesDatos(ids) {
  try {
    console.log(
      `  [Async Function]: Obteniendo datos para IDs: ${ids.join(
        ", "
      )} en paralelo...`
    );

    // `Promise.all` toma un array de promesas y espera a que todas se resuelvan.
    // Si una falla, `Promise.all` se rechaza.
    const resultados = await Promise.all(
      ids.map((id) => simularLlamadaAPI(id))
    );

    console.log(
      "  [Async Function]: Todos los datos obtenidos concurrentemente:",
      resultados
    );

    const datosProcesados = await Promise.all(
      resultados.map((data) => procesarDatos(data))
    );
    console.log(
      "  [Async Function]: Todos los datos procesados concurrentemente:",
      datosProcesados
    );

    return datosProcesados;
  } catch (error) {
    console.error(`  [Async Function ERROR - Promise.all]: ${error}`);
    throw error;
  }
}

obtenerMultiplesDatos([2, 3, 4])
  .then((res) =>
    console.log(
      "  [Llamada Principal]: Múltiples datos procesados exitosamente."
    )
  )
  .catch((err) =>
    console.error("  [Llamada Principal]: Error al procesar múltiples datos.")
  );

// --- 4. Diferencias con `.then()`/`.catch()` ---
// `async/await` es más legible, especialmente en secuencias anidadas o con manejo de errores.

console.log("\n--- Comparación: `async/await` vs. `.then()` ---");

// Equivalente con .then() chaining:
function obtenerYProcesarDatosThen(userId) {
  console.log(
    `  [`.then()`]: Intentando obtener y procesar datos para el usuario ${userId}`
  );
  return simularLlamadaAPI(userId)
    .then((rawData) => {
      console.log(`  [`.then()`]: Datos recibidos: ${rawData.data}`);
      return procesarDatos(rawData);
    })
    .then((processed) => {
      console.log(`  [`.then()`]: Datos procesados: ${processed}`);
      return processed;
    })
    .catch((error) => {
      console.error(`  [`.then()` ERROR]: ${error}`);
      throw error;
    });
}

obtenerYProcesarDatosThen(5)
  .then((resultado) =>
    console.log("  [Llamada Principal]: Operación exitosa (then):", resultado)
  )
  .catch((err) =>
    console.error("  [Llamada Principal]: Error en la operación (then):", err)
  );

// --- 5. `await` de valores no Promises ---
// `await` también funciona con valores que no son promesas, los convierte automáticamente.

console.log("\n--- `await` de valores no Promises ---");
async function ejemploAwaitNoPromise() {
  const valorDirecto = await 123; // Se resuelve inmediatamente
  console.log("  Valor directo:", valorDirecto);

  const valorCalculado = await (5 * 5);
  console.log("  Valor calculado:", valorCalculado);
}
ejemploAwaitNoPromise();

// --- 6. `await` a nivel superior (Top-level await) ---
// Desde ES2022, `await` puede usarse directamente en el cuerpo de un módulo JavaScript
// (archivos con `type: "module"` en `package.json` o importados con `<script type="module">`).
// Esto es muy útil para inicializaciones asíncronas en scripts.

/*
// Si este código estuviera en un archivo de módulo (ej. `myModule.mjs`):
// console.log("\n--- Top-level await (Solo en módulos ES) ---");
// try {
//   const config = await simularLlamadaAPI("config");
//   console.log("  Configuración cargada a nivel superior:", config);
// } catch (e) {
//   console.error("  Error al cargar configuración a nivel superior:", e);
// }
// console.log("  El resto del módulo se ejecutaría después de que la await termine.");
*/
console.log(
  "  [Top-level await]: Es una característica de ES2022 para módulos. No se ejecuta en este entorno de script simple."
);

console.log(
  "\nFin del script principal. Los resultados asíncronos aparecerán después."
);
