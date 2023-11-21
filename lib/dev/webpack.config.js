const path = require('path');
const webpack = require('webpack');
const csConfig = require('@ali/cs-config');
const utils = require('@ali/cs-utils');
const fs = require('fs-extra');
const { mergeWithRules } = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const TerserPlugin = require('../utils/plugins/_TerserPlugin');
const CssMinimizerPlugin = require('../utils/plugins/_CssMinimizer');
const getPlugins = require('../utils/plugins');
const getRules = require('../utils/rules');
const cons = require('../utils/constants');
const { createMFEntry } = require('../utils/transfer');

process.on('uncaughtException', (err) => {
  console.log(err.stack); // eslint-disable-line
});

const cwd = process.cwd();

const {
  prod,
  entry,
  extend,
  MF = {},
  noChunk,
  filename,
  microApp,
  sourceMap,
  ydExternals,
  isCommonMicroApp,
  copyToBuildPaths, // cs build 时拷贝到build文件夹的路径
} = csConfig;

module.exports = async function (opts = {}) { //eslint-disable-line
  const {
    profile = false,
    childApp,
  } = opts;
  const [rules, plugins] = await Promise.all([getRules(), getPlugins({ opts })]);

  if (!microApp && !noChunk) {
    utils.error('vendor相关配置已移除，请在abc.json文件增加配置 "noChunk": true');
  }

  const { name: projectName } = require(path.resolve(cwd, 'package.json'));
  MF.enable && createMFEntry();

  const outputFilename = MF.enable && ((microApp && microApp.name !== 'root') || ydExternals) ? 'main.[name].js' : '[name].js';
  const output = {
    globalObject: 'self',
    path: path.resolve(cwd, process.env.BUILD_DEST || 'build'),
    publicPath: MF.enable ? 'auto' : '/',
    hotUpdateMainFilename: 'static/[runtime].hot-update.json',
    filename: outputFilename,
    devtoolModuleFilenameTemplate: (info) => `file://${info.absoluteResourcePath.replace(/\\/g, '/')}`,
    uniqueName: ydExternals ? 'ydExternals' : `${isCommonMicroApp ? 'com' : projectName}${microApp.name || ''}`,
  };

  // cs build 命令需要拷贝文件
  if (prod && copyToBuildPaths) {
    copyToBuildPaths.forEach((p) => {
      const name = p.slice(p.lastIndexOf('/') + 1);
      fs.copySync(path.resolve(cwd, p), `${output.path}/${name}`);
    });
  }

  // 得到devtool配置
  let devtool = 'eval-cheap-module-source-map';
  // let devtool = 'source-map';

  if (prod) {
    if (sourceMap) {
      devtool = 'hidden-source-map';
    } else {
      devtool = false;
    }
  }

  const defaultEntry = (!prod && (childApp || ydExternals)) ? './demo/index' : './src/index';

  let MFEntry;
  if (MF.enable) {
    if (prod) {
      MFEntry = microApp.name === 'root' ? './src/bootstrap' : './src/index';
    } else {
      MFEntry = (childApp || ydExternals) ? './demo/bootstrap' : isCommonMicroApp ? './src/index' : './src/bootstrap';
    }
  }

  let config = {
    entry: typeof entry === 'object' ? entry : {
      [filename]: MFEntry || entry || defaultEntry,
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
    externals: cons.externals,
    resolve: {
      alias: cons.alias,
      extensions: cons.extensions,
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
    } : { },
  };

  if (extend) {
    const extendConfig = require(path.resolve(cwd, extend))({
      webpack,
      prod,
    });
    const configurations = Array.isArray(extendConfig) ? extendConfig : [extendConfig];
    config = mergeWithRules({
      module: {
        rules: {
          test: 'match',
          use: 'replace',
        },
      },
    })(config, ...configurations);
  }

  if (profile) {
    const smp = new SpeedMeasurePlugin(); // 测量各个环节的速度
    config = smp.wrap(config);
  }

  return config;
};
