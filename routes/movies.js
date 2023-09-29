const movieRouter = require('express').Router();
const { createMovie, getSavedMovies, deleteSavedMovie } = require('../controllers/movies');
const auth = require('../middlewares/auth');

movieRouter.use(auth);
movieRouter.get('/movies', getSavedMovies);
movieRouter.post('/movies', createMovie);
movieRouter.delete('/movies/:_id', deleteSavedMovie);

module.exports = movieRouter;
