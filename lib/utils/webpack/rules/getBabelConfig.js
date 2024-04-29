const path = require('path');
const { presets, plugins, sourceType } = require('./babel.config.json');

// 给包名增加 require.resolve 获取完整的路径
const formatter = (list) => list.map((item) => {
  if (typeof item === 'string') {
    return require.resolve(item);
  }
  return [require.resolve(item[0]), item[1]];
});

module.exports = () => {
  const newPlugins = formatter(plugins);
  const newPresets = formatter(presets);

  newPlugins.unshift([
    path.resolve(__dirname, '../../plugins/plugin-babel'), // 获取插件完整路径
  ]);

  return {
    plugins: newPlugins,
    presets: newPresets,
    sourceType,
  };
};
