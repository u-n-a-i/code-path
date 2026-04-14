console.log("--- Objetos en JavaScript ---");

// --- 1. Creación de Objetos (Literales de Objeto) ---
// La forma más común de crear un objeto es usando la sintaxis de literal de objeto `{}`.
const usuario = {
  // Propiedades: pares clave-valor
  nombre: "Alice", // clave: "nombre", valor: "Alice" (string)
  edad: 30, // clave: "edad", valor: 30 (number)
  activo: true, // clave: "activo", valor: true (boolean)
  intereses: ["programación", "lectura"], // clave: "intereses", valor: un array
  direccion: {
    // clave: "direccion", valor: otro objeto (objeto anidado)
    calle: "Calle Falsa 123",
    ciudad: "Springfield",
  },

  // Métodos: propiedades cuyo valor es una función
  saludar: function () {
    // Método tradicional (Function Expression)
    console.log(`Hola, soy ${this.nombre} y tengo ${this.edad} años.`);
  },

  despedir: () => {
    // Método usando función flecha (¡cuidado con 'this' aquí!)
    console.log(`Adiós desde ${usuario.nombre}.`); // Usamos 'usuario.nombre' para evitar problemas con 'this' en flecha
  },

  cumplirAnios() {
    // Sintaxis abreviada de método (ES6+)
    this.edad++;
    console.log(`${this.nombre} ha cumplido ${this.edad} años.`);
  },
};

console.log("\n--- Objeto Creado (Literal) ---");
console.log("Objeto usuario:", usuario);

// --- 2. Acceso a Propiedades y Llamada a Métodos ---
console.log("\n--- Acceso a Propiedades y Métodos ---");

// Notación de punto (preferida para nombres de propiedades válidos)
console.log("Nombre del usuario:", usuario.nombre);
console.log("Edad del usuario:", usuario.edad);
console.log("Ciudad del usuario:", usuario.direccion.ciudad);

// Notación de corchetes (útil para nombres con espacios, o si la clave es una variable)
console.log("Intereses del usuario (primer interés):", usuario["intereses"][0]);
let claveDinamica = "activo";
console.log("Estado activo (usando variable):", usuario[claveDinamica]);

// Llamada a Métodos
usuario.saludar();
usuario.cumplirAnios();
usuario.despedir(); // La salida de 'despedir' es "Adiós desde Alice."

// --- 3. Métodos Predefinidos de Objetos (`Object.keys`, `Object.values`, `Object.entries`) ---
console.log("\n--- Métodos Predefinidos de Objetos ---");

console.log("Claves del objeto (Object.keys):", Object.keys(usuario)); // Devuelve un array de las claves
console.log("Valores del objeto (Object.values):", Object.values(usuario)); // Devuelve un array de los valores
console.log("Pares clave-valor (Object.entries):", Object.entries(usuario)); // Devuelve un array de arrays [clave, valor]

// Otros métodos útiles: `Object.assign()`, `Object.freeze()`, `Object.seal()`, etc.
const otroObjeto = { telefono: "555-1234" };
Object.assign(usuario, otroObjeto); // Copia propiedades de otroObjeto a usuario
console.log("Usuario con teléfono (Object.assign):", usuario.telefono);

// --- 4. Iterar Objetos ---
console.log("\n--- Iterar Objetos ---");

console.log("Iterando con `for...in` (para claves):");
for (const clave in usuario) {
  // `hasOwnProperty` es importante para evitar propiedades heredadas del prototipo
  if (usuario.hasOwnProperty(clave)) {
    console.log(`  ${clave}: ${usuario[clave]}`);
  }
}

console.log("Iterando con `Object.keys().forEach` (moderno y recomendado):");
Object.keys(usuario).forEach((clave) => {
  console.log(`  ${clave}: ${usuario[clave]}`);
});

console.log(
  "Iterando con `Object.entries().forEach` (para clave y valor juntos):"
);
Object.entries(usuario).forEach(([clave, valor]) => {
  // Desestructuración de array
  console.log(`  ${clave}: ${valor}`);
});

// --- 5. Prototipos y Herencia (Básica) ---
// Los objetos en JavaScript heredan propiedades y métodos de sus prototipos.
// `__proto__` (obsoleto, pero útil para entender) o `Object.getPrototypeOf()`
// `Object.create()` permite crear un objeto con un prototipo específico.

console.log("\n--- Prototipos y Herencia ---");

const prototipoPersona = {
  saludarPrototipo() {
    console.log(`¡Hola desde el prototipo! Soy ${this.nombre}.`);
  },
};

const nuevaPersona = Object.create(prototipoPersona); // `nuevaPersona` hereda de `prototipoPersona`
nuevaPersona.nombre = "Bob";
nuevaPersona.edad = 22;

console.log("Nueva persona (nombre):", nuevaPersona.nombre);
nuevaPersona.saludarPrototipo(); // Llama al método heredado del prototipo

console.log(
  "¿El método viene del prototipo?",
  nuevaPersona.hasOwnProperty("saludarPrototipo")
); // Salida: false
console.log(
  "¿El prototipo de nuevaPersona es prototipoPersona?",
  Object.getPrototypeOf(nuevaPersona) === prototipoPersona
); // Salida: true

// --- 6. Mutabilidad de Objetos ---
// Los objetos son tipos de datos "por referencia". Cuando asignas un objeto a una nueva variable,
// ambas variables apuntan al mismo objeto en memoria.
console.log("\n--- Mutabilidad de Objetos ---");

const coche1 = { marca: "Toyota", modelo: "Corolla" };
const coche2 = coche1; // coche2 ahora apunta al mismo objeto que coche1

coche2.modelo = "Camry"; // Cambiando el modelo a través de coche2
console.log("Coche 1 después del cambio:", coche1.modelo); // Salida: Camry (¡coche1 también se ve afectado!)

// Para copiar un objeto sin mutarlo (copia superficial):
const coche3 = { ...coche1 }; // Spread syntax (ES6+) crea una nueva copia superficial
coche3.marca = "Honda";
console.log("Coche 1 original (marca):", coche1.marca); // Salida: Toyota (no se afectó)
console.log("Coche 3 modificado (marca):", coche3.marca); // Salida: Honda

// --- 7. `this`, `call()`, `apply()`, `bind()` ---
// `this`: Se refiere al "contexto" de ejecución actual. Su valor depende de cómo se llama la función.
// `call()`, `apply()`, `bind()`: Métodos para controlar explícitamente el valor de `this` y pasar argumentos.

console.log("\n--- `this`, `call()`, `apply()`, `bind()` ---");

const personaContexto = {
  nombre: "Juan",
  saludarConThis: function () {
    console.log(`Hola, mi nombre es ${this.nombre}.`);
  },
  // Las funciones flecha no tienen su propio 'this'; heredan el 'this' del ámbito léxico padre.
  saludarConFlecha: () => {
    // Si 'this' se usa aquí, sería el 'this' del ámbito global (window en navegador, o undefined en strict mode)
    // No el 'this' del objeto personaContexto. Por eso es importante entender su comportamiento.
    console.log(
      `Hola (flecha), mi nombre es ${personaContexto.nombre}. (evitando 'this' en flecha)`
    );
  },
};

personaContexto.saludarConThis(); // 'this' es `personaContexto`
personaContexto.saludarConFlecha(); // 'this' de la flecha es el ámbito superior, no el objeto.

// --- `call()`: Llama a una función con un `this` dado y argumentos pasados individualmente.
const otraPersona = { nombre: "María" };
personaContexto.saludarConThis.call(otraPersona); // 'this' dentro de saludarConThis será `otraPersona`

function presentar(ciudad, profesion) {
  console.log(
    `Mi nombre es ${this.nombre}, vivo en ${ciudad} y soy ${profesion}.`
  );
}
presentar.call(otraPersona, "Barcelona", "Diseñadora"); // `this` es otraPersona, argumentos individuales

// --- `apply()`: Similar a `call()`, pero los argumentos se pasan como un array.
presentar.apply(otraPersona, ["Valencia", "Ingeniera"]); // `this` es otraPersona, argumentos en un array

// --- `bind()`: Devuelve una NUEVA función con el `this` fijado (bindeado) y/o argumentos predefinidos.
const saludarDeJuan = personaContexto.saludarConThis.bind(personaContexto);
saludarDeJuan(); // Ahora, 'saludarDeJuan' siempre tendrá `this` apuntando a `personaContexto`

const presentarEnMadridDeveloper = presentar.bind(
  otraPersona,
  "Madrid",
  "Desarrolladora"
);
presentarEnMadridDeveloper(); // Llama a la función ya con `this` y los primeros argumentos fijados
