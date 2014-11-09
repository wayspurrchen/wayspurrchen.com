// Custom weird little scroller plugin thing.
// For performance, we pass it an array of
// imageUrls. The scroller will lazy load these
// when it's good and ready

function photoScroller($el, imageUrls, speed) {
	var animating = false;
	var $container = $el;
	// Lock in width/height
	var contWidth = $container.width();
	var contHeight = $container.height();
	$container.width(contWidth);
	$container.height(contHeight);
	$container.css('overflow-y', 'hidden');
	$container.css('position', 'relative');
	var $button = $('<span class="avatar-scroll-button">');
	
	var $imgContainer = $('<div></div>');
	$imgContainer.css('position', 'absolute');
	var $imgs = $('img', $container);
	for (var i = 0; i < imageUrls.length; i++) {
		$imgs = $imgs.add('<img src="' + imageUrls[i] + '">');
	}
	$imgs.css('display', 'block');
	$imgs.appendTo($imgContainer);
	$container.append($imgContainer);
	$container.append($button);

	var currentImage = 0;

	// Given an array of image elements, count
	// their heights. NOTE: this must be run
	// *AFTER* all of the images have loaded,
	// otherwise it will return incorrect results.
	function cumulativeImageHeight($els) {
		var height = 0;
		$els.each(function(index, el) {
			height += $(el).height();
		});
		return height;
	}

	// Get the amount of offset from the top of an image
	// we would need to scroll our offsetTop to make it
	// appear visually centered within a div with overflow-y: hidden
	function topOffsetForCenter(imageHeight) {
		return (imageHeight - contHeight) / 2;
	}

	function cycle() {
		// Do nothing if in the middle of an animation
		if (animating) return;
		// Get the height of all the current images
		var height = cumulativeImageHeight($imgs.slice(0, currentImage + 1));
		animating = true;

		// If our image is taller than the container, we need to get the additional
		// height we need to move to get to the exact center of the image
		var nextImageHeight = cumulativeImageHeight($imgs.eq(currentImage + 1));
		if (nextImageHeight > contHeight) {
			height += topOffsetForCenter(nextImageHeight);
		}

		$imgContainer.animate({
			top: -height + 'px'
		}, 500, function() {
			currentImage++;
			animating = false;
			// If moving into our last image and need to
			// restructure it a bit. Note that this will
			// bump off our image order on the DOM - this
			// needs to be refactored in the future
			// if the ordering ever actually matters.
			if (currentImage == $imgs.length - 1) {
				// Steps for continuous stream:
				// 	at last image...
				//  
				//  1. pop off all previous images, put after last image
				//  2. re-set $imgs element
				//  3. set currentImage to 0
				var $last = $imgs.last();
				var resetHeight = 0;
				var lastHeight = cumulativeImageHeight($last)
				if (lastHeight > contHeight) {
					resetHeight += topOffsetForCenter(lastHeight);
				}
				$imgContainer.css('top', -resetHeight);
				var $rest = $imgs.slice(0, $imgs.length - 1);
				// Move all before the last to after the last
				$last.after($rest);
				// Reset imgs so our iteration works properly
				$imgs = $('img', $container);
				currentImage = 0;
			}
		});
	}

	var interval = startInterval();
	function startInterval() {
		var interval = setInterval(function() {
			cycle();
		}, speed);
		return interval;
	}

	$button.on('click touch', function() {
		cycle();
		clearInterval(interval);
		interval = startInterval();
	});
}