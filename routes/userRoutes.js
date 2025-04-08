const express = require('express');
const { crearProducto, obtenerProductos } = require('../controllers/productController');
const { actualizarRol } = require('../controllers/userController');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Solo usuarios con token válido pueden acceder
router.post('/', verificarToken, verificarAdmin, crearProducto); // Solo admin puede crear productos
router.get('/', obtenerProductos); // Todos los usuarios pueden ver productos
router.patch('/admin/actualizar-rol/:id', verificarToken, verificarAdmin, actualizarRol);


module.exports = router;
