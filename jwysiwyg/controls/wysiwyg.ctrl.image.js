/**
 * Controls: Image plugin
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
$.wysiwyg.controls.image = function(Wysiwyg) {
	var self = Wysiwyg;

	if ($.modal) {
		$.modal(self.defaults.formImageHtml, {
			onShow: function(dialog) {
				$("input:submit", dialog.data).click(function(e) {
					e.preventDefault();
					var szURL = $('input[name="url"]', dialog.data).val();
					var title = $('input[name="imagetitle"]', dialog.data).val();
					var description = $('input[name="description"]', dialog.data).val();
					var img = '<img src="' + szURL + '" title="' + title + '" alt="' + description + '"/>';
					self.insertHtml(img);
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
			var dialog = $(self.defaults.formImageHtml).appendTo("body");
			dialog.dialog({
				modal: true,
				width: self.defaults.formWidth,
				height: self.defaults.formHeight,
					open: function(ev, ui) {
						$("input:submit", $(self)).click(function(e) {
						e.preventDefault();
						var szURL = $('input[name="url"]', dialog).val();
						var title = $('input[name="imagetitle"]', dialog).val();
						var description = $('input[name="description"]', dialog).val();
						var img="<img src='" + szURL + "' title='" + title + "' alt='" + description + "' />";
						self.insertHtml(img);
						$(dialog).dialog("close");
					});
					$("input:reset", $(self)).click(function(e) {
						e.preventDefault();
						$(dialog).dialog("close");
					});
				},
				close: function(ev, ui){
					$(self).dialog("destroy");
				}
			});
		}
		else {
			if ($.browser.msie) {
				self.focus();
				self.editorDoc.execCommand("insertImage", true, null);
			}
			else {
				var szURL = prompt("URL", "http://");
				if (szURL && szURL.length > 0) {
					self.editorDoc.execCommand("insertImage", false, szURL);
				}
			}
		}
	}
};

})(jQuery);