const path = require('path');

module.exports = {
  entry: './dist/lib/index.js',
  output: {
    filename: 'jsmigemo.js',
    path: path.resolve(__dirname, './'),
    library: 'jsmigemo',
    libraryTarget: 'umd'
  }
};