var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/notification.api.controller.js');

router.get('/notification/:id', controller.getNotification);

router.get('/updatenotification/:id', controller.updateNotification);

router.delete('/deletenotification/:id', controller.deleteNotifi);
module.exports = router;