// Evitar que los tests intenten conectar a MongoDB real
jest.mock('./src/config/db', () => ({
  __esModule: true,
  default: jest.fn(),
}));
