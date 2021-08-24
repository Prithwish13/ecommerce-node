const {body} = require('express-validator');
const User = require('../models/User');
//const {check} = require('express-validator');
// this check will find the field from any where including chookie and header


exports.signupValidation=[
    body('email').isEmail().withMessage('Please enter a Valid Email').normalizeEmail().custom((value,{req})=>{
       return User.findOne({email:value})
            .then(user=>{
                if(user){
                    return Promise.reject('Email exists already,please try different one')
                }
            })
    }),
    body('password').trim().isLength({min:5}).withMessage('password must be atleast 5 character long'),
    body('confirmPassword').trim().custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error('passwords should be match')
        }
        return true;
    })
]

exports.loginValidation = [
    body('email').normalizeEmail().isEmail().withMessage('Please enter a Valid Email'),
    body('password').notEmpty().withMessage('password field should not be empty').trim()
]

exports.formValidator=[
    body('title').trim().isLength({min:3}).withMessage('Title must be 3 character long'),
    body('imageUrl'),
    body('description').isLength({min:8}).withMessage('discription must be 8 char long'),
    body('price').isNumeric().withMessage('password must be numeric and cannot be empty')

]