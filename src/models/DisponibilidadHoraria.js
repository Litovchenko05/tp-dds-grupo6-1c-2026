import {DiasSemana} from './dia-semana.enum.js'
export class DisponibilidadHoraria{
  #diaSemana
  #horaDesde
  #horaHasta
  #fueModificada

  constructor(diaSemana, horaDesde, horaHasta){
    this.#diaSemana = diaSemana;
    this.#horaDesde = horaDesde;
    this.#horaHasta = horaHasta;
    this.#fueModificada = false;
  }

  get getFueModificada(){
    return this.fueModificada;
  }
  
  obtenerFecha() {
    const fecha = new Date();

    while (fecha.getDay() !== this.diaSemana){
        fecha.setDate(fecha.getDate() + 1);
    }

    fecha.setHours(this.horaDesde, 0, 0, 0);

    return fecha;
  }
}