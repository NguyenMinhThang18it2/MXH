var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/profile.api.controller');

//
router.get('/profile/:id', controller.getProfile);
//
router.post('/profile/:id' , controller.postsProfile);

module.exports = router;