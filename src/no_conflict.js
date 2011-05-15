Wysiwyg.noConflict = function()
{
	$.wysiwyg = previousWysiwyg;
	previousWysiwyg = null;
	return Wysiwyg;
};
