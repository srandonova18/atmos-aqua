let express = require('express');
const fetch = require('node-fetch');
let router = express.Router();

router.get('/api', function(req, res, next) {
  res.send(true);
});

module.exports = router;