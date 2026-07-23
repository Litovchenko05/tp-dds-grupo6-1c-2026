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
  
  static generarTurnos(medicoId, disponibilidad, sedeId, servicioId, tipoDeServicio, duracion) {

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

        while (fechaHoraInicial <= fechaHoraFinal ) {

          let anteUltimaFechaDeTurno = new Date(fechaHoraInicial);

          anteUltimaFechaDeTurno.setMinutes(anteUltimaFechaDeTurno.getMinutes() + duracion);

          if(anteUltimaFechaDeTurno <= fechaHoraFinal){
            // console.log('La fecha del siguiente turno es ' + fechaHoraInicial.toLocaleString('es-AR'));

            const fechaTurno = new Date(fechaHoraInicial);
            const nuevoTurno = new Turno(medicoId, fechaTurno, sedeId, servicioId, tipoDeServicio, duracion);
            
            nuevosTurnos.push(nuevoTurno);
            //le sumo duracion en min a la hora inicial de la fecha inicial para generar los turnos
            fechaHoraInicial.setMinutes(fechaHoraInicial.getMinutes() + duracion);
          }else{
            break;
          }
          
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



  
}
