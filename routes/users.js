const userRouter = require('express').Router();
const {
  login, createUser, getUserInfo, updateUserInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

userRouter.post('/signin', login);
userRouter.post('/signup', createUser);
userRouter.use(auth);
userRouter.get('/users/me', getUserInfo);
userRouter.patch('/users/me', updateUserInfo);

module.exports = userRouter;
