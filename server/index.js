const express = require('express');
const config = require('./config');
const routes = require('./routes');
const app = express();
const cors = require('cors');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api', routes);

app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));

module.exports = app
