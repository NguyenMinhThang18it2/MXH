var mongoose = require('mongoose');

var CmtSchema = new mongoose.Schema({
    idposts:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Posts'
    },
    iduser:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    document:{
        type: String,
        require: true
    },
    file:{
        imageComment: 
        {
            type:String,
            required: true
        }
    },
    numberLike:[{
        iduserLike:{
            type:mongoose.Schema.Types.ObjectId, ref: 'User' 
        },
        typeLike:{
            type: Number,
            require: true
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
var Cmt = mongoose.model("Cmt", CmtSchema, "comment");

module.exports = Cmt;
