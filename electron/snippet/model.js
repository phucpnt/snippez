const PropTypes = require('proptypes');
const db = require('./repo');


const schema = {
  _id: PropTypes.string,
  _rev: PropTypes.string,
  description: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    content: PropTypes.string,
  })),
  createdAt: PropTypes.instanceOf(Date),
  updatedAt: PropTypes.instanceOf(Date),
  versioning: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.instanceOf(Date),
    files: PropTypes.array,
  })),
};

function check(propTypes, props) {
    for (let prop in propTypes) {
        if (propTypes.hasOwnProperty(prop)) {
            let err = propTypes[prop](props, prop, 'name', 'prop');
            if (err) {
                console.warn(err);
                return false;
            }
        }
    }
    return true;
}

const requireValidSnippet = (fn) => (snippet, ...args ) => {
  if (check(schema, snippet)){
    return fn(snippet, ...args);
  }
  throw new Error('Invalid Snippet');
};

function create({ description, files, _id = null }) {
  const snippet = { description, files };
  if (_id === null) {
    return db.post({ description, files })
  } else {
    return db.put({ _id, description, files })
  }
}

function update(updates, snippetId){
  return db.put(updates);
}

function get(snippetId){
  return db.get(snippetId);
}

module.exports = {
  create: requireValidSnippet(create),
  update: requireValidSnippet(update),
  get,
}

