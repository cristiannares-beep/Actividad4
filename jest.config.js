module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js', '!src/app.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  forceExit: true,
};
