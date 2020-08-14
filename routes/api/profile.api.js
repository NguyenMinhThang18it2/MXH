var express = require('express');
var patha = require('path');
var router = express.Router();
var controller = require('../../controllers/api/profile.api.controller');

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
      console.log(file);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+ patha.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });
var upload = multer({ storage: storage });
//
router.get('/profile/:id', controller.getProfile);
//
router.post('/profile/:id' , controller.postsProfile);
//
router.post('/avataprofile/:id', upload.single('image'), controller.postAvata);
//
router.post('/coverimgprofile/:id', upload.single('image'), controller.postCoverImg);
//
router.post('/profileusername/:id', controller.postUserName);
module.exports = router;