const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ msg: 'Acceso denegado, no se proporcionó token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;  // Guardamos el usuario decodificado en la solicitud
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token inválido' });
    }
}

// Middleware para verificar si el usuario es admin
const verificarAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ msg: 'Acceso denegado, se requiere rol de administrador' });
    }
    next();
}

module.exports = { verificarToken, verificarAdmin };
