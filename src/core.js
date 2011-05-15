// Global wysiwyg object.
var Wysiwyg;

Wysiwyg = (function() {

	// Instance version.
	var Wysiwyg = function( els, config ){

		var selection = $(els), instance;

		// When single elements are passed, return wysiwyg
		// instance if exists. This provides an easy API for instances.
		//
		if ( selection.length === 1 ) {
			instance = selection.data('wysiwyg');
			if ( instance !== undefined ) {
				return instance;
			}
		}
		
		// Create a new wysiwyg instance for each DOM element unless
		// it already exists.
		//
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
		init: function( el, config ){
			
			// Unique UID for this instance... used in dialogs/ui
			this.uuid = null;

			// Key codes that instances capture 
			// TODO: Move to events.js as a private/local variable
			//this.validKeyCodes	= [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46];	

			// References the iframe HTML document
			this.document = null;

			// Instance configuration options
			this.options = {};

			// Original replaced element (ie textarea)
			this.element = $(el)[0];

			// Stores a selection range on blur
			this.savedRange = null;

			// Delay timers (is this even necessary?)
			this.timers = [];

			// Check enabled/destroyed state of this editor
			this.isDestroyed = true;
			
			// Capture the closest form for save callbacks
			this.form = $(el).closest('form')[0];
			
			// Extend default options with user defined options.
			$.extend( {}, this.options, config );
			
			initEditor.apply(this, [ $(el) ]);
			
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
	
	function initEditor( element ){
		var iframe, wrapper, doc;

		if ( window.location.protocol === "https:" ){
			iframe = $('<iframe src="javascript:false;"></iframe>');
		} else {
			iframe = $("<iframe></iframe>");
		}
		
		wrapper = $("<div></div>");
		iframe.addClass('wysiwyg')
			  .attr('frameborder', '0')
			  .attr("tabindex", element.attr("tabindex"));
		element.hide().before(wrapper);
		wrapper.append( $("<div><!-- --></div>")
			   .css({clear: "both"}))
			   .append(iframe);
			
		this.editor = iframe[0];
		
		doc = $(this.editor).get(0);
		
		if ( doc.nodeName.toLowerCase() === "iframe" ) {
			if( doc.contentDocument ){
				// Gecko / Webkit based browsers
				this.document = doc.contentDocument;
			} else if( doc.contentWindow ) {
				// IE
				this.document = doc.contentWindow.document;
			}
		}
		
		
	}

	return Wysiwyg;	
	
})();

$.fn.wysiwyg = function( els, config ) {
	return Wysiwyg(els, config);
};
