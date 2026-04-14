import { IVehiculo } from "../interfaces/IVehiculo";

export class Avion implements IVehiculo {
  private encendido: boolean = false;

  encender(): void {
    this.encendido = true;
    console.log("✈️ El avión está encendido y listo para despegar.");
  }

  apagar(): void {
    this.encendido = false;
    console.log("✈️ El avión ha apagado sus motores.");
  }
}
