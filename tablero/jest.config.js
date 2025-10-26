module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};