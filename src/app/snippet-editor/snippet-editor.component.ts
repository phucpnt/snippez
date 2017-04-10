import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

const {ipcRenderer} = require('electron');

@Component({
  selector: 'snippet-editor',
  templateUrl: './snippet-editor.component.html',
})
export class SnippetEditor {
  @Input() src: String = 'console.log("hello world");';
  @Output() change = new EventEmitter<string>();
  @ViewChild('editor') editor;

  runSnippet(){
    ipcRenderer.send('snippet.run');
    ipcRenderer.on('snippet.run.ready', () => {
      console.log('snippet ready!!!');
      window.open('http://localhost:15106/test');
    })
    // poc of we can run the snippet with webpack on new window
  }

  writeValue(val: string){
    this.editor.writeValue(val);
  }

  _change(value:string){
    this.change.emit(value);
  }
 }
