var subdomain = require('express-subdomain');
var express = require('express');
var app = express();
var request = require('request');
var queryString = require('query-string');
var path = require('path');

// API
var api = require('./api');
app.use(subdomain('api', api));
var server = app.listen(process.env.WAYSPURRCHEN_COM_PORT || 80);

var allowedOrigins = [];

// Set static assets config here
var publicDir = path.resolve(__dirname, '../', 'public');
app.use(express.static(publicDir));

// Check if the file they're requesting exists. If so, let them
// continue to default behaviors, otherwise send them back
// to the SPA.
app.get('*', function(req, res, next) {
  var requestPath = path.resolve(publicDir, req.path.substring(1));
  path.exists(requestPath, function(exists) { 
    if (exists) { 
      next();
    } else {
      res.sendFile('index.html', {
        root: publicDir
      });
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
