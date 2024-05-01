const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const TerserPlugin = require('./plugins/_TerserPlugin');
const CssMinimizerPlugin = require('./plugins/_CssMinimizer');
const getExternals = require('./externals');
const getPlugins = require('./plugins');
const getRules = require('./rules');
const { microxConfig } = require('../index');

process.on('uncaughtException', (err) => {
  console.log(err.stack); // eslint-disable-line
});

const cwd = process.cwd();

const {
  isProd,
  entry,
  extend,
  filename,
} = microxConfig;

module.exports = async function (opts = {}) { //eslint-disable-line
  const { analyse = false } = opts;
  const prod = isProd();
  const [rules, plugins] = await Promise.all([
    getRules(),
    getPlugins({ opts }),
  ]);

  const output = {
    globalObject: 'self',
    path: path.resolve(cwd, 'build'),
    publicPath: '/',
    hotUpdateMainFilename: 'static/[runtime].hot-update.json',
    filename: '[name].js',
    devtoolModuleFilenameTemplate: (info) => `file://${info.absoluteResourcePath.replace(/\\/g, '/')}`,
  };


  // 得到devtool配置
  const devtool = isProd ? false : 'eval-cheap-module-source-map';

  let config = {
    entry: {
      [filename]: entry || './src/index',
    },
    mode: prod ? 'production' : 'development',
    cache: prod ? false : {
      type: 'memory',
    },
    target: 'web',
    stats: {
      entrypoints: false,
      children: false,
      modules: false,
    },
    output,
    externals: getExternals(),
    resolve: {
      alias: {
        src: path.resolve(cwd, 'src'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.scss', '.css'],
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.join(__dirname, '..', 'node_modules'),
      ],
    },
    devtool,
    performance: {
      hints: false,
    },
    module: {
      rules,
    },
    plugins,
    optimization: prod ? {
      splitChunks: {},
      minimizer: [
        CssMinimizerPlugin(),
        TerserPlugin(),
      ],
    } : {},
  };

  if (extend) {
    config = merge(config, require(path.resolve(cwd, extend))({
      webpack,
      prod,
    }));
  }

  if (analyse) {
    const smp = new SpeedMeasurePlugin(); // 测量各个环节的速度
    config = smp.wrap(config);
  }

  return config;
};
