var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/story.api.controller');

// get data
router.get('/story', controller.getStory);
// post data
// router.post('/story', controller.postStory);
module.exports = router;