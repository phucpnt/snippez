const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const Snippet = require('../snippet/model');

const port = 1806

app.listen(port, (err) => {
  if(!err){
    console.log('Server started ....');
  } else {
    console.log('error...', err);
  }
});

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


