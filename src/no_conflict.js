Wysiwyg.noConflict = function()
{
	$.wysiwyg = previousWysiwyg;
	$.fn.wysiwyg = previousFnWysiwyg;
	previousWysiwyg = previousFnWysiwyg = null;
	return Wysiwyg;
};

