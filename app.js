let express = require('express');
let path = require('path');
let logger = require('morgan');

let viewsRouter = require('./routes/views');
let apiRouter = require('./routes/api');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewsRouter);
app.use('/', apiRouter);

module.exports = app;
