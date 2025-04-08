const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); 

    console.log("Token extraído:", token); 

    if (!token) {
        return res.status(401).json({ msg: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.usuarioId = decoded.id;  
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error); 
        return res.status(400).json({ msg: 'Token inválido' });
    }
};

module.exports = verificarToken;
