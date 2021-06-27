const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');

const viewsRouter = require('./routes/views');
const apiRouter = require('./routes/api');

const app = express();

const {
  SESS_NAME = 'sid',
  SESS_SECRET = `Please don't tell anybody men!!! 😱`,
} = process.env;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(session({
  name: SESS_NAME,
  resave: false,
  secret: SESS_SECRET,
  cookie: {
    sameSite: true,
  },
}));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewsRouter);
app.use('/api/', apiRouter);

module.exports = app;
