
const path = require('path');

module.exports = {
  TMP_SNIPPEZ_REPO_PATH: path.join(__dirname, '../../tmp-snippez'), // use for create REAL files from snippet
  TMP_GHPAGE_REPO_PATH: path.join(__dirname, '../../tmp-snippez-ghpage'), // use for sharing the snippet via github pages
  GHPAGE_REPO: 'git@github.com:phucpnt/phucpnt.github.io.git',
  GHPAGE_DOMAIN: 'phucpnt.github.io',
}
