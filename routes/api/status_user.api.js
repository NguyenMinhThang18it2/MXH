var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/status_user.api.controller');

router.get('/statususer', controller.getData);

module.exports = router;