
import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';

import { ApiService } from '../../shared/api.service';
import { SnippetEdit } from './snippet-edit.component';
import { SnippetFileList } from '../../snippet-file-list/snippet-file-list.component';
import { SnippetEditor } from '../../snippet-editor/snippet-editor.component';
import { CodemirrorComponent } from '../../codemirror/codemirror.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ClarityModule,
  ],
  declarations: [
    // HomeComponent,
    // AboutComponent,
    SnippetEdit,
    SnippetFileList,
    SnippetEditor,
    CodemirrorComponent,
  ],
  providers: [
    ApiService
  ],
  bootstrap: [SnippetEdit],
  exports: [SnippetEdit],
})
export class SnippetEditModule {
  constructor(public appRef: ApplicationRef) { }
}
