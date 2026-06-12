import mongoose from "mongoose";
import { Sede } from "../models/Sede.js";

export const SedeSchema = new mongoose.Schema({
    /*
        #id
        #nombre
        #direccion
    */

    nombre:{
        type: String,
        required: true,
        trim: true,
    }
    ,direccion:{
        type: String,
        required: true,
        trim: true,
    },
    },{
    timestamps: true,
    collation: 'sedes',
           
});

SedeSchema.loadClass(Sede);

export const SedeModel = mongoose.model('Sede', SedeSchema);
