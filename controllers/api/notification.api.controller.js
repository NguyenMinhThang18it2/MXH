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