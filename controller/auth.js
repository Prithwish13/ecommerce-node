const User = require("../models/User");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const { handleError } = require("../errHandler/handelErr");

const transporter = nodemailer.createTransport({
   service:'gmail',
   auth:{
       user:'abirdey505@gmail.com',
       pass:'Abirdey@gmail.com'
   } 
 })



exports.getSignup = (req,res,next) => {

    let message = req.flash('error');
    if(message.length > 0){
        message= message[0];
    }else{
        message= null;
    }

    res.render('auth/signup',{
        path:'/signup',
        pageTitle:'Signup',
        errorMessage:message,
        oldInp:{
            email:'',
            password:''
        },
        validationError:[]
    })
}

exports.postSignup = (req,res,next) => {
    const errors = validationResult(req);
     const password = req.body.password;
     const email = req.body.email;
     console.log(email.length)
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup',{
        path:'/signup',
        pageTitle:'Signup',
        errorMessage:errors.array()[0].msg,
        validationError:errors.array(),
        oldInp:{
            email:email,
            password:password
        }
    })
    }
   

   
    bcrypt.hash(password,12)
        .then(hashPassword =>{
            const user = new User({
                 email:email,
                 password:hashPassword,
                 cart:{
                     items:[]
                 }
        })
      return user.save();
    })
     .then(result =>{
        res.redirect('/login');
        return transporter.sendMail({
             to:email,
             from:'abirdey505@gmail.com',
             subject:'Signup succeeded!',
             text:'you have succesfully signedup!'
         })
       
    })
    .catch(err=>{
       return handleError(err,next);        
    });   
        
}


exports.getLogin = (req,res,next) =>{
    // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';

    let message = req.flash('error');

    if(message.length>0){
        message=message[0];
    }else{
        message=null;
    }

    res.render('auth/login',{
        path:'/login',
        pageTitle:'Login',
        errorMessage:message,
        validationError:[],
        oldValue:{
            email:'',
            password:''
        }
    });
}

exports.postLogin = (req,res,next) =>{
        // res.setHeader('Set-Cookie','isLoggedIn=true;HttpOnly')
       

        
         const email = req.body.email;
         const password = req.body.password;
         const errors = validationResult(req);
         console.log(email.length)
         if(!errors.isEmpty()){
            return res.status(422).render('auth/login',{
            path:'/login',
            pageTitle:'Login',
            errorMessage:errors.array()[0].msg,
             validationError:errors.array(),
             oldValue:{
               email:email,
               password:password
              }
          });
        }

        
        User.findOne({email:email})
         .then(user=>{
             if(!user){
               return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid email or password.',
                 oldValue: {
                   email: email,
                   password: password
                 },
                 validationError: []
              });  
             }
              bcrypt.compare(password,user.password)
                      .then(isTrue=>{
                          if(isTrue){
                           req.session.user = user;
                           req.session.isLoggedIn = true;
                           return req.session.save((err)=>{
                               return  res.redirect('/');
                             })
                            }
                        
                         return res.status(422).render('auth/login',{
                                    path:'/login',
                                    pageTitle:'Login',
                                    errorMessage:'Invalid password',
                                    validationError:errors.array(),
                                    oldValue:{
                                     email:email,
                                     password:password
                                    }
                         });
                      })
                      .catch(err=>{
                       return handleError(err,next);        
                    });  
         })   
                
                 
       
        
}

exports.postLogout=(req,res,next) => {
    req.session.destroy((err)=>{
        if(err){
           return handleError(err,next);
        }
        res.redirect('/')
    })
}

exports.getReset=(req,res,next)=>{
    
    let message=req.flash('error');
    if(message.length>0){
        message=message[0];
    }else{
        message=null;
    }

    res.render('auth/resetPassword',{
       path:'/reset',
       pageTitle:'Reset Password',
       errorMessage: message
    })
}

exports.postReset = (req,res,next) => {
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email:req.body.email})
            .then(user=>{
               if(!user){
                   req.flash('error','no account with that email found');
                   return res.redirect('/reset');
               } 
               user.resetToken=token;
               user.resetTokenExpiration= Date.now()+3600000;
               user.save()
                .then(restlt=>{
                 res.redirect('/')
                 return transporter.sendMail({
                    to:req.body.email,
                    from:'abirdey505@gmail.com',
                    subject:'Password Reset',
                    html:`
                        <p>You have requested a password reset</p>
                        <p>Click this <a
                        href="http://localhost:4000/reset/${token}"
                        >link</a> to reset the password</p>
                    `
                })
                  .catch(err=>{
                    return  handleError(err,next);        
                  }); 
              })
            })
            
            .catch(err=>{
              return handleError(err,next);        
            }); 
    })
}

exports.getNewPassword = (req,res,next) =>{
    const token = req.params.token;
    User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
        .then(user =>{
            let message=req.flash('error');
             if(message.length>0){
                 message=message[0];
            }else{
                 message=null;
            }

       res.render('auth/new-password',{
       path:'/new-password',
       pageTitle:'New Password',
       errorMessage: message,
       userId:user._id.toString(),
       passwordToken:token
    })

        })
        .catch(err=>{
          return handleError(err,next);        
       }); 
    
}

exports.postNewPassword = (req,res,next) =>{
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    User.findOne({resetToken:passwordToken,resetTokenExpiration:{ $gt:Date.now()},_id:userId})
    .then(user=>{

        if(!user){
           req.flash('error',"User not found");  
           return res.redirect('/new-password');
        }
       
       bcrypt.hash(newPassword,12)
       .then(hashPassword=>{
        user.password = hashPassword;
        user.token=null;
        user.resetTokenExpiration=undefined;
        return user.save()
       })
       .then(result=>{
           res.redirect('/login');
       })
       .catch(err=>{
        handleError(err,next);        
       }); 
    })
    
    .catch(err=>{
        handleError(err,next);        
    }); 

};