import { Especialidad } from './Especialidad.js'
import { Practica } from './Practica.js'
import { Turno } from './Turno.js'
import { EstadoTurno } from './EstadoTurno.enum.js'
import { Medico } from './medico.js'
import { DiasSemana } from './DiaSemana.enum.js'
import { DisponibilidadHoraria } from './DisponibilidadHoraria.js'
import { Sede } from './Sede.js';
import { Paciente } from './Paciente.js'


export class Agenda {
  
  static generarTurnos(medico, disponibilidad, sede, servicio, tipoDeServicio) {

    const nuevosTurnos = []
    const fechaActual = new Date()
    const año = fechaActual.getFullYear()
    const fechaDelUltimoDiaDelAño = new Date(año, 11, 31)

    const [horaDesde, minutoDesde] = disponibilidad.getHoraDesde().split(':').map(Number)

    const [horaHasta, minutoHasta] = disponibilidad.getHoraHasta().split(':').map(Number)

    fechaActual.setDate(fechaActual.getDate() + 1) //empiezo a generar tunos para el dia siguiente

    while (fechaActual <= fechaDelUltimoDiaDelAño) {
      const nombreDelDia = disponibilidad.obtenerNombreDelDiaDeSemana(fechaActual.getDay())

      if (nombreDelDia == disponibilidad.getDiaSemana()) {
        // hora inicial del cual arrancan los turnos
        let fechaHoraInicial = new Date(
          año,
          fechaActual.getMonth(),
          fechaActual.getDate(),
          horaDesde,
          minutoDesde
        )

        // hora final para que terminen los turnos
        const fechaHoraFinal = new Date(
          año,
          fechaActual.getMonth(),
          fechaActual.getDate(),
          horaHasta,
          minutoHasta
        )

        while (fechaHoraInicial <= fechaHoraFinal) {
          // console.log('La fecha del siguiente turno es ' + fechaHora.toLocaleString('es-AR'))

          const fechaTurno = new Date(fechaHoraInicial);
          const nuevoTurno = new Turno(medico, fechaTurno, sede, servicio, tipoDeServicio);
          // const nuevoTurnoJSON = Agenda.#mapToJSON(nuevoTurno);

          nuevosTurnos.push(nuevoTurno)
          //le sumo 30 min a la hora inicial de la fecha inicial para generar los turnos
          fechaHoraInicial.setMinutes(fechaHoraInicial.getMinutes() + 30)
        }
      }

      fechaActual.setDate(fechaActual.getDate() + 1) //incremento la fecha para seguir generando turnos
    }
    return nuevosTurnos
  }

  static obtenerNuevaFechaDelTurno(fechaHoraVieja, disponibilidadAnterior, disponibilidadModificada){  

        const nuevaFechaHora = new Date(fechaHoraVieja); 
        const diaAnt = DiasSemana[disponibilidadAnterior.getDiaSemana()];
        const diaMod = DiasSemana[disponibilidadModificada.getDiaSemana()];
        const diffDias = diaMod - diaAnt;   
        // moverse de fecha en la semana
        nuevaFechaHora.setDate(nuevaFechaHora.getDate() + diffDias);

        return nuevaFechaHora;
  }


  // static #mapToJSON(turno){
  //   return{
  //     medico:{
  //           id: turno.getMedico().getId(),
  //           nombre: turno.getMedico().getNombre(),
  //           usuario: turno.getMedico().getUsuario(),
  //           matricula: turno.getMedico().getMatricula(),
  //           especialidades: Array.isArray(
  //             turno.getMedico().getEspecialidades()
  //           )
  //             ? turno.getMedico()
  //                 .getEspecialidades()
  //                 .map((e) => ({
  //                   id: e.getId(),

  //                   nombre: e.getNombre(),

  //                   duracionTurnoEnMins:
  //                     e.getDuracionTurnoEnMins(),

  //                   costo:
  //                     e.getCostoConsulta(),
  //                 }))
  //             : [],

  //           practicas: Array.isArray(
  //             turno.getMedico().getPracticas()
  //           )
  //             ? turno.getMedico()
  //                 .getPracticas()
  //                 .map((p) => ({
                    
  //                   codigo: p.getCodigo(),
  //                   nombre: p.getNombre(),
  //                   duracionTurnoEnMins: p.getDuracionTurnoEnMins(),
  //                   costo: p.getCosto(),
  //                 }))
  //             : [],

  //           sedes: Array.isArray(
  //             turno.getMedico().getSedes()
  //           )
  //             ? turno.getMedico()
  //                 .getSedes()
  //                 .map((s) => ({
                   

  //                   nombre: s.getNombre(),

  //                   direccion: s.getDireccion(),
  //                 }))
  //             : [],

  //           disponibilidades: Array.isArray(
  //             turno.getMedico().getDisponibilidades()
  //           )
  //             ? turno.getMedico()
  //                 .getDisponibilidades()
  //                 .map((d) => ({
  //                   diaSemana: d.getDiaSemana(),

  //                   horaDesde: d.getHoraDesde(),

  //                   horaHasta: d.getHoraHasta(),
  //                 }))
  //             : [],
  //         },
  //     paciente: null,
  //     fechaHora:turno.getFechaHora(),
  //     sede:{
  //       nombre:turno.getSede().getNombre(),
  //       direccion:turno.getSede().getDireccion(),
  //     },
  //     servicio:{
  //       nombre:turno.getServicio().getNombre(),
  //     },
  //     estado:turno.getEstado(),
  //     historialDeEstados: Array.isArray(turno.getHistorialEstados())
  //       ? turno.getHistorialEstados().map((cambio) => ({
  //           fechaHoraIngreso: cambio.fechaHoraIngreso,
  //           estado: cambio.estado,
  //           motivo: cambio.motivo,
  //         }))
  //       : [],
  //     costo: turno.getServicio().getCosto(),
     
  //   }
  // }


  
}
