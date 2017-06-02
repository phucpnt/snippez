import { Snippet } from './app/model/snippet';
import SnippetFile from './app/model/snippet-file';
const newSnippetFiles = require('./resource/default-snippet.js');

declare const fetch: any;


const HOST_NAME = 'http://127.0.0.1:1806';

function api(urn: string, params: object = undefined): string {
  let queryStr = '';
  if (params) {
    queryStr += Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  }
  return [`${HOST_NAME}${urn}`, queryStr !== '' ? `?${queryStr}` : ''].join('');
}

export function getSnippet(id: string) {
  return fetch(api(`/snippet/${id}`)).then(response => response.json());
}

export function getSnippetList(limit= 20, offset: number = undefined) {
  return fetch(api('/snippet', {limit, offset})).then(response => response.json());
}

export function saveSnippet(id: string, snippet: Snippet) {
  return fetch(api(`/snippet/${id}`), {
    method: id === null ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(snippet),
  });
}

export function createSnippet() {
  const newSnippet = {
    _id: ['snippez', +new Date()].join('-'),
    description: 'untitled',
    files: Object.keys(newSnippetFiles).map(key => {
      return new SnippetFile(key, newSnippetFiles[key]);
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return saveSnippet(newSnippet._id, newSnippet).then(() => newSnippet._id);
}

export function removeSnippet({id, rev}) {
  return fetch(api(`/snippet/${id}/${rev}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
