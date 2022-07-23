require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { ValidationSignIn, ValidationSignUp } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'http://lizasokol.students.nomoredomains.xyz',
    'https://lizasokol.students.nomoredomains.xyz',
  ],
  credentials: true,
};
app.use('*', cors(options));

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт!');
  }, 0);
});

app.post('/signin', ValidationSignIn, login);
app.post('/signup', ValidationSignUp, createUser);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});

app.use(errorLogger);
app.use(errors());

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Произошла ошибка на сервере' : error.message });
  next();
});

app.listen(PORT, () => {
  // В консоли вывод порта
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
