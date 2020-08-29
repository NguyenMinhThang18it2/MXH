const User = require('../../models/users.models');
const SearchHistorySchema = require('../../models/search_history.models');

module.exports.getData = async (req, res) =>{
    let regex = new RegExp(escapeRegExp(req.params.key), 'gi');
    await User.find({username : regex}, async (err, searchOK) =>{
        if(err) console.log(err);
        else{
            res.send(searchOK);
        }
    })
}
function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
//
module.exports.insertData = async (req, res) => {
    let searchHistory = await new SearchHistorySchema({
        iduser: req.body.id,
        key: req.body.key,
        createdAt: new Date()
    });
    await searchHistory.save().then(x=>{
        res.json({
            success: true,
            msg: "Search new success!"
        });
    }).catch(err =>{
        res.json({
            success: false,
            msg: "Search new false!"
        });
    })
}
//
module.exports.getSearchHistory = async (req, res) =>{
    await SearchHistorySchema.find({iduser: req.params.id}).sort(-1).limit(10)
        .then(data =>{
            res.send(data);
        }).catch(err =>{
            console.log(err +'');
        })
}