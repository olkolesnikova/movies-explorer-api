const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/not-found-error');
const limiter = require('./middlewares/rate-limeter');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to db');
});
const app = express();

const corsOptions = {
  origin: [
    'https://api.movies-collection.nomoredomainsrocks.ru',
    'https://movies-collection.nomoredomainsrocks.ru',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://api.nomoreparties.co/beatfilm-movies',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
};

app.use(express.json());

app.use(cookieParser());
app.use(helmet());

app.use(requestLogger);

app.use(cors(corsOptions));

app.use(userRouter);
app.use(movieRouter);

app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.use(limiter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
