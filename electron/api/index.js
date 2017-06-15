const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = function getApiApp() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  const Snippet = require('../snippet/model');

  app.get('/snippet/:id', (req, res) => {
    Snippet.get(req.params.id).then((snippet) => {
      res.json(snippet);
    });
  })

  app.post('/snippet/:id', (req, res) => {
    Snippet.update(req.body, req.params.id).then(snippet => {
      res.json(snippet);
    });
  });

  app.get('/snippet', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset) : undefined;

    Snippet.fetchPage({ limit, start: offset }).then(result => {
      res.json({
        total: result.total_rows,
        count: result.rows.length,
        data: result.rows.map(row => row.doc),
      });
    });
  });

  app.delete('/snippet/:id/:rev', (req, res) => {
    Snippet.remove(req.params.id, req.params.rev).then(() => {
      res.json({
        id: req.params.id,
      });
    });
  });

  return app;
};
