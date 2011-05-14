// Basic templating functionality.

Wysiwyg.template     = {};
Wysiwyg.templateData = {};

// Parse a html template using object style syntax.
//
Wysiwyg.template.parse = function(tplString, data){
	var tmpl, func,
		settings = {
			evaluate    : /\{([\s\S]+?)\}/g,
			interpolate : /\{=([\s\S]+?)\}>/g
		};
	
	//
	// JavaScript micro-templating, similar to John Resig's implementation.
	// Default implementation by underscore.js.
	// https://github.com/documentcloud/underscore
	//
	tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
		'with(obj||{}){__p.push(\'' +
		str.replace(/\\/g, '\\\\')
	        .replace(/'/g, "\\'")
	        .replace( settings.interpolate, function( match, code ) {
	          return "'," + code.replace(/\\'/g, "'") + ",'";
	        })
	        .replace( settings.evaluate || null, function( match, code ) {
	          return "');" + code.replace(/\\'/g, "'")
	                             .replace(/[\r\n\t]/g, ' ') + "__p.push('";
	        })
	        .replace(/\r/g, '\\r')
	        .replace(/\n/g, '\\n')
	        .replace(/\t/g, '\\t')
	        + "');}return __p.join('');";
	
	func = new Function( 'obj', tmpl );
	return data ? func( data ) : func;
	
};

// Load a html template from a URL, parsing it with the provided data.
// If data is not provided, it returns the template string.
//
Wysiwyg.template.load = function( tplUrl, tplData, ajaxOptions ){
	
	var options = {
		url:      tplUrl,
		dataType: 'html',
		success:  function(data){
			
			if ( tplData ){
				return Wysiwyg.template.parse( data, tplData );
			} else {
				return tplData;
			}
		}
	};
	
	if ( ajaxOptions ){
		options = $.extend( options, ajaxOptions );
	}
	
	$.ajax( options );
	
};

// Store a template for later use. This way templates can be provided without pre-load functionality, and retrieved
// as necessary for dialogs or other use.
//
Wysiwyg.template.store = function( name, template ){
	Wysiwyg.templateData[name] = template;
	return template;
};

// Retrive a stored template, optionally parsing it with the provided data.
//
Wysiwyg.template.fetch = function( name, data ){
	var tpl = Wysiwyg.templateData[name];
	if( !data ){
		return tpl;
	}else{
		return Wysiwyg.template.parse( tpl, data );
	}
};