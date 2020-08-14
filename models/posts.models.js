var mongoose = require('mongoose');

var PostsSchema = new mongoose.Schema({
    iduser:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }
    ,
    level:{
        type:Number,
        require:true
    },
    document: 
    {
        type:String,
        required: true
    },
    file: {
        image:[String]
        ,
        video: 
        {
            type:String,
            required: true
        },
        background: 
        {
            type:String,
            required: true
        }
    }
    ,
    numberLike:[{
        iduserLike:{
            type:mongoose.Schema.Types.ObjectId, ref: 'User' 
        },
        typeLike: {
            type:Number,
            require : true
        }
    }],
    numberCmt: 
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

var Posts = mongoose.model("Posts", PostsSchema, "posts");

module.exports = Posts;