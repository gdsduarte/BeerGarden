module.exports = function (api) {
  api.cache(true);

  const presets = ['module:metro-react-native-babel-preset'];
  const plugins = []; // Initialize plugins as an empty array

  if (process.env.ENV === 'prod') {
    // If you have any production-specific plugins, push them to the plugins array here
    // plugins.push(...);
  }

  return {
    presets,
    plugins,
  };
};
