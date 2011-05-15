(function( Wysiwyg ) {

Wysiwyg.fn.createToolbar = function( ){

	var control, i, lnk, li, self = this, target = this.toolbar;
	
	target.empty();
	
	for ( i in this.controls ) {
		
		control = this.controls[i];
				
		if ( $.type( control) === 'string' && control == "|" ){ // Handle separators
			createSeparator();
			continue;
		}
		
		lnk = $('<a href="#"></a>');
		li  = $('<li></li>');
		
		lnk.addClass(i)
		   .bind('wysiwyg.click', function ( event ){
				control.exec.apply(self);
			})
		   .attr('title', Wysiwyg.t(i));
		li.addClass(i)
		  .append(lnk);
		
		target.append(li);
	}
	
	function createSeparator(){
		target.append($("<li><span class='separator'>|</span></li>"));
	}
	
};

})( Wysiwyg );