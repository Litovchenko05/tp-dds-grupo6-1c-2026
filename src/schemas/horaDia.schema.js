import {z} from 'zod';
//Schema de validacion
export const horaSchema = z.string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Formato HH:MM (00:00-23:59)' //formato y rango aceptado para los string de horas
  })
  // .transform(val => {
  //   const [hora, minuto] = val.split(':').map(Number);
  //   return hora * 60 + minuto;  // Minutos totales
  // });

export const diaSemanaSchema = z.enum(['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO']);