//
// Editor refers to an instance of a Wysiwyg editor.
// To create a new instance, use:
//  new Wysiwyg.editor( domElement(s), options = {} );
//
Wysiwyg.editor = function( els, options ) {

	// Alias fn instead of extending, just to make sure we don't add extra overhead.
	// any method defined under .fn should be referencing "this" as the activeEditor anyway.
	this.fn = Wysiwyg.fn;
	
	return els; // Return jquery object for chaining
};