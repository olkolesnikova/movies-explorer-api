const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/not-found-error');
const InvalidDataError = require('../errors/invalid-data-error');
const ExistingDataError = require('../errors/existing-data-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => {
          res.status(201).send({
            name: user.name,
            email: user.email,
          });
        })
        .catch((err) => {
          console.log(err);
          if (err instanceof mongoose.Error.ValidationError) {
            next(new InvalidDataError('Неверные данные'));
          }
          if (err.code === 11000) {
            next(new ExistingDataError('Пользователь с таким Email уже зарегистрирован'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Такого пользователя не существует');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверные данные');
          }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'secret-code',
          );
          res.cookie('jwt', token, {
            // maxAge: 600000,
          });
          return res.send({ token });
        });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  return User.findById({ _id: req.user._id })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      return res.send(user);
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  return User.findOne({ email })
    .then((data) => {
      if (data) {
        throw new ExistingDataError('Пользователь с таким Email уже зарегистрирован');
      }
      User.findByIdAndUpdate(req.user._id, { name, email }, {
        new: true,
        runValidators: true,
      })
        .then(() => {
          res.send({ message: 'Данные успешно обновлены' });
        })
        .catch((err) => {
          console.log(err);
          if (err instanceof mongoose.Error.ValidationError) {
            next(new InvalidDataError('Неверные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports = {
  login,
  createUser,
  getUserInfo,
  updateUserInfo,
};
