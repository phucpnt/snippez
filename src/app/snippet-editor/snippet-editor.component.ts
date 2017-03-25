import { Component } from '@angular/core';
import * as _ from 'lodash';

const {ipcRenderer} = require('electron');

@Component({
  selector: 'snippet-editor',
  templateUrl: './snippet-editor.component.html',
})
export class SnippetEditor {
  fileList: Array<any>;

  constructor(){
    this.fileList = _.times(_.random(8, 20), (n:number) => ({name: `file ${n}`, active: n === 0}));
  }

  runSnippet(){
    ipcRenderer.send('snippet.run');
    ipcRenderer.on('snippet.run.ready', () => {
      console.log('snippet ready!!!');
      window.open('http://localhost:15106/test');
    })
    // poc of we can run the snippet with webpack on new window
  }
 }
