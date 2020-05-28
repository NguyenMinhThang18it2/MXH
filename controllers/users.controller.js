var User = require('../models/users.models');
var passwordHash = require('password-hash');

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
        password: passwordHash.generate(req.body.password)
    });
    newuser.save((err, user) => {
        if(err) {
        res.json({
            success: false,
            msg: "Failed to add author"
        });
        } else {
            res.redirect('tableuser');
        }
    });
};
//
module.exports.delete = async (req, res) => {
    await User.findByIdAndDelete({_id: req.params.id}, function(err, user) {
        if (err) throw err;
        else res.redirect('tableuser');
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