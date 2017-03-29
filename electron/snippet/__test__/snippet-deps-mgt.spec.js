const path = require('path');
const {process} = require('../snippet-deps-mgt');

const snippetContents = [
  `const debug = require('debug');
  debug('hello world');
  `,
  `import isStream from 'is-stream';
  isStream('not a stream but a string.');
  `
]

describe('Snippet dependencies management', () => {
  it('given source, it should parse and install correctly module', () => {
    const modules = process(snippetContents, path.join(__dirname, './tmp'));
    expect(modules).toContain('debug');
    expect(modules).toContain('is-stream');
    const packageJson = require(path.join(__dirname, './tmp', 'package.json'));
    expect(Object.keys(packageJson.dependencies)).toContain('debug');
    expect(Object.keys(packageJson.dependencies)).toContain('is-stream');
  }, 60*1000);
})
