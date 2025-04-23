

const isadminuser = (req,res, next)=> {
    if(req.userInfo.role !== 'admin') {
        return res.status(403).json({
            success : false,
            message : 'access denied !Admin rights required.'
        })
    }
    next();
}
module.exports = isadminuser;