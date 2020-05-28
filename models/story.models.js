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
            required: true
        },
        color:
        {
            type:String,
            required: true
        }
    },
    file: {
        image: 
        {
            type:String,
            required: true
        },
        video: 
        {
            type:String,
            required: true
        }
    }
    ,
    numberLike: 
    {
        type:Number,
        required: true
    },
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