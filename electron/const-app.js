const path = require('path');
const {app} = require('electron');

let appDataPath = app.getPath('userData');
// if(process.env.NODE_ENV === 'development'){
//   const mkdirp = require('mkdirp');
//   appDataPath = path.join(__dirname, '../tmp/app-data');
//   mkdirp(appDataPath);
// }

module.exports = {
  TMP_SNIPPEZ_REPO_PATH: path.join(appDataPath, './tmp-snippez'), // use for create REAL files from snippet
  TMP_GHPAGE_REPO_PATH: path.join(appDataPath, './tmp-snippez-ghpage'), // use for sharing the snippet via github pages
  GHPAGE_REPO: 'git@github.com:phucpnt/phucpnt.github.io.git',
  GHPAGE_DOMAIN: 'phucpnt.github.io',
  DB_PATH: path.join(appDataPath, process.env.NODE_ENV === 'development' ? './db-dev' : './database'),
}
