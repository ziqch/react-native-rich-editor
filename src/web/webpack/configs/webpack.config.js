const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const root = path.resolve(__dirname, '../../');
module.exports = {
  entry: path.resolve(__dirname, '../../src/index.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: path.resolve(__dirname, '../../node_modules/babel-loader'),
            options: {
              presets: [
                [
                  path.resolve(
                    __dirname,
                    '../../node_modules/@babel/preset-env'
                  ),
                ],
              ],
            },
          },
          path.resolve(__dirname, '../../node_modules/ts-loader'),
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    quill: 'Quill',
  },
  output: {
    filename: 'index.js',
    path: path.resolve(root, './lib'),
    libraryTarget: 'umd',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../template/index.html'),
      inject: 'body',
    }),
  ],
};
