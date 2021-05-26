const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  output: {
    filename: 'jsmigemo.js',
    path: path.resolve(__dirname, 'umd'),
    library: 'jsmigemo',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.ts(x*)?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};