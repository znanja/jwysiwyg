/**
 * WYSIWYG - jQuery plugin @VERSION
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

(function( window, undefined ) {
	"use strict";

	// Use the correct document accordingly with window argument (sandbox)
	var document = window.document,
		$ = window.jQuery;


	if ($ === undefined) {
		$.error("jQuery not found. Please include jQuery prior to including jwysiwyg.");
		return false;
	}

	if ($.wysiwyg !== undefined && $.wysiwyg.version) {
		return true;
	}
