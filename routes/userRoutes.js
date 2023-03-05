const express = require(`express`);
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();
router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/forgotPassword' , authController.forgotPassword);
router.patch('/resetPassword/:token' , authController.restPassword);
router.patch('/changePassword' , authController.protect,authController.changePassword);
router.patch('/updateMe',authController.protect,userController.updateMe);
router.delete('/deleteMe',authController.protect,userController.deleteMe);
router.get('/me' ,authController.protect,userController.getMe , userController.getUser);

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