// Global wysiwyg object.
var Wysiwyg; // forward declaration

Wysiwyg = function( els, config ) {
	
	$.each( $(els), function( i, el ){
		
		// Create a new editor instance
		var instance  = new Wysiwyg.editor( el, config );
		// Generate a unique ID for the instance so it can be 
		// referenced easily.
		instance.uuid = new Date().getTime();
		// Store the instance globally
		Wysiwyg.instances[instance.uuid] = instance;
		
		// Store the instance on the dom element.
		$(el).data( 'wysiwyg', instance );
		
	});
	
	return els;	
};

// References the active editor instance, useful for having a global toolbar.
Wysiwyg.activeEditor = null;

// Collection
Wysiwyg.instances = {};

// Overwritten at compile time	
Wysiwyg.version   =  "@VERSION";
Wysiwyg.instances = {};
Wysiwyg.dialog    = {};
Wysiwyg.utils     = {};
Wysiwyg.ui        = {};
Wysiwyg.controls  = {};
Wysiwyg.plugins   = {};
Wysiwyg.console   = console; // defined in console.js

//
// Editor refers to an instance of a Wysiwyg editor.
// To create a new instance, use:
//  new Wysiwyg( domElement(s), options = {} );
//
// Specific editor functionality defined in editor.js
//
Wysiwyg.editor = function( el, config ) {

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

	return this;
	
};

Wysiwyg.fn = Wysiwyg.editor.prototype;