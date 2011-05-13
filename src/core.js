// Global wysiwyg object.
var Wysiwyg, EditorInstance; // forward declaration

Wysiwyg = function(){

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
	
	
	// The plugin API provides defaults for plugin functionality. When creating plugins
	// they simply override these methods. Any methods not overridden keep these defaults. 
	// This also provides a standardized interface for plugins.
	
	var pluginApi = {
		getActiveEditor: function(w) { Wysiwyg.activeEditor; },
		init:            function(w) {},
		isPlugin:        true
	};

	//
	// Use registerPlugin to add plugins or functionality that isn't part of "core". 
	// Extending sets up a proper name, and allows plugins to initialize, 
	// gives them access to core libs, and hooks.
  // Active editor should be accessed through $.wysiwyg.activeEditor.

	// Example:
	// 	var myPlugin = {};
	//	$.wysiwyg.registerPlugin('myPlugin', myPlugin);
	//
	this.registerPlugin = function( name, plugin ) {
		
		$.extend( plugin, pluginApi );
		
		// Place the new plugin in the core namespace
		this[name] = $.extend({}, pluginApi, plugin); //  plugin can override pluginApi defaults.

		// Fire the plugin "init" method (it is always exists due to pluginApi declaration, we pass the core Wysiwyg object
		// in the event it needs access to various functionality.
		
		this.fn[name].init.call(this);
		
		// If the plugin defines a control internally, add it to the available controls.
		if ( 'control' in this.fn[name] ) {
			$.extend(this.controls, this.fn[name].control);
		}

	};

	this.plugins = function() {
		var r = {};
		$.each($.fn, function(item, key) {
			if ('isPlugin' in this)
			{
				r[key] = this;
			}
		});
		return r;
	};

	// active editor instance extend itself using Wysiwyg.fn (prototyping)
  EditorInstance = function()
  {
  };
};
