
import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from 'clarity-angular';

import { SharedModule } from '../shared/shared.module';
import { ApiService } from '../../shared/api.service';
import { SnippetCollection } from './snippet-collection.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    BrowserAnimationsModule,
    ClarityModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    SnippetCollection,
  ],
  providers: [
    ApiService
  ],
  bootstrap: [SnippetCollection],
  exports: [SnippetCollection],
})
export class SnippetCollectionModule {
  constructor(public appRef: ApplicationRef) { }
}
