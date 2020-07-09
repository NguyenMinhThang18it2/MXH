var User = require('../../models/users.models');
var Notification = require('../../models/notification.models');
const Posts = require('../../models/posts.models');

module.exports.authentication = async (req, res, next) =>{
    if(!req.signedCookies.cookieid){
        res.redirect("/login");
        return;
    }
    var user = await User.findOne({_id : req.signedCookies.cookieid});
    if(!user){
        res.redirect("/login");
        return;
    }
    

    res.app.locals.user = await user;
    await Notification.findOne({ iduser: user._id})
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
                res.app.locals.notification = await dataNotify;
            });
    });
    
    // console.log("ádhkasdsajdhsjd"+notification);
    next();
};