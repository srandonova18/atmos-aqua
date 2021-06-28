const express = require('express');
const session = require('express-session');
// const fetch = require('node-fetch');
const router = express.Router();
const { redirectLogin } = require('./middlewares')


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/admin', /* redirectLogin, */ function(req, res, next) {
  res.render('admin');
});

router.get('/worker', /* redirectLogin, */ function(req, res, next) {
  res.render('worker');
});

router.get('/agent', /* redirectLogin, */ function(req, res, next) {
  res.render('agent');
});

router.get('/create-port', function(req, res, next) {
  res.render('create-port');
});

module.exports = router;
