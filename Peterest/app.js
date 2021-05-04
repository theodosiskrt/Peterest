const express = require('express');
const ejsMate = require('ejs-mate');
const post = require('./models/post.js');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const catchAsync = require('./utilities/catchAsync.js');
const postJoiSchema = require('./joiSchemas/post.js')
const ExpressError = require('./utilities/errorHandler.js');
const app = express();

//Connect Mongo
mongoose.connect('mongodb://localhost:27017/Peterest', {useNewUrlParser:true, useUnifiedTopology:true})
    .then(() => {
        console.log('Database Connected');
    })
    .catch(() => {
        console.log('Error Connecting to Database, exiting...');
        process.exit();
    })
const validatePost = (req, res, next) => {
    const {error} = postJoiSchema.validate(req.body);
    if(error) return next(error);
    return next();
}


//Using Styles and Scripts on the Templates
app.use(express.static('assets'));
//Using Styles and Scripts when running the server from any directory
app.set('assets', path.join(__dirname, '/assets'))
//Ejs Engine
app.engine('ejs', ejsMate);
//Using EJS
app.set('view engine', 'ejs');
//Running the server from every folder
app.set('views', path.join(__dirname, '/views'));
//To get data from forms
app.use(express.urlencoded({extended: true}));
//Using Method Override to create Patch requests with forms
app.use(methodOverride('_method'));

//Home Page
app.get('/', catchAsync(async (req, res) => {
    const posts = await post.find({});
    posts.reverse();
    res.render('Peterest/posts.ejs', {posts});
}))

//Create post Form
app.get('/posts/new', (req, res) => {
    res.render('Peterest/new.ejs');
})

//Show Single post
app.get('/posts/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const fPost = await post.findById(id);
    res.render('Peterest/show.ejs', {post: fPost});
}))

//Edit Tweet Form
app.get('/posts/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const fPost = await post.findById(id);
    res.render('Peterest/edit.ejs', {post: fPost});
}))

//Update post with the data collected from the Edit Form
app.patch('/posts/:id', validatePost, catchAsync(async(req, res) => {
    const {id} = req.params;
    await post.findByIdAndUpdate(id, req.body, {runValidators: true, useFindAndModify:false});
    res.redirect(`/`)
}))

//Delete post
app.delete('/posts/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await post.findByIdAndDelete(id);
    res.redirect('/');
}))

//Create post
app.post('/posts', validatePost, catchAsync(async (req, res) => {
    const newPost = new post(req.body)
    await newPost.save();
    res.redirect(`/`)
}))

app.all('*', (req, res, next) => {
    return next(new ExpressError(404, 'Page Not Found'));
})

app.use((error, req, res, next) => {
    res.render('error.ejs', {error});
})

//Listen on Port 3000
app.listen(3000, () => {
    console.log('Listening on Port 3000');
})