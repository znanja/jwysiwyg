// Global wysiwyg object.
var Wysiwyg;

Wysiwyg = (function() {

	// Instance version.
	var Wysiwyg = function( els, config ){

		var selection = $(els);
		if ( selection.length === 1 ) {
			var instance = selection.data('wysiwyg');
			if ( instance !== undefined ) {
				return instance;
			}
		}

		selection.each(function( i, el ) {
			var instance;

			// Create a new instance unless it exists.
			if ( $.data(el, 'wysiwyg') === undefined ) {
				instance 	  = new Wysiwyg.fn.init( el, config );
				instance.uuid = new Date().getTime();
				$.data(el, 'wysiwyg', instance);
			}
		});

		return els;
	};

	Wysiwyg.fn = Wysiwyg.prototype = {
		constructor: Wysiwyg,
		isInitialized: false,
		init: function( el, config ){
			// Unique UID for this instance... used in dialogs/ui
			this.uuid = null;

			// Key codes that instances capture
			this.validKeyCodes	= [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46];

			// References the iframe HTML document
			this.document = null;

			// Instance configuration options
			this.options = {};

			// Original replaced element (ie textarea)
			this.element = null;

			// Stores a selection range on blur
			this.savedRange = null;

			// Delay timers (is this even necessary?)
			this.timers = [];

			// Check enabled/destroyed state of this editor
			this.isDestroyed = true;

			// Extend default options with user defined options.
			this.options = $.extend( {}, this.options, config );

		}
	};

	Wysiwyg.fn.init.prototype = Wysiwyg.fn;

	Wysiwyg.extend = function( namespace, data ) {
		if ( $.isPlainObject(namespace) ){
			$.extend(this, namespace);
		} else {
			$.extend(this[namespace], data);
		}
	};

	Wysiwyg.extend({
		version: '@VERSION',
		dialog:   {},
		utils:    {},		
		controls: {},
		plugins:  {},
		ui:       {}
	});

	return Wysiwyg;	
	
})();

$.fn.wysiwyg = function( els, config ) {
	return Wysiwyg(els, config);
};
