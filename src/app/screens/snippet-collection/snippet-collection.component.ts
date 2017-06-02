import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';


@Component({
  selector: 'snippet-collection', // <my-app></my-app>
  templateUrl: './snippet-collection.component.html',
})
export class SnippetCollection implements OnInit {
  snippetList = [];
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getSnippetList().then(response => {
      this.snippetList = response.data.map(snippet => {
        const [title, description] = snippet.description.split('\n', 2);
        return Object.assign({}, snippet, { title, description });
      });
    });
  }

  remove(snippetId: string, rev: string) {
    this.api.removeSnippet({id: snippetId, rev}).then(() => {
      this.ngOnInit();
    });
  }

}
