const mongoose = require('mongoose');

const NotFoundError = require('../errors/not-found-error');
const InvalidDataError = require('../errors/invalid-data-error');
const ForbiddenError = require('../errors/forbidden-error');

const Movie = require('../models/movie');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    trailerLink,
  } = req.body;
  console.log(req.body);

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
    trailerLink,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidDataError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

const getSavedMovies = (req, res, next) => {
  return Movie.find({ owner: req.user.id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const deleteSavedMovie = (req, res, next) => {
  const { _id } = req.params;
  console.log(req.params._id);

  return Movie.findById(_id)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалять фильмы других пользователей');
      }
      Movie.deleteOne()
        .then(() => {
          res.send({ message: 'Фильм успешно удален' });
        })
        .catch(next);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new InvalidDataError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  getSavedMovies,
  deleteSavedMovie,
};
