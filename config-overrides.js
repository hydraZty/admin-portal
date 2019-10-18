const {
  override,
  fixBabelImports,
  addLessLoader,
  overrideDevServer
} = require('customize-cra');


const devServerConfig = () => config => {
  return {
    ...config,
    port: 3000,
    proxy: {
      '/user': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: false,
        pathRewrite: { '^/user': '' },
        secure: false,
      },
      '/arborist': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: false,
        pathRewrite: { '^/arborist': '' },
        secure: false,
      },
    },
  };
};


module.exports = {
  webpack: override(
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
        '@primary-color': '#ef8523',
        '@background-color-light': '#fff',
        '@table-row-hover-bg': '#f5f5f5',
      },
    }),
  ),

  devServer: overrideDevServer(
    // dev server plugin
    devServerConfig()
  )
};
