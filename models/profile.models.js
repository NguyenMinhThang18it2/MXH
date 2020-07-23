var mongoose = require('mongoose');

var profileSchema = new mongoose.Schema({
    iduser: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
    profile:{
        gender:{
            type: String,
            require: true
        },
        phone:{
            type: String,
            require: true
        },
        dateofbirth:{
            type: String,
            require: true
        },
        nickname:{
            type: String,
            require: true
        } 
    },
    education:{
        studied_at:{
            type:String,
            require: true
        },
        studies_at :{
            type: String,
            require: true
        }
    },
    placeslive:{
        type: String,
        require: true
    },
    from:{
        type:String,
        require: true
    },
    job:{
        type: String,
        require: true
    },
    createdAt:{
        type: Date, 
        default: Date.now
    },
    updatedAt:{
        type: Date, 
        default: Date.now
    }
});

var Profile = mongoose.model("Profile", profileSchema, "profiles");

module.exports = Profile;