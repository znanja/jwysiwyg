/**
 * Autoload plugin
 * 
 * Depends on jWYSIWYG, autoload
 */
(function($) {
if (undefined === $.wysiwyg) {
//	console.log("Depends on $.wysiwyg");
	return false;
}

if (undefined === $.autoload) {
//	console.log("Depends on $.autoload");
	return false;
}

/*
 * Wysiwyg namespace: public properties and methods
 */
$.wysiwyg.autoload = {
	defaults: {
		baseFile:		"jquery.wysiwyg.js",
		cssPath:		"css/",
		controlPath:	"controls/",
		i18nPath:		"i18n/"
	},

	css: function(names) {
		$.autoload.css(names, this.defaults);
	},

	control: function(names, success) {
		$.autoload.js(names, {"baseFile": this.defaults.baseFile, "jsPath": this.defaults.controlPath, "success": success});
	},

	lang: function(names, success) {
		$.autoload.js(names, {"baseFile": this.defaults.baseFile, "jsPath": this.defaults.i18nPath, "success": success});
	}
};

})(jQuery);