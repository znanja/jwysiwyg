// Basic templating functionality.

Wysiwyg.utils.template = function(tplString, data){
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
	        .replace(settings.interpolate, function(match, code) {
	          return "'," + code.replace(/\\'/g, "'") + ",'";
	        })
	        .replace(settings.evaluate || null, function(match, code) {
	          return "');" + code.replace(/\\'/g, "'")
	                             .replace(/[\r\n\t]/g, ' ') + "__p.push('";
	        })
	        .replace(/\r/g, '\\r')
	        .replace(/\n/g, '\\n')
	        .replace(/\t/g, '\\t')
	        + "');}return __p.join('');";
	
	func = new Function('obj', tmpl);
	return data ? func(data) : func;
};