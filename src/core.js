// Global wysiwyg object.
var Wysiwyg; // forward declaration

Wysiwyg = function( els, config ) {
	
	// Class methods are accessed directly as members of Wysiwyg
	// Plugins are accessed directly as members of Wysiwyg
	this.version  =  "@VERSION"; // Overwritten at compile time

	this.activeEditor = null;        // References the active editor instance, useful for having a global toolbar.
	this.instances    = {};          // Collection

	function uuid(){
		
	}

	$.each( $(els), function( i, el ){
		
		var instance  = new Wysiwyg.editor( el, config );
		instance.uuid = new Date().getTime();
		
		$(el).data( 'wysiwyg', instance );
		
	});
	
	return els;	
};

Wysiwyg.dialog   = {};
Wysiwyg.utils    = {};
Wysiwyg.ui       = {};
Wysiwyg.controls = {};
Wysiwyg.plugins  = {};


//
// Editor refers to an instance of a Wysiwyg editor.
// To create a new instance, use:
//  new Wysiwyg.editor( domElement(s), options = {} );
//
// Specific editor functionality defined in editor.js
//
Wysiwyg.editor = function( els, config ) {

	this.constructor = Wysiwyg;
	
	// Store a unique id per editor instead of a simple array
	this.uuid = null;

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
	$.extend( {}, this.options, config );
	
	$.each( config.plugins, function( i, plugin ){
		$.proxy( plugin );
	});

	return this;
	
};

Wysiwyg.fn = Wysiwyg.editor.prototype;