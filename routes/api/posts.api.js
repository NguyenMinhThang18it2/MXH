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
      console.log(file);
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
router.get('/posts/:id', controller.getPostsUser);
// post posts
router.post('/posts', upload.array('image', 20), controller.postPosts);
// posts share
router.post('/posts/share', controller.postSharePosts);
//
router.post('/postbackground' , controller.postBackground);
//
router.get('/postsdetail/:id', controller.getPostsDetail);
//Delete posts
router.delete('/deleteposts/:id', controller.getDelete);
//Edit posts
router.put('/updateposts/:id', controller.getUpdate);
module.exports = router;