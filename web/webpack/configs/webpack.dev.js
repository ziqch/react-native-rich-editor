const webpack = require('webpack');
const base = require('./webpack.config');
module.exports = {
  ...base,
  mode: 'development',
  devServer: {
    static: false,
    hot: true,
    port: 9000,
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), ...base.plugins],
};
