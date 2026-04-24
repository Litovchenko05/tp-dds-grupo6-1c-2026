import { Especialidad } from './especialidad.js';
import { Practica } from './practica.js'
import { Turno} from  './turno.js';
import { EstadoTurno } from "./estadoTurno.enum.js";
import { Medico } from "./Medico.js";
export class Agenda {
  
   static generarTurnosPara(especialidad, medico){
        // agarro al medico y compruebo que tiene es especialidad
        const tieneEspecialidad = medico.especialidades.some(especialidadMedico => especialidadMedico.id === especialidad.id);
     
     
        if (!tieneEspecialidad){
            throw new Error(`El médico ${medico.nombre} no tiene la especialidad ${especialidad.nombre}`);
        }
                    
            //lista de nuevos turnos a generar
            const nuevosTurnos = [];

            medico.disponibilidades.forEach((disponibilidad) => {

                let fechaTurno = disponibilidad.obtenerFecha();

                let turno = new Turno(
                    medico,
                    null,
                    fechaTurno,
                    null,
                    especialidad,
                    null,
                     [],
                    especialidad.costoConsulta
                );

                turno.actualizarEstado(
                    EstadoTurno.RESERVADO,
                    medico.usuario,
                    'Turno generado automáticamente por el sistema'
                );

                nuevosTurnos.push(turno);
            });
                 
            return nuevosTurnos;
    }
   

   static generarTurnosPara(practica, medico){

       // agarro al medico y compruebo que tiene esa practica
        const tienePractica = medico.practicas.some(practicaMedico => practicaMedico.id === practica.id);
     
        if (!tienePractica){
              throw new Error(`El médico ${medico.nombre} no tiene la practica ${practica.nombre}`);
        }

        const nuevosTurnos = [];

        medico.disponibilidades.forEach((disponibilidad) => {

             let fechaTurno = disponibilidad.obtenerFecha();

             let turno = new Turno(
                medico,
                null,
                fechaTurno,
                null,
                practica,
                null,
                [],
                practica.costo,
            );

             turno.actualizarEstado(
                EstadoTurno.RESERVADO,
                medico.usuario,
                'Turno generado automáticamente por el sistema'
            );

            nuevosTurnos.push(turno);

        });
          
        return nuevosTurnos;
    }

    static refrescarTurnosSegunDisponibilidadDe(medico){

        /*Aca tendrian que traerse todos los turnos del medico, que esten con estado disponible y 
        con fecha posterior a la actual, de la base de datos y modificarlos segun  la nueva disponilidad del medico*/
         
        const turnosAsignados = []; //estos son turnos que ya corresponden al medico y que fueron asignados con los antiguos horarios

        medico.disponibilidades.forEach(unaDisponibilidad => {

            if (unaDisponibilidad.getFueModificada() === true){

                    turnosAsignados.forEach(turno => {
                        if(turno.estadoActual == EstadoTurno.DISPONIBLE && turno.fechaTurno < unaDisponibilidad.obtenerFecha()){
                              
                            turno.fechaHora = unaDisponibilidad.obtenerFecha();

                            turno.actualizarEstado(
                                EstadoTurno.RESERVADO,
                                medico.usuario,
                                'Turno generado automáticamente por el sistema'
                            );    
                        }});
               
                    
            }
        });
       
    }
}