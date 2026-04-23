import { Notificacion } from "./notificacion.model.js";
import { Especialidad } from './especialidad.js';
import { Practica } from './practica.js';
export class Agenda {
  
   static generarTurnosPara(especialidad, medico){
        // agarro al medico y compruebo que tiene es especialidad
        const tieneEspecialidad = medico.especialidades.some(especialidadMedico => especialidadMedico.id === especialidad.id);
     
        if (tieneEspecialidad){
           /*aca tendria que hacerse una cosulta a la base de datos
            para traer los turnos del medico que correspan a dicha especialidad */   
        }else{
            throw new Error(`El médico ${medico.nombre} no tiene la especialidad ${especialidad.nombre}`);
        }
    }
   

   static generarTurnosPara(practica, medico){

       // agarro al medico y compruebo que tiene esa practica
        const tienePractica = medico.practicas.some(practicaMedico => practicaMedico.id === practica.id);
     
        if (tienePractica){
           /*aca tendria que hacerse una cosulta a la base de datos
            para traer los turnos del medico que correspan a dicha practica */   
        }else{
            throw new Error(`El médico ${medico.nombre} no tiene la practica ${practica.nombre}`);
        }
    }

    static refrescarTurnosSegunDisponibilidadDe(medico){

        /*Aca tendrian que traerse todos los turnos del medico, que esten con estado reservado y 
        con fecha posterior a la actual, de la base de datos y modificarlos segun si la nueva disponilidad del medico*/
       
    }


}