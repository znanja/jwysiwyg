Plugins
===================

Name your plugin as wysiwyg.**plugin_name**.js and place it under *plugins*
directory.

Sample
-------------------

	(function($) {
		// Check that jWYSIWYG was loaded
		if (undefined === $.wysiwyg) {
			throw "wysiwyg.plugin_name.js depends on $.wysiwyg";
		}

		// plugin
		$.wysiwyg.plugin_name = {
			// plugin defaults
			defaults: {},

			somePluginMethod: function() {
				var oWysiwyg = this.data("wysiwyg");

				// do something
			}
		}
	})(jQuery);
	
