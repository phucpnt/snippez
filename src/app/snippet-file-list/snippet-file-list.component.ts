import { Component, Input } from '@angular/core';
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
  @Input() fileFocus: string = null;
  @Input() fileList: Array<File> = null;;
  @Input() selectItem: Function = (item) => {console.log(item)};
  @Input() onAddNewFile: Function = (filename) => {console.log(filename)};
  newFileName: string = '';
  modalVisible: boolean = false;

  constructor(){
    if(this.fileList == null){
      this.fileList = _.times(_.random(3, 10), (n:number) => new File(`file${n}.js`));
    }
  }

  /**
   * FIXME: add validation
   */
  addNewFile(){
    this.onAddNewFile(this.newFileName);
    this.newFileName = '';
    this.modalVisible = false;
  }

 }
