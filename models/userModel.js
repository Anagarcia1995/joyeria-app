const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true  // Aseguramos que el correo sea único
    },
    contraseña: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }],  // Referencia a productos favoritos
    cesta: [{ 
        productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
        cantidad: { type: Number, default: 1 }
    }]
});



usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('contraseña')) return next(); 

    try {
        console.log("Encriptando la contraseña...");  
        this.contraseña = await bcrypt.hash(this.contraseña, 10); 
        console.log("Contraseña encriptada:", this.contraseña);  
        next();
    } catch (error) {
        console.error("Error al encriptar la contraseña:", error);  
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
