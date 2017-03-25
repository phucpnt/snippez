import { Component } from '@angular/core';
import * as _ from 'lodash';

import Snippet from './snippet';

@Component({
  selector: 'snippet-list',
  templateUrl: './snippet-list.component.html',
  // styles: [
  //   `:host{position: absolute; left: 0; right: 0; bottom: 0; top: 0; overflow: hidden; overflow-y: auto;}`
  // ]
})
export class SnippetList {
  itemList: Array<Snippet>;

  constructor(){
    this.itemList = _.times(_.random(20, 100), (n:number) => new Snippet(`ASnippet ${n}`));
  }
 }
