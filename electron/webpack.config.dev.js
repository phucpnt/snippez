const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const path = require('path');
const fs = require('fs');

const devPort = 15106;
const basedir = path.join(__dirname, '../tmp');
module.exports = (entry, rootModule, port = devPort) => {
  const config = {
    devtool: 'source-map',
    target: 'electron-renderer',
    // externals: [nodeExternals({
    //   whitelist: [/\.css/],
    //   modulesDir: rootModule[0],
    // })],
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
      // noParse: /lodash/,
      loaders: [{
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader', options: {
              presets: ['es2015', 'react'],
              plugins: ['transform-es2015-modules-commonjs']
            }
          }
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
      new NpmInstallPlugin({
        // Use --save or --save-dev
        dev: false,
        // Install missing peerDependencies
        peerDependencies: true,
        // Reduce amount of console logging
        quiet: false,
        basedir: path.join(rootModule[0], '..'),
      })
    ],
    profile: true,
  };

  return config;
};
