var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        text: true
    },
    email: 
    {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    avata: {
        type:String,
        require: true
    },
    coverimage:{
        type:String,
        require: true
    }
});

var User = mongoose.model("User", userSchema, "users");

module.exports = User;