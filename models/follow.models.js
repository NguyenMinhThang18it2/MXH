var mongoose = require('mongoose');

var followSchema = mongoose.Schema({
    iduser:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    listFollowers:[{
        iduserFollowers:{
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        }
    }],
    listFollowing:[{
        iduserFollowing:{
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        }
    }]
});
var Follow = mongoose.model('Follow', followSchema, 'follows');
module.exports = Follow;