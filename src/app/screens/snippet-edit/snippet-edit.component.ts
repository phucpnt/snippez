import { Component, Input, ViewChild } from '@angular/core';
import * as _ from 'lodash';

import { ApiService } from '../../shared';
import {Snippet} from '../../model/snippet';

@Component({
  selector: 'screen-snippet-edit', // <my-app></my-app>
  templateUrl: './snippet-edit.component.html',
  styleUrls: ['./snippet-edit.component.scss'],
})
export class SnippetEdit {
  url = 'https://github.com/preboot/angular2-webpack';
  title: string;
  snippet: Snippet = null;
  fileFocus: string = null;
  fileFocusSrc: String = null;

  @ViewChild('editor') editor;

  static defaultInitFile = 'index.js';

  @Input() snippetId: string;

  constructor(private api: ApiService) {
    this.title = this.api.title;
    this.selectFile = this.selectFile.bind(this);
    this.save = _.debounce(this.save, 1500);
  }

  ngOnChanges(){
    console.log('... on changes....');
    this.api.getSnippet(this.snippetId).then((snippet) => {
      this.snippet = snippet;
      console.log(this.snippet);
      this.fileFocus = SnippetEdit.defaultInitFile;
      this.fileFocusSrc = snippet.files.find(file => file.name === SnippetEdit.defaultInitFile).content;
    });
  }

  selectFile(file) {
    this.fileFocus = file.name;
    this.fileFocusSrc = this.snippet.files.find(_file => _file.name === file.name).content;
    this.editor.writeValue(this.fileFocusSrc);
  }

  save(content){
    if(typeof content === 'string' && content !== this.fileFocusSrc){
      const index = this.snippet.files.findIndex(file => file.name === this.fileFocus)
      this.snippet.files[index].content = content;
      console.log('will save', this.snippet);
    }
    this.api.saveSnippet(this.snippetId, this.snippet);
  }
}
