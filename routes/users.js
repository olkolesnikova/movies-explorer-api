const userRouter = require('express').Router();
const {
  login, createUser, getUserInfo, updateUserInfo,
} = require('../controllers/users');
const {
  loginValidation, registrationValidation, updateUserInfoValidation,
} = require('../validation/user-joi-validation');
const auth = require('../middlewares/auth');

userRouter.post('/signin', loginValidation, login);
userRouter.post('/signup', registrationValidation, createUser);
userRouter.use(auth);
userRouter.get('/users/me', getUserInfo);
userRouter.patch('/users/me', updateUserInfoValidation, updateUserInfo);

module.exports = userRouter;
