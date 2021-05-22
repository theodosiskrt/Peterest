const express = require('express');
const post = require('../models/post.js');
const postJoiSchema = require('../joiSchemas/post.js');
const catchAsync = require('../utilities/catchAsync.js');

const router = express.Router()
const validatePost = (req, res, next) => {
    const {error} = postJoiSchema.validate(req.body);
    if(error) return next(error);
    return next();
}


//Home Page
router.get('/', catchAsync(async (req, res) => {
    const posts = await post.find({});
    posts.reverse();
    res.render('Peterest/posts.ejs', {posts});
}))
//Create post
router.post('/', validatePost, catchAsync(async (req, res) => {
    const newPost = new post(req.body)
    await newPost.save();
    res.redirect(`/`)
}))

//Create post Form
router.get('/new', (req, res) => {
    res.render('Peterest/new.ejs');
})

//Show Single post
router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const fPost = await post.findById(id);
    res.render('Peterest/show.ejs', {post: fPost});
}))

//Edit Tweet Form
router.get('/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const fPost = await post.findById(id);
    res.render('Peterest/edit.ejs', {post: fPost});
}))

//Update post with the data collected from the Edit Form
router.patch('/:id', validatePost, catchAsync(async(req, res) => {
    const {id} = req.params;
    await post.findByIdAndUpdate(id, req.body, {runValidators: true, useFindAndModify:false});
    res.redirect(`/`)
}))

//Delete post
router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await post.findByIdAndDelete(id);
    res.redirect('/');
}))



module.exports = router;