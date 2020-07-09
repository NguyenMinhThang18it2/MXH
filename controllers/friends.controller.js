var Friend = require('../models/friends.models');

module.exports.getFriends = async (req, res) =>{
    await Friend.findOne({iduser: req.params.id}, async (req, res)=>{
        
    });
};
//
module.exports.addFriend = async (req, res) =>{
    await Friend.findOne({iduser: req.signedCookies.cookieid}, async (err, iduseradd) =>{
        if(err) throw err;
        else{
            console.log(iduseradd);
            await Friend.findByIdAndUpdate(iduseradd._id, {$addToSet:{
                listFriend:[{
                    idfriend: req.params.id
                }] 
            }}, async (err, data) => {
                if(err) throw err;
                else{
                    await Friend.findOne({iduser: req.params.id}, async (err, iduserbeadd) =>{
                        if(err) throw err;
                        else{
                            console.log(iduserbeadd);
                            await Friend.findByIdAndUpdate(iduserbeadd._id, {$addToSet:{
                                listFriend:[{
                                    idfriend: req.signedCookies.cookieid
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
module.exports.deleteFriend = async (req, res) =>{
    await Friend.findOne({iduser: req.signedCookies.cookieid}, async (err, iduseradd) =>{
        if(err) throw err;
        else{
            console.log(iduseradd);
            await Friend.findByIdAndUpdate(iduseradd._id, {$pull:{
                listFriend:{
                    idfriend: req.params.id
                }
            }}, async (err, data) => {
                if(err) throw err;
                else{
                    await Friend.findOne({iduser: req.params.id}, async (err, iduserbeadd) =>{
                        if(err) throw err;
                        else{
                            console.log(iduserbeadd);
                            await Friend.findByIdAndUpdate(iduserbeadd._id, {$pull:{
                                listFriend:{
                                    idfriend: req.signedCookies.cookieid
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