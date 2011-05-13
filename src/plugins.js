Wysiwyg.plugins = {
	register: function(name, api) {
		var plugin = $.extend({}, Wysiwyg.plugins.api, api);
		Wysiwyg.plugins[name] = plugin;
		if ('control' in plugin) {
			Wysiwyg.controls[name] = plugin.control;
		}
		plugin.init.call(plugin, Wysiwyg); // this will point to plugin itself, first argument - to Wysiwyg.
	},
	api: {
		init: $.noop
	}
};

