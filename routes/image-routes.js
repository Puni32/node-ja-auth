const express = require('express');
const authmiddleware = require('../middleware/auth-middleware');
const adminmiddleware = require('../middleware/admin-middleware');
const uploadmiddleware  = require('../middleware/upload-middleware');
const {uploadimagecontroller,fetchimagescontroller,imagedeletecontroller} = require('../controllers/image-controllers')


const router = express.Router();
//uplad an image 
router.post('/upload', authmiddleware,adminmiddleware,uploadmiddleware.single('image'),uploadimagecontroller)

// to get all the images 
router.get("/get",authmiddleware,fetchimagescontroller);

//delete image route
router.delete('/:id',authmiddleware,adminmiddleware,imagedeletecontroller);

module.exports = router;