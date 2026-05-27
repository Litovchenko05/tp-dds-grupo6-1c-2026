import { z } from 'zod'
import { EstadoTurno } from '../models/EstadoTurno.enum'

export const EstadoTurnoSchema = z.enum(Object.values(EstadoTurno))
