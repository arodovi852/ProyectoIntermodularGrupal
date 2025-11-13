const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');

const app = express();

const isDev = process.env.NODE_ENV !== 'production';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://play-frontend-latest.onrender.com';

// CORS: en desarrollo permitir cualquier origen (cors echo), en producción restringir al origen real
app.use(cors({
    origin: isDev ? true : FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Preflight / Private Network Access (PNA)
app.options('*', (req, res) => {
    // Chrome envía `access-control-request-private-network` en el preflight para PNA
    if (req.headers['access-control-request-private-network']) {
        res.set('Access-Control-Allow-Private-Network', 'true');
    }

    const originHeader = req.headers.origin || '';
    // En desarrollo eco del origen; en producción forzar FRONTEND_ORIGIN
    res.set('Access-Control-Allow-Origin', isDev ? originHeader || '*' : FRONTEND_ORIGIN);
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Cuando usamos credenciales debemos no usar '*' como origen en la respuesta
    if (isDev || FRONTEND_ORIGIN !== '*') {
        res.set('Access-Control-Allow-Credentials', 'true');
    }

    return res.status(204).end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;