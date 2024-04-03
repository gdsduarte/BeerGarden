module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: [
    '@react-native',
    'plugin:react/recommended',
  ],
  plugins: ['react', 'react-native', 'jsx'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
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
