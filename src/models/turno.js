//import { turnoSchema } from '../schemas/turno.schema.js'
import { Agenda } from './agenda.js';
import { FactoryNotificacion } from './notificacion.factory.js';
import { EstadoTurno } from './estadoTurno.enum.js';
  export class Turno {
    constructor(idTurno, medico, fechaHora, sede, practica) {
        this.id = idTurno;
        this.medico = medico;
        this.paciente = null; // Inicialmente sin paciente asignado
        this.fechaHora = fechaHora; //date
        this.sede = sede;
        this.practica = practica; //practica o servicio asociado al turno
        this.estado = EstadoTurno.DISPONIBLE; // Estado inicial
        this.historialEstados = [];
        this.costo = practica.costo; 
    }

    actualizarEstado(nuevoEstado,quien,motivo){

        this.estado = nuevoEstado;

        this.historialEstados.push({
            fechaHoraIngreso: new Date(),
            estado: nuevoEstado,
            turno: this,
            usuario:quien, 
            motivo:motivo
        });

 
    }
    get ultimoCambioEstado() {
        return this.historialEstados.at(-1); 
    }

    reservar(paciente){
        this.paciente=paciente;
        this.actualizarEstado(EstadoTurno.RESERVADO,paciente.usuario,'El paciente ha reservado el turno');
    }

   esManiana(fechaManiana) { // 'YYYY-MM-DD'
    const fechaTurno = this.fechaHora.toISOString().split('T')[0];
    if(fechaTurno === fechaManiana && this.estado === EstadoTurno.ACEPTADO){
        this.recordarTurno = true;
        return true;
        }
    }

}