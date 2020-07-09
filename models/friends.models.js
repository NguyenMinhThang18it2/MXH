var mongoose = require('mongoose');

var friendSchema = mongoose.Schema({
    iduser:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    listFriend:[{
        idfriend:{
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        }
    }]
});
var Friend = mongoose.model('Friend', friendSchema, 'friends');
module.exports = Friend;