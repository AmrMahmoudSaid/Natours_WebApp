const express = require(`express`);
//form in code used to upload files from form
const multer = require('multer');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();
router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.post('/forgotPassword' , authController.forgotPassword);
router.patch('/resetPassword/:token' , authController.restPassword);
const upload = multer({dest : 'public/img/users'});
router.use(authController.protect);

router.patch('/changePassword' ,authController.changePassword);
router.patch('/updateMe',
    userController.uploadUserPhoto
    ,userController.resizeUserPhoto
    ,userController.updateMe
);
router.delete('/deleteMe',userController.deleteMe);
router.get('/me' ,userController.getMe , userController.getUser);


router.use(authController.restrictTo('admin'));

router
    .route(('/'))
    .get(userController.gerAlluser)
    .post(userController.creatUser);
router
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);

module.exports = router;