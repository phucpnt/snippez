const express = require('express');
const getApiApp = require('./api');
const hb = require('handlebars');
const fs = require('fs-extra');
const path = require('path');
const constApp = require('./const-app');

let server = null;
const hostName = 'localhost';
const devPort = 15106;

module.exports = {
  hostName,
  devPort,
  getServer: () => {
    if (server) {
      return server;
    }
    server = express();

    const router = express.Router();
    router.get('/:snippetId', (req, res) => {
      const snippetId = req.params.snippetId;
      const template = hb.compile(fs.readFileSync(path.join(__dirname, './resource/snippet-entry.hbs'), { encoding: 'UTF8' }));
      res.send(template({
        vendor: `//localhost:${devPort}/gist-a2/vendor.js`,
        url_iframe_result: `//localhost:${devPort}/${snippetId}/result`,
        url_iframe_spec: `//localhost:${devPort}/${snippetId}/spec`
      }));
    });

    router.get('/:snippetId/result', (req, res) => {
      const snippetId = req.params.snippetId;
      const template = hb.compile(fs.readFileSync(path.join(__dirname, './resource/snippet-result.hbs'), { encoding: 'UTF8' }));
      res.send(template({
        content: fs.readFileSync(`${constApp.TMP_SNIPPEZ_REPO_PATH}/${snippetId}/index.html`, 'utf8'),
        entry: `//localhost:${devPort}/gist-a2/${snippetId}.js`,
        vendor: `//localhost:${devPort}/gist-a2/vendor.js`,
        path_node_module: path.join(constApp.TMP_SNIPPEZ_REPO_PATH, './node_modules'),
      }));
    });

    router.get('/:snippetId/spec', (req, res) => {
      const snippetId = req.params.snippetId;
      const template = hb.compile(fs.readFileSync(path.join(__dirname, './resource/snippet-result.hbs'), { encoding: 'UTF8' }));
      res.send(template({
        entry: `//localhost:${devPort}/gist-a2/${snippetId}-spec.js`,
        vendor: `//localhost:${devPort}/gist-a2/vendor.js`,
        path_node_module: path.join(constApp.TMP_SNIPPEZ_REPO_PATH, './node_modules'),
      }));
    });

    server.use(router);
    server.use('/api', getApiApp());
    server.listen(devPort, '0.0.0.0', () => {
      console.log(`DEV SERVER start on port: ${devPort}`);
    });
  }
};
