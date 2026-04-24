export class Paciente {
  #id
  #usuario
  #dni
  #nombre
  #obraSocial
  #plan

  constructor( id, usuario, dni, nombre, obraSocial, plan ) {
    this.#id = id;
    this.#usuario = usuario;
    this.#dni = dni;
    this.#nombre = nombre;
    this.#obraSocial = obraSocial; // es necesario que los pacientes tengan obra social? puede atender a particulares?
    this.#plan = plan; // cada obraSocial tiene un plan?
  }
}