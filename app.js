const express = require('express');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});