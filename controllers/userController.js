const Usuario = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    try {
        const usuarioExistente = await Usuario.findOne({ correo });
        if ( usuarioExistente) {
            return res.status(400).json({ msg: 'El correo ya está registrado' });
        }

        const nuevoUsuario = new Usuario ({ nombre, correo, contraseña});
        await nuevoUsuario.save();

        const token = jwt.sign({ id: nuevoUsuario._id}, process.env.JWT_SECRET, { expiresIn: '2h'});
        res.status(201).json({ msg: 'Usuario registrado exitosamente', token });

    } catch (error) {
        res.status(500).json({ msg: 'Error al registrar el usuario' });
    }
}

const login = async (req, res) => {
    const { correo, contraseña} = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ msg: 'Usuario no encontrado' });
        }

        const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if(!esValida) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({id: usuario._id}, process.env.JWT_SECRET, {expiresIn: '2h'});
        res.status(200).json({ msg: 'Login exitoso', token });

    } catch (error) {
        res.status(500).json({ msg: 'Error al iniciar sesión' });

    }
};


const actualizarRol = async (req, res) => {
    const { id } = req.params;
    const { rol } = req.body;

    if (rol !== 'admin' && rol !== 'user') {
        return res.status(400).json({ msg: 'Rol inválido. Solo se puede asignar "admin" o "user".' });
    }

    try {
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Si el rol ya es el mismo que se intenta asignar, no se hace nada
        if (usuario.rol === rol) {
            return res.status(400).json({ msg: 'El rol ya es el mismo' });
        }

        // Actualizar el rol
        usuario.rol = rol;
        await usuario.save();

        res.status(200).json({ msg: 'Rol actualizado exitosamente', usuario });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el rol' });
    }
}


module.exports = { signup, login, actualizarRol}