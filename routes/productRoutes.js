const express = require('express');
const { crearProducto, obtenerProductos, actualizarProducto, eliminarProducto } = require('../controllers/productController');
const router = express.Router();

router.post('/', crearProducto);
router.get('/', obtenerProductos);
router.patch('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;
