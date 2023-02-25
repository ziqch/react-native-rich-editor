const base = require('./webpack.config');
const ConvertRawCodePlugin = require('../plugins/Code2EvalString');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
module.exports = {
  ...base,
  mode: 'production',
  plugins: [
    ...base.plugins,
    new HtmlInlineScriptPlugin(),
    new ConvertRawCodePlugin(),
  ],
};
