/** @type {import('jest').Config} */
export default {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.spec.json', stringifyContentPathRegex: '\\.html$' }
    ]
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'mjs', 'json'],
  testMatch: ['**/?(*.)+(spec).ts'],
  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/app/**/*.{ts}',
    '!src/main.ts',
    '!src/environments/**',
    '!**/*.module.ts'
  ],
  coverageDirectory: '<rootDir>/coverage'
};
