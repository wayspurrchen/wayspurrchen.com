var express = require('express');
var request = require('request');

var router = express.Router();
router.get('/', function(req, res) {
  res.send('This is the API for wayspurrchen.com. Nothing to do from here.');
});
router.get('/medium', function(req, res, next) {
  console.log(req);
  request('https://medium.com/feed/@way', function(err, resp, body) {
    if (err) {
      console.log(err);
    } else {
      res.set({ 'Content-Type': 'text/xml' })
      res.send(body);
    }
  });
});

module.exports = router;