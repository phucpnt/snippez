import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';


@Component({
  selector: 'snippet-collection', // <my-app></my-app>
  templateUrl: './snippet-collection.component.html',
})
export class SnippetCollection implements OnInit {
  snippetList = [];
  removalSnippetConfirmVisible = false;
  removalSnippet = null;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getSnippetList().then(response => {
      this.snippetList = response.data.map(snippet => {
        const [title, description] = snippet.description.split('\n', 2);
        return Object.assign({}, snippet, { title, description });
      });
    });
  }


  remove(snippet, confirm = true) {
    if (confirm) {
      this.removalSnippet = snippet;
      this.removalSnippetConfirmVisible = true;
    } else {
      this.api.removeSnippet({ id: snippet._id, rev: snippet._rev }).then(() => {
        this.ngOnInit();
      }).then(() => {
      this.removalSnippetConfirmVisible = false;
      this.removalSnippet = undefined;
      });
    }
  }

}
