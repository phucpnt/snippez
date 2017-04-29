import { Component } from '@angular/core';
import * as _ from 'lodash';


@Component({
  selector: 'snippet-collection', // <my-app></my-app>
  templateUrl: './snippet-collection.component.html',
})
export class SnippetCollection {

  snippetList = _.times(_.random(20, 40), (n) => n);

}
