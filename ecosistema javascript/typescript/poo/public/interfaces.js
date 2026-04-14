"use strict";
// Interfaces
const escritor1 = {
    name: "Stephen King",
    age: 77,
    data: "¡Un maestro del terror con décadas de historias escalofriantes!",
};
console.log();
class Libro {
    constructor(title, pag) {
        this.title = title;
        this.pag = pag;
        this.extension = "pdf";
        this.escritor = escritor1;
    }
    toString() {
        return `
    Title: ${this.title}
    Pag: ${this.pag}
    Escritor: ${this.escritor.name}
    `;
    }
    getPag() {
        return this.pag;
    }
    download() {
        return "Descargando: " + this.title + "." + this.extension;
    }
}
const libro = new Libro("Billy Summer", 470);
console.log(libro.download());
console.log(libro.toString());
