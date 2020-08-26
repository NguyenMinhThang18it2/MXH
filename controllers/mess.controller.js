const Mess = require('../models/mess.model');

module.exports.getData = async (req, res) => {
    await Mess.find({"members.iduser": '5eca74e8e6e46e1d58addecc'})
        .then(data=>{
            res.render('./admin/layoutadmin/mess',{messall:data});
        })
        .catch(err=>res.send(err+''))
}