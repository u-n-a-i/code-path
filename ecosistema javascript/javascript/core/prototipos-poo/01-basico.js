console.log("--- 1. Clase, Atributos, Constructor, Métodos ---");

// Definición de la clase (azúcar sintáctico para constructores prototípicos)
class Persona {
  // Atributos (propiedades)
  // Puedes declararlos directamente (ES2022+) o asignarlos en el constructor.
  // nombre;
  // edad;

  // Constructor: Método especial que se ejecuta cuando se crea una nueva instancia.
  constructor(nombre, edad) {
    this.nombre = nombre; // 'this' se refiere a la instancia que se está creando
    this.edad = edad;
    this.estaActivo = true; // Atributo con valor por defecto
  }

  // Métodos: Funciones que operan sobre los datos de la instancia.
  saludar() {
    console.log(`Hola, soy ${this.nombre} y tengo ${this.edad} años.`);
  }

  cumplirAnios() {
    this.edad++;
    console.log(`${this.nombre} ha cumplido ${this.edad} años.`);
  }

  // Getter (método de acceso a propiedad, se usa como propiedad)
  get estado() {
    return this.estaActivo ? "Activo" : "Inactivo";
  }

  // Setter (método para modificar propiedad, se usa como propiedad)
  set estado(nuevoEstado) {
    this.estaActivo = nuevoEstado === "Activo";
  }

  // Métodos estáticos: Pertenecen a la clase en sí, no a las instancias.
  static obtenerDescripcion() {
    console.log("Esta es la clase base para crear objetos de tipo Persona.");
  }
}

// Creación de instancias (objetos) de la clase
const persona1 = new Persona("Alicia", 25);
const persona2 = new Persona("Roberto", 40);

console.log("--- Instancias Creadas ---");
console.log("Persona 1:", persona1);
console.log("Persona 2:", persona2);

// Acceso a atributos
console.log("Nombre de Persona 1:", persona1.nombre);
console.log("Edad de Persona 2:", persona2.edad);

// Llamada a métodos
persona1.saludar(); // Salida: Hola, soy Alicia y tengo 25 años.
persona2.cumplirAnios(); // Salida: Roberto ha cumplido 41 años.
persona2.saludar(); // Salida: Hola, soy Roberto y tengo 41 años.

// Usando getters y setters
console.log("Estado de Persona 1:", persona1.estado); // Salida: Activo
persona1.estado = "Inactivo";
console.log("Nuevo estado de Persona 1:", persona1.estado); // Salida: Inactivo

// Llamada a método estático
Persona.obtenerDescripcion(); // Salida: Esta es la clase base para crear objetos de tipo Persona.
// persona1.obtenerDescripcion(); // Error: persona1.obtenerDescripcion is not a function (no pertenece a la instancia)
