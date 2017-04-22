import {Snippet} from './app/model/snippet';
declare const fetch: any;


const HOST_NAME = 'http://127.0.0.1:1806';

function api(urn:string): string{
  return `${HOST_NAME}${urn}`;
}

export function getSnippet(id: string) {
  return fetch(api(`/snippet/${id}`)).then(response => response.json());
}

export function saveSnippet(id: string, snippet: Snippet){
  return fetch(api(`/snippet/${id}`), {
    method: id === null ? 'PUT': 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(snippet),
  });
}
