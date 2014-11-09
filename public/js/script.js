
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
var flagLayoutMethod = function(flagMethod, args) {
	return function() {
		if (getCurrentLayout() == 'flag') {
			flagMethod.apply(undefined, args);
		}// else {
			// longMethod.apply(undefined, args);
		// }
	};
};

// Show an individual content tab.
var showTab = function(tab) {
	$('.js-tab-links li').removeClass('active');
	$('.js-tab-links li[data-tab="' + tab + '"]').addClass('active');
	$('.js-tab-contents').hide();
	$('.js-tab-contents[data-tab="' + tab + '"]').show();
};

// Show all of our content.
var showForLong = function() {
	$('.js-tab-contents').show();
};

page('/', flagLayoutMethod(showTab, ['projects']));
page('/projects', flagLayoutMethod(showTab, ['projects']));
page('/resume', flagLayoutMethod(showTab, ['resume']));
// Catchall
page('*', function() {
	page('/');
});

// Navigate to routes on click/touch
$('.tab-links a').on('click touch', function(e) {
	e.preventDefault();
	page($(this).attr('href'));
});

function getPath() {
	return location.pathname.substring(1);
}

// We landed!
$(function() {
	// Initialize our silly photo scroller thing
	photoScroller($('#scroller'), [
		'/images/professor.jpg',
		'/images/teaching.jpg',
		'/images/wideeyed.jpg'
	], 15000);

	// Let page.js route us automatically. (By default, this is
	// to the projects tab.)
	page(getPath());

	// If the layout has changed, show either the tabbed
	// view for the flag layout or display everything
	// for the long layout.
	$(window).on('resize', function(e) {
		var newLayout = getCurrentLayout();
		if (newLayout !== currentLayout) {
			currentLayout = newLayout;
			var path = getPath();
			if (currentLayout == 'flag') {
				showTab(path || 'projects');
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
		var tmpl = _.template($('#r-frontend-listing').html());
		var compiled = tmpl({
			threads: redditPosts
		});
		$('#r-frontend-posts').empty().append($(compiled));
	}
})