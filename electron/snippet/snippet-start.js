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
const webpackMerge = require('webpack-merge');
const express = require('express');
const Router = require('express').Router;
const hb = require('handlebars');
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const { dialog } = require('electron');
const childProcess = require('child_process');

const {getServer, devPort, hostName} = require('../server');

let console = null;
if (process.env.NODE_ENV !== 'development') {
  console = require('electron-log');
  console.transports.file.level = 'debug';
  console.log = console.info;
} else {
  console = global.console;
}


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

function setup() {
  // add the package.json
  // install the dependencies
  return new Promise(resolve => {
    fs.copy(path.join(__dirname, '../resource/vendor.js'), path.join(config.snippetsPath, './vendor.js'));

    fs.exists(path.join(config.snippetsPath, './package.json'), (exists) => {
      if (!exists) {
        fs.copy(path.join(__dirname, '../resource/package.json'), path.join(config.snippetsPath, './package.json'), (err) => {
          if (!err) {
            console.log('📦 installing packages...');
            const npm = childProcess.spawn('npm', ['install'], { cwd: config.snippetsPath, env: process.env });
            npm.on('error', (err) => {
              dialog.showErrorBox('Npm install', err.message);
            });
            npm.on('close', () => {
              console.log('📦 finish installing packages...');
              resolve();
            });
          }
        });
      }
    })
  });
}

function start(snippetId, callback){
  const server = getServer();

  entryCache.vendor = `${config.snippetsPath}/vendor.js`;
  entryCache[snippetId] = `${config.snippetsPath}/${snippetId}/index.js`;
  entryCache[`${snippetId}-spec`] = `${config.snippetsPath}/${snippetId}/index.spec.js`;
  console.log('config >> %s', JSON.stringify(config));
  compilerCallbackWhenDone.setCallback(() => {
    callback(`http://${hostName}:${devPort}/${snippetId}`);
  });
  if(wmInstance!== null){
    wmInstance.invalidate();
    return;
  }


  compiler = new Webpack(webpackMerge(
    webpackConfig(() => entryCache, config.modulesLookupPath, devPort),
    { context: config.snippetsPath }
  ));
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
    log: console.log.bind(console),
  });
  getServer().use(wmInstance);

  compiler.plugin('done', compilerCallbackWhenDone);
}

function writeSnippetFiles(snippetId, snippetFiles){
  mkdirp.sync(path.join(config.snippetsPath, snippetId));
  // prepare the files for webpack
  snippetFiles.forEach(file => {
    fs.writeFileSync(path.join(config.snippetsPath, snippetId, file.name), file.content);
  });
  return path.join(config.snippetsPath, snippetId);
}

function setConfig(nuConfig){
  config = Object.assign(config, nuConfig);
}

module.exports = {
  start,
  setConfig,
  writeSnippetFiles,
  setup,
}

