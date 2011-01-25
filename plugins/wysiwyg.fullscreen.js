/**
 * Fullscreen plugin
 * 
 * Depends on jWYSIWYG
 */
(function ($) {
	if (undefined === $.wysiwyg) {
		throw "wysiwyg.fullscreen.js depends on $.wysiwyg";
	}

	/*
	 * Wysiwyg namespace: public properties and methods
	 */
	var fullscreen = {
		name: "fullscreen",
		version: "",
		defaults: {
			css: {
				width:	"100%",
				height:	"100%",
				position: "absolute",
				left:	"0px",
				top:	"0px",
				background: "rgb(255, 255, 255)",
				padding: "0px",
				border: "0px",
				"z-index": 1000
			}
		},
		originalBoundary: {
			width: null,
			height: null
		},

		init: function (Wysiwyg, options) {
			options = options || {};
			options = $.extend(true, this.defaults, options);

			if (this.originalBoundary.width) {
				this.restore(Wysiwyg);
			} else {
				this.stretch(Wysiwyg, options);
			}
		},

		restore: function (Wysiwyg) {
			var propertyName;

			for (propertyName in this.defaults.css) {
				Wysiwyg.element.css(propertyName, this.originalBoundary[propertyName]);

				this.originalBoundary[propertyName] = null;
			}
		},

		stretch: function (Wysiwyg, options) {
			var propertyName;

			for (propertyName in this.defaults.css) {
				this.originalBoundary[propertyName] = Wysiwyg.element.css(propertyName);
			}

			for (propertyName in this.defaults.css) {
				Wysiwyg.element.css(propertyName, options.css[propertyName]);
			}
		}
	};

	$.wysiwyg.plugin.register(fullscreen);
})(jQuery);