import { IVehiculo } from "../interfaces/IVehiculo";
import { Vehiculo } from "./Vehiculo";

export class Coche extends Vehiculo implements IVehiculo {
  private encendido: boolean = false;

  constructor(marca: string, modelo: string) {
    super(marca, modelo);
  }

  encender(): void {
    this.encendido = true;
    console.log(`${this.getInfo()} está encendido.`);
  }

  apagar(): void {
    this.encendido = false;
    console.log(`${this.getInfo()} está apagado.`);
  }
}
