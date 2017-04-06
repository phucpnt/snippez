import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';

import { AppComponent } from './app.component';
// import { HomeComponent } from './home/home.component';
// import { AboutComponent } from './about/about.component';
import { SnippetList } from './snippet-list/snippet-list.component';
import { SnippetFileList } from './snippet-file-list/snippet-file-list.component';
import { SnippetEditor } from './snippet-editor/snippet-editor.component';
import {CodemirrorComponent} from './codemirror/codemirror.component';
import { ApiService } from './shared';
// import { routing } from './app.routing';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ClarityModule,
    // routing
  ],
  declarations: [
    AppComponent,
    // HomeComponent,
    // AboutComponent,
    SnippetList,
    SnippetFileList,
    SnippetEditor,
    CodemirrorComponent,
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
