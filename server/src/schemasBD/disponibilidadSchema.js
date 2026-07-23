import mongoose from "mongoose";
import { DisponibilidadHoraria } from "../models/DisponibilidadHoraria.js";

export const DisponibilidadSchema = new mongoose.Schema({
    diaSemana:{
        type: String,
        required: true,
        trim: true,
    }
    ,horaDesde:{
        type: String,
        required: true,
    }
    ,horaHasta:{
        type: String,
        required: true,
    }
    ,
},{
    timestamps: true,          
});

DisponibilidadSchema.loadClass(DisponibilidadHoraria);

export const DisponibilidadModel = mongoose.model('Disponibilidad', DisponibilidadSchema);

 