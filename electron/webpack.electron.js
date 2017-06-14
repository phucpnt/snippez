const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  devtool: 'source-map',
  entry: {
    'main.prod.js': path.join(__dirname, './main.js'),
  },
  externals: [nodeExternals()],
  output:{
    path: path.join(__dirname, '../dist/electron'),
    filename: '[name]',
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules|__test__)/,
      use: [
        {
          loader: 'babel-loader', options: {
            presets: ['es2015'],
            plugins: ['transform-es2015-modules-commonjs']
          }
        }
      ],
    },],
  },
  plugins: [
    new webpack.ProvidePlugin({
      'console': 'electron-log',
    })
  ],
  profile: true,
}
