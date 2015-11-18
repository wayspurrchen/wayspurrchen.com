/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function() {
        $('.js-tooltip').tooltipster( {
            theme: 'tooltipster-light',
            animation: 'fade',
            delay: 100,
            hideOnClick: true,
            trigger: 'click'
        } );
    });
}(jQuery));