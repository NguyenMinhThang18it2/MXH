var mongoose = require('mongoose');
var themeSchema = new mongoose.Schema({
    themestatus:{
        type: String,
        require: true
    }
});
var Themestatus = mongoose.model("Theme", themeSchema, "themes");

module.exports = Themestatus;