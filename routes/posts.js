var express = require('express');
var patha = require('path');
var router = express.Router();
var controller = require('../controllers/posts.controller');
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
      console.log(uniqueSuffix);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });
var upload = multer({ storage: storage });

/* GET users listing. */
router.get('/tablepost', controller.getPosts);
/* Post users listing. */
router.post('/tablepost', upload.array('image', 5), controller.postPost);
router.post('/tablepostsss', upload.array('image', 5), controller.tetsPostFIle);
// router.postnotfile('/tablepost', controller.postPostnotfile);
/* Delete user */
router.get('/tablepost/delete/:id', controller.delete);
// Update user
router.post('/tablepost/update/:id', controller.edit);
// ajax
// Like
router.get('/tablepost/likeposts', controller.likeposts);
//get comment
module.exports = router;