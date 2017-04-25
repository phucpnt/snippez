const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const fs = require('fs');

const devPort = 15106;
module.exports = (entry, rootModule, port = devPort) => {
  const config = {
    devtool: 'source-map',
    target: 'electron-renderer',
    externals: [nodeExternals({
      whitelist: [/\.css/],
      modulesDir: path.join(__dirname, '../tmp/node_modules'),
    })],
    entry: entry || {},
    output: {
      path: path.join(__dirname, '../../dist'),
      publicPath: `http://localhost:${port}/gist-a2/`,
      filename: '[name].js',
    },
    resolve: {
      modules: rootModule,
      alias: {},
    },
    module: {
      noParse: /lodash/,
      loaders: [{
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: [
          {loader: 'babel-loader', options: {presets: ['es2015', 'react']}}
        ],
      }, {
        test: /\.less$/,
        loader: 'style-loader!css-loader?sourceMap!less-loader?sourceMap',
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader?sourceMap',
      }, {
        test: /\.(png|jpg|svg|gif|eot|woff|ttf)$/,
        loader: 'url-loader',
      },],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
    profile: true,
  };

  return config;
};
