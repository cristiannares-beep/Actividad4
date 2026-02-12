const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * Registro de nuevo usuario
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }
    const user = await User.create({ email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Usuario registrado correctamente.',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Inicio de sesión
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }
    const token = generateToken(user._id);
    res.json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};
