const {ipcMain} = require('electron');
const {get: getSnippet} = require('./snippet/model');

ipcMain.on('snippet/get', (event, snippetId) => {
  console.log('snippet/get', snippetId);
  getSnippet(snippetId).then(snippet => {
    event.sender.send('snippet/get', snippet);
  });
});

