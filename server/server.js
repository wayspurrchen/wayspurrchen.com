var subdomain = require('express-subdomain');
var express = require('express');
var app = express();
var request = require('request');
var queryString = require('query-string');
var path = require('path');

// API
var api = require('./api');
app.use(subdomain('api', api));
var server = app.listen(3000);

var allowedOrigins = [];

// Set static assets config here
var public = path.resolve(__dirname, '../', 'public');
app.use(express.static(public));

// CORS
app.use(function(req, res, next) {
  // TODO: update to only take http://wayspurrchen.com/,
  //       or any localhost:*
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
