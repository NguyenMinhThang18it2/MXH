var express = require('express');
var patha = require('path');
var router = express.Router();
var controller = require('../../controllers/api/comment.api.controller');

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
// upload file Comment
router.post('/comment/:id', upload.single('image'), controller.postFileComment);
// delete
router.delete('/deletecomment/:id', controller.deleteComment);
// put
router.put('/putcomment/:id', controller.putComment);
module.exports = router;