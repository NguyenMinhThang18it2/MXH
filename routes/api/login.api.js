var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/login.api.controller');

//
// router.get('/api/login', controller.getlogin);
//
router.post('/login', controller.postlogin);

router.post("/register", controller.postRegister);

module.exports = router;