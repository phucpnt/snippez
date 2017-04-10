import { Component, Input } from '@angular/core';

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

  static defaultInitFile = 'index.js';

  @Input() snippetId: string;

  constructor(private api: ApiService) {
    this.title = this.api.title;
    this.selectFile = this.selectFile.bind(this);
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
  }

  save(content){
    console.log(content);
  }
}
