const movieRouter = require('express').Router();
const { createMovie, getSavedMovies, deleteSavedMovie } = require('../controllers/movies');
const { createMovieValidation, deleteMovieValidation } = require('../validation/movie-joi-validation');
const auth = require('../middlewares/auth');

movieRouter.use(auth);
movieRouter.get('/movies', getSavedMovies);
movieRouter.post('/movies', createMovieValidation, createMovie);
movieRouter.delete('/movies/:_id', deleteMovieValidation, deleteSavedMovie);

module.exports = movieRouter;
