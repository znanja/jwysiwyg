// Global wysiwyg object.
var Wysiwyg;

Wysiwyg = (function() {
	
	// Instance version.
	var Wysiwyg = function( els, config ){
		
		if ( jQuery(els).length === 1 ){
			if ( jQuery(els).data('wysiwyg') ){
				return jQuery(els).data('wysiwyg');
			}
		}
		
		jQuery.each( jQuery(els), function( i, el ){
			// Create a new instance unless it exists.
			if ( !jQuery(el).data('wysiwyg') ){
				jQuery(el).data('wysiwyg', new Wysiwyg.fn.init( el, config ));
			}
		});
		
		return els;
	};
	
	Wysiwyg.fn = Wysiwyg.prototype = {
		constructor: Wysiwyg,
		isInitialized: false,
		init: function( el, config ){
			// Defaults
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
			jQuery.extend( {}, this.options, config );
			
		}
	};

	Wysiwyg.fn.init.prototype = Wysiwyg.fn;
	
	Wysiwyg.extend = function( namespace, data ){
		if ( jQuery.isPlainObject(namespace) ){
			jQuery.extend(this, namespace);
		} else {
			jQuery.extend(this[namespace], data);
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

jQuery.fn.wysiwyg = function( els, config ){
	Wysiwyg(els, config);
	return els;
};