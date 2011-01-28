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
				editor: {
					width:	"100%",
					height:	"100%"
				},
				element: {
					width:	"100%",
					height:	"100%",
					position: "absolute",
					left:	"0px",
					top:	"0px",
					background: "rgb(255, 255, 255)",
					padding: "0px",
					"border-bottom-color": "",
					"border-bottom-style": "",
					"border-bottom-width": "0px",
					"border-left-color": "",
					"border-left-style": "",
					"border-left-width": "0px",
					"border-right-color": "",
					"border-right-style": "",
					"border-right-width": "0px",
					"border-top-color": "",
					"border-top-style": "",
					"border-top-width": "0px",
					"z-index": 1000
				},
				original: {
					width:	"100%",
					height:	"100%",
					position: "absolute",
					left:	"0px",
					top:	"0px",
					background: "rgb(255, 255, 255)",
					padding: "0px",
					"border-bottom-color": "",
					"border-bottom-style": "",
					"border-bottom-width": "0px",
					"border-left-color": "",
					"border-left-style": "",
					"border-left-width": "0px",
					"border-right-color": "",
					"border-right-style": "",
					"border-right-width": "0px",
					"border-top-color": "",
					"border-top-style": "",
					"border-top-width": "0px",
					"z-index": 1000
				}
			}
		},
		originalBoundary: {
			editor: {
				width: null	// check state by width?
			},
			element: {
			},
			original: {
			}
		},

		init: function (Wysiwyg, options) {
			options = options || {};
			options = $.extend(true, this.defaults, options);

			if (this.originalBoundary.element.width) {
				this.restore(Wysiwyg);
			} else {
				this.stretch(Wysiwyg, options);
			}
		},

		restore: function (Wysiwyg) {
			var propertyName;

			for (propertyName in this.defaults.css.editor) {
				Wysiwyg.editor.css(propertyName, this.originalBoundary.editor[propertyName]);
				this.originalBoundary.editor[propertyName] = null;
			}

			for (propertyName in this.defaults.css.element) {
				Wysiwyg.element.css(propertyName, this.originalBoundary.element[propertyName]);
				this.originalBoundary.element[propertyName] = null;
			}

			for (propertyName in this.defaults.css.original) {
				$(Wysiwyg.original).css(propertyName, this.originalBoundary.original[propertyName]);
				this.originalBoundary.original[propertyName] = null;
			}
		},

		stretch: function (Wysiwyg, options) {
			var propertyName;

			// save previous values
			for (propertyName in this.defaults.css.editor) {
				this.originalBoundary.editor[propertyName] = Wysiwyg.editor.css(propertyName);
			}

			for (propertyName in this.defaults.css.element) {
				this.originalBoundary.element[propertyName] = Wysiwyg.element.css(propertyName);
			}

			for (propertyName in this.defaults.css.original) {
				this.originalBoundary.original[propertyName] = $(Wysiwyg.original).css(propertyName);
			}

			// set new values
			for (propertyName in this.defaults.css.editor) {
				Wysiwyg.editor.css(propertyName, options.css.editor[propertyName]);
			}

			for (propertyName in this.defaults.css.element) {
				Wysiwyg.element.css(propertyName, options.css.element[propertyName]);
			}

			options.css.original.top = Wysiwyg.ui.panel.css("height");
			for (propertyName in this.defaults.css.original) {
				$(Wysiwyg.original).css(propertyName, options.css.original[propertyName]);
			}
		}
	};

	$.wysiwyg.plugin.register(fullscreen);
})(jQuery);