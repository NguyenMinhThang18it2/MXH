var mongoose = require('mongoose');

var notificationSchema = mongoose.Schema({
    iduser:{
        type: mongoose.Schema.type.ObjectId,
        require: true,
        ref: 'User'
    },
    listnotification:[{
        id_Source:{
            type: mongoose.Schema.type.ObjectId,
            require: true,
            refPath: "onModel"
        },
        onModel:{
            type: String,
            required: true,
            enum: ['Posts', 'Storys']
        },
        iduserpost:{
            type: mongoose.Schema.type.ObjectId,
            require: true,
            ref: 'User'
        },
        title:{
            type: String,
            require: true
        },
    }]
});
var Notification = mongoose.model('Friend', notificationSchema, 'notifications');
module.exports = Notification;