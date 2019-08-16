const path = require('path');

module.exports = {
  entry: './lib/index.js',
  mode: 'production',
  output: {
    filename: './dist/jsmigemo.js',
    path: path.resolve(__dirname, './'),
    library: 'jsmigemo',
    libraryTarget: 'umd'
  }
};