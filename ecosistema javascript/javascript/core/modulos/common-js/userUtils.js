// userUtils.js

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  getInfo() {
    return `User: ${this.name}, Email: ${this.email}`;
  }
}

// Exportación por defecto (la única forma de exportar un único "cosa" principal)
// En CommonJS, esto es lo que se obtendrá cuando hagas require('./userUtils.js')
module.exports = User;

// Si quisieras exportar otra cosa además de la clase, tendrías que añadirla a 'exports'
// exports.utilityFunction = () => console.log("Some utility."); // Esto sí se podría requerir como .utilityFunction

console.log("CommonJS module 'userUtils.js' loaded.");
