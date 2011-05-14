// Add a list of defaults plugins should adhere to.
// init: Called on plugin install
//
Wysiwyg.plugins.api = {
	init: $.noop
};

// Add a new plugin to Wysiwyg core.
//
Wysiwyg.plugins.register = function( name, api ) {
	
	// Ensure api compatability
	var plugin = $.extend( {}, Wysiwyg.plugins.api, api );

	// Add plugin to core
	Wysiwyg.plugins[name] = plugin;
		
	if ( 'control' in plugin ) {
		Wysiwyg.controls[name] = plugin.control;
	}
	
	plugin.init.apply( Wysiwyg ); // Ensure "this" is reference to core.
		
};