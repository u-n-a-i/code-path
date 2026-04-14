console.log("--- Set y WeakSet en JavaScript ---");

// --- 1. Objeto `Set` ---
// Un `Set` es una colección de valores únicos. Cualquier tipo de dato puede ser almacenado
// en un Set (primitivos o referencias a objetos).
// No mantiene un orden de inserción garantizado en todas las implementaciones (aunque la mayoría lo hacen),
// pero lo principal es la unicidad.

console.log("\n--- Usando `Set` ---");

// Creación de un Set
const miSet = new Set();

// `add(valor)`: Añade un nuevo valor al Set. Si el valor ya existe, no hace nada.
miSet.add("Manzana");
miSet.add("Plátano");
miSet.add("Manzana"); // Este duplicado será ignorado
miSet.add(10);
miSet.add({ id: 1, nombre: "ObjetoA" });
miSet.add({ id: 1, nombre: "ObjetoA" }); // ¡Cuidado! Objetos son únicos por referencia, no por valor.

console.log("Set después de añadir elementos:", miSet); // Salida: Set(4) {"Manzana", "Plátano", 10, {…}, {…}}

// Si quieres añadir el mismo objeto por referencia
const objComun = { id: 2, nombre: "ObjetoB" };
miSet.add(objComun);
miSet.add(objComun); // Este sí será ignorado porque es la misma referencia
console.log("Set con objeto común:", miSet);

// `has(valor)`: Comprueba si un valor existe en el Set.
console.log("¿El Set tiene 'Plátano'?:", miSet.has("Plátano")); // Salida: true
console.log("¿El Set tiene 'Naranja'?:", miSet.has("Naranja")); // Salida: false
console.log("¿El Set tiene objComun?:", miSet.has(objComun)); // Salida: true
console.log(
  "¿El Set tiene un nuevo objeto {id:1}?:",
  miSet.has({ id: 1, nombre: "ObjetoA" })
); // Salida: false (diferente referencia)

// `delete(valor)`: Elimina un valor del Set.
miSet.delete("Plátano");
console.log("Set después de eliminar 'Plátano':", miSet);
console.log(
  "¿El Set tiene 'Plátano' después de eliminar?:",
  miSet.has("Plátano")
); // Salida: false

// `size`: Propiedad que devuelve el número de valores únicos en el Set.
console.log("Tamaño del Set:", miSet.size);

// `clear()`: Elimina todos los valores del Set.
// miSet.clear();
// console.log("Set después de clear():", miSet); // Salida: Set(0) {}

// Iteración de un Set (mantiene el orden de inserción en la mayoría de implementaciones)
console.log("\n--- Iterando `Set` ---");
console.log("Valores (miSet.values()):");
for (const valor of miSet.values()) {
  // `.values()` es lo mismo que iterar directamente el Set
  console.log(`  ${valor}`);
}

console.log("Iterando directamente con `for...of`:");
for (const item of miSet) {
  console.log(`  ${item}`);
}

miSet.forEach((valor) => {
  // forEach solo tiene el argumento (valor) para Sets
  console.log(`  forEach - Valor: ${valor}`);
});

// Convertir Set a Array
const arrayDesdeSet = Array.from(miSet);
console.log("Array desde Set:", arrayDesdeSet); // Salida: Array con elementos únicos del Set

// Eliminar duplicados de un array usando Set
const arrayConDuplicados = [1, 2, 2, 3, 4, 4, 5];
const arraySinDuplicados = [...new Set(arrayConDuplicados)];
console.log("Array sin duplicados:", arraySinDuplicados); // Salida: [1, 2, 3, 4, 5]

// --- 2. Objeto `WeakSet` ---
// Un `WeakSet` es similar a un `Set`, pero con dos diferencias CRÍTICAS:
// 1. Solo acepta OBJETOS como valores (no primitivos como strings, números, booleanos).
// 2. Sus valores son de "referencia débil". Esto significa que si no hay otras referencias
//    a un objeto que es un valor en un `WeakSet`, ese objeto y su entrada en el `WeakSet`
//    pueden ser recolectados por el recolector de basura (garbage collector).
//    Esto lo hace útil para "marcar" objetos sin evitar que sean liberados.
// 3. No es iterable (`size`, `clear`, `keys`, `values`, `entries`, `forEach` no están disponibles).

console.log("\n--- Usando `WeakSet` ---");

const miWeakSet = new WeakSet();

let obj1 = { estado: "activo" };
let obj2 = { estado: "inactivo" };

// `add(objeto)`: Añade un objeto al WeakSet.
miWeakSet.add(obj1);
miWeakSet.add(obj2);

console.log("WeakSet creado con objetos.");

// `has(objeto)`: Comprueba si un objeto existe en el WeakSet.
console.log("¿WeakSet tiene obj1?:", miWeakSet.has(obj1)); // Salida: true
console.log("¿WeakSet tiene un nuevo objeto {}?:", miWeakSet.has({})); // Salida: false (diferente referencia)

// `delete(objeto)`: Elimina un objeto del WeakSet.
miWeakSet.delete(obj1);
console.log("¿WeakSet tiene obj1 después de eliminar?:", miWeakSet.has(obj1)); // Salida: false

// Demostración de la "referencia débil" (difícil de observar directamente)
// Si `obj2 = null;` se ejecuta, la referencia a `{ estado: 'inactivo' }` se perdería.
// El garbage collector eventualmente liberaría ese objeto y su entrada asociada en `miWeakSet`.
// Como no es iterable, no podemos saber cuántos elementos hay o cuáles son.
// console.log("Si obj2 se pierde, su entrada en WeakSet se eliminará automáticamente.");

// miWeakSet.add('string'); // TypeError: Invalid value used in weak set (solo objetos)

// --- Comparación y Casos de Uso ---
console.log("\n--- Comparación y Casos de Uso ---");

// Uso típico de `Set`:
console.log("\n--- Caso de uso de Set: Registrar visitantes únicos ---");
const visitantesHoy = new Set();
visitantesHoy.add("usuario123");
visitantesHoy.add("ip.address.a");
visitantesHoy.add("usuario123"); // No se añade de nuevo
console.log("Visitantes únicos hoy:", visitantesHoy.size); // Salida: 2

// Uso típico de `WeakSet`: Marcar objetos activos o ya procesados sin impedir su recolección.
console.log("\n--- Caso de uso de WeakSet: Marcar objetos activos ---");
class GestionTareas {
  constructor() {
    this.tareasActivas = new WeakSet();
  }

  activarTarea(tareaObj) {
    this.tareasActivas.add(tareaObj);
    console.log(`Tarea ${tareaObj.id} activada.`);
  }

  esTareaActiva(tareaObj) {
    return this.tareasActivas.has(tareaObj);
  }
}

const gestor = new GestionTareas();
let tarea1 = { id: 1, descripcion: "Comprar pan" };
let tarea2 = { id: 2, descripcion: "Hacer ejercicio" };

gestor.activarTarea(tarea1);
console.log("¿Tarea 1 es activa?:", gestor.esTareaActiva(tarea1)); // true
console.log("¿Tarea 2 es activa?:", gestor.esTareaActiva(tarea2)); // false

// Si `tarea1 = null;` en algún punto, la entrada de `tarea1` en `tareasActivas`
// se liberaría automáticamente cuando el objeto sea recolectado.
console.log(
  "WeakSet es ideal para listas de 'presencia' de objetos que pueden desaparecer."
);
