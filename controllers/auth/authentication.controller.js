var User = require('../../models/users.models');

module.exports.authentication = async function(req, res, next){
    if(!req.signedCookies.cookieid){
        res.redirect("/login");
        return;
    }
    var user = await User.findOne({_id : req.signedCookies.cookieid});
    if(!user){
        res.redirect("/login");
        return;
    }
    

    res.locals.user = user;
    console.log(user);
    next();
};