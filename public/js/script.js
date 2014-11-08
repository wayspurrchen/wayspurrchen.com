// Run the first or second method, depending on which
// layout we're on.
var routeLayoutMethod = function(flagMethod, longMethod) {
	return function() {
		if (document.documentElement.clientWidth > 800) {
			flagMethod();
		} else {
			longMethod();
		}
	};
};

var projectsFlagView = function() {
	console.log('show projects flagview');
};
var projectsLongView = function() {
	console.log('show projects longview');
};

var cvFlagView = function() {
	console.log('show cv flagview');
};
var cvLongView = function() {
	console.log('show cv longview');
};

page('/', routeLayoutMethod(projectsFlagView, projectsLongView));
page('/projects', routeLayoutMethod(projectsFlagView, projectsLongView));
page('/cv', routeLayoutMethod(cvFlagView, cvLongView));

// Navigate to routes on click
$('.tab-links a').on('click', function(e) {
	e.preventDefault();
	page($(this).attr('href'));
});

// Grab the latest reddit posts from /r/frontend
$.ajax({
	url: 'http://www.reddit.com/r/frontend/top.json?t=week',
	success: function(res) {
		var redditPosts = res.data.children.slice(0, 5);
		console.log(redditPosts);
		var tmpl = _.template($('#r-frontend-listing').html());
		var compiled = tmpl({
			threads: redditPosts
		});
		$('#r-frontend-posts').empty().append($(compiled));
	}
})