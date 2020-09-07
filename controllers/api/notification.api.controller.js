var Notification = require('../../models/notification.models');
var Posts = require('../../models/posts.models');

module.exports.getNotification = async (req, res)=>{
    await Notification.findOne({ iduser: req.params.id})
        .populate('listnotification.iduserNotify', 'username avata')
        .populate('listnotification.idPosts', 'iduser')
        .exec(async (err, data)=>{
            if(err) throw err;
            await Posts.populate(data, {
                path: 'listnotification.idPosts.iduser',
                select: 'username',
                model: 'User'
            }, async (err, dataNotify)=>{
                if(err) throw err;
                // res.send(data);
                // console.log(dataNotify);
                res.send(dataNotify);
            });
    });
};
//
module.exports.updateNotification = async (req, res) => {
    console.log("vô");
    await Notification.updateOne({iduser: req.params.id},{$set : {
        "listnotification.$[].status" : true
    }}, async (err, data) => {
        if(err){
            console.log(err);
            res.json({
                success: false,
                msg: "Read all False"
            });
        } 
        else{
            res.json({
                success: true,
                msg: "Real all success"
            });
        };
    });
};
// delete 
module.exports.deleteNotifi = async (req, res) => {
    await Notification.findOneAndUpdate({iduser: req.params.id}, { $pull: { 
        listnotification: { 
            iduserNotify: req.body.replyfriend, /// vẫn chưa xóa đc
            title: 'addfriend'
        }
    }},async (err, kq)=>{
        if(err) {
            socket.emit('add friend success',{
                success: false,
                msg: "Posts new success"
            });
        }
        else{
            console.log("delete notication success!");
            socket.emit('add friend success',{
                success: true,
                msg: "Posts new success"
            });
        }
    });
}