const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const {execSync} = require('child_process');
const Webpack = require('webpack');
const Router = require('express').Router;
const hb = require('handlebars');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.dev');

/**
 * TODO:
 * [x]: serve the html page for running the gist
 * [ ]: AUTO refresh the html page when gist is updated.
 * @param {Number} snippetId
 * @param {Array} snippetFiles
 */

const exec = (snippetId, snippetFiles) => {
  // parsing the module required.
  const modules = snippetFiles.map(file => getRequiredModules(file.content))
    .reduce((modules, next) => modules.concat(next));

  mkdirp.sync(path.join(__dirname, '../tmp', snippetId));

  // install the modules, at the tempo dir
  installModules(modules);

  // prepare the files for webpack
  snippetFiles.forEach(file => {
    fs.writeFileSync(path.join(__dirname, '../tmp', snippetId, file.name), file.content);
  });

  // start the webpack server
  startWebpack(snippetId);
}

function getRequiredModules(src){
  const commonRequirePatt = /require\(["'](.+?)["']\)/ig;
  const es6ImportPatt = /import\s+.*\s*(from)?\s*["'](.+?)["']/ig;
  const modules = [];
  let match;
  while((match = commonRequirePatt.exec(src)) !== null){
    if(match[1].indexOf('.') !== 0){
      modules.push(match[1]);
    }
  }

  while((match = es6ImportPatt.exec(src)) !== null){
    if(match[2].indexOf('.') !== 0){
      modules.push(match[2]);
    }
  }

  return modules;
}

function installModules(modules, cwd = path.join(__dirname, '../tmp')){
  // make sure the package.json exists with blank json. eg: {}
  try{
    fs.accessSync(path.join(cwd, 'package.json'), fs.constants.R_OK)
  } catch (ex) {
    fs.writeFileSync(path.join(cwd, 'package.json'), '{}', { encoding: 'UTF8' });
  }
  execSync(['npm install'].concat(modules).join(' '), {cwd});
}

function startWebpack(snippetId){
  const devPort = 15106;
  const compiler = new Webpack(webpackConfig({
    [snippetId]: path.join(__dirname, `../tmp/${snippetId}/index.js`),
  }, [path.join(__dirname, `../tmp/node_modules`)], devPort))
  const server = new WebpackDevServer(compiler, {
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
  const router = Router();
  router.get(`/${snippetId}`, (req, res) => {
    const template = hb.compile(fs.readFileSync(path.join(__dirname, './resource/snippet-entry.hbs'), {encoding: 'UTF8'}));
    res.send(template({entry: `//localhost:${devPort}/gist-a2/${snippetId}.js`}));
  });
  server.use(router);
  server.listen(devPort, '0.0.0.0', () => {
    console.log(`DEV SERVER start on port: ${devPort}`);
  });

}

getRequiredModules(`
const abc = require('lodash')
const xyz = require('./xxy')
const aaa = require('../mm')

console.log(_);
`)

getRequiredModules(`
import * as _ from 'lodash';
import 'abx';
import './aaa';
import {text} from 'xxy';
import aaa from './bbb';

console.log(_);

`)

const snippets = [
  {
    name: 'index.js',
    content: `
  import * as _ from 'lodash';
  import abc from './abc';
  console.log(_.times(3, () => console.log('hello')));
  `},{
    name: 'abc.js',
    content: `
  console.log('abc.js');
    `
  }
]

exec('test', snippets);
