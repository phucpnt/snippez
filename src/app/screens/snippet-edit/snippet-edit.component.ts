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

  @Input() snippetId: string;

  constructor(private api: ApiService) {
    this.title = this.api.title;
  }

  ngOnChanges(){
    this.api.getSnippet(this.snippetId).then((snippet) => {
      this.snippet = snippet;
    });
  }
}
