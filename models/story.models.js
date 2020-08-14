var mongoose = require('mongoose');
var StorysSchema = new mongoose.Schema({
    iduser:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }
    ,
    text: 
    {
        document:
        {
            type:String,
            require: true
        },
        color:
        {
            type:String,
            require: true
        }
    },
    file:[String],
    numberLike:[{
        iduserLike:{
            type:mongoose.Schema.Types.ObjectId, ref: 'User' 
        }
    }],
    createdAt: 
    {
        type: Date, 
        default: Date.now
    },
    updatedAt: 
    {
        type: Date, 
        default: Date.now
    }
});

var Storys = mongoose.model("Storys", StorysSchema, "storys");

module.exports = Storys;