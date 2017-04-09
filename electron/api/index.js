const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

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
