import mongoose from "mongoose";
import { Medico } from "../models/Medico.js";
import { PracticaSchema } from "../shemasBD/practicaSchema.js";
import { EspecialidadSchema } from "../shemasBD/especialidadSchema.js";
import { SedeSchema } from "../shemasBD/sedeSchema.js";
import { DisponibilidadSchema } from "../shemasBD/disponibilidadSchema.js";
import { UsuarioSchema} from "../shemasBD/usuarioSchema.js";
const Schema = mongoose.Schema;
export const MedicoSchema = new mongoose.Schema({

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
    especialidades: [{
        type: Schema.Types.ObjectId, 
        ref: 'Especialidad',
        required: true,}], 

    practicas:[{
        type: Schema.Types.ObjectId, 
        ref: 'Practica',
        required: true,}], 

    sedes:[{
        type: Schema.Types.ObjectId, 
        ref: 'Sede',
        required: true,}],

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
