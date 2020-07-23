var User = require('../models/users.models');
var passwordHash = require('password-hash');
var Follow = require('../models/follow.models');
var Friend = require('../models/friends.models');
var Notification = require('../models/notification.models');

module.exports.getUsers = (req, res, next) => {
    User.find({}, function(err, user){
      if(err){
        res.json({
          success: false,
          msg: "Failed to add author"
        }); 
      }else{
        res.render('./admin/layoutadmin/user',{useraa:user});
      }
    });
};
//
module.exports.postUser = async (req, res) => {
    let newuser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
        avata:'avata-male-default.jpg',
        coverimage:'coverimg.jpg'
    });
    newuser.save( async (err, user) => {
        if(err) {
        res.json({
            success: false,
            msg: "Failed to add author"
        });
        } else {
            // Follow
            let newFollow = await new Follow({
                iduser: user._id,
                listFollowers:[],
                listFollowing:[]
            });
            await newFollow.save(async (err, data) => {
                if(err) throw err;
                else {
                    console.log('follow create oki');
                }
            });
            // friend
            let newFriend = await new Friend({
                iduser: user._id,
                listFriend:[]
            });
            await newFriend.save(async (err, data) => {
                if(err) throw err;
                else {
                    console.log('listfriend create oki');
                }
            });
            // notification
            let newNotification = await new Notification({
                iduser: user._id,
                listnotification:[]
            });
            await newNotification.save( async (err, data) =>{
                if(err) throw err;
                console.log('notification create ok');
            });
            res.redirect('tableuser');
        }
    });
};
//
module.exports.delete = async (req, res) => {
    await User.findByIdAndDelete({_id: req.params.id}, function(err, user) {
        if (err) throw err;
        else res.redirect('/admin/tableuser');
    });
};
//
module.exports.edit = async (req, res) => {
    ///test lại
    await User.findByIdAndUpdate(req.params.id,{$set:{
        username: req.body.username,
        email: req.body.email,
        password: passwordHash.generate(req.body.password)
    }}, function(err, result){
        if(err){
            console.log(err);
        }
        res.redirect('/admin/tableuser');
    });
};