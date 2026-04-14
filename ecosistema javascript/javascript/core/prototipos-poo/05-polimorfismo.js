console.log("\n--- 5. Polimorfismo ---");

// --- Sobrescritura (Overriding) ---
// Ya lo vimos con el ejemplo de `Animal` y `Perro`. El método `emitirSonido()`
// se comporta diferente en la subclase `Perro` que en la superclase `Animal`.

console.log("\n--- Sobrescritura (Overriding) ---");
class Gato extends Animal {
  // Animal ya definido arriba
  constructor(nombre) {
    super(nombre);
  }
  emitirSonido() {
    // Sobreescribe el método de Animal
    console.log(`${this.nombre} maúlla: ¡Miau!`);
  }
}

const miGato = new Gato("Pelusa");
miGato.emitirSonido(); // Salida: Pelusa maúlla: ¡Miau! (comportamiento específico de Gato)
miAnimal.emitirSonido(); // Salida: Un animal hace un sonido. (comportamiento de Animal)

// --- Simulación de Sobrecarga (Overloading) ---
// En JavaScript, no puedes tener dos funciones con el mismo nombre en la misma clase.
// En su lugar, se maneja la lógica dentro de una única función, a menudo verificando
// el número o tipo de argumentos.

console.log("\n--- Simulación de Sobrecarga (Overloading) ---");
class Calculadora {
  // Simulación de sobrecarga del método 'sumar'
  sumar(a, b) {
    if (b === undefined) {
      // Si solo se pasa un argumento, sumar a sí mismo (ejemplo simple)
      console.log(`Sumando un solo número: ${a + a}`);
      return a + a;
    } else if (typeof a === "number" && typeof b === "number") {
      console.log(`Sumando dos números: ${a + b}`);
      return a + b;
    } else if (typeof a === "string" && typeof b === "string") {
      console.log(`Concatenando dos strings: ${a + b}`);
      return a + b;
    } else {
      console.warn("Tipo de argumento no soportado para sumar.");
      return NaN;
    }
  }
}

const calc = new Calculadora();
calc.sumar(5, 3); // Salida: Sumando dos números: 8
calc.sumar("Hola ", "Mundo"); // Salida: Concatenando dos strings: Hola Mundo
calc.sumar(10); // Salida: Sumando un solo número: 20
calc.sumar(true, 5); // Salida: Tipo de argumento no soportado para sumar.
