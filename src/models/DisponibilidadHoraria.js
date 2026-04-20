import {DiasSemana} from './dia-semana.enum.js'
export class DisponibilidadHoraria{
  constructor(diaSemana, horaDesde, horaHasta){
    this.diaSemana = diaSemana;
    this.horaDesde = horaDesde;
    this.horaHasta = horaHasta;
  }
}