const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getStyleConfig = require('./getStyleConfig');
const getBabelConfig = require('./getBabelConfig');
const { microxConfig, utils } = require('../../index');

const {
  isProd,
  cssExtract,
} = microxConfig;

const cwd = process.cwd();
const assetConfig = {
  type: 'asset',
  parser: {
    dataUrlCondition: (source, { module }) => {
      const size = source.length;
      if (size > 10240) { // 10kb
        utils.warn(`${module.rawRequest}：超过10kb，请使用图床进行单独管理，不然打包会非常大`);
        return false;
      }
      return true;
    },
  },
};

const rules = {
  css: {
    test: /\.css$/,
    rules: [
      {
        use: [{ loader: require.resolve('css-loader') }],
      },
    ],
  },
  jsx: {
    test: /\.(js|ts)x?$/,
    include: [
      path.resolve(cwd, 'src'),
    ],
    use: [],
  },
  json5: {
    test: /\.json5$/,
    loader: require.resolve('json5-loader'),
  },
  svg: {
    test: /\.svg$/,
    exclude: [/node_modules/],
    use: require.resolve('svg-react-loader'),
  },
  asset: {
    test: /\.(png|jpg|gif|jpeg|ttf|eot|woff|woff2)$/,
    ...assetConfig,
  },
  webworker: {
    test: /\.worker\.(js|ts)$/i,
    use: [{
      loader: 'raw-loader',
    }],
  },
};


module.exports = async (storybook) => {
  // let skyComponentNames = null;
  // if (microApp || useMicrox || experimental || ydExternals) {
  //   skyComponentNames = await utils.getUiComponentNames(); // sky库的所有组件名（本地、线上均需要）
  // }

  const prod = isProd();
  const cssBaseLoader = (prod && cssExtract && !storybook) ? MiniCssExtractPlugin.loader : require.resolve('style-loader');

  rules.scss = getStyleConfig('scss', cssBaseLoader);
  rules.less = getStyleConfig('less', cssBaseLoader);
  rules.css.rules.unshift({
    use: [{ loader: cssBaseLoader }],
  });

  rules.jsx.use.push({
    loader: require.resolve('babel-loader'),
    options: {
      ...getBabelConfig(),
      // cacheDirectory: !prod,
      cacheDirectory: false, // TODO: 应该开启缓存
    },
  });

  return [
    rules.css,
    rules.scss,
    rules.less,
    rules.jsx,
    rules.svg,
    rules.json5,
    rules.asset,
    rules.webworker,
  ];
};
