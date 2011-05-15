(function( Wysiwyg ) {
	
// Controls have specific properties that define how they work:
// command:  If command is defined, the control is considered an 'execCommand' operator. control.exec is never called in favor of
//			 native execCommand support.
// toolTip:  The i18n key to use when translating the control name. The translation becomes the "title" attribute of the button link
// tags:     The HTML tags this control uses when wrapping content. If 2 entries exist, the first is considered XHTML, the second is
//			 considered HTML4.  When only a single entry exists, it is used for either.
// hotkeys:  This is either an integer or an object representing a keyboard command that can be used to trigger this control.
//			 If shift/control are required, use object notation specifying key: (key integer) and ctrl and/or shift as booleans.
// delegate: If the specified control should delegate execution to a plugin, specify the plugin name here (string value).
//
// Adding controls
// Add controls to core using:
// Wysiwyg.addControl(name, object);
//

Wysiwyg.extend( 'controls', {
	bold: {
		command: 'bold',
		hotkeys: { ctrl: true, key: 66 },
		tags: ["strong", "b"],
		tooltip: "bold"
	},
	
	highlight: {
		command: ( $.browser.msie || $.browser.safari ) ? "backcolor" : "hilitecolor",
		css:{
			backgroundColor: "rgb(255, 255, 102)"
		},
		tooltip: "highlight"		
	},
	
	italic: {
		command: 'italic',
		tags: ["em", "i"],
		tooltip: "italic"
	}

});

Wysiwyg.controls.bold 	   = {};
Wysiwyg.controls.highlight = {};
Wysiwyg.controls.italic    = {};
Wysiwyg.controls.link  	   = {};

Wysiwyg.controls.h1 	   = {};
Wysiwyg.controls.h2 	   = {};
Wysiwyg.controls.h3 	   = {};
Wysiwyg.controls.h4 	   = {};
Wysiwyg.controls.indent    = {};
Wysiwyg.controls.outdent   = {};

Wysiwyg.controls.paste	= {};
Wysiwyg.controls.undo	= {};
Wysiwyg.controls.redo	= {};

Wysiwyg.controls.insertHorizontalRule = {};
Wysiwyg.controls.insertImage 		  = {};
Wysiwyg.controls.insertOrderedList 	  = {};
Wysiwyg.controls.insertUnorderedList  = {};
Wysiwyg.controls.justifyRight 		  = {};
Wysiwyg.controls.justifyFull  		  = {};
Wysiwyg.controls.justifyRight  		  = {};
Wysiwyg.controls.strikeThrough  	  = {};

Wysiwyg.controls.subscript		= {};
Wysiwyg.controls.supercscript	= {};
Wysiwyg.controls.underline		= {};

})( Wysiwyg );