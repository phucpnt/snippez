import { Component } from '@angular/core';
import * as _ from 'lodash';

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
    // poc of we can run the snippet with webpack on new window
    window.open('https://google.com');
  }
 }
