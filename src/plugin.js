(function( Wysiwyg ) {
	
// Add a list of defaults plugins should adhere to.
// init: Called on plugin install
//
Wysiwyg.plugin.api = {
	init: $.noop,
	exec: $.noop
};

// Add a new plugin to Wysiwyg core.
//
Wysiwyg.plugin.register = function( name, api ) {
	
	// Ensure api compatability
	var plugin = $.extend( {}, Wysiwyg.plugin.api, api );

	// Add plugin to core
	Wysiwyg.plugin[name] = plugin;
		
	if ( 'control' in plugin ) {
		Wysiwyg.addControl( name, plugin.control );
	}
	
	plugin.init.apply( Wysiwyg ); // Initialize plugin, passing core Wysiwyg object
		
};

})( Wysiwyg );