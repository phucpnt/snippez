import { Component, Input } from '@angular/core';
import * as _ from 'lodash';

import File from '../model/snippet-file';

@Component({
  selector: 'snippet-file-list',
  templateUrl: './snippet-file-list.component.html',
})
export class SnippetFileList {
  @Input() fileFocus: string = null;
  @Input() fileList: Array<File> = null;;
  @Input() selectItem: Function = (item) => {console.log(item)};
  @Input() onAddNewFile: Function = (filename) => {console.log(filename)};
  @Input() onRemoveFile: Function = (file: File) => {console.log(file)};

  newFileName: string = '';
  modalVisible: boolean = false;

  modalRemoveFileVisible: boolean = false;
  fileWannaRemove: File = null;

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

  removeFile($event, file: File){
    this.fileWannaRemove = file;
    this.modalRemoveFileVisible = true;
    $event.stopPropagation();
  }

  removeFileConfirmed(file){
    this.modalRemoveFileVisible = false;
    this.onRemoveFile(file);
  }

 }
