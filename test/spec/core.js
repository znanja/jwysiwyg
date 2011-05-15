describe('Wysiwyg', function(){
	
	var editor1, editor2;
		
		
	beforeEach(function(){
		var text1 = Wysiwyg('#text1'), text2 = Wysiwyg('#text2');
		editor1 = $('#text1').data('wysiwyg');
		editor2 = $('#text2').data('wysiwyg');
	});
	
	it ('creates a wysiwyg object', function(){
		expect($('#text1').data('wysiwyg')).toBeDefined();
		expect($('#text2').data('wysiwyg')).toBeDefined();		
	});
	
	it ('creates separate instances for each element', function(){
		editor1.isDestroyed = false;
		expect(editor2.isDestroyed).toNotEqual(editor1.isDestroyed);
	})
	
});