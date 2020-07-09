var Follow = require('../models/follow.models');

module.exports.getFollowers = async (req, res) => {
    await Follow.findOne({iduser: req.params.id}, async (err, data) => {
        if(err) throw err;
        else{
            res.send(data.listFollowers);
        }
    });
};
module.exports.getFollowing = async (req, res) => {
    await Follow.findOne({iduser: req.params.id}, async (err, data) => {
        if(err) throw err;
        else{
            res.send(data.listFollowing);
        }
    });
};
// follow other people
module.exports.postFollowers = async (req, res) =>{
    console.log(req.params.id);
    await Follow.findOne({iduser: req.signedCookies.cookieid}, async (err, iduserfollow) =>{
        if(err) throw err;
        else{
            console.log(iduserfollow);
            await Follow.findByIdAndUpdate(iduserfollow._id, {$addToSet:{
                listFollowing:[{
                    iduserFollowing: req.params.id
                }] 
            }}, async (err, data) => {
                if(err) throw err;
                else{
                    await Follow.findOne({iduser: req.params.id}, async (err, iduserbefollow) =>{
                        if(err) throw err;
                        else{
                            console.log(iduserbefollow);
                            await Follow.findByIdAndUpdate(iduserbefollow._id, {$addToSet:{
                                listFollowers:[{
                                    iduserFollowers: req.signedCookies.cookieid
                                }] 
                            }}, async (err, data) => {
                                if(err) throw err;
                                else{
                                    res.redirect('/admin/tableuser');
                                }
                            });
                        }
                    });
                }
            });
        };
    });
};
//
module.exports.unFollowers = async (req, res) =>{
    await Follow.findOne({iduser: req.signedCookies.cookieid}, async (err, iduserfollow) =>{
        if(err) throw err;
        else{
            console.log(iduserfollow);
            await Follow.findByIdAndUpdate(iduserfollow._id, {$pull:{
                listFollowing:{
                    iduserFollowing: req.params.id
                } 
            }}, async (err, data) => {
                if(err) throw err;
                else{
                    await Follow.findOne({iduser: req.params.id}, async (err, iduserbefollow) =>{
                        if(err) throw err;
                        else{
                            console.log(iduserbefollow);
                            await Follow.findByIdAndUpdate(iduserbefollow._id, {$pull:{
                                listFollowers:{
                                    iduserFollowers: req.signedCookies.cookieid
                                }
                            }}, async (err, data) => {
                                if(err) throw err;
                                else{
                                    res.redirect('/admin/tableuser');
                                }
                            });
                        }
                    });
                }
            });
        };
    });
};
