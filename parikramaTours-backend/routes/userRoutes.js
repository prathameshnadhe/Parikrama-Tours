const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authController.updatePassword);

// Protect all routes after this middleware
// router.use(authController.protect);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.updateMe
);

router.patch(
  '/updatePhoto',
  userController.uploadUserPhoto,
  userController.updatePhoto
);

router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

// Protect all routes after this middleware
// router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

// router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
