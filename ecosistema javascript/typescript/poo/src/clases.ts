// Clase
class Movie {
  private title: string;
  private duration: number;
  readonly hasOscars: boolean;
  /*
    readonly: Permite acceder a la propiedad desde cualquier lugar, pero impide modificar su valor una vez asignado.
    private: Restringe completamente el acceso a la propiedad, de modo que solo puede ser usada dentro de la misma clase.
  */

  // Constructor
  constructor(title: string, duration: number, hasOscars: boolean) {
    this.title = title;
    this.duration = duration;
    this.hasOscars = hasOscars;
  }

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

const mov1 = new Movie("Memento", 120, false);
const mov2 = new Movie("El rey Leon", 90, true);

console.log(mov1.toString());
console.log(mov2.toString());

// mov1.title -> Propiedad privada
mov1.setTitle("Leon el profesional");
console.log(mov1.toString());
