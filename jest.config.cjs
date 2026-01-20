module.exports = {
  testEnvironment: 'jsdom',
  // Solo ejecutar archivos .jest.js (no .test.js que son para Vitest)
  testMatch: [
    '**/*.jest.{js,jsx,ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '\\.test\\.(js|jsx|ts|tsx)$',  // Ignorar archivos .test.* (son para Vitest)
  ],
  transform: {},
};
