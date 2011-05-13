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
	
	this.activeEditor = null;
	this.init         = function (obj, options) {}; // call instance
	this.instance     = function (options) {}; // create new object

	this.activeEditor = null;        // References the active editor instance, useful for having a global toolbar.
	this.instances    = [];             // Collection
};	
	
// active editor instance extend itself using Wysiwyg.fn (prototyping)
EditorInstance = function()
{
};

