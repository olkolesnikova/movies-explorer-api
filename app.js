const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to db');
});
const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
