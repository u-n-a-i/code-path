console.log("\n--- 4. Herencia (Prototípica) y Composición ---");

// --- Herencia con `extends` (azúcar sintáctico) ---
class Animal {
  constructor(nombre) {
    this.nombre = nombre;
  }

  emitirSonido() {
    console.log(`${this.nombre} hace un sonido.`);
  }
}

class Perro extends Animal {
  // Perro hereda de Animal
  constructor(nombre, raza) {
    super(nombre); // Llama al constructor de la clase padre
    this.raza = raza;
  }

  emitirSonido() {
    // Sobreescribe el método del padre
    console.log(`${this.nombre} (${this.raza}) ladra: ¡Guau guau!`);
  }

  // Método específico de Perro
  buscarPelota() {
    console.log(`${this.nombre} está buscando la pelota.`);
  }
}

const miAnimal = new Animal("Un animal");
miAnimal.emitirSonido(); // Salida: Un animal hace un sonido.

const miPerro = new Perro("Max", "Labrador");
miPerro.emitirSonido(); // Salida: Max (Labrador) ladra: ¡Guau guau! (método sobrescrito)
miPerro.buscarPelota(); // Salida: Max está buscando la pelota.
console.log(
  "¿`miPerro` es una instancia de `Perro`?",
  miPerro instanceof Perro
); // true
console.log(
  "¿`miPerro` es una instancia de `Animal`?",
  miPerro instanceof Animal
); // true

// --- Composición vs. Herencia ---
// La composición favorece "tiene un" sobre "es un".
// En lugar de que un objeto herede de otro, un objeto contiene (usa) instancias de otros objetos.

console.log("\n--- Composición (Ejemplo: Capacidades) ---");

// Definimos capacidades/comportamientos como funciones o pequeños objetos
const puedeVolar = (ave) => ({
  volar: () => console.log(`${ave.nombre} está volando alto.`),
});

const puedeNadar = (pez) => ({
  nadar: () => console.log(`${pez.nombre} está nadando.`),
});

// Creamos un constructor o fábrica que "compone" estas capacidades
function crearPato(nombre) {
  const pato = { nombre };
  return { ...pato, ...puedeVolar(pato), ...puedeNadar(pato) }; // Mezcla propiedades
}

const patoDonald = crearPato("Pato Donald");
patoDonald.volar(); // Salida: Pato Donald está volando alto.
patoDonald.nadar(); // Salida: Pato Donald está nadando.

console.log(
  "La composición es más flexible para mezclar y combinar comportamientos."
);
