var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/search.api.controller');

router.get('/search/:key', controller.getData);
// get từ khóa đã search
router.get('/search-history/:id', controller.getSearchHistory);
// update từ khóa đã search vaaof database
router.post('/search-history', controller.insertData);

module.exports = router;