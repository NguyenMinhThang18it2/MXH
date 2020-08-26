var mongoose = require('mongoose');

var MessSchema = new mongoose.Schema({
    members:[{
        iduser:{
            type:mongoose.Schema.Types.ObjectId, ref: 'User' 
        }
    }],
    content:[{
        iduser:{
            type:mongoose.Schema.Types.ObjectId, ref: 'User' 
        },
        message:{
            type: String,
            require: true
        },
        file:{
            image:{type: String, require: true},
            video:{type: String, require: true}
        },
        createdAt: 
        {
            type: Date, 
            default: Date.now
        }
    }]
});
var Mess = mongoose.model("Mess", MessSchema, "mess");

module.exports = Mess;
