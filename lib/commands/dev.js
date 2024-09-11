
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const fs = require('fs-extra');
const webpackConfig = require('../utils/webpack');
const { microConfig, utils } = require('../utils');

const cwd = process.cwd(); // 工作目录

const {
  proxy,
  port: microPort,
  mockServer,
} = microConfig;

const hasLocalDataFile = fs.pathExistsSync(path.join(cwd, 'data'));


module.exports = async function (opts = {}) {
  const { host: cliHost, port: cliPort, analyse } = opts;

  const host = cliHost || 'localhost';
  const port = cliPort || microPort || '8888';
  const dataDir = path.join(cwd, 'data');


  const config = await webpackConfig({ analyse });

  const options = {
    compress: true,
    port,
    host,
    allowedHosts: 'all',
    static: [dataDir], // localhost可访问的静态目录
    open: true,
    client: {
      progress: true,
      logging: 'error',
      overlay: {
        errors: true,
        warnings: false,
      },
      reconnect: false,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Private-Network': true,
    },
    historyApiFallback: {
      index: 'index.html',
      rewrites: [
        {
          from: /./,
          to: '/index.html',
        },
      ],
    },
    proxy: {
      '**/!(*hot-update).json': {
        target: mockServer,
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        bypass(req) {
          if (!hasLocalDataFile) {
            return;
          }

          const apiName = req.url.match(/\/(\w+\.json)/);
          console.log('apiName', apiName);
          if (!apiName) {
            return;
          }

          const localFileExist = fs.existsSync(
            path.resolve(cwd, 'data', apiName[1]),
          );
          if (localFileExist) {
            utils.info(`${apiName[1]} match local file: [${path.resolve(cwd, 'data', apiName[1])}]`);
            return `/${apiName[1]}`;
          }
        },
      },
      ...proxy, // 自定义代理配置
    },
  };

  const compiler = webpack(config);

  const server = new WebpackDevServer(options, compiler);
  server.listen(port, host, () => utils.info(`Webpack dev server running at http://${host}:${port}`));
};
