
import { turnoSchema } from '../schemas/turno.schema.js'
import { Agenda } from './ageda.js';
import { FactoryNotificacion } from './notificacion.factory.js';


  export class Turno {
    constructor(data) {
        const result = turnoSchema.parse(data);

        this.id = result.id;
        this.medico = result.medico;
        this.paciente = result.paciente;
        this.fechaHora = result.fechaHora;
        this.sede = result.sede;
        this.practica = result.practica;
        this.estado = result.estado;
        this.historialEstados = result.historialEstados;
        this.costo = result.costo;
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




}