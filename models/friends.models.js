var mongoose = require('mongoose');

var friendSchema = mongoose.Schema({
    iduser:{
        type: mongoose.Schema.type.ObjectId,
        require: true,
        ref: 'User'
    },
    iduserfirend:{
        type: mongoose.Schema.type.ObjectId,
        require: true,
        ref: 'User'
    }

});
var Friend = mongoose.model('Friend', friendSchema, 'friends');
module.exports = Friend;