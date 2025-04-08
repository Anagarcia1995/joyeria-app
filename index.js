const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5000',
    methods: 'GET,POST,DELETE,PATCH',
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.log('Error en la conexión:', err));

app.use('/api/usuarios', userRoutes);  
app.use('/api/productos', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
