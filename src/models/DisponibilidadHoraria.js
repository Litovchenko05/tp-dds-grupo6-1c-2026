import {z} from 'zod';
import {diaSemanaSchema, DiaSemana} from './EnumDia.js'
//Schema de validacion
const HoraSchema = z.string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Formato HH:MM (00:00-23:59)' //formato y rango aceptado para los string de horas
  })
  .transform(val => {
    const [hora, minuto] = val.split(':').map(Number);
    return hora * 60 + minuto;  // Minutos totales
  });

const disponibilidadHorariaSchema = z.object({
    diaSemana: diaSemanaSchema,
    horaDesde: HoraSchema,
    horaHasta: HoraSchema,
}).refine(
    (data)=> data.horaDesde<data.horaHasta, { message: 'HoraDesde debe ser menor que HoraHasta'}
);

export class DisponibilidadHoraria{
  constructor(data){
    const{diaSemana, desde, hasta} = disponibilidadHorariaSchema.parse(data);
    this.diaSemana = diaSemana;
    this.horaDesde = desde;
    this.horaHasta = hasta;
  }
}