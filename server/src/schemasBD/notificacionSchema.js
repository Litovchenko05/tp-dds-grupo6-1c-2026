import mongoose from 'mongoose'
import { Notificacion } from '../models/notificacion.model.js'

export const NotificacionSchema = new mongoose.Schema(
  {
    destinatario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El destinatario es obligatorio'],
    },

    remitente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El remitente es obligatorio'],
    },

    mensaje: {
      type: String,
      required: [true, 'El contenido del mensaje es obligatorio'],
      trim: true,
    },

    fechaHoraCreacion: {
      type: Date,
      default: Date.now,
      required: true,
    },

    fechaHoraLeida: {
      type: Date,
      default: null,
    },

    leida: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { collection: 'notificaciones' }
)

NotificacionSchema.loadClass(Notificacion)

export const NotificacionModel = mongoose.model('Notificacion', NotificacionSchema)
