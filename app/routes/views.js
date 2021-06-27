const express = require('express');
const session = require('express-session');
// const fetch = require('node-fetch');
const router = express.Router();
const { redirectLogin } = require('./middlewares')


router.get('/', function(req, res, next) {
  res.render('index', {title: "Website"});
});

router.get('/admin', redirectLogin, function(req, res, next) {
  res.send('admin')
});

router.get('/worker', redirectLogin, function(req, res, next) {
  res.send('worker')
});

router.get('/agent', redirectLogin, function(req, res, next) {
  res.send('agent')
});

module.exports = router;
