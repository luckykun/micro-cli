const TerserPlugin = require('terser-webpack-plugin');

module.exports = () => new TerserPlugin({
  parallel: 2,
  terserOptions: {
    compress: {
      pure_funcs: [
        'console.log',
        'console.info',
        'console.debug',
        'console.warn',
      ],
    },
    format: {
      comments: false,
    },
  },
  extractComments: false,
});
