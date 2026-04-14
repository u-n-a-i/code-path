// Clase
class Movie2 {
  /*
    readonly: Permite acceder a la propiedad desde cualquier lugar, pero impide modificar su valor una vez asignado.
    private: Restringe completamente el acceso a la propiedad, de modo que solo puede ser usada dentro de la misma clase.
  */

  // Constructor
  constructor(
    private title: string,
    private duration: number,
    readonly hasOscars: boolean
  ) {}

  // Getter y Setter
  getTitle(): string {
    return this.title;
  }

  setTitle(title: string) {
    this.title = title;
  }

  // Método
  toString(): string {
    return `
    Title: ${this.title}
    Duration: ${this.duration}
    Oscar: ${this.hasOscars ? "YES" : "NO"}
    `;
  }
}

const mov_1 = new Movie2("Memento", 120, false);
const mov_2 = new Movie2("El rey Leon", 90, true);

console.log(mov_1.toString());
console.log(mov_2.toString());

// mov1.title -> Propiedad privada
mov_1.setTitle("Leon el profesional");
console.log(mov_1.toString());
