var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/user.api.controller');

router.get('/checklogin', controller.checklogin);

module.exports = router;