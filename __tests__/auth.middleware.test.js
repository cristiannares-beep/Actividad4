const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const { authenticate } = require('../src/middlewares/auth');

jest.mock('jsonwebtoken');
jest.mock('../src/models/User');

describe('middleware authenticate', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('debe devolver 401 si no hay header Authorization', async () => {
    await authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Token') }));
    expect(next).not.toHaveBeenCalled();
  });

  it('debe devolver 401 si el token no empieza con Bearer', async () => {
    req.headers.authorization = 'Invalid token';
    await authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('debe devolver 401 si el token es inválido', async () => {
    req.headers.authorization = 'Bearer token-invalido';
    const err = new Error('invalid token');
    err.name = 'JsonWebTokenError';
    jwt.verify.mockImplementation(() => {
      throw err;
    });
    await authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('debe llamar a next y adjuntar req.user si el token es válido', async () => {
    req.headers.authorization = 'Bearer token-valido';
    jwt.verify.mockReturnValue({ id: 'user123' });
    const user = { _id: 'user123', email: 'test@test.com' };
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
    await authenticate(req, res, next);
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('debe devolver 401 si el usuario no existe en BD', async () => {
    req.headers.authorization = 'Bearer token-valido';
    jwt.verify.mockReturnValue({ id: 'user123' });
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    await authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
