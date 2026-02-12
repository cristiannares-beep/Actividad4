const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middlewares/auth');

// Todas las rutas de productos requieren autenticación JWT
router.use(authenticate);

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router;
