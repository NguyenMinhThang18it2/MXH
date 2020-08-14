var User = require('../../models/users.models');

module.exports.checklogin = async (req, res) => {
    User.findOne({_id : req.idauth}, async (err, user) => {
        if(err){
            res.json({
                success: false,
                msg: "Failed"
              }); 
        }else{
            res.json({
                success: true,
                msg: "Success",
                user: user
            }); 
        }
    });
};