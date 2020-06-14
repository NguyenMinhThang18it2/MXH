var mongoose = require('mongoose');

var followSchema = mongoose.Schema({
    iduser:{
        type: mongoose.Schema.type.ObjectId,
        require: true,
        ref: 'User'
    },
    listFollow:[{
        iduser:{
            type: mongoose.Schema.type.ObjectId,
            require: true,
            ref: 'User'
        }
    }]
});
var Follow = mongoose.model('Follow', followSchema, 'follows');
module.exports = Follow;