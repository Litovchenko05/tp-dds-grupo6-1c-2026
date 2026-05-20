import { Especialidad } from './especialidad.js';
import { Practica } from './practica.js'
import { Turno} from  './turno.js';
import { EstadoTurno } from "./estadoTurno.enum.js";
import { Medico } from "./medico.js";
import { DiasSemana} from './diaSemana.enum.js'
import { DisponibilidadHoraria } from './DisponibilidadHoraria.js';
export class Agenda {

  
   static generarTurnos(medico, disponibilidad){

       const nuevosTurnos = [];
       const fechaActual = new Date(); 
       const año = fechaActual.getFullYear();
       const fechaDelUltimoDiaDelAño = new Date(año, 11, 31)
       const [horaDesde, minutoDesde] = disponibilidad.horaDesde.split(':').map(Number);

       const [horaHasta, minutoHasta] = disponibilidad.horaHasta.split(':').map(Number);

        fechaActual.setDate(fechaActual.getDate() + 1); //empiezo a generar tunos para el dia siguiente

        while(fechaActual <= fechaDelUltimoDiaDelAño){

           const nombreDelDia = disponibilidad.obtenerNombreDelDiaDeSemana(fechaActual.getDay());

            if(nombreDelDia == disponibilidad.diaSemana){

                // hora inicial del cual arrancan los turnos
                let fechaHora = new Date(
                    año,
                    fechaActual.getMonth(),
                    fechaActual.getDate(),
                    horaDesde,
                    minutoDesde
                );

                // hora final para que terminen los turnos
                const fechaLimite = new Date(
                    año,
                    fechaActual.getMonth(),
                    fechaActual.getDate(),
                    horaHasta,
                    minutoHasta
                );

                while(fechaHora <= fechaLimite){
                    
                    console.log("La fecha del siguiente turno es " + fechaHora.toLocaleString('es-AR'));

                        const nuevoTurno = new Turno(
                            null,
                            medico,
                            fechaHora, 
                            null,
                            null
                        );
                    
                    nuevosTurnos.push(nuevoTurno);
                    //le sumo 30 min a la hora inicial de la fecha inicial para generar los turnos
                    fechaHora.setMinutes(fechaHora.getMinutes() + 30);
                }
     
                
            }

            fechaActual.setDate(fechaActual.getDate() + 1); //incremento la fecha para seguir generando turnos
        }
         return nuevosTurnos;
    }

  
    static #generarPorPractica(practica, medico){
        if (!medico.tieneTipoTurno(practica)){
              throw new Error(`El médico ${medico.nombre} no tiene la practica ${practica.nombre}`);
        }

        const nuevosTurnos = [];

        medico.disponibilidades.forEach((disponibilidad) => {
            const fechaTurno = disponibilidad.obtenerFecha();

            const turno = new Turno(
                null,
                medico,
                fechaTurno,
                medico.sedes[0],
                practica
            );

            nuevosTurnos.push(turno);
        });

        return nuevosTurnos;
    }

    static #generarPorEspecialidad(especialidad, medico){
        if (!medico.tieneTipoTurno(especialidad)){
            throw new Error(`El médico ${medico.nombre} no tiene la especialidad ${especialidad.nombre}`);
        }

        const nuevosTurnos = [];

        medico.disponibilidades.forEach((disponibilidad) => {
            const fechaTurno = disponibilidad.obtenerFecha();

            const turno = new Turno(
                null,
                medico,
                fechaTurno,
                medico.sedes[0],
                especialidad
            );

            nuevosTurnos.push(turno);
        });

        return nuevosTurnos;
    }

    static refrescarTurnosSegunDisponibilidadDe(medico){

        /*Aca tendrian que traerse todos los turnos del medico, que esten con estado disponible y 
        con fecha posterior a la actual, de la base de datos y modificarlos segun  la nueva disponilidad del medico*/

        const turno1 = new Turno(1, medico, new Date() , null, null);
        const turno2 = new Turno(2, medico, new Date(), null, null);
        const turno3 = new Turno(3, medico, new Date(), null, null);

        const turnosAsignados = [turno1, turno2, turno3];


        const disponibilidadesModificadas = medico.disponibilidades.filter(disponibilidad => disponibilidad.getFueModificada === true);

        const nuevasFechas = disponibilidadesModificadas.map(disponibilidad => disponibilidad.obtenerFecha());

        
        turnosAsignados.forEach((turno, indice) => {

            const nuevaFecha = nuevasFechas[indice];

            if(turno.estadoActual === EstadoTurno.DISPONIBLE && nuevaFecha !== undefined){

                turno.fechaTurno = nuevaFecha;

            }
        });
    }
       
    


    static buscarTurnoParaGenerarNotificacionesDeRecordatorio(unTurno){

        const fechaManiana = new Date();
        fechaManiana.setDate(fechaManiana.getDate() + 1);

        const medico = new Medico(1, 'usuarioMedico', 'matriculaMedica', 'nombreMedico', [], [], []);

        const turno1 = new Turno(1, medico, new Date() , null, null);
        const turno2 = new Turno(2, medico, fechaManiana, null, null);
        const turno3 = new Turno(3, medico, new Date(), null, null);

        const turnos = [turno1, turno2, turno3];

    
        let resultado = turnos.some(turno => turno.fechaHora.toDateString() === fechaManiana.toDateString() && unTurno.estadoActual === EstadoTurno.ACEPTADO && unTurno.id === turno.id);

        return resultado;
    
    }
}