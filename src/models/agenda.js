import { Especialidad } from './especialidad.js';
import { Practica } from './practica.js'
import { Turno} from  './turno.js';
import { EstadoTurno } from "./estadoTurno.enum.js";
import { Medico } from "./medico.js";
export class Agenda {

  
   static generarTurnosPara(servicio, medico){
        if (servicio instanceof Practica) {
            return this.#generarPorPractica(servicio, medico);
        }

        if (servicio instanceof Especialidad) {
            return this.#generarPorEspecialidad(servicio, medico);
        }

        throw new Error('Tipo de servicio no soportado para generar turnos');
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