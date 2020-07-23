var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/follower.api.controller');

router.get('/followers/:id', controller.getFollowers);

router.get('/following/:id', controller.getFollowing);

module.exports = router;