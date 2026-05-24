import { z } from 'zod'
import { EstadoTurno } from '../models/estadoTurno.enum'

export const EstadoTurnoSchema = z.enum(Object.values(EstadoTurno))
