const express = require('express');
const { signup, login, obtenerUsuarios,
        agregarAFavoritos, quitarDeFavoritos,
        agregarACesta, quitarDeCesta, obtenerFavoritosYCesta
    } = require('../controllers/userController');
const verificarToken  = require('../middleware/auth'); 
const router = express.Router();

router.post('/signup', signup); 
router.post('/login', login);  

router.post('/favoritos', verificarToken, agregarAFavoritos);
router.post('/cesta', verificarToken, agregarACesta);

router.get('/', verificarToken, obtenerUsuarios);  
router.get('/favoritos-cesta', verificarToken, obtenerFavoritosYCesta);

router.delete('/favoritos', verificarToken, quitarDeFavoritos);
router.delete('/cesta', verificarToken, quitarDeCesta);

console.log('Rutas de usuarios registradas correctamente');

module.exports = router;
