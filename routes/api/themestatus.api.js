var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/themestatus.api.controller');

// Get
router.get('/theme', controller.getTheme);
// // Post 
// router.post('/theme', upload.single('theme'), controller.postTheme);
// // //delete
// router.get('/theme/delete/:id', controller.deleteTheme);

module.exports = router;