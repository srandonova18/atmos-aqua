const express = require('express');
const session = require('express-session');
const router = express.Router();
const { redirectLogin, adminOnly } = require('./middlewares')

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/admin', redirectLogin, (req, res) => {
  res.render('admin');
});

router.get('/worker', redirectLogin, (req, res) => {
  res.render('worker');
});

router.get('/agent', redirectLogin, (req, res) => {
  res.render('agent');
});

router.get('/create-port', (req, res) => {
  res.render('create-port');
});

router.get('/shipment/:shipmentId', (req, res) => {
  res.render('shipment', {shipmentId: req.params.shipmentId});
});

module.exports = router;
