import { Sede } from './sede.js'
import { DisponibilidadHoraria } from './disponibilidadHoraria.js'
import { Especialidad } from './Especialidad.js'
import { Practica } from './Practica.js'

export class Medico {
  #id
  #usuario
  #matricula
  #nombre
  #especialidades
  #practicas
  #sedes
  #disponibilidades
  #solicitudesDeCambioDeFecha

  constructor(
    usuarioMedico,
    matriculaMedica,
    nombreMedico,
    especialidadesMedico,
    practicasMedico,
    sedesMedico,
    disponibilidadesMedico
  ) {
    this.#usuario = usuarioMedico
    this.#matricula = matriculaMedica
    this.#nombre = nombreMedico
    this.#especialidades = especialidadesMedico
    this.#practicas = practicasMedico
    this.#sedes = sedesMedico
    this.#disponibilidades =  disponibilidadesMedico ?? []
    this.#solicitudesDeCambioDeFecha = []
  }

  getId() {
    return this.#id
  }
  setId(id){
      this.#id = id;
  }

  getUsuario() {
    return this.#usuario
  }

  getMatricula() {
    return this.#matricula
  }

  getNombre() {
    return this.#nombre
  }

  getEspecialidades() {
    return this.#especialidades
  }

  getPracticas() {
    return this.#practicas
  }

  getSedes() {
    return this.#sedes
  }

  getDisponibilidades() {
    return this.#disponibilidades
  }

  definirDisponibilidad(disponibilidad){
    this.disponibilidades.push(disponibilidad)
  }

  modificarDisponibilidad(idDisponibilidad, nuevaDisponibilidad){
    this.disponibilidades[idDisponibilidad] = nuevaDisponibilidad
  }
  tieneTipoTurno(tipoTurno){
    if (tipoTurno instanceof Especialidad) {
      return this.#especialidades.some(
        (especialidadMedico) => especialidadMedico.id === tipoTurno.id
      )
    }
    if (tipoTurno instanceof Practica) {
      return this.#practicas.some((practicaMedico) => practicaMedico.id === tipoTurno.id)
    }
  }

  recibirSolicitud(turno, nuevaFechaHora){
    this.#solicitudesDeCambioDeFecha.push({ turno, nuevaFechaHora })
  }

  aceptarCambioDeFecha(turno){
    const solicitud = this.#solicitudesDeCambioDeFecha.find(
      (solicitud) => solicitud.turno === turno
    )

    if (!solicitud) {
      throw new Error('Solicitud no encontrada')
    }
    turno.cambiarFechaHora(solicitud.nuevaFechaHora)

    this.#solicitudesDeCambioDeFecha = this.#solicitudesDeCambioDeFecha.filter(
      (solicitud) => solicitud.turno !== turno
    )
  }

  rechazarCambioDeFecha(turno){
    this.#solicitudesDeCambioDeFecha = this.#solicitudesDeCambioDeFecha.filter(
      (solicitud) => solicitud.turno !== turno
    )
  }

  toJSON(){
    return {
      id: this.#id,
      usuario: this.#usuario,
      matricula: this.#matricula,
      nombre: this.#nombre,
      especialidades: this.#especialidades,
      practicas: this.#practicas,
      sedes: this.#sedes,
      disponibilidades: this.#disponibilidades
    }
  }
}
