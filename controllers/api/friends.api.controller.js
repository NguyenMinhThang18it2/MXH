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
            res.send(data.listFriend);
        }
    });
};
// 
module.exports.deleteFriend = async (req, res) =>{
    await Friend.findOneAndUpdate({iduser: req.params.id}, {$pull: {
        listFriend:[{
            idfriend: req.body.idfriend
        }] 
    }}).then(data => {
        res.json({
            success: true,
            msg: "Delete friend success"
        });
    }).catch(err => {
        console.log(err + " ");
        res.json({
            success: false,
            msg: "Delete friend false"
        });
    })
};