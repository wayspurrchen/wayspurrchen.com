var fs = require('fs');
var path = require('path');
var express = require('express');
var request = require('request');
var FeedParser = require('feedparser');

var router = express.Router();
router.get('/', function(req, res) {
  res.send('This is the API for wayspurrchen.com. Nothing to do from here.');
});

// Get the last 5 blog posts from Jekyll feed
router.get('/blogfeed', function(req, res, next) {
  // fReq = feed request
  var feedXMLPath = path.resolve(__dirname, '../public/blog/feed.xml');
  var fp = new FeedParser();

  var fileStream = fs.createReadStream(feedXMLPath);
  fileStream.on('readable', function(res) {
    var stream = this;
    stream.pipe(fp);
  });

  var count = 0;
  var posts = [];
  fp.on('readable', function() {
    var stream = this;
    var post;

    while (post = stream.read()) {
      posts.push({
        title: post.title,
        link: post.link,
        date: [
          post.date.getFullYear(),
          post.date.getMonth() + 1,
          post.date.getDate()
        ].join('-')
      });
      if (++count == 5) {
        res.send(posts);
        break;
      }
    }
  });
});

module.exports = router;