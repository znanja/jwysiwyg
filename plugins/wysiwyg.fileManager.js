/**
 * File Manager plugin for jWYSIWYG
 * 
 * Yotam Bar-On, 2011
 */
(function ($) {
	if (undefined === $.wysiwyg) {
		throw "wysiwyg.fileManager.js depends on $.wysiwyg";
	}

	/*
	 * Wysiwyg namespace: public properties and methods
	 */
	 // Only for show
	 var fileManager = {
		name: "fileManager",
		version: "0.98", // Same as jwysiwyg
		ajaxHandler: "",
		setAjaxHandler: function(_handler) {
			this.ajaxHandler = _handler;
		},
		isAjaxSet: function () {
			return false;
		},
		init: function() {
			if (!this.isAjaxSet) {
				return false;
			}
		}
		
	 }
	// Register:
	$.wysiwyg.plugin.register(fileManager);
	
	// Private methods:
	function loadFileManagerUI (_handler) {
		
	}
	function getDir (_handler) {
		
	}

})(jQuery);
