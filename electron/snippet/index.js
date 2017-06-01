const appConfig = require('../const-app');
const {process: installSnippetModules} = require('./snippet-deps-mgt');
const {setConfig, start, writeSnippetFiles} = require('./snippet-start');
const {build, deploy} = require('./snippet-export');
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

exports.shareGithubPageById = (snippetId) => {
  return Snippet.get(snippetId).then(snippet => {
    return build({
      id: snippetId,
      files: snippet.files,
      description: snippet.description,
      rootModule: [[appConfig.TMP_SNIPPEZ_REPO_PATH, 'node_modules'].join('/')],
      outputPath: [appConfig.TMP_SNIPPEZ_REPO_PATH, 'build'].join('/'),
    }).then((snippetBuiltPath) => deploy({
      ghPageRepo: appConfig.GHPAGE_REPO,
      builtSnippetPath: snippetBuiltPath,
      ghPagePath: appConfig.TMP_GHPAGE_REPO_PATH,
    })).then(() => {
      return [appConfig.GHPAGE_DOMAIN, 'snippez', snippetId].join('/');
    });
  });
}
