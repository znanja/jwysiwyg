/**
 * WYSIWYG - jQuery plugin 0.98 dev
 *
 * Copyright (c) 2008-2009 Juan M Martinez, 2010-2011 Akzhan Abdulin and all contributors
 * https://github.com/akzhan/jwysiwyg
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/*jslint browser: true, forin: true */

(function($) {
	
	if (typeof $ === "undefined" || $ !== window.jQuery){
		$.error("jQuery not found. Please include jQuery prior to including jwysiwyg.");
		return false;
	}
		
	if ( typeof $.wysiwyg != "undefined" || !$.wysiwyg.version ) {
		return;
	}
	