const express = require('express');
const { getLogin,postLogin,postLogout,getSignup,postSignup, getReset, postReset, getNewPassword, postNewPassword } = require('../controller/auth');
const router = express.Router();
const { signupValidation, loginValidation } = require('../validations/validate');

router.get('/signup',getSignup);
router.post('/signup',signupValidation,postSignup);
router.get('/login',getLogin);
router.post('/login',loginValidation,postLogin);
router.post('/logout',postLogout);
router.get('/reset',getReset);
router.post('/reset',postReset);
router.get('/reset/:token',getNewPassword);
router.post("/new-password",postNewPassword)

module.exports= router;