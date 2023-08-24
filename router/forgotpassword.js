const sendEmailController = require('../controllers/Passwordreset');

const express = require('express');

const router = express.Router();

router.get('/update-password/:uuid', sendEmailController.updatePassword)

router.get('/resetpassword/:uuid', sendEmailController.resetPasswordForm)

router.post('/forgotpassword', sendEmailController.sendResetUrlMail);

module.exports = router;