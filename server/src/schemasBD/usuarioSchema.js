import mongoose from "mongoose";
import { Usuario } from "../models/Usuario.js";

export const UsuarioSchema = new mongoose.Schema({

    /*
        #id
        #nombreUsuario
        #password
    */

    nombreUsuario: {
        type: String,
        required: true,
        trim: true,
    }
    , password: {
        type: String,
        required: true,
        trim: true

    },
}, {
    timestamps: true,
    collection: 'usuarios',


});

UsuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);
