require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var expressLayouts = require('express-ejs-layouts');
//authentication
var auth = require('./controllers/auth/authentication.controller');
var authJWT = require('./controllers/auth/jsonwebtoken.controller');
// db
var mongodb = require('./db/connectdb');
// router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var storyRouter = require('./routes/story');
var themeRouter = require('./routes/themestatus');
var commentRouter = require('./routes/comment');
var followRouter = require('./routes/follower');
var friendRouter = require('./routes/friends');
var notification = require('./routes/notification');
// api
var apiloginRouter = require('./routes/api/login.api');
var apipostsRouter = require('./routes/api/posts.api');
var apistoryRouter = require('./routes/api/story.api');
var apithemeRouter = require('./routes/api/themestatus.api');
var profileRouter  = require('./routes/api/profile.api');

var app = express();
var io = require('./socket/socket');
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
app.use('/admin',auth.authentication, themeRouter);
app.use('/admin',auth.authentication, commentRouter);
app.use('/admin',auth.authentication, followRouter);
app.use('/admin',auth.authentication, friendRouter);
app.use('/admin',auth.authentication, notification);
//api
app.use('/api', apiloginRouter);
app.use('/api', authJWT.authenticationJWT, apipostsRouter);
app.use('/api', authJWT.authenticationJWT, apistoryRouter);
app.use('/api', authJWT.authenticationJWT, apithemeRouter);
app.use('/api', authJWT.authenticationJWT, profileRouter);

app.use('/test', authJWT.authenticationJWT, (req, res) =>{
  console.log("con kẹt"+ req.token);
  
  jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, data)=>{
    if(err) res.send(err);
    else{
      res.json({
        msg:' helllo cai dầu buồi',
        data: data
      });  
    }
  });
});
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
