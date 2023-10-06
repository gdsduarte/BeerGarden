module.exports = {
  root: true,
  parser: '@babel/eslint-parser', // Use Babel's ESLint parser
  extends: [
    '@react-native',
    'plugin:react/recommended',  // Use recommended rules from eslint-plugin-react
  ],
  plugins: ['react'], // Use eslint-plugin-react
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enable JSX
    },
    requireConfigFile: false, // Add this line to disable the requirement for a Babel config file
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
  ignorePatterns: [".eslintrc.js"], // Add this line to exclude the ESLint config file from being parsed
};
