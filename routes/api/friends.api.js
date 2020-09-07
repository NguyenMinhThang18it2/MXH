var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/friends.api.controller');

router.get('/friend/:id', controller.getFriends);


module.exports = router;