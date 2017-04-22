import { Injectable } from '@angular/core';
import * as ExtApi from '../../api';

@Injectable()
export class ApiService {
  title = 'Snippez';
  getSnippet = ExtApi.getSnippet;
  saveSnippet = ExtApi.saveSnippet;
}
