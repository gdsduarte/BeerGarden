module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: [
    '@react-native',
    'plugin:react/recommended',
  ],
  plugins: ['react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enable JSX
    },
    requireConfigFile: false,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [".eslintrc.js"],
};
