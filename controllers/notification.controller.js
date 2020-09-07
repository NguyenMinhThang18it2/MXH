var Comment = require('../models/comment.models');
var Follow = require('../models/follow.models');
var Friend = require('../models/friends.models');
var Notification = require('../models/notification.models');
var Posts = require('../models/posts.models');

module.exports.getNotification = async (req, res) =>{
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
    // await Comment.find({idposts: '5edba75e6a8d0b07d8721762' }).distinct('iduser', async (err, data) =>{
    //     if(err) throw err;
    //     else{
    //         res.send({
    //             data,

    //         });
    //     }
    // });
    // let newNotification = await new Notification({
    //     iduser: '5f00afb6bd7a53231ca7074e',
    //     listnotification:[]
    // });
    // await newNotification.save( async (err, data) =>{
    //     if(err) throw err;
    //     res.send(data);
    // });
    // let newFollow = await new Follow({
    //     iduser: '5eca74e8e6e46e1d58addecc',
    //     listFollowers:[],
    //     listFollowing:[]
    // });
    // await newFollow.save(async (err, data) => {
    //     if(err) throw err;
    //     else {
    //         res.send(data);
    //     }
    // });
    // let newFriend = await new Friend({
    //     iduser: '5eca74e8e6e46e1d58addecc',
    //     listFriend:[]
    // });
    // await newFriend.save(async (err, data) => {
    //     if(err) throw err;
    //     else {
    //         res.send(data);
    //     }
    // });
};