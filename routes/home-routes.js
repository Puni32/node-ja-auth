const express = require('express');
const authmiddleware = require('../middleware/auth-middleware');
const router = express.Router()

router.get('/welcome',authmiddleware, (req,res) => {
    const{username, userid,role} = req.userInfo;

    res.json({
        message : 'welcome to the home page',
        user:{
            _id : userid,
            username,
            role
        }
    });
})
module.exports = router;
