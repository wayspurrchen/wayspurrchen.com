var express = require('express');
var app = express();
var request = require('request');
var queryString = require('query-string');
var path = require('path');
var fs = require('fs');

var ghost = require('./ghost_app/ghost-middleware');
var allowedOrigins = [];

// API
var api = require('./server/api');
app.use('/api', api);
app.listen(process.env.WAYSPURRCHEN_COM_PORT || 3000);

// Ghost blog server
app.use( '/blog', ghost( {
    config: path.join(__dirname, 'ghost_app/config.js')
} ) );

// Set static assets config here
var publicDir = path.resolve(__dirname, 'public');
app.use(express.static(publicDir));

// Annex redirect
app.get( '/pixelsorter', function (req, res, next) {
  res.redirect( 301, 'http://www.glitchet.com/pixelsorter' );
} );

// Check if the file they're requesting exists. If so, let them
// continue to default behaviors, otherwise send them back
// to the SPA.
app.get('*', function(req, res, next) {
  var requestPath = path.resolve(publicDir, req.path.substring(1));
  fs.stat(requestPath, function(err, stat) {
    if(err == null) {
      next();
    } else if(err.code == 'ENOENT') {
      res.sendFile('index.html', {
        root: publicDir
      });
    } else {
      console.log('Some other error: ', err.code);
    }
  });
});

// CORS
app.use(function(req, res, next) {
  // TODO: update to only take http://wayspurrchen.com/,
  //       or any localhost:*
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
