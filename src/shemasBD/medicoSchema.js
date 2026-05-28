import mongoose from "mongoose";
import { Medico } from "../models/Medico.js";
import { PracticaSchema } from "../shemasBD/practicaSchema.js";
import { EspecialidadSchema } from "../shemasBD/especialidadSchema.js";
import { SedeSchema } from "../shemasBD/sedeSchema.js";
import { DisponibilidadSchema } from "../shemasBD/disponibilidadSchema.js";
import {UsuarioSchema} from "../shemasBD/usuarioSchema.js";

export const MedicoSchema = new mongoose.Schema({

    medicoId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
    },
    usuario: UsuarioSchema,
    matricula:{
        type: String,
        required: true,
        trim: true,
    },
    nombre:{
        type: String,
        required: true,
        trim: true,
    },
    especialidades: [EspecialidadSchema],
    practicas:[PracticaSchema],
    sedes:[SedeSchema],
    disponibilidades:[DisponibilidadSchema],
    solicitudesDeCambioDeFecha:{
          type: [mongoose.Schema.Types.Mixed],
          default:[],
          required:false,
        }
    },
    {
    timestamps: true,
    collection: 'medicos',
         
});


MedicoSchema.loadClass(Medico);

export const MedicoModel = mongoose.model('Medico', MedicoSchema);
