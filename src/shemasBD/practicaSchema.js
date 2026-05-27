import mongoose from "mongoose";
import { Practica } from "../models/Practica.js";

export const PracticaSchema = new mongoose.Schema({
    /*
        #id
        #codigo
        #nombre
        #duracionTurnoEnMins
        #costo
    */

    codigo:{
        type: String,
        required: true,
        trim: true,
    }
    ,nombre:{
        type: String,
        required: true,
        trim: true,
    },duracionTurnoEnMins:{
        type: Number,
        required: true,
        trim:true,
    },costo:{
        type: Number,
        required: true,
        trim:true,
    },
    },{
    timestamps: true,
    collection: 'practicas',
           
});

PracticaSchema.loadClass(Practica);

export const PracticaModel = mongoose.model('Practica', PracticaSchema);