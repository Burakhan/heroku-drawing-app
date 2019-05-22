var express = require('express');
var router = express.Router();
var Socket = require('../lib/Socket');

/* GET home page. */
router.get('/room/:roomId', function (req, res, next) {
  res.render('index', { drawRoom: req.params.roomId });
});

router.get('/literally/:roomId', function (req, res, next) {
  res.render('literally', { drawRoom: req.params.roomId });
});

module.exports = router;
