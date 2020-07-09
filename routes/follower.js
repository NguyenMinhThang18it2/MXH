var express = require('express');
var router = express.Router();
var controller = require('../controllers/follower.controller');

router.get('followers/:id', controller.getFollowers);

router.get('following/:id', controller.getFollowing);

router.get('/follow/:id', controller.postFollowers);

router.get('/unfollow/:id', controller.unFollowers);

module.exports = router;