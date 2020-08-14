var jwt = require('jsonwebtoken');

module.exports.authenticationJWT = async (req, res, next)=>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];      
        jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, authData) =>{
            if(err){
                res.sendStatus(403);
            }else{
                req.idauth = authData.id;
                next();
            }
        });        
    }else{
        res.sendStatus(403);
    }
}