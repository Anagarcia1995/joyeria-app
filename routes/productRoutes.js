const express = require('express');
const { crearProducto, obtenerProductos } = require('../controllers/productController');
const router = express.Router();



router.post('/', crearProducto);
router.get('/', obtenerProductos),

module.exports = router;