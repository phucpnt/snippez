import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
})
export class AppHeader {
  constructor(private router: Router, private api: ApiService) { }
  createSnippet() {
    this.api.createSnippet().then(id => {
      this.router.navigate(['/snippet', id]);
    });
  }
}
