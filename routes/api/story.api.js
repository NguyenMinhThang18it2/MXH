var express = require('express');
var patha = require('path');
var router = express.Router();
var controller = require('../../controllers/api/story.api.controller');

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+ patha.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });
var upload = multer({ storage: storage });
// get data
router.get('/story', controller.getStory);
// post data
router.post('/story/:id', upload.array('image', 20), controller.postStory);
module.exports = router;