
const {process: installSnippetModules} = require('./snippet-deps-mgt');
const {setConfig, start, writeSnippetFiles} = require('./snippet-start');
const Snippet = require('./model');

let snippetsRepoPath = null;


exports.config = (config) => {
  snippetsRepoPath = config.snippetsRepoPath;
  setConfig({ snippetsPath: snippetsRepoPath, modulesLookupPath: config.modulesLookupPath || [snippetsRepoPath + '/node_modules'] });
  return config;
}

exports.exec = (snippetId, snippetFiles, callback) => {
  writeSnippetFiles(snippetId, snippetFiles);
  installSnippetModules(snippetFiles.map(file => file.content), snippetsRepoPath).then((modules) => {
    return start(snippetId, callback);
  });
}

exports.execById = (snippetId, callback) => {
  Snippet.get(snippetId).then(snippet => {
    exports.exec(snippetId, snippet.files, callback);
  });
}
