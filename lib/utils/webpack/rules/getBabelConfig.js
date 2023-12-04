const { presets, plugins, sourceType } = require('./babel.config.json');

// 给包名增加 require.resolve 获取完整的路径
const formatter = (list) => list.map((item) => {
  if (typeof item === 'string') {
    return require.resolve(item);
  }
  return [require.resolve(item[0]), item[1]];
});

module.exports = (skyComponentNames) => {
  const newPlugins = formatter(plugins);
  const newPresets = formatter(presets);
  if (skyComponentNames) {
    newPlugins.unshift([
      require.resolve('@ali/babel-plugin-cs'), {
        skyComponents: skyComponentNames,
      },
    ]);
  }

  return {
    plugins: newPlugins,
    presets: newPresets,
    sourceType,
  };
};
