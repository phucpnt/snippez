const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const {start, setConfig} = require('../snippet-start');

const snippets = [
  {
    name: 'index.js',
    content: `
  import abc from './abc';
  console.log(_.times(3, () => console.log('hello world')));
  `}, {
    name: 'abc.js',
    content: `
  console.log('hello abc.js');
    `
  },
];

describe('Snippet - Run', () => {
  const baseSrcPath = path.join(__dirname, './tmp/');
  setConfig({
    snippetsPath:baseSrcPath,
    modulesLookPath: [path.join(baseSrcPath, './node_modules')],
  });

  beforeAll(() => {
    mkdirp.sync(baseSrcPath);
    mkdirp.sync(path.join(baseSrcPath, 'test'));
    snippets.forEach(file => {
      fs.writeFileSync(path.join(baseSrcPath, 'test', file.name), file.content, {encoding: 'utf8'});
    })
  })


  it('should run snippetId `test` correctly', (done) => {
    start('test', () => {
      done();
    });
  });
  it('should support live reload when snippet change');
  it('given another snippet, it should support running new one');
})
