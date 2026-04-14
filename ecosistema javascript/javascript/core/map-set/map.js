console.log("--- Map y WeakMap en JavaScript ---");

// --- 1. Objeto `Map` ---
// Un `Map` es una colección de pares clave-valor donde puedes usar cualquier tipo de dato
// (objetos, funciones, números, etc.) como clave, no solo strings.
// Mantiene el orden de inserción de los elementos.

console.log("\n--- Usando `Map` ---");

// Creación de un Map
const miMapa = new Map();

// `set(clave, valor)`: Añade un par clave-valor al Map.
miMapa.set("nombre", "Alice");
miMapa.set(1, "un número");
miMapa.set(true, "un booleano");

const objComoClave = { id: 1 };
miMapa.set(objComoClave, "un objeto como clave"); // Usando un objeto como clave

const arrComoClave = [1, 2];
miMapa.set(arrComoClave, "un array como clave"); // Usando un array como clave

console.log("Mapa después de añadir elementos:", miMapa);

// `get(clave)`: Obtiene el valor asociado a una clave.
console.log("Valor de 'nombre':", miMapa.get("nombre")); // Salida: Alice
console.log("Valor de 1:", miMapa.get(1)); // Salida: un número
console.log("Valor de objComoClave:", miMapa.get(objComoClave)); // Salida: un objeto como clave
console.log("Valor de una clave no existente:", miMapa.get("inexistente")); // Salida: undefined

// `has(clave)`: Comprueba si una clave existe en el Map.
console.log("¿El mapa tiene la clave 'nombre'?:", miMapa.has("nombre")); // Salida: true
console.log("¿El mapa tiene la clave 'otra'?:", miMapa.has("otra")); // Salida: false
// Importante: para objetos/arrays como claves, la referencia debe ser la misma
console.log(
  "¿El mapa tiene un nuevo objeto {} como clave?:",
  miMapa.has({ id: 1 })
); // Salida: false (es un objeto diferente)
console.log("¿El mapa tiene objComoClave original?:", miMapa.has(objComoClave)); // Salida: true

// `delete(clave)`: Elimina un par clave-valor por su clave.
miMapa.delete("nombre");
console.log("Mapa después de eliminar 'nombre':", miMapa);
console.log(
  "¿El mapa tiene 'nombre' después de eliminar?:",
  miMapa.has("nombre")
); // Salida: false

// `size`: Propiedad que devuelve el número de pares clave-valor.
console.log("Tamaño del mapa:", miMapa.size); // Salida: (depende de cuántos quedan)

// `clear()`: Elimina todos los pares clave-valor del Map.
// miMapa.clear();
// console.log("Mapa después de clear():", miMapa); // Salida: Map(0) {}

// Iteración de un Map (mantiene el orden de inserción)
console.log("\n--- Iterando `Map` ---");
console.log("Claves (miMapa.keys()):");
for (const clave of miMapa.keys()) {
  console.log(`  ${clave}`);
}

console.log("Valores (miMapa.values()):");
for (const valor of miMapa.values()) {
  console.log(`  ${valor}`);
}

console.log("Pares clave-valor (miMapa.entries() o directamente `for...of`):");
for (const [clave, valor] of miMapa.entries()) {
  // Desestructuración
  console.log(`  Clave: ${clave}, Valor: ${valor}`);
}
// También se puede hacer directamente:
// for (const [clave, valor] of miMapa) {
//   console.log(`  Clave: ${clave}, Valor: ${valor}`);
// }

miMapa.forEach((valor, clave) => {
  // forEach tiene los argumentos (valor, clave, mapa)
  console.log(`  forEach - Clave: ${clave}, Valor: ${valor}`);
});

// --- 2. Objeto `WeakMap` ---
// Un `WeakMap` es similar a un `Map`, pero con dos diferencias CRÍTICAS:
// 1. Solo acepta OBJETOS como claves (no primitivos como strings, números, etc.).
// 2. Sus claves son de "referencia débil". Esto significa que si no hay otras referencias
//    a un objeto que es clave en un `WeakMap`, ese objeto y su entrada en el `WeakMap`
//    pueden ser recolectados por el recolector de basura (garbage collector).
//    Esto lo hace útil para datos auxiliares que no deben evitar que un objeto sea liberado.
// 3. No es iterable (`size`, `clear`, `keys`, `values`, `entries` no están disponibles).

console.log("\n--- Usando `WeakMap` ---");

const miWeakMap = new WeakMap();

let user1 = { id: 101, nombre: "Charlie" };
let user2 = { id: 102, nombre: "Diana" };

// `set(objetoClave, valor)`: Añade un par clave-valor.
miWeakMap.set(user1, { ultimaSesion: new Date() });
miWeakMap.set(user2, { permisos: ["editor"] });

console.log("WeakMap creado con claves de objeto.");

// `get(objetoClave)`: Obtiene el valor asociado a la clave.
console.log("Datos de user1:", miWeakMap.get(user1));
console.log("Datos de user2:", miWeakMap.get(user2));

// `has(objetoClave)`: Comprueba si existe la clave.
console.log("¿WeakMap tiene user1?:", miWeakMap.has(user1)); // Salida: true

// `delete(objetoClave)`: Elimina la entrada.
miWeakMap.delete(user1);
console.log("¿WeakMap tiene user1 después de eliminar?:", miWeakMap.has(user1)); // Salida: false

// Demostración de la "referencia débil" (difícil de ver en un script simple)
// Si `user2 = null;` se ejecuta, la referencia a `{ id: 102, nombre: 'Diana' }` se perdería.
// El garbage collector eventualmente liberaría ese objeto y su entrada asociada en `miWeakMap`.
// No podemos verificarlo directamente, ya que WeakMap no es iterable ni tiene `size`.
// console.log("Si user2 se pierde, su entrada en WeakMap se eliminará automáticamente.");

// miWeakMap.set('string', 'esto falla'); // TypeError: Invalid value used as weak map key (solo objetos)

// --- Comparación y Casos de Uso ---
console.log("\n--- Comparación y Casos de Uso ---");

// Uso típico de `Map`:
console.log("\n--- Caso de uso de Map: Contar frecuencias ---");
const palabras = ["manzana", "pera", "manzana", "naranja", "pera", "manzana"];
const frecuencias = new Map();
for (const palabra of palabras) {
  frecuencias.set(palabra, (frecuencias.get(palabra) || 0) + 1);
}
console.log("Frecuencia de palabras:", frecuencias); // Salida: Map(3) {"manzana" => 3, "pera" => 2, "naranja" => 1}

// Uso típico de `WeakMap`: Almacenar datos privados o auxiliares para objetos DOM/clases.
// Imagina que tienes muchos elementos DOM y quieres asociarles datos sin evitar que se eliminen del DOM.
console.log(
  "\n--- Caso de uso de WeakMap: Datos auxiliares para elementos DOM ---"
);
// let elementoDOM = document.getElementById('miElemento'); // En un navegador
// if (elementoDOM) {
//   miWeakMap.set(elementoDOM, { cache: {}, eventoActivo: true });
// }
// Cuando `elementoDOM` se elimina del DOM y no hay otras referencias, la entrada en `miWeakMap` también se libera.
console.log(
  "WeakMap es ideal para asociar datos a objetos sin crear referencias fuertes que impidan la recolección de basura."
);
