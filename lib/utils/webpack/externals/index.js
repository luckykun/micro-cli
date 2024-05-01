
const { microxConfig } = require('../../index');

const {
  isVendor,
  customExternals,
} = microxConfig;


module.exports = () => {
  const vendorExternalConfig = {
    react: '__miReact',
    'react-dom': '__miReactDOM',
    'react-router-dom': '__miReactRouterDOM',
  };

  // 你的项目可以单独全局引入echarts等资源，那么单个微应用就不需要以来这些资源了
  const globalExternalConfig = {
    echarts: 'echarts',
    d3: 'd3',
    '@antv/g2': 'G2',
    '@antv/g6': 'G6',
  };

  // 如果是vendor项目，那就不需要externals配置
  return isVendor ? {} : {
    ...vendorExternalConfig,
    ...globalExternalConfig,
    ...customExternals,
  };
};
