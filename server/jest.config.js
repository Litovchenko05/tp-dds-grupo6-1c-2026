export default {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.js'],
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],
  collectCoverageFrom: [
    'src/services/**/*.js',
    'src/models/**/*.js',
    '!src/**/*.enum.js',
    '!node_modules/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/repositories/'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}
