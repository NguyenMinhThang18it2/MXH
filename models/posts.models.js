var mongoose = require('mongoose');

var PostsSchema = new mongoose.Schema({
    iduser:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }
    ,
    document: 
    {
        type:String,
        required: true
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
        },
        background: 
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