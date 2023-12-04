const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { microxConfig, utils } = require('../../index');

const {
  name,
  isProd,
  cssExtract,
} = microxConfig;


// const getTemplateParams = ({ globalResources = {}, appInstances = {}, ...rest }) => {
//   const { js, css } = globalResources;
//   const globalCss = css.map((item) => `<link rel="stylesheet" href="${item}" />`);
//   const globalJs = js.map((item) => ` <script src="${item}"></script>`);

//   return {
//     title: `${name === 'root' ? '主应用' : '子应用'} - ${name}`,
//     style: globalCss.join('\n'),
//     script: globalJs.join('\n'),
//     microConfig: JSON.stringify({ appInstances }, null, 2),
//     ...rest, // 包括平台配置的公共变量和项目变量
//   };
// };

module.exports = async ({ opts = {}, storybook, filename }) => {
  const plugins = [
    new CaseSensitivePathsPlugin(),
    new NodePolyfillPlugin({
      excludeAliases: ['console', 'https', 'http', 'querystring', 'process'],
    }),
  ];

  const prod = isProd();

  // if (storybook) {
  //   return plugins; // storybook环境不往后执行了
  // }

  // plugins = plugins.concat([
  //   new ImageMinimizerPlugin({
  //     minimizerOptions: {
  //       plugins: [
  //         ['gifsicle', { interlaced: true, optimizationLevel: 3 }],
  //         ['jpegtran', { progressive: true }],
  //         ['optipng', { optimizationLevel: 7 }], // 最大了
  //       ],
  //     },
  //   }),
  //   new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh|en|ja/),
  // ]);

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
    // if (microApp || useMicrox) { // 微应用项目获取当前项目的资源配置（本地需要）
    //   const appResourceConfig = await utils.getMicroAppResources();
    // templateParams = getTemplateParams(appResourceConfig);
    // }
    plugins.unshift(new HtmlWebpackPlugin({
      ...templateParams,
      template: 'index.html',
      inject: false,
    }));
  }

  return plugins;
};
