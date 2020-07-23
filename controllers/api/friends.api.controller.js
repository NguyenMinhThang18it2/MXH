var Friend = require('../../models/friends.models');

module.exports.getFriends = async (req, res) =>{
   await Friend.findOne({iduser: req.params.id}).populate('listFriend.idfriend', 'username avata').exec(async (err, data)=>{
        if(err) throw err;
        else if(data === null){
            res.json({
                success: false,
                msg: "Not friend"
            });
        }else{
            res.send(data);
        }
    });
};