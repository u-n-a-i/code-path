import { Avion } from "./entidades/Avion";
import { Coche } from "./entidades/Coche";

const miCoche = new Coche("Toyota", "Corolla");
console.log(miCoche.getInfo());
miCoche.encender();
miCoche.apagar();

const miAvion = new Avion();
miAvion.encender();
miAvion.apagar();
