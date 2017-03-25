const webpack = require('webpack');
const path = require('path');

const devPort = 15106;
module.exports = (entry, rootModule, port = devPort) => {
  const config = {
    devtool: 'eval-inline-source-map',
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
      loaders: [{
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: [
          {loader: 'babel-loader', options: {presets: ['es2015', 'react']}}
        ],
      }, {
        test: /\.less$/,
        loader: 'style!css?sourceMap!less?sourceMap',
      }, {
        test: /\.css$/,
        loader: 'style!css?sourceMap',
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
