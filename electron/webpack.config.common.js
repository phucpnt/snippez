module.exports = ({rootModule}) => ({
  devtool: 'source-map',
  entry: {},
  resolve: {
    modules: rootModule,
    alias: {},
  },
  module: {
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
  profile: true,
});
