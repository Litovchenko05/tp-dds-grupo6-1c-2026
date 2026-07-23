import { CoberturaEspecialidad } from './CoberturaEspecialidad.js'
import { CoberturaPractica } from './CoberturaPractica.js'
export class Plan {
  id
  nombre
  coberturasDeServicios //ahora usamos este


  constructor(nombre, coberturasDeServicios) {
    this.nombre = nombre
    this.coberturasDeServicios = coberturasDeServicios
  }

}
