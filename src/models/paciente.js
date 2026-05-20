export class Paciente {
  #id
  #usuario
  #dni
  #nombre
  #obraSocial
  #plan
  #historialDeTurnos 
  constructor( id, usuario, dni, nombre, obraSocial, plan ) {
    this.#id = id;
    this.#usuario = usuario;
    this.#dni = dni;
    this.#nombre = nombre;
    this.#obraSocial = obraSocial; // es necesario que los pacientes tengan obra social? puede atender a particulares?
    this.#plan = plan; // cada obraSocial tiene un plan?
    this.#historialDeTurnos = []; // historial de turnos del paciente
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

  get historialDeTurnos() {
    return this.#historialDeTurnos;
  }

  guardarTurnoEnHistorial(turno){
    this.#historialDeTurnos.push(turno);
    console.log("Se guardó el turno " + turno.id + " en el historial del paciente " + this.nombre + ": " + this.#historialDeTurnos.length);
  }

  solicitarCambioDeFechaTurno(turno, nuevaFechaHora, medico){
    medico.recibirSolicitud(turno, nuevaFechaHora);
  }

}