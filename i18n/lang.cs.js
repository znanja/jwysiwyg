/**
 * Internationalization: czech language
 * 
 * Depends on jWYSIWYG, $.wysiwyg.i18n
 *
 * By: deepj on github.com
 *
 */
(function ($) {
	if (undefined === $.wysiwyg) {
		throw "lang.cs.js depends on $.wysiwyg";
	}
	if (undefined === $.wysiwyg.i18n) {
		throw "lang.cs.js depends on $.wysiwyg.i18n";
	}

	$.wysiwyg.i18n.lang.cs = {
		controls: {
			"Bold": "Tučné",
			"Colorpicker": "",
			"Copy": "Kopírovat",
			"Create link": "Vytvořit odkaz",
			"Cut": "Vyjmout",
			"Decrease font size": "Zmenšit velikost písma",
			"Fullscreen": "",
			"Header 1": "Nadpis 1",
			"Header 2": "Nadpis 2",
			"Header 3": "Nadpis 3",
			"View source code": "Zobrazit zdrojový kód",
			"Increase font size": "Zvětšit velikost písma",
			"Indent": "Zvětšit odsazení",
			"Insert Horizontal Rule": "Vložit horizontální čáru",
			"Insert image": "Vložit obrázek",
			"Insert Ordered List": "Vložit číslovaný seznam",
			"Insert table": "Vložit tabulku",
			"Insert Unordered List": "Vložit odrážkový seznam",
			"Italic": "Kurzíva",
			"Justify Center": "Zarovnat na střed",
			"Justify Full": "Zarovnat do bloku",
			"Justify Left": "Zarovnat doleva",
			"Justify Right": "Zarovnat doprava",
			"Left to Right": "Zleva doprava",
			"Outdent": "Zmenšit odsazení",
			"Paste": "Vložit",
			"Redo": "Znovu",
			"Remove formatting": "Odstranit formátování",
			"Right to Left": "Zprava doleva",
			"Strike-through": "Přeškrnuté",
			"Subscript": "Dolní index",
			"Superscript": "Horní index",
			"Underline": "Potržené",
			"Undo": "Zpět"
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