const express =require('express');
const {registeruser,loginuser, changepassword} = require('../controllers/auth-controllers');
const router = express.Router();
const authmiddleware = require('../middleware/auth-middleware')

//all routes relate dto user path and authenication
router.post('/register',registeruser);
router.post('/login',loginuser);
router.post('/change-password',authmiddleware,changepassword);

module.exports = router;