const productController = require('../src/controllers/productController');
const Product = require('../src/models/Product');

jest.mock('../src/models/Product');

describe('productController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {}, user: { _id: 'user123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('debe devolver lista de productos', async () => {
      const products = [{ _id: '1', name: 'Prod1', price: 10 }];
      Product.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(products),
      });
      await productController.getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(products);
    });
  });

  describe('getById', () => {
    it('debe devolver 404 si el producto no existe', async () => {
      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      req.params.id = '507f1f77bcf86cd799439011';
      await productController.getById(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('no encontrado') }));
    });

    it('debe devolver el producto si existe', async () => {
      const product = { _id: '507f1f77bcf86cd799439011', name: 'Prod', price: 5 };
      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(product),
      });
      req.params.id = '507f1f77bcf86cd799439011';
      await productController.getById(req, res, next);
      expect(res.json).toHaveBeenCalledWith(product);
    });
  });

  describe('create', () => {
    it('debe devolver 400 si faltan nombre o precio', async () => {
      req.body = {};
      await productController.create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('debe crear producto y devolver 201', async () => {
      req.body = { name: 'Nuevo', price: 99, description: 'Desc', stock: 5 };
      const created = { _id: 'p1', name: 'Nuevo', price: 99, createdBy: 'user123' };
      Product.create.mockResolvedValue(created);
      await productController.create(req, res, next);
      expect(Product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Nuevo',
          price: 99,
          createdBy: 'user123',
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });
  });

  describe('update', () => {
    it('debe devolver 404 si el producto no existe', async () => {
      Product.findByIdAndUpdate.mockResolvedValue(null);
      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { name: 'Actualizado' };
      await productController.update(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('no encontrado') }));
    });

    it('debe actualizar y devolver el producto', async () => {
      const updated = { _id: 'p1', name: 'Actualizado', price: 15 };
      Product.findByIdAndUpdate.mockResolvedValue(updated);
      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { name: 'Actualizado', price: 15 };
      await productController.update(req, res, next);
      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });

  describe('delete', () => {
    it('debe devolver 404 si el producto no existe', async () => {
      Product.findByIdAndDelete.mockResolvedValue(null);
      req.params.id = '507f1f77bcf86cd799439011';
      await productController.delete(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('no encontrado') }));
    });

    it('debe eliminar y devolver mensaje de éxito', async () => {
      Product.findByIdAndDelete.mockResolvedValue({ _id: 'p1' });
      req.params.id = '507f1f77bcf86cd799439011';
      await productController.delete(req, res, next);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('eliminado') }));
    });
  });
});
