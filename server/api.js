var fs = require('fs');
var path = require('path');
var express = require('express');
var request = require('request');
var FeedParser = require('feedparser');
var parseXMLString = require('xml2js').parseString;

var router = express.Router();
router.get('/', function(req, res) {
  res.send('This is the API for wayspurrchen.com. Nothing to do from here.');
});

// Get the last 5 blog posts from Jekyll feed
router.get('/blogfeed', function(req, res, next) {
  var hostBlogFeedUrl = req.protocol + '://' + req.get('host') + '/blog/rss';
  console.log( hostBlogFeedUrl );

  request( hostBlogFeedUrl, function ( error, response, body ) {
    if ( !error && response.statusCode == 200 ) {
      parseXMLString( body, function ( err, result ) {
        var articles = result.rss.channel[0].item;
        res.send( articles.slice( 0, 5 ) );
      } );
    } else {
      console.log( error );
      res.sendStatus( 500 );
    }
  } );
});

// <ul>
//   <% for (var i = 0; i < posts.length; i++) { %>
//     <li>
//       <a href="<%= posts[i].link %>"><%= posts[i].title %></a>
//       <span class="blog-date"><%= posts[i].date %></span>
//     </li>
//   <% } %>
// </ul>

module.exports = router;