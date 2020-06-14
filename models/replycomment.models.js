var mongoose = require('mongoose');

var replyCmtSchema = new mongoose.Schema({
    idcmt:{
        type: mongoose.Schema.type.ObjectId,
        require: true,
        ref: 'Cmt'
    },
    idposts:{
        type: mongoose.Schema.type.ObjectId,
        require: true,
        ref: 'Posts'
    },
    listCmt:[{
        iduser:{
            type: mongoose.Schema.type.ObjectId,
            require: true,
            ref: 'User'
        },
        document:{
            type: String,
            require: true
        },
        file:{
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
    }]
});
var reqlyCmt = mongoose.model("reqlyCmt", replyCmtSchema, "replycomment");

module.exports = reqlyCmt;
