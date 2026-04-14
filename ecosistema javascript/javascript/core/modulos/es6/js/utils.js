// js/utils.js

// Exportación por nombre
export class Saludar {
  constructor(nombre) {
    this.nombre = nombre;
  }
  saludarFormalmente() {
    return `Estimado/a ${this.nombre}, le envío un cordial saludo.`;
  }
}

// Exportación por defecto (solo una por archivo)
function generarMensajeAleatorio() {
  const mensajes = [
    "¡Hola, mundo!",
    "JavaScript es genial.",
    "Aprendiendo módulos ES6.",
    "La asincronía es clave.",
  ];
  const indice = Math.floor(Math.random() * mensajes.length);
  return mensajes[indice];
}

export default generarMensajeAleatorio;

console.log("Módulo 'utils.js' cargado.");
