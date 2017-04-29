import { Injectable } from '@angular/core';
import * as ExtApi from '../../api';

const {ipcRenderer} = require('electron');

@Injectable()
export class ApiService {
  title = 'Snippez';
  getSnippet = ExtApi.getSnippet;
  saveSnippet = ExtApi.saveSnippet;
  createSnippet = ExtApi.createSnippet;

  execSnippet(snippetId){
    return new Promise((resolve) => {
      ipcRenderer.send('snippet.run', snippetId)
      ipcRenderer.once('snippet.run.ready', (snippetUrl) => {
        resolve(snippetUrl);
      });
    });
  }
}
