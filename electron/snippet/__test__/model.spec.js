const { getModel }= require('../model');
const _ = require('lodash');

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-memory'));

describe('Snippet Model', () => {
  let db = null;
  let model = null;
  const snippets = {
    description: 'test snippets',
    files: [
      {name: 'f1.js', content: 'console.log("hello")'},
      {name: 'f2.js', content: 'console.log("world")'},
    ]
  }

  beforeEach(() => {
    db = new PouchDB(`unittest${_.uniqueId()}`, {adapter: 'memory'});
    model = getModel(db);
  });

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

  describe('Given list of snippet > fetchPage', () => {
    beforeEach((done) => {
      const countSnippet = _.random(20, 99);
      db.bulkDocs(_.times(countSnippet, i => Object.assign({}, snippets, { _id: `test${i < 10 ? '0'+i: i}` }))).then((result) => {
        done();
      });
    })

    it('should support limit', (done) => {
      model.fetchPage({ limit: 20 }).then((result) => {
        expect(result.rows.length).toEqual(20);
        done();
      });
    });

    it('should support pagination', (done) => {
      model.fetchPage({limit: 10, start : 10}).then(result => {
        expect(result.rows.length).toEqual(10);
        console.log(result.rows[0]);
        expect(result.rows[0].id).toEqual('test10');
        done();
      })
    })
  })

})
