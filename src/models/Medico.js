import {Sede} from './sede.js'
import { DisponibilidadHoraria } from './disponibilidadHoraria.js';

export class Medico{
    constructor(idMedico, usuarioMedico, matriculaMedica, nombreMedico, especialidadesMedico, practicasMedico, sedesMedico){
        this.id = idMedico;
        this.usuario = usuarioMedico;
        this.matricula = matriculaMedica;
        this.nombre = nombreMedico;
        this.especialidades = especialidadesMedico;
        this.practicas = practicasMedico;
        this.sedes = sedesMedico;
        this.disponibilidades = [];
    }

    definirDisponibilidad(disponibilidad){ //disponibilidad es un objeto de tipo DisponibilidadHoraria
        this.disponibilidades.push(disponibilidad);
        console.log(`Disponibilidad agregada para ${this.nombre}: ${disponibilidad.diaSemana} de ${disponibilidad.horaDesde} a ${disponibilidad.horaHasta}`);
    }

}