var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Health check endpoint
router.get('/api/health', function(req, res) {
    res.json({
        status: 'ok',
        message: 'Backend funcionando',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;