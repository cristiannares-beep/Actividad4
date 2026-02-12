require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Raíz: redirigir al login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Vista estática para login (raíz public/ para Vercel y local)
const loginDir = path.join(__dirname, '..', 'public', 'login');
app.use('/login', express.static(loginDir));
app.get('/login', (req, res) => {
  res.sendFile(path.join(loginDir, 'index.html'));
});

// API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API de gestión de productos' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
}

module.exports = app;
