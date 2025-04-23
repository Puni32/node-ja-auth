const express = require('express');
const authmiddleware = require('../middleware/auth-middleware');
const adminmiddleware = require('../middleware/admin-middleware');
const router = express.Router();


router.get('/welcome',authmiddleware,authmiddleware, (req,res) => {
    res.json({
        message : 'welcome to adminpage'
    });
});
module.exports = router;