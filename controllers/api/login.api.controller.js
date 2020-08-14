require('dotenv').config();

var User = require('../../models/users.models');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
// module.exports.getlogin = function(req, res, next) {
//     res.render('./admin/layoutadmin/login');
//  };

module.exports.postlogin = function(req, res, next) {
        User.findOne({email : req.body.email}, function(err, user){
        if(err){
          res.json({
            success: false,
            msg: "Failed to add author"
          }); 
        }
        else if(!user){
          res.json({
            success: false,
            msg: "Failed to add author"
          }); 
        }
        else{
            if(passwordHash.verify(req.body.password, user.password)){
              let userToken = {
                id: user._id,
                email: user.email
              };
              let token = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30d'});
              res.json({
                success: true,
                msg: "Login is Success",
                user: user,
                token: token
              }); 
            }else{
              res.json({
                success: false,
                msg: "Password is incorrect"
              }); 
            }
        }
  });

};
//
module.exports.postRegister = async function(req, res){
  let newuser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: passwordHash.generate(req.body.password)
  });
  await newuser.save((err, user) => {
      if(err) {
        console.log("Fail");
        res.json("Email or username already exists");
        console.log("Sai");
      // res.json({
      //     success: false,
      //     msg: "Failed to add author"
      // });
      } else {
          res.json('Success');
          console.log("Thành công");
      }
  });
}
