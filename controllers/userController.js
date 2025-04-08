const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/userModel");
// const Producto = require('../models/productModel');

// Registro de usuario
const signup = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    const rolAsignado = rol === "admin" ? "admin" : "user";
    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña,
      rol: rolAsignado,
    });
    await nuevoUsuario.save();

    const token = jwt.sign({ id: nuevoUsuario._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(201).json({ msg: "Usuario registrado exitosamente", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar el usuario" });
  }
};


// Login de usuario
const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(200).json({ msg: "Login exitoso", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al iniciar sesión" });
  }
};

// Obtener los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los usuarios" });
  }
};

// Función de agregar a favoritos
const agregarAFavoritos = async (req, res) => {
    const { id } = req.usuarioId;
    const { productoId } = req.body;
  
    // Verificar que el usuario no sea admin
    if (req.usuarioId.rol === "admin") {
      return res.status(403).json({ msg: "Los administradores no pueden modificar favoritos." });
    }
  
    try {
      const usuario = await Usuario.findById(id);
  
      if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
  
      if (!usuario.favoritos.includes(productoId)) {
        usuario.favoritos.push(productoId);
        await usuario.save();
        return res.status(200).json({ msg: "Producto añadido a favoritos" });
      }
  
      return res.status(400).json({ msg: "Producto ya está en favoritos" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al añadir producto a favoritos" });
    }
};

// Función de quitar de favoritos
const quitarDeFavoritos = async (req, res) => {
    const { id } = req.usuarioId;
    const { productoId } = req.body;
  
    // Verificar que el usuario no sea admin
    if (req.usuarioId.rol === "admin") {
      return res.status(403).json({ msg: "Los administradores no pueden modificar favoritos." });
    }
  
    try {
      const usuario = await Usuario.findById(id);
  
      if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
  
      usuario.favoritos = usuario.favoritos.filter(
        (fav) => fav.toString() !== productoId
      );
      await usuario.save();
  
      res.status(200).json({ msg: "Producto eliminado de favoritos" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al quitar producto de favoritos" });
    }
  };

// Agregar a cesta
const agregarACesta = async (req, res) => {
    const { id } = req.usuarioId;
    const { productoId, cantidad } = req.body;
  
    // Verificar que el usuario no sea admin
    if (req.usuarioId.rol === "admin") {
      return res.status(403).json({ msg: "Los administradores no pueden modificar la cesta." });
    }
  
    try {
      const usuario = await Usuario.findById(id);
  
      if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
  
      const productoEnCesta = usuario.cesta.find(
        (item) => item.productoId.toString() === productoId
      );
  
      if (productoEnCesta) {
        productoEnCesta.cantidad += cantidad;
      } else {
        usuario.cesta.push({ productoId, cantidad });
      }
  
      await usuario.save();
      res.status(200).json({ msg: "Producto añadido a la cesta" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al añadir producto a la cesta" });
    }
  };

// Eliminar de cesta
const quitarDeCesta = async (req, res) => {
    const { id } = req.usuarioId;
    const { productoId } = req.body;
  
    // Verificar que el usuario no sea admin
    if (req.usuarioId.rol === "admin") {
      return res.status(403).json({ msg: "Los administradores no pueden modificar la cesta." });
    }
  
    try {
      const usuario = await Usuario.findById(id);
  
      if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
  
      usuario.cesta = usuario.cesta.filter(
        (item) => item.productoId.toString() !== productoId
      );
      await usuario.save();
  
      res.status(200).json({ msg: "Producto eliminado de la cesta" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al quitar producto de la cesta" });
    }
  };
  

// Obtener favoritos y cesta
const obtenerFavoritosYCesta = async (req, res) => {
  const { id } = req.usuarioId;

  try {
    const usuario = await Usuario.findById(id)
      .populate("favoritos")
      .populate("cesta.productoId");

    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.status(200).json({
      favoritos: usuario.favoritos,
      cesta: usuario.cesta,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los favoritos y la cesta" });
  }
};

module.exports = {
  signup,
  login,
  obtenerUsuarios,
  agregarAFavoritos,
  quitarDeFavoritos,
  agregarACesta,
  quitarDeCesta,
  obtenerFavoritosYCesta,
};
