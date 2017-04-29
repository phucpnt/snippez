import { RouterModule, Routes } from '@angular/router';

import { SnippetCollection } from './screens/snippet-collection/snippet-collection.component';
import { SnippetEdit } from './screens/snippet-edit/snippet-edit.component';

const routes: Routes = [
  { path: '', component: SnippetCollection },
  { path: 'snippet/:id', component: SnippetEdit }
];

export const routing = RouterModule.forRoot(routes);
