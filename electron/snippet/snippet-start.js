/**
 * Start setup for snippet.
 * [x] Running the webpack server if not running
 * [x] Or reload the webpack server if already running
 * @param {String} snippetId
 * @param {Function} callback
 */
const path = require('path');
const Webpack = require('webpack');
const express = require('express');
const Router = require('express').Router;
const hb = require('handlebars');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config.dev');

let server = null;
let wmInstance = null;
let config = {
  snippetsPath: path.join(__dirname, '../tmp/'),
  modulesLookPath: [path.join(__dirname, '../tmp/node_modules')],
};
let entryCache = {};

function start(snippetId, callback){
  const devPort = 15106;

  entryCache[snippetId] = `${config.snippetsPath}/${snippetId}/index.js`;
  if(server !== null && wmInstance!== null){
    wmInstance.invalidate();
    return;
  }


  const compiler = new Webpack(webpackConfig(() => entryCache, config.modulesLookPath, devPort));
  server = express();
  wmInstance = webpackMiddleware(compiler, {
    contentBase: 'demo',
    hot: false,
    inline: true,
    historyApiFallback: false,
    staticOptions: {},
    quiet: false,
    noInfo: false,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    publicPath: '/gist-a2/',
    headers: {
      'X-Custom-Header': 'yes',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    stats: {
      colors: true,
      chunks: false,
    },
  });
  server.use(wmInstance);

  const router = Router();
  router.get('/:snippetId', (req, res) => {
    const snippetId = req.params.snippetId;
    const template = hb.compile(fs.readFileSync(path.join(__dirname, './resource/snippet-entry.hbs'), {encoding: 'UTF8'}));
    res.send(template({entry: `//localhost:${devPort}/gist-a2/${snippetId}.js`}));
  });
  server.use(router);
  server.listen(devPort, '0.0.0.0', () => {
    console.log(`DEV SERVER start on port: ${devPort}`);
  });

  compiler.plugin('done', (stats) => {
    process.nextTick(() => {
      console.log('+++ bundle valid >>>')
      callback();
    })
  });

}

function setConfig(nuConfig){
  config = Object.assign(config, nuConfig);
}

module.exports = {
  start,
  setConfig,
}

