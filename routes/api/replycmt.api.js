var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/replycomment.api.controller');

router.get('/replycmt/:id', controller.getReplyComment);
// delete
router.delete('/deletereplycmt/:id', controller.deleteRepCmt);
// put
router.put('/putreplycmt/:id', controller.putRepCmt);

module.exports = router;