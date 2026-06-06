import { Sede } from './sede.js'
import { DisponibilidadHoraria } from './disponibilidadHoraria.js'
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
  solicitudesDeCambioDeFecha

  constructor(
    usuarioMedico,
    matriculaMedica,
    nombreMedico,
    especialidadesMedico,
    practicasMedico,
    sedesMedico,
    disponibilidadesMedico
  ) {
    this.usuario = usuarioMedico
    this.matricula = matriculaMedica
    this.nombre = nombreMedico
    this.especialidades = especialidadesMedico
    this.practicas = practicasMedico
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
    const solicitud = this.solicitudesDeCambioDeFecha.find(
      (solicitud) => solicitud.turno === turno
    )

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

    if ("codigo" in servicio) {

      this.practicas = this.darDeAlta(servicio, this.practicas)
    } else {
      this.especialidades = this.darDeAlta(servicio, this.especialidades)
    }
  }

  darDeBajaServicio(servicio) {

    if ("codigo" in servicio) {

      this.practicas = this.darDeBaja(servicio, this.practicas)
    } else if ("codigo" in servicio) {
      this.especialidades = this.darDeBaja(servicio, this.especialidades)
    } else {
      throw new Error(
        "servicio no esta en formato indicado"
      )
    }

  }
  darDeBaja(servicio, listaServicios) {

    if (!this.servicioExiste(servicio, listaServicios)) {
      throw new Error(
        "Este servicio no es brindado por el medico"
      )
    }
    return listaServicios.filter(p => p.id !== servicio.id)


  }
  servicioExiste(servicio, listaServicios) {
    return listaServicios.some(p => p.nombre === servicio.nombre)
  }
  servicioPorId(servicioId) {
    console.log("paseid")
    const servicios = [
      ...this.practicas,
      ...this.especialidades
    ]
    console.log("pase", servicios)

    const servicio = servicios.find(s => s._id === servicioId)
    console.log("pase", servicio)
    return servicio
  }

  darDeAlta(servicio, listaServicio) {


    if (this.servicioExiste(servicio, listaServicio)) {
      throw new Error(
        "Servicio ya está dado de alta"
      )
    }
    else if (!listaServicio) {

      listaServicio = []
      return listaServicio.push(servicio)

    } else {

      listaServicio.push(servicio)

      return listaServicio
    }
  }

}
