var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var mysql = require('mysql');




var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var captchaRouter = require('./routes/codeimg');
var challengeRouter = require('./routes/challenge');
var ranklistRouter = require('./routes/ranklist');
//var adminRouter = require('./routes/admin');
var web1Router = require('./routes/web1');
var web2Router = require('./routes/web2');
var web3Router = require('./routes/web3');
var balaRouter = require('./routes/balabala');
var changepwdRouter = require('./routes/changepwd');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/captcha', captchaRouter);
app.use('/challenge', challengeRouter);
app.use('/ranklist', ranklistRouter);
//app.use('/admin', adminRouter);
app.use('/web1', web1Router);
app.use('/web2', web2Router);
app.use('/web3', web3Router);
app.use('/balabala', balaRouter);
app.use('/changepwd',changepwdRouter);


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

app.use(session({
    secret: 'twxtql',
    resave: false, // 是否每次请求都重新设置session
    saveUninitialized: true // 无论有没有session，每次都请求设置一个session
}));


module.exports = app;
