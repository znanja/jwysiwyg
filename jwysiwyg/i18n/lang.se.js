/**
 * Internationalization: swedish language
 * 
 * Depends on jWYSIWYG, $.wysiwyg.i18n
 *
 * By: ippa@rubylicio.us
 *
 */
(function($) {
if (undefined === $.wysiwyg) {
	throw "lang.se.js depends on $.wysiwyg";
	return false;
}
if (undefined === $.wysiwyg.i18n) {
	throw "lang.se.js depends on $.wysiwyg.i18n";
	return false;
}

$.wysiwyg.i18n.lang.se = {
"Bold": "Tjock",
"Copy": "Kopiera",
"Create link": "Skaka l.nk",
"Cut": "Klipp",
"Decrease font size": "Minska storlek",
"Header 1": "Rubrik 1",
"Header 2": "Rubrik 2",
"Header 3": "Rubrik 3",
"View source code": "Se k.llkod",
"Increase font size": ".ka fontstorlek",
"Indent": ".ka indrag",
"Insert Horizontal Rule": "L.gg in vertical avskiljare ",
"Insert image": "Infoga bild",
"Insert Ordered List": "Infoga numrerad lista",
"Insert table": "Infoga tabell",
"Insert Unordered List": "Infoga lista",
"Italic": "Kursiv",
"Justify Center": "Centrera",
"Justify Full": "Marginaljustera",
"Justify Left": "V.nsterjustera",
"Justify Right": "H.gerjustera",
"Left to Right": "V.nster till h.ger",
"Outdent": "Minska indrag",
"Paste": "Klistra",
"Redo": "G.r om",
"Remove formatting": "Ta bort formatering",
"Right to Left": "H.ger till v.nster",
"Strike-through": "Genomstrykning",
"Subscript": "Subscript",
"Superscript": "Superscript",
"Underline": "Understruken",
"Undo": ".ngra"
};

})(jQuery);
