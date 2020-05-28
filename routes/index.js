var express = require('express');
var router = express.Router();
var controller = require('../controllers/login.controller');

/* GET home page. */
router.get('/', controller.getlogin);
// Post login
router.post('/', controller.postlogin);


module.exports = router;
