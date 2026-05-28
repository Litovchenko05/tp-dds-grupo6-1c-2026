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

  tieneServicio(tipoServicio) {
    return this.especialidades.some((especialidad) => especialidad.nombre=== tipoServicio) ||
           this.practicas.some((practica) => practica.nombre === tipoServicio)
  }

  definirDisponibilidad(disponibilidad) {
    //disponibilidad es un objeto de tipo DisponibilidadHoraria
    this.disponibilidades.push(disponibilidad)
    // console.log(`Disponibilidad agregada para ${this.nombre}: ${disponibilidad.diaSemana} de ${disponibilidad.horaDesde} a ${disponibilidad.horaHasta}`);
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
   modificarServicio(servicioAModificar, nuevoServicio){
      
     if(nuevoServicio instanceof Practica){
        this.#practicas[this.#practicas.indexOf(servicioAModificar)] = nuevoServicio
      }else if (nuevoServicio instanceof Especialidad){
        this.#especialidades[this.#especialidades.indexOf(servicioAModificar)] = nuevoServicio
      }else {
        throw new Error(
            "servicio no esta en formato indicado"
        )
      }}
    darDeAltaServicio(servicio){
      if(servicio instanceof Practica){
        this.#practicas = this.darDeAlta(servicio,this.#practicas)
      }else if (servicio instanceof Especialidad){
        this.#especialidades = this.darDeAlta(servicio,this.#especialidades)
      }else {
        throw new Error(
            "servicio no esta en formato indicado"
        )
      }}
    
    darDeBajaServicio(servicio){
      
      if(servicio instanceof Practica){
        this.#practicas = this.darDeBaja(servicio,this.#practicas)
      }else if (servicio instanceof Especialidad){
        this.#especialidades = this.darDeBaja(servicio,this.#especialidades)
      }else {
        throw new Error(
            "servicio no esta en formato indicado"
        )
      }

    }
    darDeBaja(servicio,listaServicios){
      if(!this.servicioExiste(servicio,listaServicios)){
            throw new Error(
            "Este servicio no es brindado por el medico"
        ) 
        }
      return listaServicios.filter(p=>p.id !== servicio.id)
    }
    servicioExiste(servicio,listaServicios){
      return listaServicios.some(p=>p.id === servicio.id)
    }
  
     darDeAlta(servicio,listaServicio){
    if(this.servicioExiste(servicio,listaServicio)){
      throw new Error(
            "Servicio ya está dado de alta"
        )
    }    
    else if(!listaServicio){
      return listaServicio = [servicio]
           
    }else{
      listaServicio.push(servicio) 
      return listaServicio
    }
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
