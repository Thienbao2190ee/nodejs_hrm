const isAuth = async function(req, res, next) {
    var jwt = require('../helper/auth.helper');
    var authorizationHeader  = req.headers.authorization;
    const _token = authorizationHeader?.split(' ')[1];
    console.log(req.headers.authorization);
    if(_token){
        try {
            var authData = await jwt.checkToken(_token).then((data)=>{
                req.auth = authData;
                req.userID = data.data.userid
                next();
            });
            
            // console.log(authData);
        } catch (error) {
            return res.send({result: false, message: "Invalid token or token expired"});
        }
    }else{
        return res.send({result: false, message: "Token does not exist"});
    }
}

module.exports = {
    isAuth: isAuth
}