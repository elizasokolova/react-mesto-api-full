const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validationURL = (value) => {
  if (validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_protocol: true })) return value;
  throw new Error('Некорректная ссылка');
};

module.exports.ValidationSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validationURL),
  }),
});

module.exports.ValidationSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.ValidationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validationURL),
  }),
});

module.exports.ValidationUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.ValidationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validationURL),
  }),
});

module.exports.ValidationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports.ValidationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});
