var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    email: 
    {
        type:String,
        required: true,
        unique: true
    },
    password: String,
});

var User = mongoose.model("User", userSchema, "users");

module.exports = User;