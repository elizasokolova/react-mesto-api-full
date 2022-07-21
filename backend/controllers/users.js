const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_SECRET } = require('../utils/secretKey');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильные почта или пароль'));
        return;
      }
      // eslint-disable-next-line consistent-return
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // если хэши не совпали, мы отклоняем промис
          next(new UnauthorizedError('Неправильные почта или пароль'));
          return;
        }
        // eslint-disable-next-line consistent-return
        return user; // Я не понимаю почему EsLint ругается на них...
      });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, { httpOnly: true, sameSite: true })
        .send({ token }); // возвращаем токен
    })
    .catch((error) => next(error));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(new InternalServerError('Произошла ошибка')));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })) // Захешировали пароль
    .then(() => res.status(201).send({ name, about, avatar }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (error.code === 11000) {
        next(new ConflictError('Указанный e-mail уже зарегистрирован'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new mongoose.Error.DocumentNotFoundError();
      } else {
        return res.status(200).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Ошибка запроса'));
      } else if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new mongoose.Error.DocumentNotFoundError();
      } else {
        return res.send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Ошибка запроса'));
      } else if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // валидация данных перед изменением
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        // const message = Object.entries(error.errors)
        //   .map(([errorName, errorMessage]) => `${errorName}: ${errorMessage}`)
        //   .join('; ');
        next(new BadRequestError('Переданы некорректные данные для обновления профиля'));
      } else if (error.name === 'CastError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // валидация данных перед изменением
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для обновления аватара'));
      } else if (error.name === 'CastError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(new InternalServerError());
      }
    });
};
