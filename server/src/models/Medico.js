import { Sede } from './sede.js'
import { DisponibilidadHoraria } from './disponibilidadHoraria.js'
import { Especialidad } from './Especialidad.js'
import { Practica } from './Practica.js'

export class Medico {
  id
  usuario
  matricula
  nombre
  servicios
  sedes
  disponibilidades
  solicitudesDeCambioDeFecha

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
    this.servicios = serviciosMedico ?? []
    this.sedes = sedesMedico
    this.disponibilidades = disponibilidadesMedico ?? []
    this.solicitudesDeCambioDeFecha = []
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

  getServicios() {
    return this.servicios
  }

  getEspecialidades() {
    return this.servicios.filter((servicio) => servicio.especialidad != null)
  }

  getPracticas() {
    return this.servicios.filter((servicio) => servicio.practica != null)
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

  aceptarCambioDeFecha(turno) {
    const solicitud = this.solicitudesDeCambioDeFecha.find((solicitud) => solicitud.turno === turno)

    if (!solicitud) {
      throw new Error('Solicitud no encontrada')
    }
    turno.cambiarFechaHora(solicitud.nuevaFechaHora)

    this.solicitudesDeCambioDeFecha = this.solicitudesDeCambioDeFecha.filter(
      (solicitud) => solicitud.turno !== turno
    )
  }

  rechazarCambioDeFecha(turno) {
    this.solicitudesDeCambioDeFecha = this.solicitudesDeCambioDeFecha.filter(
      (solicitud) => solicitud.turno !== turno
    )
  }
  /*modificarServicio(servicioAModificar, nuevoServicio){

      if ("codigo" in nuevoServicio) {

   const index = this.practicas.findIndex(
     p => String(p._id) === String(servicioAModificar._id)
   );

   if (index === -1) {
     throw new Error("Práctica no encontrada");
   }

   this.practicas[index].codigo = nuevoServicio.codigo;
   this.practicas[index].nombre = nuevoServicio.nombre;
   this.practicas[index].duracionTurnoEnMins = nuevoServicio.duracionTurnoEnMins;
   this.practicas[index].costo = nuevoServicio.costo;

 } else {

   const index = this.especialidades.findIndex(
     e => String(e._id) === String(servicioAModificar._id)
   );

   if (index === -1) {
     throw new Error("Especialidad no encontrada");
   }

   this.especialidades[index].nombre = nuevoServicio.nombre;
   this.especialidades[index].duracionTurnoEnMins = nuevoServicio.duracionTurnoEnMins;
   this.especialidades[index].costoConsulta = nuevoServicio.costoConsulta;
 }}*/
  darDeAltaServicio(servicio) {
    if ('codigo' in servicio) {
      this.practicas = this.darDeAlta(servicio, this.practicas)
    } else {
      this.especialidades = this.darDeAlta(servicio, this.especialidades)
    }
  }

  darDeBajaServicio(servicio) {
    if ('codigo' in servicio) {
      this.practicas = this.darDeBaja(servicio, this.practicas)
    } else if (!('codigo' in servicio)) {
      this.especialidades = this.darDeBaja(servicio, this.especialidades)
    } else {
      throw new Error('servicio no esta en formato indicado')
    }
  }

  darDeBaja(servicio, listaServicios) {
    if (!this.servicioExiste(servicio, listaServicios)) {
      throw new Error('Este servicio no es brindado por el medico')
    }

    const indice = listaServicios.findIndex((p) => {
      if (p.id != null && servicio.id != null) {
        return p.id === servicio.id
      }
      return p.nombre === servicio.nombre
    })

    if (indice !== -1) {
      listaServicios.splice(indice, 1)
    }

    return listaServicios
  }

  servicioExiste(servicio, listaServicios) {
    return listaServicios.some((p) => {
      if (p.id != null && servicio.id != null) {
        return p.id === servicio.id
      }
      return p.nombre === servicio.nombre
    })
  }

  darDeAlta(servicio, listaServicio) {
    if (this.servicioExiste(servicio, listaServicio)) {
      throw new Error('Servicio ya está dado de alta')
    } else if (!listaServicio) {
      listaServicio = []
      return listaServicio.push(servicio)
    } else {
      listaServicio.push(servicio)
      return listaServicio
    }
  }
}
