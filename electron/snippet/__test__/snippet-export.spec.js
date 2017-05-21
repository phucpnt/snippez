const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const _ = require('lodash');
const { start, setConfig } = require('../snippet-start');
const { build } = require('../snippet-export');

const snippets = [{
    name: 'index.js',
    content: `
import * as lodash from 'lodash';
import abc from './abc';
console.log(_.times(3, () => console.log('hello world')));
  `
  }, {
    name: 'abc.js',
    content: `
console.log('hello abc.js');
    `
  }, {
    name: 'index.html',
    content: `
<ha2>Hello World</h2>
    `
  },

];

describe('Snippet - Run', () => {
  const baseSrcPath = path.join(__dirname, './tmp/');
  let spy = jasmine.createSpy('spy');
  setConfig({
    snippetsPath: baseSrcPath,
    modulesLookPath: [path.join(baseSrcPath, './node_modules')],
  });

  it('should build successfully', (done) => {
    build({
      id: 'test-export',
      files: snippets,
      description: 'test exported to github pages',
      rootModule: [path.join(baseSrcPath, './node_modules')],
     }).then(done);
  });
});
