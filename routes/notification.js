var express = require('express');
var router = express.Router();
var controller = require('../controllers/notification.controller');

router.get('/notification', controller.getNotification);

module.exports = router;