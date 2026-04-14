console.log("\n--- 3. Abstracción (Simulación de Clases Abstractas) ---");

// Clase "abstracta" simulada
class Vehiculo {
  constructor(modelo) {
    this.modelo = modelo;
    // Forzamos que las clases hijas implementen 'arrancar' y 'detener'
    if (this.arrancar === undefined) {
      throw new TypeError(
        "La clase 'Vehiculo' es abstracta. Las clases hijas deben implementar el método 'arrancar()'."
      );
    }
    if (this.detener === undefined) {
      throw new TypeError(
        "La clase 'Vehiculo' es abstracta. Las clases hijas deben implementar el método 'detener()'."
      );
    }
  }

  mostrarModelo() {
    console.log(`Modelo: ${this.modelo}`);
  }
}

// Clase concreta que hereda de Vehiculo e implementa sus métodos
class Coche extends Vehiculo {
  constructor(modelo, color) {
    super(modelo); // Llama al constructor de la clase padre
    this.color = color;
  }

  arrancar() {
    console.log(`El coche ${this.modelo} (${this.color}) está arrancando.`);
  }

  detener() {
    console.log(`El coche ${this.modelo} (${this.color}) se ha detenido.`);
  }

  tocarBocina() {
    console.log("¡BEEP BEEP!");
  }
}

class Moto extends Vehiculo {
  constructor(modelo, cilindrada) {
    super(modelo);
    this.cilindrada = cilindrada;
  }

  arrancar() {
    console.log(
      `La moto ${this.modelo} (${this.cilindrada}cc) está rugiendo al arrancar.`
    );
  }

  detener() {
    console.log(`La moto ${this.modelo} se ha apagado.`);
  }
}

try {
  // const miVehiculoAbstracto = new Vehiculo("Genérico"); // Esto lanzaría un TypeError
} catch (e) {
  console.error(
    `Error al intentar instanciar una clase abstracta: ${e.message}`
  );
}

const miCoche = new Coche("Ford Focus", "rojo");
miCoche.mostrarModelo();
miCoche.arrancar();
miCoche.tocarBocina();
miCoche.detener();

const miMoto = new Moto("Yamaha MT-07", 700);
miMoto.mostrarModelo();
miMoto.arrancar();
miMoto.detener();
