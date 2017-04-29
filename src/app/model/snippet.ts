import SnippetFile from './snippet-file';

export interface Snippet {
  _id: string,
  _rev?: string,
  description: string,
  files: SnippetFile[],
  createdAt: Date,
  updatedAt: Date,
}
