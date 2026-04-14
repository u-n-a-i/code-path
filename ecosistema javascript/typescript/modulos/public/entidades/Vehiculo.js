"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehiculo = void 0;
class Vehiculo {
    constructor(marca, modelo) {
        this.marca = marca;
        this.modelo = modelo;
    }
    getInfo() {
        return `${this.marca} ${this.modelo}`;
    }
}
exports.Vehiculo = Vehiculo;
