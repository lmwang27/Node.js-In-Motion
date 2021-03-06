const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const index = require('./routes/index');
const users = require('./routes/users');
const api = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Cookie-based sessions
app.use(cookieSession({
    name: 'helloworld',
    keys: ['dffwefcqr3tert', '2453t4geferwf'],

    // Cookie Options
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
}));

// CSRF Protection
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

// Add some security and some odd-jobs
app.use((req, res, next) => {
    // These pages do not require security
    const excludePages = ['/login', '/logout', '/api/chuck', '/api/hello'];
    // If not logged in and on a secured page, redirect to login
    if(typeof req.session.user == 'undefined' && excludePages.indexOf(req.url) == -1) {
        res.redirect('/login');
        res.end();
    } else {
        // Always echo back the user record so we can display a greeting
        res.locals.authuser = req.session.user;
        // Always echo back the URL so we can adjust the navbar
        res.locals.url = req.url;
        next();
    }
});

app.use('/', index);
app.use('/users', users);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
