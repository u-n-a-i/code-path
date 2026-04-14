"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avion = void 0;
class Avion {
    constructor() {
        this.encendido = false;
    }
    encender() {
        this.encendido = true;
        console.log("✈️ El avión está encendido y listo para despegar.");
    }
    apagar() {
        this.encendido = false;
        console.log("✈️ El avión ha apagado sus motores.");
    }
}
exports.Avion = Avion;
