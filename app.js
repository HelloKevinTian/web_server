var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var redis = require("redis"),
client = redis.createClient();
var session_config = require('./config/session');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');
var config = require('./routes/config');
var config2 = require('./routes/config2');
var save = require('./routes/save');
var mask_word = require('./routes/mask_word');
var prize = require('./routes/prize');
var rank_for_pvp_week = require('./routes/rank_for_pvp_week');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var options = {
    "client":client,
    "host":session_config.options.host,
    "port":session_config.options.port,
    "ttl":session_config.options.ttl,
    "db":session_config.options.db
};
app.use(session({ store: new RedisStore(options), secret: 'keyboard cat' }));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/logout', logout);
app.use('/config', config);
app.use('/config2', config2);
app.use('/save', save);
app.use('/mask_word', mask_word);
app.use('/prize', prize);
app.use('/rank_for_pvp_week', rank_for_pvp_week);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
