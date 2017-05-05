/**
 * Start setup for snippet.
 * [x] Running the webpack server if not running
 * [x] Or reload the webpack server if already running
 * @param {String} snippetId
 * @param {Function} callback
 */
const path = require('path');
const Webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const express = require('express');
const Router = require('express').Router;
const hb = require('handlebars');
const mkdirp = require('mkdirp');
const fs = require('fs');

const webpackConfig = require('../webpack.config.dev');

let server = null;
let wmInstance = null;
let compiler = null;
function CallbackPlugin(){}
CallbackPlugin.prototype.setCallback = function (cb) {
  this.cb = cb;
}
CallbackPlugin.prototype.apply = function(){
  this.cb();
}
let compilerCallbackWhenDone = new CallbackPlugin();

let config = {
  snippetsPath: path.join(__dirname, '../tmp/'),
  modulesLookupPath: [path.join(__dirname, '../tmp/node_modules')],
};
let entryCache = {};

function start(snippetId, callback){
  const devPort = 15106;

  entryCache.vendor = `${config.snippetsPath}/vendor.js`;
  entryCache[snippetId] = `${config.snippetsPath}/${snippetId}/index.js`;
  entryCache[`${snippetId}-spec`] = `${config.snippetsPath}/${snippetId}/index.spec.js`;
  compilerCallbackWhenDone.setCallback(() => {
    callback(`http://localhost:${devPort}/${snippetId}`);
  });
  if(server !== null && wmInstance!== null){
    wmInstance.invalidate();
    return;
  }


  compiler = new Webpack(webpackConfig(() => entryCache, config.modulesLookupPath, devPort));
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
    watchContentBase: true,
    // watchOptions: {
    //   aggregateTimeout: 300,
    //   poll: 1000,
    // },
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
    const template = hb.compile(fs.readFileSync(path.join(__dirname, '../resource/snippet-entry.hbs'), {encoding: 'UTF8'}));
    res.send(template({
      vendor: `//localhost:${devPort}/gist-a2/vendor.js`,
      url_iframe_result: `//localhost:${devPort}/${snippetId}/result`,
      url_iframe_spec: `//localhost:${devPort}/${snippetId}/spec`
    }));
  });

  router.get('/:snippetId/result', (req, res) => {
    const snippetId = req.params.snippetId;
    const template = hb.compile(fs.readFileSync(path.join(__dirname, '../resource/snippet-result.hbs'), {encoding: 'UTF8'}));
    res.send(template({
      content: fs.readFileSync(`${config.snippetsPath}/${snippetId}/index.html`, 'utf8'),
      entry: `//localhost:${devPort}/gist-a2/${snippetId}.js`,
      vendor: `//localhost:${devPort}/gist-a2/vendor.js`,
    }));
  });

  router.get('/:snippetId/spec', (req, res) => {
    const snippetId = req.params.snippetId;
    const template = hb.compile(fs.readFileSync(path.join(__dirname, '../resource/snippet-result.hbs'), {encoding: 'UTF8'}));
    res.send(template({
      entry: `//localhost:${devPort}/gist-a2/${snippetId}-spec.js`,
      vendor: `//localhost:${devPort}/gist-a2/vendor.js`,
    }));
  });

  server.use(router);
  server.listen(devPort, '0.0.0.0', () => {
    console.log(`DEV SERVER start on port: ${devPort}`);
  });

  compiler.plugin('done', compilerCallbackWhenDone);

}

function writeSnippetFiles(snippetId, snippetFiles){
  mkdirp.sync(path.join(config.snippetsPath, snippetId));
  // prepare the files for webpack
  snippetFiles.forEach(file => {
    fs.writeFileSync(path.join(config.snippetsPath, snippetId, file.name), file.content);
  });
}

function setConfig(nuConfig){
  config = Object.assign(config, nuConfig);
}

module.exports = {
  start,
  setConfig,
  writeSnippetFiles,
}

