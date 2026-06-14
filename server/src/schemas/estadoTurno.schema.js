import { z } from 'zod'
import { EstadoTurno } from '../models/EstadoTurno.enum.js'

export const EstadoTurnoSchema = z.enum(Object.values(EstadoTurno))
