const { defaults } = require('jest-expo/jest-preset');

module.exports = {
  ...defaults,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    'App.js',
    '!**/coverage/**',
    '!**/node_modules/**',
  ],
  testMatch: ['**/__tests__/**/*.test.{js,jsx}'],
  testEnvironment: 'jsdom',
  globals: {
    __DEV__: true,
  },
};
