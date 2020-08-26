const StatusUser = require('../../models/status_users.models');

module.exports.getData = async (req, res) => {
    
    await StatusUser.find({}).populate('iduser','username avata coverimage')
        .then(data => {
            res.send(data);
        }).catch(err => console.log(err+''))
}