/**
 * Controls: Table plugin
 * 
 * Depends on jWYSIWYG
 */
(function($) {
if (undefined === $.wysiwyg) {
	console.log("Depends on $.wysiwyg");
	return false;
}

if (undefined === $.wysiwyg.controls) {
	$.wysiwyg.controls = {};
}

/*
 * Wysiwyg namespace: public properties and methods
 */
$.wysiwyg.controls.table = function(Wysiwyg) {
	var self = Wysiwyg;

	if ($.fn.modal) {
		$.modal(self.defaults.formTableHtml, {
			onShow: function(dialog) {
				$("input:submit", dialog.data).click(function(e) {
					e.preventDefault();
					var rowCount = $('input[name="rowCount"]', dialog.data).val();
					var colCount = $('input[name="colCount"]', dialog.data).val();
					self.insertTable(colCount, rowCount, self.defaults.tableFiller);
					$.modal.close();
				});
				$("input:reset", dialog.data).click(function(e) {
					e.preventDefault();
					$.modal.close();
				});
			},
			maxWidth: self.defaults.formWidth,
			maxHeight: self.defaults.formHeight,
			overlayClose: true
		});
	}
	else {
		if ($.fn.dialog) {
			var dialog = $(self.defaults.formTableHtml).appendTo("body");
			dialog.dialog({
				modal: true,
				width: self.defaults.formWidth,
				height: self.defaults.formHeight,
				open: function(event, ui) {
					$("input:submit", $(self)).click(function(e) {
						e.preventDefault();
						var rowCount = $('input[name="rowCount"]', dialog).val();
						var colCount = $('input[name="colCount"]', dialog).val();
						self.insertTable(colCount, rowCount, self.defaults.tableFiller);
						$(dialog).dialog("close");
					});
					$("input:reset", $(self)).click(function(e) {
						e.preventDefault();
						$(dialog).dialog("close");
					});
				},
				close: function(event, ui){
					$(self).dialog("destroy");
				}
			});
		}
		else {
			var colCount = prompt("Count of columns", "3");
			var rowCount = prompt("Count of rows", "3");
			self.insertTable(colCount, rowCount, self.defaults.tableFiller);
		}
	}
};

})(jQuery);