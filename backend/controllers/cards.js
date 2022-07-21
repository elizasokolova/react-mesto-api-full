const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => next(new InternalServerError()));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с таким _id не существует'));
      }
      if (req.user._id !== card.owner.toString()) {
        return next(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }
      return Card.deleteOne(card)
        .then(() => {
          res.status(200).send({ message: 'Карточка успешно удалена' });
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Ошибка запроса'));
      } else if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка с таким _id не существует'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new mongoose.Error.DocumentNotFoundError();
      } else {
        return res.status(200).send(card);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Ошибка запроса'));
      } else if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка с таким _id не существует'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new mongoose.Error.DocumentNotFoundError();
      } else {
        return res.status(200).send(card);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Ошибка запроса'));
      } else if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка с таким _id не существует'));
      } else {
        next(new InternalServerError());
      }
    });
};
