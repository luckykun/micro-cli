
const webpack = require('webpack');
const { utils } = require('../utils');
const webpackConfig = require('../utils/webpack');


module.exports = async function (options) {
  process.env.NODE_ENV = 'production';
  const config = await webpackConfig({ ...options });

  await new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        utils.error(err);
        reject();
      } else {
        utils.success(stats && stats.toString({
          entrypoints: false,
          children: false,
          modules: false,
          colors: true,
        }));
        resolve();
      }
    });
  });
};
