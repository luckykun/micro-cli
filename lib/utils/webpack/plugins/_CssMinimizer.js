const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = () => new CssMinimizerPlugin({
  parallel: 2,
  minimizerOptions: {

  },
});
