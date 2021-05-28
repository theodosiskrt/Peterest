const express = require('express');
const user = require('../models/user.js')
const passport = require('passport')
const catchAsync = require('../utilities/catchAsync.js');

const router = express.Router()

router.get('/register', (req, res) => {
    res.render('users/register.ejs');
})

router.get('/login', (req, res) => {
    res.render('users/login.ejs')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const {email, username, password} = req.body.user;
        const newUser = new user({email, username});
        const hashedUser = await user.register(newUser, password);
        req.login(hashedUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Peterest!!');
            return res.redirect('/posts');
        })
    }
    catch(err){
            req.flash('error', err.message);
            res.redirect('/users/register');
        }
}))

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }),  (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/posts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/posts');
})




module.exports = router;