const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyFilesPlugin = require('../../plugins/plugin-webpack');
const { microConfig, utils } = require('../../index');

const {
  name,
  isProd,
  cssExtract,
} = microConfig;


module.exports = async ({ opts = {}, storybook, filename }) => {
  const plugins = [
    new CaseSensitivePathsPlugin(),
    new NodePolyfillPlugin({
      excludeAliases: ['console', 'https', 'http', 'querystring', 'process'],
    }),
  ];

  const prod = isProd();
  const { analyse = false } = opts;

  if (prod) {
    if (cssExtract) {
      plugins.push(new MiniCssExtractPlugin({
        filename: filename || '[name].css',
      }));
    }
    if (analyse) { // Analysis
      plugins.push(new BundleAnalyzerPlugin({
        analyzerPort: 10086,
        openAnalyzer: true,
      }));
      utils.info('🚀   已启用性能分析模式...');
    }
    plugins.push(new CopyFilesPlugin({ source: 'src/config/schema.json' }));
  } else {
    // Dev Plugin
    plugins.push(
      new WebpackBar(),
      new WebpackBuildNotifierPlugin({
        title: 'Webpack',
        suppressSuccess: true,
      }),
    );
    const templateParams = {};
    plugins.unshift(new HtmlWebpackPlugin({
      ...templateParams,
      template: 'index.html',
      inject: false,
    }));
  }

  return plugins;
};
