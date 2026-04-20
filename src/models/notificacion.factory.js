import { Agenda } from "./ageda.js";
import { Notificacion } from "./notificacion.model.js";
export class FactoryNotificacion {

   
  
    static crearSegunEstadoTurno(turno){
        
    }

  
    static crearNotificacionParaTurnoReservado(turno, nombreDeServicio){
        
        const notificacion = new Notificacion({
            destinatario: turno.medico,           
            remitente:"Sweet Medical - Plataforma de Seguro de la Salud", 
            mensaje: "Se ha reservado un turno, con el paciente " + turno.paciente.nombre + "y con el medico " + turno.medico.nombre + "para el servicio de " + nombreDeServicio,
        }); 

        return notificacion;
    }

    static crearNotificacionParaTurnoAceptado(turno){

        const notificacion = new Notificacion({
            destinatario: turno.paciente,           
            remitente:"Sweet Medical - Plataforma de Seguro de la Salud", 
            mensaje: "Querido paciente " + turno.paciente.nombre + "tu turno ha sido aceptado",
        });

        return notificacion;
    }


    static crearNotificacionParaTurnoCancelado(turno, nombreDeDestinatario){
        
        const notificacion = new Notificacion({
            destinatario: nombreDeDestinatario,           
            remitente:"Sweet Medical - Plataforma de Seguro de la Salud", 
            mensaje: "Querido usuario " + nombreDeDestinatario + "tu turno ha sido cancelado",
        });

        return notificacion;
    }

    static crearNotificacionParaRecordatorioDeTurno(turno, nombreDeDestinatario){
        const notificacion = new Notificacion({
            destinatario: nombreDeDestinatario,
            remitente: "Sweet Medical - Plataforma de Seguro de la Salud",
            mensaje: "Querido paciente " + nombreDeDestinatario + " te recordamos que tenes un turno programado para el día " + turno.fechaHora.toLocaleDateString(),
        });

        return notificacion;
    }
    


}