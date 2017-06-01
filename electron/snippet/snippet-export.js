const path = require('path');
const webpack = require('webpack');
const SimpleGit = require('simple-git');
const fs = require('fs-extra');
const hb = require('handlebars');

const mkdirp = require('mkdirp');
const config = require('../webpack.config.gh-pages');
const {writeSnippetFiles} = require('./snippet-start');

function build ({id, files, description, rootModule, outputPath}) {
  const snippetOutputPath = path.join(outputPath, id);
  const snippetFolder = writeSnippetFiles(id, files)
  const compiler = webpack(config({
    entry: {[id]: path.join(snippetFolder, 'index.js')},
    rootModule,
    snippetName: id,
    outputPath: snippetOutputPath,
  }));

  return new Promise(resolve => {
    compiler.run((err, stats) => {
      console.log(stats.toJson({
        chunks: false,
        modules: false,
      }));
      if(!err){
        resolve(stats.toJson());
      } else {
        console.error(err);
      }
    })
  }).then(stats => {
    const genEntryJs = stats.assetsByChunkName[id].filter(fname => /\.js$/.test(fname))[0];
    buildRunningPage({ snippetName: id, files, genEntryJs, snippetOutputPath});
    return path.join(outputPath, id);
  });
}

function buildRunningPage({snippetName, files, genEntryJs, snippetOutputPath = path.join(__dirname, '../../tmp/build', snippetName)}){
  const indexHtml = files.filter(file => file.name ==='index.html')[0].content;
  const tmpl = hb.compile(fs.readFileSync(path.join(__dirname, '../resource/snippet-exported.hbs'), 'UTF8'));

  fs.writeFileSync(path.join(snippetOutputPath, 'index.html'), tmpl({
    content: indexHtml,
    entry: ['.', genEntryJs].join('/'),
  }));
}

function deploy({ghPageRepo, builtSnippetPath, ghPagePath = null}){
  /**
   * TODO:
   * [ ] checkout the ghPageRepo
   * [ ] add/update built snippet files
   * [ ] commit and push to githubRepo
   */
  const repoLocalPath = ghPagePath || path.join(__dirname, '../../tmp', ghPageRepo.split('/').slice(-1)[0]);
  let promise = new Promise(resolve => resolve());
  let git;
  try {
    git = SimpleGit(repoLocalPath);
  } catch(ex){
    mkdirp.sync(repoLocalPath);
    git = SimpleGit(repoLocalPath);
    promise = new Promise(resolve => git.clone(ghPageRepo, '.', null, resolve ));
  }

  return promise.then(() => {
    const localExportedSnippetPath = path.join(repoLocalPath, 'snippez', builtSnippetPath.split('/').slice(-1)[0]);
    try{
      fs.accessSync(localExportedSnippetPath);
    } catch (ex) {
      mkdirp(localExportedSnippetPath)
    }
    console.log(builtSnippetPath, localExportedSnippetPath);
    fs.copySync(builtSnippetPath, localExportedSnippetPath);
  }).then(() => new Promise(resolve => {
    git.add('.', resolve);
  })).then(() => new Promise(resolve => {
    git.commit('Snippez: update the generated snippet', null, null, resolve)
  })).then(() => new Promise(resolve => {
    git.push('origin', 'master', resolve);
  }));
}



module.exports = {
  build,
  deploy,
}
