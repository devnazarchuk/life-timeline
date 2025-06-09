// life-calendar-app/jest.config.js
const nextJest = require('next/jest')({
  dir: './', // Path to Next.js app
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/store/(.*)$': '<rootDir>/src/store/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    // Add other aliases here if needed
  },
  // If using TypeScript with a baseUrl set to the root directory then you need the below for aliases to work
  modulePaths: ['<rootDir>'],
};

module.exports = nextJest(customJestConfig);
