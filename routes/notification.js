var express = require('express');
var router = express.Router();
var controller = require('../controllers/notification.controller');

router.get('/notification/:id', controller.getNotification);

module.exports = router;