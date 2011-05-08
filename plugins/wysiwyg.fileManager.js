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
			return this;
		},
		isAjaxSet: function () {
			if (this.ajaxHandler) {
				return true;
			} else {
				return false;
			}
		},
		init: function() {
			if (this.ajaxHandler) {
				return loadFileManagerUI();
			} else {
				return false;
			}
		}
		
	 }
	// Register:
	$.wysiwyg.plugin.register(fileManager);
	
	// Private methods:
	function loadFileManagerUI () {
		var fileList = getDir('/');
		var content = '<div>'+fileList+'</div>';
		if ($.wysiwyg.dialog) {
			$.wysiwyg.dialog(content);
		} else if ($.dialog) {
			$(content).dialog();
		} else {
			// If neither of the above works..
		}
		return $.wysiwyg.fileManager.ajaxHandler;
	}
	function getDir (dir) {
		var treeHtml = '<ul>';
		// Retreives list of files inside a certain directory:
		$.getJSON($.wysiwyg.fileManager.ajaxHandler, { "dir": dir },function (json) {
			$.each(json.data, function(name, type) {
				var ext = (type === "file") ? name.replace(/^.*?\./, '') : "dir";
				treeHtml += '<li class="wysiwyg-'+ext+'">'+name+'</li>';
			});
		});
		treeHtml += '</ul>';
		return treeHtml; // And returns HTML
	}

})(jQuery);
