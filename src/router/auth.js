const router = require('express').Router();
const auth = require('../controller/auth');
const {verifyToken } = require('../middleware');
const {
  validateSignupRequest,
  authRequestValidated,
  validateSigninRequest,
} = require('../validators/auth');

router.post(
  '/joinin',
  validateSignupRequest,
  authRequestValidated,
  auth.signup
);
router.post(
  '/login',
  validateSigninRequest,
  authRequestValidated,
  auth.signin
);
router.post('/logout', verifyToken, auth.signout);
router.post('/activate-account', auth.activateAccount);
router.post('/change-password', verifyToken, auth.changePassword);

router.post('/forgot-password', auth.forgotpassword);
router.post('/create-password', auth.createpassword);



module.exports = router;
