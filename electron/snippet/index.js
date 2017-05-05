
const {process: installSnippetModules} = require('./snippet-deps-mgt');
const {setConfig, start, writeSnippetFiles} = require('./snippet-start');
const Snippet = require('./model');

let snippetsRepoPath = null;


exports.config = (config) => {
  snippetsRepoPath = config.snippetsRepoPath;
  setConfig({ snippetsPath: snippetsRepoPath, modulesLookupPath: config.modulesLookupPath || [snippetsRepoPath + '/node_modules'] });
  return config;
}

function exec(snippetId, snippetFiles, callback){
  writeSnippetFiles(snippetId, snippetFiles);
  return new Promise(resolve => {
    start(snippetId, callback);
    resolve(snippetId);
  });
}
exports.exec = exec;
exports.execById = (snippetId, callback) => {
  return Snippet.get(snippetId).then(snippet => {
    return exec(snippetId, snippet.files, callback);
  });
}
