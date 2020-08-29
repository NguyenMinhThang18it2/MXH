const reqlyCmt = require('../../models/replycomment.models');

module.exports.getReplyComment = async (req, res) =>{
    await reqlyCmt.findOne({ idcmt: req.params.id})
        .populate('listCmt.iduser','username avata coverimage')
        .populate('listCmt.numberLike.iduserLike', 'username avata coverimage')
        .then(data => res.send(data)).catch(err => console.log(er+''))
}
//delete
module.exports.deleteRepCmt = async (req, res) =>{
    await reqlyCmt.findOneAndUpdate({idcmt: req.params.id}, {$pull:{
        'listCmt._id': req.body.idRepcmt
    }}).then(data =>{
        res.json({
            success: true,
            msg: "Success!"
        })
    }).catch(err => {
        res.json({
            success: false,
            msg: "Failed to add author"
        });
    })      
}
//put
module.exports.putRepCmt = async (req, res) =>{
         
}