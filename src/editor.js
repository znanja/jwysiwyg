(function( Wysiwyg ) {
	
// Empty all content from editor instance
//
Wysiwyg.fn.clear = function(){
	
};

// Creates an editor instance from a dom element.
//
Wysiwyg.fn.create = function(){
	
};

// Completely destroy an editor instance, saving its content back
// to the original dom element
//
Wysiwyg.fn.destroy = function(){
	
};

// Execute a method on editor docuement
//
Wysiwyg.fn.exec = function( method, selection ){

	// Support function calls directly
	if ( $.isFunction( method ) ) {
		method.apply(this.document, selection);
	} else {
		
	}
};

// Removes wysiwyg functionality from dom element. 
// To completely destroy instance ( including removal from data() ) use
// Wysiwyg.destroy
//
Wysiwyg.fn.remove = function(){
	
};

// Reset editor content to content of original dom element
//
Wysiwyg.fn.reset = function(){
	
};

// Save editor content back to the dom element
//
Wysiwyg.fn.save = function(){

};

})( Wysiwyg );