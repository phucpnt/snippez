const PouchDB = require('pouchdb');
const AppConst = require('../const-app');

const dbFilePath = AppConst.DB_PATH;
console.log('📌 db stored in > ', dbFilePath);
module.exports = new PouchDB(dbFilePath);
