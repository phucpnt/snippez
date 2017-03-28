const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
// const jasmine = require('jasmine');
const _ = require('lodash');
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
  let spy = jasmine.createSpy('spy');
  setConfig({
    snippetsPath:baseSrcPath,
    modulesLookPath: [path.join(baseSrcPath, './node_modules')],
  });

  function buildTestSnippet(snippetId){
    mkdirp.sync(baseSrcPath);
    mkdirp.sync(path.join(baseSrcPath, snippetId));
    snippets.forEach(file => {
      fs.writeFileSync(path.join(baseSrcPath, snippetId, file.name), file.content, {encoding: 'utf8'});
    })
  }

  beforeAll(() => {
    buildTestSnippet('test')
  })


  it('should run snippetId `test` correctly', (done) => {
    const _done = _.once(done);
    start('test', () => {
      spy();
      _done();
    })
  });
  it('should support live reload when snippet change', (done) => {
    fs.appendFileSync(path.join(baseSrcPath, 'test/abc.js'), '\nconsole.log("appended");', {encoding: 'utf8'});
    setTimeout(() => {
      expect(spy.calls.count()).toBeGreaterThan(2);
      done();
    }, 1000);
  });

  it('given another snippet, it should support running new one', (done) => {
    buildTestSnippet('test2');
    start('test2', () => {});
    setTimeout(() => {
      expect(spy.calls.count()).toBeGreaterThan(3);
      fetch('http://localhost:15106/gist-a2/test2.js')
        .then(res => res.text())
        .then(body => {
          expect(body).toContain('hello world');
          done();
        })
    }, 2000);
  });
})
