const Producto = require('../models/productModel');

const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, imagen } = req.body;
        const nuevoProducto = new Producto({ nombre, descripcion, precio, imagen});
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

module.exports = { crearProducto, obtenerProductos}