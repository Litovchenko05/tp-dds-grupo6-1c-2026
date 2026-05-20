import { DiasSemana } from './diaSemana.enum.js'
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

  get diaSemana(){
    return this.#diaSemana;
  }

  get horaDesde(){
    return this.#horaDesde;
  }

  get horaHasta(){
    return this.#horaHasta;
  }

  get getFueModificada(){
    return this.#fueModificada;
  }

  actualizarDisponibilidad(diaSemana, horaDesde, horaHasta){
    this.#diaSemana = diaSemana;
    this.#horaDesde = horaDesde;
    this.#horaHasta = horaHasta;
    this.#fueModificada = true;
  }
  
  obtenerFecha() {
    const fecha = new Date();

    while (fecha.getDay() !== this.diaSemana){
        fecha.setDate(fecha.getDate() + 1);
    }

    fecha.setHours(this.horaDesde, 0, 0, 0);

    return fecha;
  }

  obtenerNombreDelDiaDeSemana(indice){
    return Object.keys(DiasSemana).find(key => DiasSemana[key] === indice)
  }

  obtenerIndiceDelDiaDeSemana(nombreDia){
    return DiasSemana[nombreDia];
  }

}