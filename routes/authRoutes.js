const express = require('express');
const authController = require('../controllers/auth')
const router = express.Router();
const multer  = require('multer')


const storageStrategy = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
       }
    , filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storageStrategy })


router.post('/register', authController.register)

router.post('/login',authController.login)

router.get('/users',authController.users)

router.get('/user/:id',authController.user)

router.put('/changepassword', authController.changePassword)

router.put('/changeuser', authController.changeUsers)

router.get('/roles',authController.getRole)

router.post('/uploadimage', upload.single('image'),authController.uploadimage)


module.exports = router;
