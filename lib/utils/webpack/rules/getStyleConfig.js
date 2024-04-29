const { microxConfig } = require('../../index');

module.exports = (id, cssBaseLoader) => {
  const { name, cssNamespace = true, cssNamespaceIgnores = [], isSpecialMicroApp, isCommonMicroApp } = microxConfig;

  const useList = [
    cssBaseLoader,
    require.resolve('css-loader'),
  ];

  // 为需要的微应用css增加前缀插件 - @ali/postcss-plugin-cs
  if (name && !isSpecialMicroApp && !isCommonMicroApp && cssNamespace) {
    // const prefix = require('@ali/postcss-plugin-cs');
    // const ignore = cssNamespaceIgnores.map((item) => (item.startsWith('REG:') ? new RegExp(item.replace('REG:', '')) : item));

    useList.push({
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          // plugins: [prefix(`.micro-app-${name}`, { ignore })],
        },
      },
    });
  }

  const [loader, test] = {
    scss: ['sass-loader', /\.scss$/],
    less: ['less-loader', /\.less$/],
  }[id];

  useList.push({
    loader: require.resolve(loader),
  });

  return {
    test,
    use: useList,
  };
};
