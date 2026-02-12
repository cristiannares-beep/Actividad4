const authController = require('../src/controllers/authController');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

jest.mock('../src/models/User');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token-fake'),
}));

describe('authController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debe devolver 400 si faltan email o contraseña', async () => {
      req.body = {};
      await authController.register(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('debe devolver 400 si el email ya está registrado', async () => {
      req.body = { email: 'ya@test.com', password: '123456' };
      User.findOne.mockResolvedValue({ email: 'ya@test.com' });
      await authController.register(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('registrado') }));
    });

    it('debe crear usuario y devolver 201 con token', async () => {
      req.body = { email: 'nuevo@test.com', password: '123456' };
      User.findOne.mockResolvedValue(null);
      const userCreated = { _id: 'user123', email: 'nuevo@test.com' };
      User.create.mockResolvedValue(userCreated);
      await authController.register(req, res, next);
      expect(User.create).toHaveBeenCalledWith({ email: 'nuevo@test.com', password: '123456' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
          token: 'token-fake',
          user: expect.objectContaining({ email: 'nuevo@test.com' }),
        })
      );
    });
  });

  describe('login', () => {
    it('debe devolver 400 si faltan email o contraseña', async () => {
      req.body = {};
      await authController.login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('debe devolver 401 si el usuario no existe', async () => {
      req.body = { email: 'no@test.com', password: '123456' };
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
      await authController.login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Credenciales') }));
    });

    it('debe devolver 401 si la contraseña no coincide', async () => {
      req.body = { email: 'user@test.com', password: 'wrong' };
      const user = { _id: 'u1', email: 'user@test.com', comparePassword: jest.fn().mockResolvedValue(false) };
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
      await authController.login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Credenciales') }));
    });

    it('debe devolver 200 con token si las credenciales son correctas', async () => {
      req.body = { email: 'user@test.com', password: '123456' };
      const user = { _id: 'u1', email: 'user@test.com', comparePassword: jest.fn().mockResolvedValue(true) };
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
      await authController.login(req, res, next);
      expect(res.status).not.toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
          token: 'token-fake',
          user: expect.objectContaining({ email: 'user@test.com' }),
        })
      );
    });
  });
});
