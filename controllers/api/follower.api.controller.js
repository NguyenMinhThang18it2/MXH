var Follow = require('../../models/follow.models');
// ... đang theo dõi bạn
module.exports.getFollowers = async (req, res) => {
    await Follow.findOne({iduser: req.params.id}).populate('listFollowers.iduserFollowers','username avata').exec( async (err, data) => {
        if(err) throw err;
        else{
            res.send(data.listFollowers);
        }
    });
};
// bạn đang theo dõi ..
module.exports.getFollowing = async (req, res) => {
    await Follow.findOne({iduser: req.params.id}).populate('listFollowing.iduserFollowing','username avata').exec(async (err, data) => {
        if(err) throw err;
        else{
            res.send(data.listFollowing);
        }
    });
};