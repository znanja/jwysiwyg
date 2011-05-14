// Global wysiwyg object.
var Wysiwyg, EditorInstance; // forward declaration

Wysiwyg = function() {

	// Class methods are accessed directly as members of Wysiwyg
	// Plugins are accessed directly as members of Wysiwyg
	this.version  =  "@VERSION"; // Overwritten at compile time
	this.fn       =  EditorInstance.prototype; // fn are instance methods.
	this.dialog   = {};
	this.utils    = {};
	this.ui       = {};
	this.controls = {};
	
	this.init = function (obj, options) {}; // call instance

	this.activeEditor = null;        // References the active editor instance, useful for having a global toolbar.
	this.instances    = [];          // Collection
};	