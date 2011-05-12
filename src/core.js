// Global wysiwyg object.
var Wysiwyg = function(){
	
	this.version =  "@VERSION";		// Overwritten at compile time
	this.fn      = {}; 				// Plugins are accessed via fn caller, this is compatabile with jQuery's format and is familiar.
	this.dialog  = {};
	this.utils   = {};
	this.ui      = {};
	
	this.activeEditor = null;
	this.init		  = function (object, options) {}; // call instance
	this.instance     = function (options) {}; // create new object

	this.activeEditor: null;        // References the active editor instance, useful for having a global toolbar.
	this.instances: [];             // Collection
	
	//
	// Use extend to add plugins or functionality that isn't part of "core". 
	// Extending sets up a proper fn namespace, and allows plugins to initialize, 
	// gives them access to core libs, a 'activeEditor' instance, and hooks.
	// 
	this.extend  = function( namespace, plugin ){
		
		$.extend( plugin, pluginApi );
		
		// Place the new plugin in the fn namespace
		this.fn[namespace] = plugin;

		// Fire the plugin "init" method if it exists, we pass the core Wysiwyg object
		// in the event it needs access to various functionality.
		
		if ( jQuery.isFunction( plugin.init ) ) {
			plugin.init.call(this);
		}
	};
	
	// The plugin API provides defaults for plugin functionality. When creating plugins
	// they simply override these methods. Any methods not overridden keep these defaults. 
	// This also provides a standardized interface for plugins.
	
	var pluginApi = {
		activeEditor: function(w){ w.activeEditor}(this), // Make sure this is up to date on extend?
		init: 		  function(){}		
	};
	
	
};

$.wysiwyg = Wysiwyg;