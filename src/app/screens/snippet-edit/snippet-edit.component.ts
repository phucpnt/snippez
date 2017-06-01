import { Component, Input, ViewChild, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import File from '../../model/snippet-file';
import { ApiService } from '../../shared';
import { Snippet } from '../../model/snippet';
import { SnippetEditor } from '../../snippet-editor/snippet-editor.component';

@Component({
  selector: 'screen-snippet-edit', // <my-app></my-app>
  templateUrl: './snippet-edit.component.html',
  styleUrls: ['./snippet-edit.component.scss'],
})
export class SnippetEdit implements OnChanges, OnInit {
  static defaultInitFile = 'index.js';

  url = 'https://github.com/preboot/angular2-webpack';
  title: string;
  snippet: Snippet = null;
  fileFocus: string = null;
  fileFocusSrc: string = null;
  description = '';
  showDescriptionEditor = false;

  @ViewChild('editor') editor: SnippetEditor;


  @Input() snippetId: string;

  constructor(private api: ApiService, private route: ActivatedRoute) {
    this.title = this.api.title;
    this.selectFile = this.selectFile.bind(this);
    this.addNewFile = this.addNewFile.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.run = this.run.bind(this);
    this.save = _.debounce(this.save.bind(this), 1500);
  }

  ngOnInit() {
    this.route.params
      .map(params => params['id'])
      .subscribe((id) => {
        this.loadSnippet(id);
      });
  }

  ngOnChanges() {
    this.loadSnippet(this.snippetId);
  }

  loadSnippet(id) {
    this.api.getSnippet(id).then((snippet) => {
      this.snippetId = snippet._id;
      this.snippet = snippet;
      this.fileFocus = SnippetEdit.defaultInitFile;
      this.fileFocusSrc = snippet.files.find(file => file.name === SnippetEdit.defaultInitFile).content;
      this.description = snippet.description;
    });
  }

  selectFile(file) {
    this.fileFocus = file.name;
    this.fileFocusSrc = this.snippet.files.find(_file => _file.name === file.name).content;
    this.editor.changeFile(this.fileFocus);
    this.editor.writeValue(this.fileFocusSrc);
  }

  save(content = null) {
    if (typeof content === 'string' && content !== this.fileFocusSrc) {
      const index = this.snippet.files.findIndex(file => file.name === this.fileFocus)
      this.snippet.files[index].content = content;
      this.api.saveSnippet(this.snippetId, this.snippet).then(response => response.json()).then(update => {
        this.snippet._rev = update.rev;
      });
    } else if (typeof content !== 'string') {
      this.api.saveSnippet(this.snippetId, this.snippet).then(response => response.json()).then(update => {
        this.snippet._rev = update.rev;
      });
    }
  }

  run() {
    this.api.execSnippet(this.snippetId);
  }

  addNewFile(filename) {
    this.snippet.files.push({ name: filename, content: '' });
    this.save();
  }

  removeFile(file: File) {
    const indexRemove = this.snippet.files.findIndex((f) => f.name === file.name);
    this.snippet.files = this.snippet.files.slice(0, indexRemove).concat(this.snippet.files.slice(indexRemove + 1));
    this.save();
  }

  toggleEditDescription() {
    this.showDescriptionEditor = !this.showDescriptionEditor;
  }

  saveDescription(description) {
    console.log(description);
    this.snippet.description = description;
    this.save();
    this.toggleEditDescription();
  }

  shareGithub() {
    console.log('share github', this.snippetId);
    this.api.shareGithub(this.snippetId);
  }
}
