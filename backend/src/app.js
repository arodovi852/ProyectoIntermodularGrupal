const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');

// Rutas de la API
const authRoutes = require('./routes/authRoutes');
const userRoutesAPI = require('./routes/userRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const songRoutes = require('./routes/songRoutes');
<<<<<<< HEAD
const reccoRoutes = require('../routes/recco');
=======
>>>>>>> dev

const app = express();

// Conectar a MongoDB
connectDB();

// CORS - permitir frontend de Vite (puerto 5173)
app.use(cors({
    // origin: 'http://localhost:5173',
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
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

// Rutas legacy (puedes eliminarlas si no las necesitas)
app.use('/', indexRouter);
app.use('/users', usersRouter);

<<<<<<< HEAD
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend funcionando', timestamp: new Date().toISOString() });
});

=======
>>>>>>> dev
// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutesAPI);
app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', songRoutes);
<<<<<<< HEAD
app.use('/api/recco', reccoRoutes);
=======
>>>>>>> dev

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
