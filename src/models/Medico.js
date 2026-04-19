import {z} from 'zod';
import {Sede, sedeSchema} from './Sede.js'
import { DisponibilidadHoraria, disponibilidadHorariaSchema } from './DisponibilidadHoraria.js';


//Schema de validacion
//para matriculas medicas provinciales y nacionales  MP012345 o MN0012334...
const matriculaMedicaSchema = z.string()
  .regex(/^MP\d{5,7}$/i, 'MP + 5-7 dígitos (MP12345)')
  .transform(m => `MP${m.slice(2).padStart(5, '0').slice(0,7)}`.toUpperCase());

const medicoSchema = z.object({
    id: z.number().int().positive(),
    usuario: z.object({}),
    matricula: matriculaMedicaSchema,
    nombre: z.string().trim().min(1, 'Debe tener nombre.'),
    especialidades: z.array(Object).optional().nullable(), //verificar si esta bien esto
    practicas: z.array(Object).optional().nullable(), // verificar si esta bien esto
    sedes:z.array(sedeSchema),
    //disponibilidades:z.array(disponibilidadHorariaSchema).optional().nullable(),

})

export class Medico{
    constructor(data){
        const {id, usuario, matricula, nombre, especialidades, practicas, sedes} = medicoSchema.parse(data);
        this.id = id;
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
        this.especialidades = especialidades;
        this.practicas = practicas;
        this.sedes = sedes;
        this.disponibilidades = [];
    }

    definirDisponibilidad(disponibilidad){
        const nuevaDisponibilidad = new DisponibilidadHoraria(disponibilidad);
        this.disponibilidades.push(nuevaDisponibilidad);
        console.log(`Disponibilidad agregada para ${this.nombre}: ${nuevaDisponibilidad.diaSemana} de ${nuevaDisponibilidad.horaDesde} a ${nuevaDisponibilidad.horaHasta}`);
    } //redefinir con esquema Async


}