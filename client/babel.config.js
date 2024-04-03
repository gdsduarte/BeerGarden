/* eslint-disable prettier/prettier */
module.exports = function (api) {
  api.cache(true);

  const presets = ['module:metro-react-native-babel-preset'];
  const plugins = [
    'module:react-native-dotenv',
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        extensions: [
          '.ios.js',
          '.android.js',
          '.ios.jsx',
          '.android.jsx',
          '.js',
          '.jsx',
          '.json',
          '.ts',
          '.tsx',
        ],
        alias: {
          '@components': './src/components',
          '@hooks': './src/hooks/index',
          '@navigation': './src/navigation',
          '@screens': './src/screens/index',
          '@contexts': './src/contexts',
          '@utils': './src/utils',
          '@services': './src/services',
        },
      },
    ],
  ];

  if (process.env.ENV === 'prod') {
    // If you have any production-specific plugins, push them to the plugins array here
    // plugins.push(...);
  }

  return {
    presets,
    plugins,
  };
};
