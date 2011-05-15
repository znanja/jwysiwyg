(function( Wysiwyg ) {
	
// Controls have specific properties that define how they work:
// command:  If command is defined, the control is considered an 'execCommand' operator. control.exec is never called in favor of
//			 native execCommand support.
// tooltip:  The i18n key to use when translating the control name. The translation becomes the "title" attribute of the button link
// tags:     The HTML tags this control uses when wrapping content. If 2 entries exist, the first is considered XHTML, the second is
//			 considered HTML4.  When only a single entry exists, it is used for either.
// hotkeys:  This is either an integer or an object representing a keyboard command that can be used to trigger this control.
//			 If shift/control are required, use object notation specifying key: (key integer) and ctrl and/or shift as booleans.
// delegate: If the specified control should delegate execution to a plugin, specify the plugin name here (string value).
//
// css:      If specified, the specified css objected will be applied to the editor selection using jQuery.css
//
//
// Adding controls
// Add controls to core using:
// Wysiwyg.addControl(name, object);
//

Wysiwyg.addControl('bold', {
	command: 'bold',
	hotkeys: { ctrl: true, key: 66 },
	tags: ["strong", "b"],
	tooltip: "bold"
});

Wysiwyg.addControl('highlight', {
	command: ( $.browser.msie || $.browser.safari ) ? "backcolor" : "hilitecolor",
	css:{
		backgroundColor: "rgb(255, 255, 102)"
	},
	tooltip: "highlight"
});

Wysiwyg.addControl('italic', {
	command: 'italic',
	tags: ["em", "i"],
	tooltip: "italic"
});

Wysiwyg.addControl('link', {
	delegate: 'createLink',
	tooltip: 'link'
});

})( Wysiwyg );