export class Vehiculo {
  protected marca: string;
  protected modelo: string;

  constructor(marca: string, modelo: string) {
    this.marca = marca;
    this.modelo = modelo;
  }

  getInfo(): string {
    return `${this.marca} ${this.modelo}`;
  }
}
