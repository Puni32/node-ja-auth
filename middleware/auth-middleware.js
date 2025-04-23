const jwt = require('jsonwebtoken');


const authmiddleware = (req ,res, next)=> {
    const authheader = req.headers['authorization'];
    console.log(authheader);
    const token = authheader && authheader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success :false,
            message : 'access denied.No token provided pls login to continue'
        })
    }

    // decode this token 
    try{
        const decodedtokeninfo = jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log(decodedtokeninfo);
         req.userInfo = decodedtokeninfo;
         next();

    }catch(error){
        return res.status(500).json({

        })
    }
};
module.exports = authmiddleware;