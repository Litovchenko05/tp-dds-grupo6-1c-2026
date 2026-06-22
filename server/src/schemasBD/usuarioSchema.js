import mongoose from 'mongoose'
import { Usuario } from '../models/Usuario.js'

export const UsuarioSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    keycloakId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: 'usuarios',
  }
)

UsuarioSchema.loadClass(Usuario)

export const UsuarioModel = mongoose.model('Usuario', UsuarioSchema)
