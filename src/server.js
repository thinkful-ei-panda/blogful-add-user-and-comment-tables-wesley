const knex = require('knex');
const app = require ('./app');
const {PORT, NODE_ENV, DB_URL} = require('./config');

const db = knex ({
  client : 'pg',
  connection: DB_URL
});

app.set('db',db);

app.listen(PORT, () => {
  console.log(`Server is listening in ${NODE_ENV} mode at http://localhost:${PORT}`);
});