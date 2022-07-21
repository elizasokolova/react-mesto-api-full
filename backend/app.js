const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { ValidationSignIn, ValidationSignUp } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors);
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт!');
  }, 0);
});

app.post('/signin', ValidationSignIn, login);
app.post('/signup', ValidationSignUp, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => {
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
