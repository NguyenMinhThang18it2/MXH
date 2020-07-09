var express = require('express');
var patha = require('path');
var router = express.Router();
var controller = require('../controllers/themestatus.controller');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        console.log("bakajskdkls");
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+ patha.extname(file.originalname);
        console.log("aaa "+uniqueSuffix);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });
var upload = multer({ storage: storage });
// Get
router.get('/theme', controller.getDataTheme);
// Post 
router.post('/theme', upload.single('theme'), controller.postTheme);
// //delete
router.get('/theme/delete/:id', controller.deleteTheme);

module.exports = router;