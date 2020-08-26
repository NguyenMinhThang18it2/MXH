var express = require('express');
var router = express.Router();
var controller = require('../controllers/mess.controller');

router.get('/mess', controller.getData);

module.exports = router;