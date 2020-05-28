var express = require('express');

var router = express.Router();


var controller = require('../controllers/users.controller');


/* GET users listing. */
router.get('/tableuser', controller.getUsers);
/* Post users listing. */
router.post('/tableuser', controller.postUser);
/* Delete user */
router.get('/tableuser/delete/:id', controller.delete);
// Update user
router.post('/tableuser/update/:id', controller.edit);

module.exports = router;
