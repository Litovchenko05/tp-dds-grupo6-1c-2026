import mongoose from "mongoose";
import { Medico } from "../models/Medico.js";
import { PracticaSchema } from "../shemasBD/practicaSchema.js";
import { EspecialidadSchema } from "../shemasBD/especialidadSchema.js";
import { SedeSchema } from "../shemasBD/sedeSchema.js";
import { DisponibilidadSchema } from "../shemasBD/disponibilidadSchema.js";
import {UsuarioSchema} from "../shemasBD/usuarioSchema.js";

export const MedicoSchema = new mongoose.Schema({

    /*
            #id
            #usuario
            #matricula
            #nombre
            #especialidades
            #practicas
            #sedes
            #disponibilidades
            #solicitudesDeCambioDeFecha //este no lo muestro

    */

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
    },
    {
    timestamps: true,
    collection: 'medicos',
         
});


// //MIDDLEWARE PARA POPULAR TODOS LOS METODOS QUE TENGAN 'find'
// MedicoSchema.pre(/^find/, async function(){
//     this.populate('especialidades');
//     this.populate('practicas');
//     this.populate('sedes');
//     this.populate('disponibilidades');
    
// });

MedicoSchema.loadClass(Medico);

export const MedicoModel = mongoose.model('Medico', MedicoSchema);
