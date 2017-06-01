const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const nodeExternals = require('webpack-node-externals');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const path = require('path');
const fs = require('fs');

const common = require('./webpack.config.common');

module.exports = ({entry, rootModule, snippetName, outputPath}) => {
  const config = webpackMerge(common({rootModule}), {
    target: 'web',
    entry: entry || {},
    output: {
      path: outputPath || path.join(__dirname, '../tmp/build', snippetName),
      publicPath: '',
      filename: '[name][hash].js',
    },
  });

  return config;
};
