const fs = require('fs');
const path = require('path');
const {get : getSnippet, create : createSnippet} = require('./snippet/model');
const {getServer} = require('./server');

module.exports.prepareDb =  function prepareDb(){
  const testSnippetId = '@@test@@';
  const testSnippetPath = path.join(__dirname, './resource/example-babyzscore');
  console.log('parepare db');
  getSnippet(testSnippetId).then(snippet => {
    // console.log('test snippet >>> ', snippet);
  }).catch((err) => {
    console.log(err);
    const exampleFiles = fs.readdirSync(testSnippetPath);

    createSnippet({
      _id: testSnippetId,
      description: 'Test snippet',
      files: exampleFiles.map(filename => ({
        name: filename,
        content: fs.readFileSync(path.join(testSnippetPath, filename), 'utf8'),
      })),
    });
  })
}

module.exports.startServer = () => getServer();
