var jwt = require('jsonwebtoken');

module.exports.authenticationJWT = async (req, res, next)=>{
    // const bearerHeader = req.headers['authorization'];
    // if(typeof bearerHeader !== 'undefined'){
    //     const bearer = bearerHeader.split(' ');
    //     const bearerToken = bearer[1];        
    //     req.token = bearerToken;
    //     // làm thêm xác thực có đúng với dữ liệu ở database hay ko
        next();
    // }else{
    //     res.sendStatus(403);
    // }
}