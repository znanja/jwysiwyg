/**
 * Internationalization: Slovenian language
 *
 * Depends on jWYSIWYG, $.wysiwyg.i18n
 *
 * By: Peter Zlatnar <peter.zlatnar@gmail.com>
 *
 */
(function ($) {
	if (undefined === $.wysiwyg) {
		throw "lang.sl.js depends on $.wysiwyg";
	}
	if (undefined === $.wysiwyg.i18n) {
		throw "lang.sl.js depends on $.wysiwyg.i18n";
	}

	$.wysiwyg.i18n.lang.sl = {
		controls: {
			"Bold": "Krepko",
			"Colorpicker": "",
			"Copy": "Kopiraj",
			"Create link": "Dodaj povezavo",
			"Cut": "Izreži",
			"Decrease font size": "Zmanjšaj pisavo",
			"Fullscreen": "",
			"Header 1": "Naslov 1",
			"Header 2": "Naslov 2",
			"Header 3": "Naslov 3",
			"View source code": "Prikaži izvorno kodo",
			"Increase font size": "Povečaj pisavo",
			"Indent": "Zamik v desno",
			"Insert Horizontal Rule": "Vstavi vodoravno črto ",
			"Insert image": "Vstavi sliko",
			"Insert Ordered List": "Vstavi oštevilčen seznam",
			"Insert table": "Vstavi tabelo",
			"Insert Unordered List": "Vstavi označen seznam",
			"Italic": "Ležeče",
			"Justify Center": "Sredinska poravnava",
			"Justify Full": "Obojestranska poravnava",
			"Justify Left": "Leva poravnava",
			"Justify Right": "Desna poravnava",
			"Left to Right": "Od leve proti desni",
			"Outdent": "Zamik v levo",
			"Paste": "Prilepi",
			"Redo": "Ponovi",
			"Remove formatting": "Odstrani oblikovanje",
			"Right to Left": "Od desne proti levi",
			"Strike-through": "Prečrtano",
			"Subscript": "Podpisano",
			"Superscript": "Nadpisano",
			"Underline": "Podčrtano",
			"Undo": "Razveljavi"
		},

		dialogs: {
			// colorpicker
			"Colorpicker": "",
			"Color": "",
			"Apply": "",

			// image
			"Insert Image": "",
			"Preview": "",
			"URL": "",
			"Title": "",
			"Description": "",
			"Width": "",
			"Height": "",
			"Original W x H": "",

			// link
			"Insert Link": "",
			"Link URL": "",
			"Link Title": "",
			"Link Target": "",

			// table
			"Insert table": "",
			"Count of columns": "",
			"Count of rows": "",

			// for all
			"Cancel": ""
		}
	};
})(jQuery);
