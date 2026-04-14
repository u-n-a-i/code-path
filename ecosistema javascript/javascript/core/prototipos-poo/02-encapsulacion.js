console.log("\n--- 2. Encapsulación (Métodos de Acceso) ---");

class CuentaBancaria {
  #saldo; // Campo privado (solo accesible desde dentro de la clase)

  constructor(saldoInicial) {
    if (saldoInicial < 0) {
      throw new Error("El saldo inicial no puede ser negativo.");
    }
    this.#saldo = saldoInicial;
  }

  // Método público para depositar (modificador)
  depositar(cantidad) {
    if (cantidad <= 0) {
      console.warn("No se puede depositar una cantidad no positiva.");
      return;
    }
    this.#saldo += cantidad;
    console.log(
      `Depósito de ${cantidad} realizado. Nuevo saldo: ${this.#saldo}`
    );
  }

  // Método público para retirar (modificador)
  retirar(cantidad) {
    if (cantidad <= 0) {
      console.warn("No se puede retirar una cantidad no positiva.");
      return;
    }
    if (cantidad > this.#saldo) {
      console.warn("Fondos insuficientes.");
      return;
    }
    this.#saldo -= cantidad;
    console.log(`Retiro de ${cantidad} realizado. Nuevo saldo: ${this.#saldo}`);
  }

  // Método público para consultar saldo (accesor)
  get obtenerSaldo() {
    return this.#saldo;
  }

  // Método privado (ejemplo, aunque los métodos privados son menos comunes sin un caso de uso claro)
  // #validarOperacion(cantidad) {
  //   return cantidad > 0;
  // }
}

const miCuenta = new CuentaBancaria(100);

// Acceso controlado al saldo a través de métodos públicos
console.log("Saldo actual:", miCuenta.obtenerSaldo); // Accesor (getter)
miCuenta.depositar(50);
miCuenta.retirar(20);
miCuenta.retirar(200); // Intento de retiro con fondos insuficientes
console.log("Saldo final:", miCuenta.obtenerSaldo);

// console.log(miCuenta.#saldo); // Error: Private field '#saldo' must be declared in an enclosing class
// Esto demuestra que el atributo `#saldo` está verdaderamente encapsulado.
