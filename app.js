const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ExpressError = require('./utilities/errorHandler.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const PassportLocal = require('passport-local');
const user = require('./models/user.js');
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


//Using Styles and Scripts on the Templates
app.use(express.static(path.join(__dirname, 'assets')));

//Ejs Engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

//Running the server from every folder
app.set('views', path.join(__dirname, 'views'));

//To get data from forms
app.use(express.urlencoded({extended: true}));

//Using Method Override to create Patch requests with forms
app.use(methodOverride('_method'));

//Printing every request on Console
app.use(morgan(`dev`));

//Session
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

//Flash
app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//Setting up the response locals
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//ROUTES
//Campgrounds
const postsRoutes = require('./routes/postsRoutes.js')
app.use('/posts', postsRoutes);
//Users
const userRoutes = require('./routes/userRoutes.js');
app.use('/users', userRoutes);





//Home Page
app.get('/', (req, res) => {
    res.render('home');
})

//Page Not Found
app.all('*', (req, res, next) => {
    return next(new ExpressError(404, 'Page Not Found'));
});
app.use((error, req, res, next) => {
    if(!error.message) error.message = 'Oh no something went wrong!';
    res.render('error.ejs', {error});
});

//Listen on Port 3000
app.listen(3000, () => {
    console.log('Listening on Port 3000');
});