var express = require('express');
var router = express.Router();
var controller = require('../controllers/friends.controller');

router.get('/friend/:id', controller.getFriends);

router.get('/addfriend/:id', controller.addFriend);

router.get('/deletefriend/:id', controller.deleteFriend);

module.exports = router;