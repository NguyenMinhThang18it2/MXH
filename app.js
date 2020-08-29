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
var mess = require('./routes/mess');
// api
var apiloginRouter = require('./routes/api/login.api');
var apipostsRouter = require('./routes/api/posts.api');
var apistoryRouter = require('./routes/api/story.api');
var apithemeRouter = require('./routes/api/themestatus.api');
var apiprofileRouter  = require('./routes/api/profile.api');
var apinotificationRouter = require('./routes/api/notification.api'); 
var apifollowerRouter = require('./routes/api/follower.api');
var apifriendRouter = require('./routes/api/friends.api');
var apicommentRouter = require('./routes/api/comment.api');
var apisearchRouter = require('./routes/api/search.api');
var apistatususerRouter = require('./routes/api/status_user.api');
var apireplycmtRouter = require('./routes/api/replycmt.api');
//
var apicheckloginRouter = require('./routes/api/checktoken.api');

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
app.use('/admin', auth.authentication, usersRouter);
app.use('/admin', auth.authentication, postsRouter);
app.use('/admin', auth.authentication, storyRouter);
app.use('/admin', auth.authentication, themeRouter);
app.use('/admin', auth.authentication, commentRouter);
app.use('/admin', auth.authentication, followRouter);
app.use('/admin', auth.authentication, friendRouter);
app.use('/admin', auth.authentication, notification);
app.use('/admin', auth.authentication, mess);
//api
app.use('/api', apiloginRouter);
app.use('/api', authJWT.authenticationJWT, apicheckloginRouter);
app.use('/api', authJWT.authenticationJWT, apipostsRouter);
app.use('/api', authJWT.authenticationJWT, apistoryRouter);
app.use('/api', authJWT.authenticationJWT, apithemeRouter);
app.use('/api', authJWT.authenticationJWT, apiprofileRouter);
app.use('/api', authJWT.authenticationJWT, apinotificationRouter);
app.use('/api', authJWT.authenticationJWT, apifollowerRouter);
app.use('/api', authJWT.authenticationJWT, apifriendRouter);
app.use('/api', authJWT.authenticationJWT, apicommentRouter);
app.use('/api', authJWT.authenticationJWT, apisearchRouter);
app.use('/api', authJWT.authenticationJWT, apistatususerRouter);
app.use('/api', authJWT.authenticationJWT, apireplycmtRouter);

app.use('/test', authJWT.authenticationJWT, (req, res) =>{
    res.render('./admin/master/test');
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
