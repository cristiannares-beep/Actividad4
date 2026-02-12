const request = require('supertest');
jest.mock('../src/models/User');
jest.mock('../src/models/Product');
jest.mock('jsonwebtoken');

const app = require('../src/app');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const jwt = require('jsonwebtoken');

describe('Rutas API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('debe responder 200 con status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  describe('POST /api/auth/register', () => {
    it('debe devolver 400 sin body', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('debe registrar y devolver 201 con token', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: 'u1', email: 'new@test.com' });
      jwt.sign.mockReturnValue('fake-jwt');
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'new@test.com', password: '123456' });
      expect(res.status).toBe(201);
      expect(res.body.token).toBe('fake-jwt');
      expect(res.body.user.email).toBe('new@test.com');
    });
  });

  describe('POST /api/auth/login', () => {
    it('debe devolver 400 sin credenciales', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.status).toBe(400);
    });

    it('debe devolver 200 con token si login correcto', async () => {
      const user = { _id: 'u1', email: 'u@test.com', comparePassword: jest.fn().mockResolvedValue(true) };
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
      jwt.sign.mockReturnValue('fake-jwt');
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'u@test.com', password: '123456' });
      expect(res.status).toBe(200);
      expect(res.body.token).toBe('fake-jwt');
    });
  });

  describe('Rutas /api/products (protegidas)', () => {
    it('GET /api/products sin token debe devolver 401', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('POST /api/products sin token debe devolver 401', async () => {
      const res = await request(app).post('/api/products').send({ name: 'P', price: 1 });
      expect(res.status).toBe(401);
    });

    it('GET /api/products con token válido debe devolver 200', async () => {
      jwt.verify.mockReturnValue({ id: 'user123' });
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'user123', email: 'a@b.com' }) });
      Product.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
      });
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('404', () => {
    it('ruta inexistente debe devolver 404', async () => {
      const res = await request(app).get('/api/ruta-inexistente');
      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });
  });
});
