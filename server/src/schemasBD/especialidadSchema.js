import mongoose from "mongoose";
import { Especialidad } from "../models/Especialidad.js";

export const EspecialidadSchema = new mongoose.Schema({

    /*
    #nombre
    #duracionTurnoEnMins
    #costoConsulta
    */


    nombre:{
        type: String,
        required: true,
        trim: true,
    }
    ,duracionTurnoEnMins:{
        type: Number,
        required: true,
       
    }
    ,costoConsulta:{
        type: Number,
        required: true,
    },
    },{
    timestamps: true,
    collection: 'especialidades',
         
});

EspecialidadSchema.loadClass(Especialidad);

export const EspecialidadModel = mongoose.model('Especialidad', EspecialidadSchema);
