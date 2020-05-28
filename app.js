require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var auth = require('./controllers/auth/authentication.controller');

var mongodb = require('./db/connectdb');
// router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var storyRouter = require('./routes/story');
// api
var apiloginRouter = require('./routes/api/login.api');
var apipostsRouter = require('./routes/api/posts.api');
var apistoryRouter = require('./routes/api/story.api');

var app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './admin/master/home');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIES));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/login', indexRouter);
app.use('/logout', function(req, res){
  res.clearCookie('cookieid');
  res.redirect('/login');
});
app.use('/admin',auth.authentication, usersRouter);
app.use('/admin',auth.authentication, postsRouter);
app.use('/admin',auth.authentication, storyRouter);
//api
app.use('/api', apiloginRouter);
app.use('/api', apipostsRouter);
app.use('/api', apistoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
