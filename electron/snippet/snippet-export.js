const path = require('path');
const webpack = require('webpack');
const config = require('../webpack.config.gh-pages');
const {writeSnippetFiles} = require('./snippet-start');

function build ({id, files, description, rootModule}) {
  const snippetFolder = writeSnippetFiles(id, files)
  const compiler = webpack(config({
    entry: {[id]: path.join(snippetFolder, 'index.js')},
    rootModule,
    snippetName: id,
  }));

  return new Promise(resolve => {
    compiler.run((err, stats) => {
      console.log(stats);
      if(!err){
        resolve();
      } else {
        console.error(err);
      }
    });
  });
}

module.exports = {
  build,
}
