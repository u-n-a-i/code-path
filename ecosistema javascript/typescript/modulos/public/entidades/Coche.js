"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coche = void 0;
const Vehiculo_1 = require("./Vehiculo");
class Coche extends Vehiculo_1.Vehiculo {
    constructor(marca, modelo) {
        super(marca, modelo);
        this.encendido = false;
    }
    encender() {
        this.encendido = true;
        console.log(`${this.getInfo()} está encendido.`);
    }
    apagar() {
        this.encendido = false;
        console.log(`${this.getInfo()} está apagado.`);
    }
}
exports.Coche = Coche;
