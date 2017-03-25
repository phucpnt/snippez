const webpack = require('webpack');
const path = require('path');

const devPort = 15106;
module.exports = (entry, rootModule, port = devPort) => {
  const config = {
    devtool: 'source-map',
    entry: entry || {},
    output: {
      path: path.join(__dirname, '../../dist'),
      publicPath: `http://localhost:${port}/gist-a2/`,
      filename: '[name].js',
    },
    resolve: {
      alias: {},
      rootModule,
    },
    module: {
      loaders: [{
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
        }
      }, {
        test: /\.less$/,
        loader: 'style!css?sourceMap!less?sourceMap',
      }, {
        test: /\.css$/,
        loader: 'style!css?sourceMap',
      }, {
        test: /\.(png|jpg|svg|gif|eot|woff|ttf)$/,
        loader: 'file-loader?name=[path][name].[ext]',
      }, {
        test: /ext-lib[\\\/].+\.js$/,
        loader: 'imports?require=>false,module=>false,define=>false,exports=>undefined',
      }, ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
    profile: true,
  };

  return config;
};
