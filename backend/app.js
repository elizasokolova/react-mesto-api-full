require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { ValidationSignIn, ValidationSignUp } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const options = {
  origin: [
    'lizasokol.students.nomoredomains.xyz',
    'http://localhost:3000',
    'http://lizasokol.students.nomoredomains.xyz',
    'https://lizasokol.students.nomoredomains.xyz',
    'http://api.lizasokol.students.nomoredomains.xyz',
    'https://api.lizasokol.students.nomoredomains.xyz',
    'https://elizasokolova.github.io',
  ],
  credentials: true,
};
const { PORT = 3001 } = process.env;

const app = express();

app.use('*', cors(options));
// app.use((req, res, next) => {
//  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
//  res.header('Access-Control-Allow-Credentials', 'true');
//  next();
// });

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(cookieParser());
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
