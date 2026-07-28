import { z } from 'zod'
import { EstadoTurnoSchema } from './estadoTurno.schema.js'
import { medicoSchema } from './medico.schema.js'
import { pacienteSchema}  from './paciente.schema.js'
import {sedeSchema} from './sede.schema.js'
import {practicaSchema} from './practica.schema.js'
import { especialidadSchema } from './especialidad.schema.js'

 // Enum para tipo de usuario
 const TipoUsuarioEnum = z.enum(['PACIENTE', 'MEDICO', 'ADMIN'], {
     errorMap: () => ({ message: 'Tipo de usuario inválido' })
 })

const servicioTurnoSchema = z
    .object({
        practica: practicaSchema.nullable().optional(),
        especialidad: especialidadSchema.nullable().optional(),
        costo: z.number().int().nonnegative(),
    })
    .refine((servicio) => Boolean(servicio.practica) !== Boolean(servicio.especialidad), {
        message: 'El turno debe tener exactamente una referencia: practica o especialidad',
    })

export const turnoSchema = z.object({
    id: z.string().optional(), // Valida que el id sea un string opcionable recibirlo
    medico: medicoSchema, // Valida que el médico cumpla con el schema de médico
    paciente: pacienteSchema.nullable().optional(), // Valida que el paciente cumpla con el schema de paciente
    fechaHora: z.date(), // Valida que fechaHora sea una fecha válida
    sede: sedeSchema, // Valida que la sede cumpla con el schema de sede
    ...servicioTurnoSchema.shape,
    estado: EstadoTurnoSchema, // Valida que el estado sea uno de los valores definidos en estadoTurno
    historialEstados: z.array(EstadoTurnoSchema.nullable()), // Valida que sea un valor posible de estadoTurno o null
})

export const cancelarTurnoSchema = z.object({
    id: z.number()
        .int().positive('ID de usuario inválido'),

    tipoUsuario: TipoUsuarioEnum,

    motivo: z.string()
        .min(1, 'El motivo es obligatorio')
        .max(500, 'El motivo no puede exceder 500 caracteres')
        .trim()
})
