const webpackConfig = require('../configs/webpack.config');
class Code2EvalString {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('Code2EvalString', (compilation, callback) => {
      const source = compilation.assets['index.html'].source();
      delete compilation.assets['index.html'];
      const json = JSON.stringify(source)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
      const content = `export default ${json}`;
      compilation.assets[webpackConfig.output.filename] = {
        source() {
          return content;
        },
        size() {
          return content.length;
        },
      };
      callback();
    });
  }
}

module.exports = Code2EvalString;
