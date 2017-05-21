const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const nodeExternals = require('webpack-node-externals');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const path = require('path');
const fs = require('fs');

const common = require('./webpack.config.common');

const devPort = 15106;
const basedir = path.join(__dirname, '../tmp');
module.exports = (entry, rootModule, port = devPort) => {
  const config = webpackMerge(common({rootModule}), {
    target: 'electron-renderer',
    entry: entry || {},
    output: {
      path: path.join(__dirname, '../../dist'),
      publicPath: `http://localhost:${port}/gist-a2/`,
      filename: '[name].js',
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
  });

  return config;
};
