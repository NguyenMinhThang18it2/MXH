var User = require('../models/users.models');
var passwordHash = require('password-hash');

//Get homt
module.exports.getlogin = function(req, res, next) {
   res.render('./admin/layoutadmin/login');
};
// Post login
module.exports.postlogin = async function(req, res, next) {
  await User.findOne({email : req.body.email}, function(err, user){
      if(err){
        res.json({
          success: false,
          msg: "Failed to add author"
        }); 
      }
      else if(!user){
        res.render('./admin/layoutadmin/login',{
          abc : "Email does not exist"
        });
      }
      else{
          if(passwordHash.verify(req.body.password, user.password)){
              
              res.cookie("cookieid", user._id ,{
                signed: true
              });
              res.redirect('/admin/tableuser');
          }else{
            res.render('./admin/layoutadmin/login',{
              abc : "Password is incorrect"
            });
          }
      }
    });
 };