import { Especialidad } from './Especialidad.js'
import { Practica } from './Practica.js'

export class Medico {
  id
  usuario
  matricula
  nombre
  especialidades
  practicas
  sedes
  disponibilidades

  constructor(
    usuarioMedico,
    matriculaMedica,
    nombreMedico,
    serviciosMedico,
    sedesMedico,
    disponibilidadesMedico
  ) {
    this.usuario = usuarioMedico
    this.matricula = matriculaMedica
    this.nombre = nombreMedico
    this.sedes = sedesMedico
    this.disponibilidades = disponibilidadesMedico ?? []
    this.especialidades = []
    this.practicas = []
  }

  getId() {
    return this.id
  }
  setId(id) {
    this.id = id
  }

  getUsuario() {
    return this.usuario
  }

  getMatricula() {
    return this.matricula
  }

  getNombre() {
    return this.nombre
  }

  getEspecialidades() {
    return this.especialidades
  }

  getPracticas() {
    return this.practicas
  }

  getSedes() {
    return this.sedes
  }

  getDisponibilidades() {
    return this.disponibilidades
  }

  tieneServicio(tipoServicio) {
    return (
      this.getEspecialidades().some((servicio) => servicio.especialidad?.nombre === tipoServicio) ||
      this.getPracticas().some((servicio) => servicio.practica?.nombre === tipoServicio)
    )
  }

  definirDisponibilidad(disponibilidad) {
    //disponibilidad es un objeto de tipo DisponibilidadHoraria
    this.disponibilidades.push(disponibilidad)
  }

  modificarDisponibilidad(idDisponibilidad, nuevaDisponibilidad) {
    this.disponibilidades[idDisponibilidad] = nuevaDisponibilidad
  }
  tieneTipoTurno(tipoTurno) {
    if (tipoTurno instanceof Especialidad) {
      return this.getEspecialidades().some((servicio) => servicio.especialidad?.id === tipoTurno.id)
    }
    if (tipoTurno instanceof Practica) {
      return this.getPracticas().some((servicio) => servicio.practica?.id === tipoTurno.id)
    }
  }

  recibirSolicitud(turno, nuevaFechaHora) {
    this.solicitudesDeCambioDeFecha.push({ turno, nuevaFechaHora })
  }

  agregarDisponibilidad(disponibilidad) {
    this.disponibilidades.push(disponibilidad)
  }

  obtenerDisponibilidadPorId(idDisponibilidad) {
    return this.disponibilidades[idDisponibilidad]
  }

  darDeAltaPractica(practica) {
    this.practicas = this.darDeAlta(practica, this.practicas)
  }

  darDeAltaEspecialidad(especialidad) {
    this.especialidades = this.darDeAlta(especialidad, this.especialidades)
  }

  darDeBajaPractica(idPractica, idDisponibilidad) {
    this.eliminarDisponibilidadPorId(idDisponibilidad)
    this.practicas = this.darDeBaja(idPractica, this.practicas)
  }
  darDeBajaEspecialidad(idEspecialidad, idDisponibilidad) {
    this.eliminarDisponibilidadPorId(idDisponibilidad)
    this.especialidades = this.darDeBaja(idEspecialidad, this.especialidades)
  }

  darDeBaja(idServicio, listaServicios) {
    console.log('idServicio a dar de baja:', idServicio)
    console.log('lista', listaServicios)
    return listaServicios.filter((s) => s.toString() !== idServicio.toString())
  }

  eliminarDisponibilidadPorId(idDisponibilidad) {
    if (!idDisponibilidad) return
    this.disponibilidades = this.disponibilidades.filter(
      (d) => d._id.toString() !== idDisponibilidad.toString()
    )
  }

  servicioExiste(servicio, listaServicios) {
    return listaServicios.some((p) => {
      if (p.id != null && servicio.id != null) {
        return p.id === servicio.id
      }
      return p.nombre === servicio.nombre
    })
  }

  darDeAlta(servicio, listaServicio = []) {
    const lista = Array.isArray(listaServicio) ? listaServicio : []

    if (this.servicioExiste(servicio, lista)) {
      throw new Error('El servicio ya está dado de alta')
    }

    lista.push(servicio)
    return lista
  }
}
