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

	var
		// Previous plugin instance
		previousWysiwyg = null,
		// Use the correct document accordingly with window argument (sandbox)
		document = window.document,
		// jQuery shortcut
		$ = window.jQuery;


	if ($ === undefined) {
		$.error("jQuery not found. Please include jQuery prior to including jwysiwyg.");
		return false;
	}

	previousWysiwyg = $.wysiwyg;

