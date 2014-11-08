var express = require('express');

var router = express.Router();
router.get('/', function(req, res) {
  console.log(req);
  res.send('Welcome to our API!');
});
router.get('/users', function(req, res) {
  console.log(req);
  res.json([
    { name: "Brian" }
  ]);
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