require('dotenv/config');

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
require('./src/routes')(app);

app.listen(process.env.PORT || 8282);

module.exports = app;
