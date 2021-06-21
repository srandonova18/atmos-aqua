let express = require('express');
const fetch = require('node-fetch');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {title: "Website"});
});

module.exports = router;
