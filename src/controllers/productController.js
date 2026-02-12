const Product = require('../models/Product');

/**
 * Listar todos los productos
 */
exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.find().populate('createdBy', 'email').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtener un producto por ID
 */
exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'email');
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(product);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID de producto inválido.' });
    }
    next(err);
  }
};

/**
 * Crear producto
 */
exports.create = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos.' });
    }
    const product = await Product.create({
      name,
      description: description || '',
      price: Number(price),
      stock: Number(stock) || 0,
      createdBy: req.user._id,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

/**
 * Actualizar producto
 */
exports.update = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...(name !== undefined && { name }), ...(description !== undefined && { description }), ...(price !== undefined && { price }), ...(stock !== undefined && { stock }) },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(product);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID de producto inválido.' });
    }
    next(err);
  }
};

/**
 * Eliminar producto
 */
exports.delete = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID de producto inválido.' });
    }
    next(err);
  }
};
