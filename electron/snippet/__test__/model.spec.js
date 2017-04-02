
const model = require('../model');

describe('Snippet Model', () => {
  const snippets = {
    description: 'test snippets',
    files: [
      {name: 'f1.js', content: 'console.log("hello")'},
      {name: 'f2.js', content: 'console.log("world")'},
    ]
  }

  it('Given valid snippet, it should successfully create new snippet', (done) => {
    model.create(snippets).then((response) => {
      console.log(response);
      done()
    });
  });

  it('Given invalid snippet, it should error', (done) => {
    expect(() => model.create({description: 'aaa', files: {a: 1}})).toThrowError();
    done();
  });

})
