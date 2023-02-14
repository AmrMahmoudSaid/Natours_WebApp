const express = require(`express`);
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();
router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/forgotPassword' , authController.forgotPassword);
router.patch('/resetPassword/:token' , authController.restPassword)

router
    .route(('/'))
    .get(userController.gerAlluser)
    .post(userController.creatUser);
router
    .route('/:id')
    .get(userController.getUser)
    .delete(
        authController.protect ,
        authController.restrictTo('admin'),
        userController.deleteUser
    )
    .patch(userController.updateUser);

module.exports = router;