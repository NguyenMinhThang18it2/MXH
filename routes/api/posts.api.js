var express = require('express');
var patha = require('path');
var router = express.Router();
var controller = require('../../controllers/api/posts.api.controller');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
      let parts = file.originalname.split('.');
      let format = parts[parts.length - 2];
      if(format == "background"){
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+"."+format+patha.extname(file.originalname);
      }else{
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+ patha.extname(file.originalname);
      }
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });
var upload = multer({ storage: storage });


// get posts
router.get('/posts', controller.getPosts);
// post posts
router.post('/posts', upload.single('image'), controller.postPosts);
//
router.post('/postbackground' , controller.postBackground);
//Delete posts

//Edit posts
module.exports = router;