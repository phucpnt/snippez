import { Component } from '@angular/core';
import * as _ from 'lodash';

import File from '../model/snippet-file';

@Component({
  selector: 'snippet-file-list',
  templateUrl: './snippet-file-list.component.html',
  // styles: [
  //   `:host{position: absolute; left: 0; right: 0; bottom: 0; top: 0; overflow: hidden; overflow-y: auto;}`
  // ]
})
export class SnippetFileList {
  itemList: Array<File>;

  constructor(){
    this.itemList = _.times(_.random(3, 10), (n:number) => new File(`file${n}.js`));
  }
 }