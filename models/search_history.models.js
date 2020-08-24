var mongoose = require('mongoose');
var SearchHistorySchema = new mongoose.Schema({
    iduser: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
    key:{
        type: String,
        required: true
    },
    createdAt: 
    {
        type: Date, 
        default: Date.now
    }
});
var SearchHistory = mongoose.model("SearchHistory",SearchHistorySchema, "searchhistory");
module.exports = SearchHistory;