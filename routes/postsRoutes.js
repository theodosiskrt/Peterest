const express = require('express');
const post = require('../models/post.js');
const postJoiSchema = require('../joiSchemas/post.js');
const catchAsync = require('../utilities/catchAsync.js');
const isLoggedIn = require('../utilities/isLoggedIn.js');

const router = express.Router()
const validatePost = (req, res, next) => {
    const {error} = postJoiSchema.validate(req.body);
    if(error) return next(error);
    return next();
}


//Home Page
router.get('/', catchAsync(async (req, res) => {
    const posts = await post.find({}).populate('author');
    posts.reverse();
    res.render('Peterest/posts.ejs', {posts});
}))
//Create post
router.post('/', isLoggedIn, validatePost, catchAsync(async (req, res) => {
    const newPost = new post(req.body)
    newPost.author = req.user;
    await newPost.save();
    req.flash('success', 'Posted!')
    res.redirect(`/posts`)
}))

//Create post Form
router.get('/new', isLoggedIn, (req, res) => {
    res.render('Peterest/new.ejs');
})

//Edit Post Form
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    const fPost = await post.findById(id);
    res.render('Peterest/edit.ejs', {post: fPost});
}))

//Update post with the data collected from the Edit Form
router.patch('/:id', isLoggedIn, validatePost, catchAsync(async(req, res) => {
    const {id} = req.params;
    await post.findByIdAndUpdate(id, req.body, {runValidators: true, useFindAndModify:false});
    req.flash('success', 'Successfully edited Post!');
    res.redirect(`/posts`);
}))

//Delete post
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    await post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Post!');
    res.redirect('/posts');
}))



module.exports = router;