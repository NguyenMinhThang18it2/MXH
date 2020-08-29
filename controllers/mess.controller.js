const Mess = require('../models/mess.model');

module.exports.getData = async (req, res) => {
    await Mess.find({"members.iduser": req.signedCookies.cookieid})
        .populate('members.iduser', 'username avata')
        .populate('content.iduser', 'username avata')
        .then(data=>{
            // res.send(data)
            res.render('./admin/layoutadmin/mess',{messall:data});
        })
        .catch(err=>res.send(err+''))
}