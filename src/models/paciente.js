export class Paciente {
  #id
  #usuario
  #dni
  #nombre
  #obraSocial
  #plan

  constructor( id, usuario, dni, nombre, obraSocial, plan ) {
    this.#id = id;   //si uduario ya tiene el ID, es necesario?
    this.#usuario = usuario;
    this.#dni = dni;
    this.#nombre = nombre;
    this.#obraSocial = obraSocial; // es necesario que los pacientes tengan obra social? puede atender a particulares?
    this.#plan = plan; // cada obraSocial tiene un plan?
  }

  get id() {
    return this.#id;
  }

  get usuario() {
    return this.#usuario;
  }

  get dni() {
    return this.#dni;
  }

  get nombre() {
    return this.#nombre;
  }

  get obraSocial() {
    return this.#obraSocial;
  }

  get plan() {
    return this.#plan;
  }
}