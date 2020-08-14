var express = require('express');
var patha = require('path');
var router = express.Router();
var controller = require('../controllers/story.controller');
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

/* GET users listing. */
router.get('/tablestory', controller.getDataStorys);
/* Post users listing. */
router.post('/tablestory', upload.array('image', 20), controller.postStory);
/* Delete user */
router.get('/tablestory/delete/:id', controller.delete);
// Update user
router.post('tablestory/update/:id', controller.edit);

module.exports = router;