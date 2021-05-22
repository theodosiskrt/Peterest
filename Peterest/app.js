const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
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

const postsRoutes = require('./routes/postsRouts.js')
app.use('/posts', postsRoutes);

//Using Styles and Scripts on the Templates
app.use(express.static(path.join(__dirname, 'assets')));
//Ejs Engine
app.engine('ejs', ejsMate);
//Using EJS
app.set('view engine', 'ejs');
//Running the server from every folder
app.set('views', path.join(__dirname, 'views'));
//To get data from forms
app.use(express.urlencoded({extended: true}));
//Using Method Override to create Patch requests with forms
app.use(methodOverride('_method'));


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