var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var olinapps = require('olinapps');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe',
    store: new MongoStore({
      url: process.env.MONGOLAB_URI || 'mongodb://localhost/olin-dining-hacks'
    })
}));

// OlinApps login
app.post('/login', olinapps.login);
app.all('/logout', olinapps.logout);
app.all('/*', olinapps.middleware);
app.all('/*', olinapps.loginRequired);

app.all('/*', function (req, res, next) {
  if (olinapps.user(req).domain != 'students.olin.edu') {
    return res.send('<h1>Students only.</h1> <p>Sorry, this application is closed to non-students. Please apply for next candidates\' weekend!</p>');
  }
  next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
