import {Sede} from './sede.js'
import { DisponibilidadHoraria } from './disponibilidadHoraria.js';
import { Especialidad } from './especialidad.js'
import { Practica } from './practica.js'


export class Medico{
    #id
    #usuario
    #matricula
    #nombre
    #especialidades
    #practicas
    #sedes
    #disponibilidades

    constructor(idMedico, usuarioMedico, matriculaMedica, nombreMedico, especialidadesMedico, practicasMedico, sedesMedico){
        this.#id = idMedico;
        this.#usuario = usuarioMedico;
        this.#matricula = matriculaMedica;
        this.#nombre = nombreMedico;
        this.#especialidades = especialidadesMedico;
        this.#practicas = practicasMedico;
        this.#sedes = sedesMedico;
        this.#disponibilidades = [];
    }

    get id() {
        return this.#id;
    }

    get usuario() {
        return this.#usuario;
    }

    get matricula() {
        return this.#matricula;
    }

    get nombre() {
        return this.#nombre;
    }

    get especialidades() {
        return this.#especialidades;
    }

    get practicas() {
        return this.#practicas;
    }

    get sedes() {
        return this.#sedes;
    }

    get disponibilidades() {
        return this.#disponibilidades;
    }

    definirDisponibilidad(disponibilidad){ //disponibilidad es un objeto de tipo DisponibilidadHoraria
        this.disponibilidades.push(disponibilidad);
        // console.log(`Disponibilidad agregada para ${this.nombre}: ${disponibilidad.diaSemana} de ${disponibilidad.horaDesde} a ${disponibilidad.horaHasta}`);
    }

    tieneTipoTurno(tipoTurno){
        if (tipoTurno instanceof Especialidad){
            return this.#especialidades.some(especialidadMedico => especialidadMedico.id === tipoTurno.id)
        }
        if (tipoTurno instanceof Practica){
            return this.#practicas.some(practicaMedico => practicaMedico.id === tipoTurno.id)
        }
    }

}