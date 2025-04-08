const Producto = require('../models/productModel');

const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, imagen } = req.body;
        const nuevoProducto = new Producto({ nombre, descripcion, precio, imagen });
        await nuevoProducto.save();
        
        res.status(201).json({ msg: 'Producto creado exitosamente', producto: nuevoProducto });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el producto' });
    }
};

const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los productos' });
    }
}

const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen } = req.body;
    
    try {
        // Verificar si el producto existe
        const productoExistente = await Producto.findById(id);
        if (!productoExistente) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Actualizar el producto
        productoExistente.nombre = nombre || productoExistente.nombre;
        productoExistente.descripcion = descripcion || productoExistente.descripcion;
        productoExistente.precio = precio || productoExistente.precio;
        productoExistente.imagen = imagen || productoExistente.imagen;

        await productoExistente.save();
        
        res.status(200).json({ msg: 'Producto actualizado exitosamente', producto: productoExistente });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el producto' });
    }
}

const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verificar si el producto existe
        const productoExistente = await Producto.findById(id);
        if (!productoExistente) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Eliminar el producto
        await Producto.findByIdAndDelete(id);
        
        res.status(200).json({ msg: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el producto' });
    }
}

module.exports = { crearProducto, obtenerProductos, actualizarProducto, eliminarProducto };
