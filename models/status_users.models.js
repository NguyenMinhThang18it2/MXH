var mongoose = require('mongoose');
var StatusUserSchema = new mongoose.Schema({
    iduser : {
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
    status: {
        type: Boolean,
        require: true
    },
    createdAt:{
        type: Date, 
        default: Date.now
    }
});
var StatusUser = mongoose.model("StatusUser", StatusUserSchema, "statususers");
module.exports = StatusUser;