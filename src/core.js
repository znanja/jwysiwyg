// Global wysiwyg object.
var Wysiwyg;

Wysiwyg = (function() {

	// Instance version.
	var Wysiwyg = function( els, conf ){

		var selection = $(els), instance, config = conf || {};

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
				
				instance = new Wysiwyg.fn.init( el, config );
				$.data(el, 'wysiwyg', instance);
				
				instances[instance.uuid] = instance;
			}
			
		});

		return els;
	},
	
	controls  = {},
	instances = {};

	Wysiwyg.fn = Wysiwyg.prototype = {
		constructor: Wysiwyg,
		init: function( el, config ){
			
			var controlList = [ 'bold', 'italic', 'link' ],
				self = this;
			
			// Unique UID for this instance... used in dialogs/ui
			this.uuid = new Date().getTime();

			// Key codes that instances capture 
			// TODO: Move to events.js as a private/local variable
			//this.validKeyCodes	= [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46];	
			
			// The control names belonging to this instance.
			this.controls = {};
			
			// The plugin names belonging to this instance
			this.plugins  = [];
			
			// References the iframe HTML document
			this.document = null;

			// Instance configuration options
			this.options = {};

			// Original replaced element (ie textarea)
			this.element = $(el);

			// Stores a selection range on blur
			this.savedRange = null;

			// Delay timers (is this even necessary?)
			this.timers = [];

			// Check enabled/destroyed state of this editor
			this.isDestroyed = true;
			
			// Capture the closest form for save callbacks
			// Leave undefined if no form is wrapping this editor
			//
			if ( $(el).closest('form').length > 0 ){
				this.form = $(el).closest('form');
			}
			
			// Support passing controls as a string.. similar to TinyMCE. 
			// Final controls variable should be an array of strings that resolve to 
			// properties on Wysiwyg.controls
			//
			if ( $.type( config.controls ) === 'string' ){
				controlList = config.controls.split(',');
			} else if ( config.controls !== undefined ) {
				controlList = config.controls;
			}
			
			$.each( controlList, function(ind, name){
				self.controls[name] = controls[name];
			});
			
			// Support passing controls as a string.. similar to TinyMCE. 
			// Final controls variable should be an array of strings that resolve to 
			// properties on Wysiwyg.controls
			//
			if ( $.type( config.plugins ) === 'string' ){
				this.plugins = config.plugins.split(',');
			} else if ( config.controls !== undefined ){
				this.plugins = config.plugins;
			}
			
			// We don't need duplication.
			delete config.controls; 
			delete config.plugins;
			
			// Extend default options with user defined options.
			$.extend( {}, this.options, config );
			
			initEditor.apply(this, [ $(el) ]);
			
		}
	};

	Wysiwyg.fn.init.prototype = Wysiwyg.fn;

	Wysiwyg.extend = function( namespace, data ) {
		var ns, parsed;
		
		if ( $.isPlainObject(namespace) ){
			$.extend(this, namespace);
		} else {
			
			if ( $.isFunction(data) ){
				this[namespace] = data;
				
			} else {
				
				ns = this[namespace] || {};
				ns = $.extend({}, ns, data);
				parsed = {};
				parsed[namespace] = ns;
				$.extend(this, parsed);
				
			}
		}
	};
	
	// See controls.js for more info
	//
	Wysiwyg.addControl = function( name, control ){
		
		var delegator;
		
		if( $.isPlainObject( control) ){
			
			if ( 'delegate' in control ){
				delegator = Wysiwyg.fn[control.delegate];
				
				if ( delegator !== undefined ){
					control.exec = delegator.exec;
				}				
			}
			controls[name] = control;
		}
	};

	Wysiwyg.extend({
		version: '@VERSION',
		dialog: {},
		utils:  {},
		plugin: {},
		ui:     {}
	});
	
	function initEditor( element ){
		var iframe, wrapper, doc, self = this, toolBar;

		if ( window.location.protocol === "https:" ){
			iframe = $('<iframe src="javascript:false;"></iframe>');
		} else {
			iframe = $("<iframe></iframe>");
		}
		
		wrapper = $("<div></div>");
		iframe.addClass('wysiwyg')
			  .attr('id', 'wysiwyg_' + this.uuid)
			  .attr('frameborder', '0')
			  .attr("tabindex", element.attr("tabindex"));
		element.hide().before(wrapper);
		wrapper.css({clear: "both"})
			   .addClass('wysiwyg_container')
			   .attr('id', 'wysiwyg_container_' + this.uuid)
			   .append(iframe);
			
		this.editor = iframe;
		
		doc = $(this.editor).get(0);
		
		if ( doc.nodeName.toLowerCase() === "iframe" ) {
			if( doc.contentDocument ){
				// Gecko / Webkit based browsers
				this.document = $(doc.contentDocument);
			} else if( doc.contentWindow ) {
				// IE
				this.document = $(doc.contentWindow.document);
			}
		}
		
		// Support a jQuery selector as a toolbar to have a global toolbar for all 
		// editor instances.
		//
		if ( this.options.toolbar !== undefined ){			
			this.toolbar = $(this.options.toolbar);
			
			// On focus, re-create the toolbar to ensure controls update for
			// this particular instance. This only applies to a global toolbar;
			this.document.bind('wysiwyg.focus', function( event ){
				self.createToolbar();
			});
			
		} else {
			this.toolbar = $("<ul class='wysiwyg_toolbar'></ul>");
			wrapper.prepend(this.toolbar);
		}
		
		this.createToolbar();
		
		
	}

	return Wysiwyg;	
	
})();

$.fn.wysiwyg = function( els, config ) {
	return Wysiwyg(els, config);
};
