const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

// Register
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register',[
    check('name', 'Please enter a Name').not().isEmpty(),
    check('email', 'Please enter a valid Email').isEmail(),
    check('password', 'Please enter a password with minimum 6 charecters').isLength({min: 6}),
] ,async (req, res) => {
    const {name, email, password, password2} = req.body;
    const errorsArray = validationResult(req);
    let errors = [];
    if(!errorsArray.isEmpty() || password !== password2){
        errorsArray.errors.forEach(error=>{
            errors.push(error.msg);
        });
        if(password !== password2){
            errors.push('Password do not match');
        }
        return res.render('register', {errors , newUser: req.body});
    }
    try {
        let user = await User.findOne({email});
        if(user){
            errors.push('Email Already Registered');
            return res.render('register', {errors , newUser: req.body});
        } 
        const newUser = {
            name, email, password
        };
        user = new User(newUser);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        req.flash('success', 'You are now registered and can log in');
        res.redirect('/users/login');
    } catch (e) {
        return res.render('register', {errors: ['Server Error'], newUser: req.body});
    }
});


router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local',{
    successFlash: true,
    successRedirect: '/videos',
    failureFlash: true,
    failureRedirect: '/users/login'
}), (req, res) => {});

router.get('/logout', (req, res)=> {
    req.logOut();
    req.flash('success', 'Successfully Logged out');
     res.redirect('/users/login');
});


module.exports = router;