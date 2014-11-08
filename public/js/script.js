var getCurrentLayout = function() {
	if (document.documentElement.clientWidth > 800) {
		return 'flag';
	} else {
		return 'long'
	}
};
// This might seem redundant, but we need to run checks
// for when we change the layout.
var currentLayout = getCurrentLayout();

// Run the first or second method, depending on which
// layout we're on.
var routeLayoutMethod = function(flagMethod, longMethod, args) {
	return function() {
		if (getCurrentLayout() == 'flag') {
			flagMethod.apply(undefined, args);
		} else {
			longMethod.apply(undefined, args);
		}
	};
};

// Show an individual content tab.
var showTab = function(tab) {
	console.log('showing tab', tab);
	$('.js-tab-links li').removeClass('active');
	$('.js-tab-links li[data-tab="' + tab + '"]').addClass('active');
	$('.js-tab-contents').hide();
	$('.js-tab-contents[data-tab="' + tab + '"]').show();
};

// Show all of our content.
var showForLong = function() {
	$('.js-tab-contents').show();
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

page('/', routeLayoutMethod(showTab, projectsLongView, ['projects']));
page('/projects', routeLayoutMethod(showTab, projectsLongView, ['projects']));
page('/cv', routeLayoutMethod(showTab, cvLongView, ['cv']));

// Navigate to routes on click
$('.tab-links a').on('click', function(e) {
	e.preventDefault();
	page($(this).attr('href'));
});

function getPath() {
	return location.pathname.substring(1);
}

// We landed!
$(function() {
	// If our path is anything but just the root,
	// let Page.js take over.
	var path = getPath();
	if (path) {
		page('/' + path);
	}

	// If the layout has changed, show either the tabbed
	// view for the flag layout or display everything
	// for the long layout.
	$(window).on('resize', function(e) {
		var newLayout = getCurrentLayout();
		if (newLayout !== currentLayout) {
			currentLayout = newLayout;
			var path = getPath();
			if (currentLayout == 'flag') {
				showTab(path);
			} else {
				showForLong();
			}
		}
	});
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