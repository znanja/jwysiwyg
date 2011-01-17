/**
 * Internationalization plugin
 * 
 * Depends on jWYSIWYG
 */
(function($) {
if (undefined === $.wysiwyg) {
	throw "wysiwyg.i18n.js depends on $.wysiwyg";
}

/*
 * Wysiwyg namespace: public properties and methods
 */
var i18n = {
	name: "i18n",
	version: "",
	defaults: {
		lang: "en",			// change to your language by passing lang option
		wysiwygLang: "en"	// default WYSIWYG language
	},
	lang: {},
	options: {},

	init: function(Wysiwyg, lang) {
		if (!lang) {
			lang = this.defaults.lang;
		}

		if ((lang !== this.defaults.wysiwygLang) && (undefined === $.wysiwyg.i18n.lang[lang])) {
			if ($.wysiwyg.autoload) {
				$.wysiwyg.autoload.lang("lang." + lang + ".js", function() {
						$.wysiwyg.i18n.init(Wysiwyg, lang);
					}
				);
			}
			else {
				throw 'Language "' + lang + '" not found in $.wysiwyg.i18n. You need to include this language file';
			}
		}

		this.options.lang = lang;
	},

	t: function(phrase, lang) {
		if (!lang) {
			lang = this.options.lang;
		}

		if ((lang !== this.defaults.wysiwygLang) && this.lang[lang] && this.lang[lang][phrase]) {
			return this.lang[lang][phrase];
		}

		return phrase;
	}
};

$.wysiwyg.plugin.register(i18n);

})(jQuery);