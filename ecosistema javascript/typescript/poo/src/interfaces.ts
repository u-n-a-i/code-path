// Interfaces

interface Escritor<T> {
  name: string;
  age: number;
  data?: T;
}

const escritor1: Escritor<string> = {
  name: "Stephen King",
  age: 77,
  data: "¡Un maestro del terror con décadas de historias escalofriantes!",
};

console.log();

// Implementar Interface
/*
Los atributos definidos en una interfaz son siempre públicos, estáticos y finales por defecto.
*/
interface IVersionPDF<T> {
  title: string;
  extension: string;
  download(): string;
  getPag(): number;
  escritor: Escritor<T>;
}

class Libro implements IVersionPDF<string> {
  readonly extension = "pdf";
  readonly escritor: Escritor<string> = escritor1;

  constructor(public title: string, private pag: number) {}

  toString(): string {
    return `
    Title: ${this.title}
    Pag: ${this.pag}
    Escritor: ${this.escritor.name}
    `;
  }

  getPag(): number {
    return this.pag;
  }

  download(): string {
    return "Descargando: " + this.title + "." + this.extension;
  }
}

const libro = new Libro("Billy Summer", 470);
console.log(libro.download());
console.log(libro.toString());
